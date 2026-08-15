import { DEFAULT_SHOW, makeEntry } from '@/lib/mockData';
import type { EntryStatus, StateResponse } from '@/lib/types';

export type DemoVariant = 'a' | 'b' | 'c';

export const DEMO_DURATION = 40_000;
export const DEMO_SUBMISSION = {
  nickname: '오븐별',
  photoPreview: '/mock/cookie-1.svg',
  shelfNumber: 7,
  tokenId: 1048,
};

function statusAt(variant: DemoVariant, seconds: number): EntryStatus | null {
  if (seconds < 16.6) return null;
  if (variant === 'a') {
    if (seconds < 20) return 'SUBMITTED';
    if (seconds < 25) return 'MINTING';
    return 'MINTED';
  }
  if (variant === 'b') {
    if (seconds < 18) return 'SUBMITTED';
    if (seconds < 21) return 'RENDERED';
    if (seconds < 25) return 'MINTING';
    return 'MINTED';
  }
  if (seconds < 20.5) return 'PINNED';
  if (seconds < 25) return 'MINTING';
  return 'MINTED';
}

export function makeDemoState(variant: DemoVariant, seconds: number): StateResponse {
  const status = statusAt(variant, seconds);
  const entries = status ? [makeEntry(6, status)] : [];
  return {
    entries,
    show: { ...DEFAULT_SHOW, qrVisible: false },
    counts: { submitted: entries.length, minted: status === 'MINTED' ? 1 : 0 },
  };
}

export function isShelfArrival(seconds: number) {
  const arrival = 25;
  return seconds >= arrival && seconds < arrival + 0.7;
}
