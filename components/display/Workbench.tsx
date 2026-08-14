'use client';

import { AnimatePresence, motion } from 'framer-motion';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import { MockQr } from './MockQr';
import { ZoneHeading } from './ZoneHeading';
import { DISPLAY_EASE } from './motion';

type LayoutTransition = { layout: { duration: number; ease: [number, number, number, number] } };

export function Workbench({
  entries,
  qrVisible,
  transition,
}: {
  entries: Entry[];
  qrVisible: boolean;
  transition: LayoutTransition;
}) {
  return (
    <motion.section className="workbench zone" layout transition={transition}>
      <ZoneHeading step="STEP 01 · PREP" label="반죽 작업대" count={entries.length} />
      <div className="workbench-grid">
        <AnimatePresence initial={false}>
          {entries.map((entry) => <CookieCard key={entry.id} entry={entry} />)}
        </AnimatePresence>
        {entries.length === 0 ? (
          <div className="workbench-empty">
            <span className="empty-mixing-bowl" aria-hidden="true" />
            <strong>첫 쿠키를 기다려요</strong>
            <span>사진이 도착하면 이곳에서 준비합니다</span>
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
