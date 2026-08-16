import { DEFAULT_SHOW, makeEntry } from '@/lib/mockData';
import type { EntryStatus, StateResponse } from '@/lib/types';

export type DemoVariant = 'a' | 'b';
export type DemoView = 'phone' | 'tv';

export const DEFAULT_PARTICIPANTS = 10;
export const PARTICIPANT_CYCLE_MS = 6_600;
export const MINTED_AT_MS = 5_200;
export const GUIDED_COMPLETE_AT_MS = 5_800;
export const SESSION_END_HOLD_MS = 4_000;

function statusAt(localMs: number): EntryStatus | null {
  if (localMs < 600) return null;
  if (localMs < 1_400) return 'SUBMITTED';
  if (localMs < 2_200) return 'RENDERED';
  if (localMs < 3_000) return 'PINNED';
  if (localMs < MINTED_AT_MS) return 'MINTING';
  return 'MINTED';
}

export function sessionDuration(participantCount: number) {
  return ((participantCount - 1) * PARTICIPANT_CYCLE_MS)
    + GUIDED_COMPLETE_AT_MS
    + SESSION_END_HOLD_MS;
}

export function makeSubmission(index: number) {
  const entry = makeEntry(index, 'MINTED');
  return {
    nickname: entry.nickname,
    photoPreview: entry.photoUrl,
    shelfNumber: index + 1,
    tokenId: entry.tokenId ?? 1042 + index,
  };
}

export function makeSimulationState(
  participantCount: number,
  elapsedMs: number,
): StateResponse {
  const entries = Array.from({ length: participantCount }, (_, index) => {
    const status = statusAt(elapsedMs - index * PARTICIPANT_CYCLE_MS);
    return status ? makeEntry(index, status) : null;
  }).filter((entry) => entry !== null);

  return {
    entries,
    show: { ...DEFAULT_SHOW, qrVisible: false },
    counts: {
      submitted: entries.length,
      minted: entries.filter((entry) => entry.status === 'MINTED').length,
    },
  };
}

export function simulationFocus(participantCount: number, elapsedMs: number) {
  const participantIndex = Math.min(
    Math.floor(elapsedMs / PARTICIPANT_CYCLE_MS),
    participantCount - 1,
  );
  return {
    participantIndex,
    localMs: elapsedMs - participantIndex * PARTICIPANT_CYCLE_MS,
  };
}
