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
    date: new Date().toLocaleString()
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('verisme_inquiries_changed'));
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
