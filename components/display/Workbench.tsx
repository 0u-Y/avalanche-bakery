'use client';

import { AnimatePresence, motion } from 'framer-motion';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import { MockQr } from './MockQr';
import { ZoneHeading } from './ZoneHeading';
import type { CardMotionPhase } from './displaySequence';
import { COUNTER_DURATION, DISPLAY_EASE, EASE_SETTLE } from './motion';

type LayoutTransition = { layout: { duration: number; ease: [number, number, number, number] } };

export function Workbench({
  entries,
  densityCount,
  phases,
  qrVisible,
  transition,
}: {
  entries: Entry[];
  densityCount: number;
  phases: Map<string, CardMotionPhase>;
  qrVisible: boolean;
  transition: LayoutTransition;
}) {
  const density = densityCount <= 0 ? 'empty'
    : densityCount === 1 ? 'single'
      : densityCount === 2 ? 'double'
        : densityCount <= 6 ? 'standard'
          : densityCount <= 9 ? 'tight'
            : 'dense';

  return (
    <motion.section className="workbench zone" layout transition={transition}>
      <ZoneHeading note="사진이 도착하는 곳" label="쿠키 접수" count={entries.length} />
      <div className={`workbench-grid density-${density}`} data-density={densityCount}>
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <CookieCard
              key={entry.id}
              entry={entry}
              motionPhase={phases.get(entry.id)}
              layoutDuration={COUNTER_DURATION}
              layoutEase={EASE_SETTLE}
            />
          ))}
        </AnimatePresence>
        {densityCount === 0 ? (
          <div className="workbench-empty">
            <span className="empty-mixing-bowl" aria-hidden="true" />
            <strong>첫 쿠키 사진을 기다려요</strong>
          </div>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {qrVisible ? (
          <motion.div
            className="qr-position"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: DISPLAY_EASE }}
          >
            <MockQr />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
