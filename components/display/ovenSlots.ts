'use client';

import { useCallback, useRef, useState } from 'react';

import type { Entry } from '@/lib/types';

const OVEN_SLOT_COUNT = 4;

function slotsFor(entries: Entry[]) {
  return new Map(entries
    .filter((entry) => entry.status === 'MINTING')
    .map((entry, index) => [entry.id, index] as const));
}

export function useOvenSlots(source: Entry[]) {
  const [ovenSlots, setOvenSlots] = useState(() => slotsFor(source));
  const slotsRef = useRef(ovenSlots);

  const replace = useCallback((next: Map<string, number>) => {
    slotsRef.current = next;
    setOvenSlots(next);
  }, []);

  const resetOvenSlots = useCallback((entries: Entry[]) => {
    replace(slotsFor(entries));
  }, [replace]);

  const assignOvenSlot = useCallback((id: string) => {
    if (slotsRef.current.has(id)) return;
    const next = new Map(slotsRef.current);
    const used = new Set(next.values());
    const openSlot = Array.from({ length: OVEN_SLOT_COUNT }, (_, index) => index)
      .find((index) => !used.has(index));
    const overflowSlot = Math.max(OVEN_SLOT_COUNT - 1, ...used) + 1;
    next.set(id, openSlot ?? overflowSlot);
    replace(next);
  }, [replace]);

  const releaseOvenSlot = useCallback((id: string) => {
    const releasedSlot = slotsRef.current.get(id);
    if (releasedSlot === undefined) return;
    const next = new Map(slotsRef.current);
    next.delete(id);
    if (releasedSlot < OVEN_SLOT_COUNT) {
      const overflow = [...next.entries()]
        .filter(([, slot]) => slot >= OVEN_SLOT_COUNT)
        .sort((left, right) => left[1] - right[1])[0];
      if (overflow) next.set(overflow[0], releasedSlot);
    }
    replace(next);
  }, [replace]);

  return { ovenSlots, assignOvenSlot, releaseOvenSlot, resetOvenSlots };
}
