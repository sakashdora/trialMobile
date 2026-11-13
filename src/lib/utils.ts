import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount?: number | null, currency = '₹'): string {
  const safe = typeof amount === 'number' && Number.isFinite(amount) ? Math.max(0, amount) : 0;
  return `${currency}${safe.toLocaleString('en-IN')}`;
}
