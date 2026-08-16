'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Entry, EntryStatus } from '@/lib/types';
import { CARD_DROP_MS, CARD_MOVE_MS, CARD_SETTLE_MS, SHOWCASE_COMPLETE_MS } from './motion';

export type CardMotionPhase = 'enter' | 'to-oven' | 'to-shelf';
type BoundaryMove = { entry: Entry; phase: Exclude<CardMotionPhase, 'enter'> };
const MIN_OVEN_MS = 2_000;

function zone(status: EntryStatus) {
  if (status === 'MINTING') return 'oven';
  if (status === 'MINTED') return 'shelf';
  return 'workbench';
}

function boundaryMove(previous: Entry, next: Entry): BoundaryMove | null {
  const from = zone(previous.status);
  const to = zone(next.status);
  if (from === to) return null;
  if (to === 'oven') return { entry: next, phase: 'to-oven' };
  if (to === 'shelf') return { entry: next, phase: 'to-shelf' };
  return null;
}

function entryCounts(entries: Entry[]) {
  return { submitted: entries.length, minted: entries.filter((entry) => entry.status === 'MINTED').length };
}
function workbenchCount(entries: Entry[]) {
  return entries.filter((entry) => !entry.hidden && zone(entry.status) === 'workbench').length;
}
export function useDisplaySequence(source: Entry[], reducedMotion: boolean) {
  const [entries, setEntries] = useState(source);
  const [phases, setPhases] = useState<Map<string, CardMotionPhase>>(new Map());
  const [arrivalIds, setArrivalIds] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState(() => entryCounts(source));
  const [workbenchDensityCount, setWorkbenchDensityCount] = useState(() => workbenchCount(source));
  const [boundaryBusy, setBoundaryBusy] = useState(false);
  const sourceMap = useRef(new Map(source.map((entry) => [entry.id, entry])));
  const latestSource = useRef(source);
  const queue = useRef<BoundaryMove[]>([]);
  const activeMove = useRef<BoundaryMove | null>(null);
  const movementTimer = useRef<number | null>(null);
  const ovenEnteredAt = useRef(new Map<string, number>());
  const timers = useRef<Set<number>>(new Set());
  const startNextRef = useRef<() => void>(() => {});

  const later = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
    return timer;
  }, []);

  const markArrival = useCallback((id: string) => {
    const landed = latestSource.current.find((entry) => entry.id === id && entry.status === 'MINTED');
    if (!landed) return;
    setArrivalIds((current) => new Set([...current, id]));
    setCounts((current) => ({
      submitted: current.submitted,
      minted: Math.min(current.minted + 1, entryCounts(latestSource.current).minted),
    }));
    later(() => setArrivalIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    }), SHOWCASE_COMPLETE_MS);
  }, [later]);

  const startNext = useCallback(() => {
    if (reducedMotion || movementTimer.current !== null || queue.current.length === 0) return;
    const pendingMove = queue.current[0];
    const enteredAt = pendingMove.phase === 'to-shelf' ? ovenEnteredAt.current.get(pendingMove.entry.id) : undefined;
    const ovenWait = enteredAt ? Math.max(0, MIN_OVEN_MS - (Date.now() - enteredAt)) : 0;
    if (ovenWait > 0) {
      movementTimer.current = later(() => {
        movementTimer.current = null;
        startNextRef.current();
      }, ovenWait);
      return;
    }
    const move = queue.current.shift();
    if (!move) return;
    activeMove.current = move;
    if (move.phase === 'to-oven') {
      ovenEnteredAt.current.set(move.entry.id, Date.now());
      setEntries((current) => current.map((entry) => entry.id === move.entry.id ? move.entry : entry));
    }
    setPhases((current) => new Map(current).set(move.entry.id, move.phase));
    later(() => {
      if (move.phase === 'to-shelf') {
        setEntries((current) => current.map((entry) => entry.id === move.entry.id ? move.entry : entry));
      }
      setPhases((current) => {
        const next = new Map(current);
        next.delete(move.entry.id);
        return next;
      });
      if (move.phase === 'to-shelf') markArrival(move.entry.id);
    }, CARD_MOVE_MS);
    movementTimer.current = later(() => {
      if (move.phase === 'to-oven') {
        setWorkbenchDensityCount((current) => Math.max(0, current - 1));
      } else {
        ovenEnteredAt.current.delete(move.entry.id);
      }
      movementTimer.current = null;
      activeMove.current = null;
      if (queue.current.length === 0) setBoundaryBusy(false);
      startNextRef.current();
    }, CARD_MOVE_MS + CARD_SETTLE_MS);
  }, [later, markArrival, reducedMotion]);
  useEffect(() => { startNextRef.current = startNext; }, [startNext]);

  useEffect(() => {
    latestSource.current = source;
    source.forEach((entry) => {
      if (entry.status === 'MINTING' && !ovenEnteredAt.current.has(entry.id)) {
        ovenEnteredAt.current.set(entry.id, Date.now());
      }
    });
    const previous = sourceMap.current;
    const moves = source.flatMap((entry) => {
      const oldEntry = previous.get(entry.id);
      const move = oldEntry ? boundaryMove(oldEntry, entry) : null;
      return move && !entry.hidden ? [move] : [];
    });
    const newEntries = source.filter((entry) => !previous.has(entry.id));
    sourceMap.current = new Map(source.map((entry) => [entry.id, entry]));

    later(() => {
      if (reducedMotion) {
        queue.current = [];
        if (movementTimer.current !== null) window.clearTimeout(movementTimer.current);
        timers.current.delete(movementTimer.current ?? -1);
        movementTimer.current = null; activeMove.current = null;
        setBoundaryBusy(false);
        setEntries(source);
        setPhases(new Map());
        setCounts(entryCounts(source));
        setWorkbenchDensityCount(workbenchCount(source));
        moves.filter((move) => move.phase === 'to-shelf').forEach((move) => markArrival(move.entry.id));
        return;
      }

      const pendingIds = new Set([
        ...queue.current.map((move) => move.entry.id),
        ...(activeMove.current ? [activeMove.current.entry.id] : []),
        ...moves.map((move) => move.entry.id),
      ]);
      const leavingWorkbench = moves.filter((move) => move.phase === 'to-oven').length;
      const densityDelta = workbenchCount(source) - workbenchCount([...previous.values()]) + leavingWorkbench;
      if (densityDelta !== 0) {
        setWorkbenchDensityCount((current) => Math.max(0, current + densityDelta));
      }
      setEntries((current) => {
        const currentById = new Map(current.map((entry) => [entry.id, entry]));
        return source.map((entry) => pendingIds.has(entry.id) && currentById.has(entry.id)
          ? currentById.get(entry.id)!
          : entry);
      });
      if (newEntries.length > 0) {
        setPhases((current) => {
          const next = new Map(current);
          newEntries.forEach((entry) => next.set(entry.id, 'enter'));
          return next;
        });
        later(() => {
          setCounts((current) => ({ ...current, submitted: latestSource.current.length }));
        }, CARD_DROP_MS);
        later(() => {
          setPhases((current) => {
            const next = new Map(current);
            newEntries.forEach((entry) => next.delete(entry.id));
            return next;
          });
        }, CARD_DROP_MS + CARD_SETTLE_MS);
      }
      if (moves.length > 0) {
        queue.current.push(...moves);
        setBoundaryBusy(true);
      }
      const rawCounts = entryCounts(source);
      setCounts((current) => ({
        submitted: rawCounts.submitted < current.submitted ? rawCounts.submitted : current.submitted,
        minted: rawCounts.minted < current.minted ? rawCounts.minted : current.minted,
      }));
      startNext();
    }, 0);
  }, [later, markArrival, reducedMotion, source, startNext]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  return { entries, phases, arrivalIds, counts, workbenchDensityCount, boundaryBusy };
}
