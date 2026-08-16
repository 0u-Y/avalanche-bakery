'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import type { CardMotionPhase } from './displaySequence';
import { OVEN_COMPLETE_MS } from './motion';

type LayoutTransition = { layout: { duration: number; ease: [number, number, number, number] } };

export function Oven({
  entries,
  phases,
  flowActive,
  transition,
}: {
  entries: Entry[];
  phases: Map<string, CardMotionPhase>;
  flowActive: boolean;
  transition: LayoutTransition;
}) {
  const active = entries.length > 0 || flowActive;
  const previousActive = useRef(active);
  const completionTimer = useRef<number | null>(null);
  const phaseTimer = useRef<number | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (phaseTimer.current !== null) window.clearTimeout(phaseTimer.current);
    phaseTimer.current = null;
    if (active) {
      if (completionTimer.current !== null) window.clearTimeout(completionTimer.current);
      completionTimer.current = null;
      phaseTimer.current = window.setTimeout(() => setCompleting(false), 0);
    } else if (previousActive.current) {
      phaseTimer.current = window.setTimeout(() => {
        setCompleting(true);
        completionTimer.current = window.setTimeout(() => {
          setCompleting(false);
          completionTimer.current = null;
        }, OVEN_COMPLETE_MS);
      }, 0);
    }
    previousActive.current = active;
  }, [active]);

  useEffect(() => () => {
    if (phaseTimer.current !== null) window.clearTimeout(phaseTimer.current);
    if (completionTimer.current !== null) window.clearTimeout(completionTimer.current);
  }, []);

  return (
    <motion.section className={`oven zone ${active ? 'is-baking' : ''} ${completing ? 'is-completing' : ''}`} layout transition={transition}>
      <header className="oven-heading"><h2>증서 오븐</h2></header>
      <div className="oven-body">
        <div className="oven-window">
          <div className="oven-light" />
          <div className="oven-readout">
            <strong>{active ? entries.length > 0 ? `${entries.length}개 굽는 중` : '굽는 중' : '예열 완료'}</strong>
            <span>180°</span>
          </div>
          <svg className="oven-heat-lines" viewBox="0 0 120 112" aria-hidden="true">
            <path d="M22 102C4 82 40 64 22 44S40 10 22 2" />
            <path d="M60 110C42 88 78 70 60 48S78 16 60 0" />
            <path d="M98 102C80 82 116 64 98 44S116 10 98 2" />
          </svg>
          <div className="oven-grid">
            <AnimatePresence initial={false}>
              {entries.map((entry) => <CookieCard key={entry.id} entry={entry} motionPhase={phases.get(entry.id)} />)}
            </AnimatePresence>
          </div>
          <div className="oven-rack" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
      </div>
    </motion.section>
  );
}
