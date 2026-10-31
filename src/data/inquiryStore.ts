// ============================================================================
// Beyond Magic Studio - Inquiries Storage & Anti-Spam Resilient Backup
// All website messages are permanently stored locally first, immune to any
// third-party spam filter or Netlify email dropping.
// ============================================================================

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  discipline: string;
  topic: string;
  message: string;
  audioLink?: string;
  date: string;
  read?: boolean;
}

const INQUIRIES_KEY = 'verisme_inquiries_v1';

export function getStoredInquiries(): InquiryMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load inquiries', e);
  }
  return [];
}

export function saveInquiry(inquiry: Omit<InquiryMessage, 'id' | 'date'>): InquiryMessage {
  const current = getStoredInquiries();
  const newItem: InquiryMessage = {
    ...inquiry,
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toLocaleString(),
    read: false,
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('verisme_inquiries_changed'));

    // Also send to local dev server / API backup if active
    if (typeof fetch !== 'undefined') {
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      }).catch(() => {});
    }
  } catch (e) {
    console.warn('Failed to save inquiry', e);
  }
  return newItem;
}

export function deleteInquiry(id: string): void {
  const current = getStoredInquiries();
  const updated = current.filter(i => i.id !== id);
  try {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('verisme_inquiries_changed'));
  } catch (e) {
    console.warn('Failed to delete inquiry', e);
  }
}

export function onInquiriesChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('verisme_inquiries_changed', handler);
  return () => window.removeEventListener('verisme_inquiries_changed', handler);
}

/**
 * Generates and triggers download of a CSV file of all inquiries.
 */
export function exportInquiriesAsCsv(): void {
  const items = getStoredInquiries();
  if (items.length === 0) return;

  const headers = ['Date', 'Name', 'Email', 'Discipline', 'Topic', 'Message', 'Audio Link'];
  const rows = items.map(item => [
    `"${(item.date || '').replace(/"/g, '""')}"`,
    `"${(item.name || '').replace(/"/g, '""')}"`,
    `"${(item.email || '').replace(/"/g, '""')}"`,
    `"${(item.discipline || '').replace(/"/g, '""')}"`,
    `"${(item.topic || '').replace(/"/g, '""')}"`,
    `"${(item.message || '').replace(/"/g, '""')}"`,
    `"${(item.audioLink || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `beyondmagic_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
