// ============================================================================
// Beyond Magic Studio - Admin Authentication & Email-Verified Password System
// ============================================================================

export const DEFAULT_ADMIN_PASSWORD = 'temporaryadmin';
export const AUTHORIZED_ADMIN_EMAIL = 'beeyondmagic@protonmail.com';

const STORAGE_KEY_ACTIVE_PASSWORD = 'beyondmagic_admin_password_v2';
const STORAGE_KEY_PENDING_CHANGE = 'beyondmagic_admin_pending_change_v2';
const STORAGE_KEY_LEGACY_PASSWORD = 'verisme_admin_password_v1';

export interface PendingPasswordChange {
  token: string;
  newPasswordValue: string;
  createdAt: number;
  expiresAt: number; // e.g. 2 hours
  targetEmail: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
}

/**
 * Returns the currently active admin password.
 * Defaults strictly to 'temporaryadmin' if no verified password has been set.
 */
export function getActiveAdminPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASSWORD;
  const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_PASSWORD);
  if (stored && stored.trim()) {
    return stored.trim();
  }
  // Check if legacy password exists
  const legacy = localStorage.getItem(STORAGE_KEY_LEGACY_PASSWORD);
  if (legacy && legacy.trim()) {
    return legacy.trim();
  }
  return DEFAULT_ADMIN_PASSWORD;
}

/**
 * Checks if the current password is still the initial default "temporaryadmin".
 */
export function isUsingDefaultPassword(): boolean {
  return getActiveAdminPassword() === DEFAULT_ADMIN_PASSWORD;
}

/**
 * Verifies if the provided password matches the currently active admin password.
 */
export function checkAdminPassword(attempt: string): boolean {
  const current = getActiveAdminPassword();
  return attempt.trim() === current;
}

/**
 * Encodes a string payload into a URL-safe base64 string with simple obfuscation
 */
function encodePayload(str: string): string {
  try {
    const utf8 = encodeURIComponent(str);
    return btoa(utf8)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    return btoa(str);
  }
}

/**
 * Decodes a URL-safe base64 string
 */
function decodePayload(str: string): string {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const utf8 = atob(base64);
    return decodeURIComponent(utf8);
  } catch (e) {
    try {
      return atob(str);
    } catch {
      return '';
    }
  }
}

/**
 * Generates a high-entropy random token for verification
 */
export function generateSecureToken(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(24);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return 't_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Creates a pending password change request and returns the verification URL and token.
 * The change will NOT be active until verified via the email link.
 */
export function createPendingPasswordChange(newPassword: string): {
  token: string;
  verificationUrl: string;
  expiresAt: number;
} {
  const trimmed = newPassword.trim();
  if (!trimmed) {
    throw new Error('Password cannot be empty');
  }

  const token = generateSecureToken();
  const now = Date.now();
  const expiresAt = now + 2 * 60 * 60 * 1000; // 2 hours expiration

  const pending: PendingPasswordChange = {
    token,
    newPasswordValue: trimmed,
    createdAt: now,
    expiresAt,
    targetEmail: AUTHORIZED_ADMIN_EMAIL,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PENDING_CHANGE, JSON.stringify(pending));
  }

  // Also sync to server API if available
  if (typeof fetch !== 'undefined') {
    fetch('/api/admin/pending-change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pending),
    }).catch(() => {
      // Offline or static host fallback is handled gracefully
    });
  }

  // Construct self-contained cross-device payload
  // This allows the verification link to work even if opened on another device/browser
  const claimData = JSON.stringify({
    t: token,
    p: trimmed,
    e: expiresAt,
  });
  const claimParam = encodePayload(claimData);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const verificationUrl = `${origin}/admin?verify_token=${token}&claim=${claimParam}`;

  return { token, verificationUrl, expiresAt };
}

/**
 * Gets the current pending password change, if any and if not expired.
 */
export function getPendingPasswordChange(): PendingPasswordChange | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY_PENDING_CHANGE);
  if (!raw) return null;

  try {
    const pending: PendingPasswordChange = JSON.parse(raw);
    if (Date.now() > pending.expiresAt) {
      // Expired
      localStorage.removeItem(STORAGE_KEY_PENDING_CHANGE);
      return null;
    }
    return pending;
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY_PENDING_CHANGE);
    return null;
  }
}

/**
 * Cancels any active pending password change request.
 */
export function cancelPendingPasswordChange(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_PENDING_CHANGE);
  if (typeof fetch !== 'undefined') {
    fetch('/api/admin/pending-change', {
      method: 'DELETE',
    }).catch(() => {});
  }
}

/**
 * Validates a verification token (and optional cross-device claim) and activates the new password.
 */
export async function validateAndApplyVerification(token: string, claim?: string): Promise<VerificationResult> {
  if (!token && !claim) {
    return { success: false, message: 'No verification token provided.' };
  }

  const now = Date.now();

  // 1. Try local pending request
  let pending = getPendingPasswordChange();
  let candidatePassword = '';

  if (pending && pending.token === token) {
    if (now > pending.expiresAt) {
      cancelPendingPasswordChange();
      return { success: false, message: 'This verification link has expired (valid for 2 hours). Please request a new change.' };
    }
    candidatePassword = pending.newPasswordValue;
  } else if (claim) {
    // 2. Decode cross-device claim if opened on another device/browser
    try {
      const decodedJson = decodePayload(claim);
      const parsed = JSON.parse(decodedJson);
      if (parsed.t === token && parsed.p && parsed.e) {
        if (now > parsed.e) {
          return { success: false, message: 'This verification link has expired. Please request a new password change.' };
        }
        candidatePassword = parsed.p;
      }
    } catch (e) {
      // Invalid claim encoding
    }
  }

  // 3. Fallback: query backend server API if local pending wasn't found
  if (!candidatePassword && typeof fetch !== 'undefined') {
    try {
      const res = await fetch(`/api/admin/verify-token?token=${encodeURIComponent(token)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.newPassword) {
          candidatePassword = data.newPassword;
        }
      }
    } catch {
      // Ignore network errors
    }
  }

  if (!candidatePassword) {
    return {
      success: false,
      message: 'Invalid, already used, or expired verification link. Please submit a new password change request.',
    };
  }

  // Apply new password!
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PASSWORD, candidatePassword);
    localStorage.removeItem(STORAGE_KEY_PENDING_CHANGE);
    // Clear legacy key to avoid old overrides
    localStorage.removeItem(STORAGE_KEY_LEGACY_PASSWORD);
  }

  // Notify server to update its state as well
  if (typeof fetch !== 'undefined') {
    fetch('/api/admin/apply-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: candidatePassword }),
    }).catch(() => {});
  }

  return {
    success: true,
    message: 'Your new password has been verified and activated successfully! You can now log in with your new password.',
  };
}
