'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import { ZoneHeading } from './ZoneHeading';
import type { CardMotionPhase } from './displaySequence';
import { SHOWCASE_COMPLETE_MS, SLOT_LIGHT_MS } from './motion';

type LayoutTransition = { layout: { duration: number; ease: [number, number, number, number] } };

export function Showcase({
  entries,
  phases,
  arrivalIds,
  landedCount,
  transition,
}: {
  entries: Entry[];
  phases: Map<string, CardMotionPhase>;
  arrivalIds: Set<string>;
  landedCount: number;
  transition: LayoutTransition;
}) {
  const reduceMotion = useReducedMotion();
  const previousCount = useRef(landedCount);
  const [fullPulse, setFullPulse] = useState(false);
  const slots = Array.from({ length: 15 }, (_, shelfIndex) => (
    entries.find((entry) => entry.shelfIndex === shelfIndex)
  ));
  const nextShelfIndex = slots.findIndex((entry) => !entry || phases.get(entry.id) === 'to-shelf');

  useEffect(() => {
    const reachedFull = previousCount.current < 15 && landedCount === 15;
    previousCount.current = landedCount;
    if (!reachedFull) return;
    const startDelay = reduceMotion ? 0 : SLOT_LIGHT_MS;
    const start = window.setTimeout(() => setFullPulse(true), startDelay);
    const end = window.setTimeout(() => setFullPulse(false), startDelay + SHOWCASE_COMPLETE_MS);
    return () => { window.clearTimeout(start); window.clearTimeout(end); };
  }, [landedCount, reduceMotion]);

  return (
    <motion.section className={`showcase zone ${fullPulse ? 'is-complete' : ''}`} layout transition={transition}>
      <ZoneHeading note="열다섯 개의 자리" label="오늘의 쿠키 진열장" count={landedCount} total={15} className="showcase-heading" />
      <motion.div className="shelf-frame" layout transition={transition}>
        <div className="shelf-grid">
          {slots.map((entry, index) => {
            const phase = entry ? phases.get(entry.id) : undefined;
            const arriving = phase === 'to-shelf';
            const lit = Boolean(entry && arrivalIds.has(entry.id));
            return (
              <motion.div
                className={`shelf-slot ${entry ? 'is-filled' : ''} ${arriving ? 'is-arriving' : ''} ${lit ? 'is-lit' : ''} ${!entry && index === nextShelfIndex ? 'is-next' : ''}`}
                key={index}
                layout
                transition={transition}
              >
                <span className="slot-shade" aria-hidden="true" />
                <span className="slot-light" aria-hidden="true" />
                <span className="shelf-number">{String(index + 1).padStart(2, '0')}</span>
                {entry ? (
                  <CookieCard entry={entry} motionPhase={phase} />
                ) : index === nextShelfIndex ? (
                  <span className="next-slot"><strong>다음 자리</strong></span>
                ) : (
                  <span className="empty-slot" aria-hidden="true" />
                )}
              </motion.div>
            );
          })}
          <span className="shelf-glass" aria-hidden="true" />
        </div>
      </motion.div>
    </motion.section>
  );
}
