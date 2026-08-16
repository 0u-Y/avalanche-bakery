'use client';

import { AnimatePresence, motion } from 'framer-motion';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import { MockQr } from './MockQr';
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
  const cardWidth = qrVisible ? 180 : 220;
  const maxSpread = qrVisible ? 44 : 156;
  const step = densityCount > 1 ? Math.min(12, maxSpread / (densityCount - 1)) : 0;

  return (
    <motion.section className={`workbench zone ${qrVisible ? 'has-qr' : ''}`} layout transition={transition}>
      <div className="workbench-surface">
        <header className="workbench-heading">
          <h2>쿠키 접수</h2>
          <strong>{entries.length}</strong>
        </header>
        <div className="workbench-content">
          <AnimatePresence initial={false}>
            {qrVisible ? (
              <motion.div
                className="qr-position"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4, ease: DISPLAY_EASE }}
              >
                <MockQr />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="workbench-grid" data-density={densityCount}>
            <AnimatePresence initial={false}>
              {entries.map((entry, index) => {
                const stackX = (index - (densityCount - 1) / 2) * step;
                return (
                  <div
                    className="queue-card-position"
                    key={entry.id}
                    style={{
                      left: `calc(50% - ${cardWidth / 2}px + ${stackX}px)`,
                      zIndex: index + 1,
                    }}
                  >
                    <CookieCard
                      entry={entry}
                      motionPhase={phases.get(entry.id)}
                      layoutDuration={COUNTER_DURATION}
                      layoutEase={EASE_SETTLE}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
