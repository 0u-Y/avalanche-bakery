'use client';

import { useEffect } from 'react';

import { mockControls } from './useShowState';

const LOOP_DURATION = 30_000;
const PARTICIPANT_STAGGER = 1_100;

export function useDemoLoop(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const timers = new Set<number>();
    const later = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (active) callback();
      }, delay);
      timers.add(timer);
    };

    const runCycle = () => {
      mockControls.reset();
      for (let index = 0; index < 15; index += 1) {
        const entryId = `entry-${index + 1}`;
        const submittedAt = index * PARTICIPANT_STAGGER;
        later(() => mockControls.addParticipants(1), submittedAt);
        later(() => mockControls.advanceOne(entryId), submittedAt + 700);
        later(() => mockControls.advanceOne(entryId), submittedAt + 1_400);
        later(() => mockControls.advanceOne(entryId), submittedAt + 2_100);
        later(() => mockControls.advanceOne(entryId), submittedAt + 4_200);
      }
      later(runCycle, LOOP_DURATION);
    };

    runCycle();
    return () => {
      active = false;
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, [enabled]);
}
