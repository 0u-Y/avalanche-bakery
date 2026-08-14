import type { Entry, EntryStatus, ShowState } from './types';

export const NICKNAMES = [
  '설탕별',
  '민트별',
  '쿠키왕',
  '초코콩',
  '딸기잼',
  '반죽이',
  '버터문',
  '오븐별',
  '코코아',
  '눈꽃',
  '바삭이',
  '밀가루',
  '체리',
  '구움이',
  '제빵사',
] as const;

export const DEFAULT_SHOW: ShowState = {
  mode: 'BAKERY',
  layout: 'LIVE',
  slideIndex: 0,
  qrVisible: true,
  spotlightEntryId: null,
};

export const STATUS_FLOW: EntryStatus[] = [
  'SUBMITTED',
  'RENDERED',
  'PINNED',
  'MINTING',
  'MINTED',
];

export function makeEntry(index: number, status: EntryStatus): Entry {
  const minted = status === 'MINTED';
  return {
    id: `entry-${index + 1}`,
    nickname: NICKNAMES[index],
    status,
    photoUrl: `/mock/cookie-${(index % 6) + 1}.jpg`,
    certificateUrl: minted ? `/mock/certificate-${(index % 6) + 1}.jpg` : null,
    tokenId: minted ? 1042 + index : null,
    txHash: minted ? `0x${(1042 + index).toString(16).padStart(64, '0')}` : null,
    shelfIndex: index,
    hidden: false,
  };
}

export const SEEDED_ENTRIES: Entry[] = [
  makeEntry(0, 'MINTED'),
  makeEntry(1, 'MINTED'),
  makeEntry(2, 'MINTED'),
  makeEntry(3, 'MINTING'),
  makeEntry(4, 'PINNED'),
  makeEntry(5, 'RENDERED'),
  makeEntry(6, 'SUBMITTED'),
];
