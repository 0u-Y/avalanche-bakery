import type { EntryStatus } from './types';

export type SubmissionPattern = 'BURST' | 'SEQUENTIAL';

const SEQUENTIAL_CYCLE_MS = 6_600;
const BURST_GROUP_SIZE = 3;
const BURST_GROUP_GAP_MS = 1_200;
const BURST_MEMBER_GAP_MS = 160;
const VARIATION = [0, 180, 80, 240, 120] as const;

export type ParticipantTiming = {
  startAt: number;
  submittedAt: number;
  renderedAt: number;
  pinnedAt: number;
  mintingAt: number;
  mintedAt: number;
};

export function participantTiming(index: number, pattern: SubmissionPattern): ParticipantTiming {
  const startAt = pattern === 'SEQUENTIAL'
    ? index * SEQUENTIAL_CYCLE_MS
    : Math.floor(index / BURST_GROUP_SIZE) * BURST_GROUP_GAP_MS
      + (index % BURST_GROUP_SIZE) * BURST_MEMBER_GAP_MS;

  if (pattern === 'SEQUENTIAL') {
    return {
      startAt,
      submittedAt: startAt + 600,
      renderedAt: startAt + 1_400,
      pinnedAt: startAt + 2_200,
      mintingAt: startAt + 3_000,
      mintedAt: startAt + 5_200,
    };
  }

  const variation = VARIATION[index % VARIATION.length];
  const mintingAt = startAt + 2_600 + variation;
  return {
    startAt,
    submittedAt: startAt + 600,
    renderedAt: startAt + 1_200 + variation,
    pinnedAt: startAt + 1_900 + (VARIATION[(index + 2) % VARIATION.length] / 2),
    mintingAt,
    mintedAt: mintingAt + 2_200 + VARIATION[(index + 1) % VARIATION.length],
  };
}

export function statusAt(index: number, elapsedMs: number, pattern: SubmissionPattern): EntryStatus | null {
  const timing = participantTiming(index, pattern);
  if (elapsedMs < timing.submittedAt) return null;
  if (elapsedMs < timing.renderedAt) return 'SUBMITTED';
  if (elapsedMs < timing.pinnedAt) return 'RENDERED';
  if (elapsedMs < timing.mintingAt) return 'PINNED';
  if (elapsedMs < timing.mintedAt) return 'MINTING';
  return 'MINTED';
}

export function lastMintedAt(participantCount: number, pattern: SubmissionPattern) {
  return Math.max(...Array.from(
    { length: participantCount },
    (_, index) => participantTiming(index, pattern).mintedAt,
  ));
}
