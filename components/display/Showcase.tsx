'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import { ZoneHeading } from './ZoneHeading';
import { DISPLAY_DURATION, DISPLAY_EASE } from './motion';

type LayoutTransition = { layout: { duration: number; ease: [number, number, number, number] } };

export function Showcase({
  entries,
  celebratingIds,
  transition,
}: {
  entries: Entry[];
  celebratingIds: Set<string>;
  transition: LayoutTransition;
}) {
  const reduceMotion = useReducedMotion();
  const previousCount = useRef(entries.length);
  const [fullPulse, setFullPulse] = useState(false);
  const slots = Array.from({ length: 15 }, (_, shelfIndex) => (
    entries.find((entry) => entry.shelfIndex === shelfIndex)
  ));
  const nextShelfIndex = slots.findIndex((entry) => !entry);

  useEffect(() => {
    const reachedFull = previousCount.current < 15 && entries.length === 15;
    previousCount.current = entries.length;
    if (!reachedFull) return;
    const start = window.setTimeout(() => setFullPulse(true), 0);
    const end = window.setTimeout(() => setFullPulse(false), 700);
    return () => { window.clearTimeout(start); window.clearTimeout(end); };
  }, [entries.length]);

  return (
    <motion.section
      className={`showcase zone ${entries.length === 15 ? 'is-full' : ''} ${
        fullPulse ? 'is-complete' : ''
      }`}
      layout
      initial={false}
      animate={fullPulse && !reduceMotion ? { scale: [1, 0.992, 1] } : { scale: 1 }}
      transition={{
        ...transition,
        scale: { duration: reduceMotion ? 0 : DISPLAY_DURATION, ease: DISPLAY_EASE },
      }}
    >
      <ZoneHeading
        note="열다섯 개의 자리"
        label="오늘의 쿠키 진열장"
        count={entries.length}
        total={15}
        className="showcase-heading"
      />
      <motion.div className="shelf-frame" layout transition={transition}>
        <div className="shelf-grid">
          {slots.map((entry, index) => (
            <motion.div
              className={`shelf-slot ${entry && celebratingIds.has(entry.id) ? 'is-lit' : ''} ${
                !entry && index === nextShelfIndex ? 'is-next' : ''
              }`}
              key={index}
              layout
              transition={transition}
            >
              <span className="shelf-number">{String(index + 1).padStart(2, '0')}</span>
              {entry ? (
                <CookieCard entry={entry} celebrating={celebratingIds.has(entry.id)} />
              ) : index === nextShelfIndex ? (
                <span className="next-slot"><strong>다음 자리</strong></span>
              ) : (
                <span className="empty-slot" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
