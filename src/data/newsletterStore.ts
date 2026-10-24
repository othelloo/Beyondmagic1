export interface NewsletterSubscriber {
  id: string;
  email: string;
  interest: string;
  language: string;
  date: string;
}

const NEWSLETTER_KEY = 'beyond_magic_subscribers_v1';

export function getStoredSubscribers(): NewsletterSubscriber[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NEWSLETTER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load subscribers', e);
  }
  return [];
}

export function saveSubscriber(email: string, interest = 'Spirituality & Philosophy Premiere Waitlist', language = 'en'): NewsletterSubscriber {
  const current = getStoredSubscribers();
  const existing = current.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const newItem: NewsletterSubscriber = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: email.trim().toLowerCase(),
    interest,
    language,
    date: new Date().toLocaleString()
  };

  const updated = [newItem, ...current];
  try {
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('beyond_magic_subscribers_changed'));
  } catch (e) {
    console.warn('Failed to save subscriber locally', e);
  }
  return newItem;
}
