'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import { ZoneHeading } from './ZoneHeading';

type LayoutTransition = { layout: { duration: number; ease: [number, number, number, number] } };

export function Oven({
  entries,
  transition,
}: {
  entries: Entry[];
  transition: LayoutTransition;
}) {
  const reduceMotion = useReducedMotion();
  const active = entries.length > 0;
  return (
    <motion.section className="oven zone" layout transition={transition}>
      <ZoneHeading
        step="STEP 02 · ON-CHAIN"
        label="오븐"
        count={entries.length}
        className="oven-heading"
      />
      <div className="oven-body">
        <div className="oven-window">
          <motion.div
            className="oven-light"
            initial={false}
            animate={{ opacity: active && !reduceMotion ? [0.05, 0.2, 0.05] : 0.05 }}
            transition={{ duration: 1.1, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
          />
          <div className="oven-copy">
            <span className="micro-label">AVALANCHE C-CHAIN</span>
            <strong>{active ? '지금 굽는 중' : '오븐 준비 완료'}</strong>
          </div>
          <div className="oven-grid">
            <AnimatePresence initial={false}>
              {entries.map((entry) => <CookieCard key={entry.id} entry={entry} />)}
            </AnimatePresence>
          </div>
          <div className="oven-rack" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
        <div className="oven-controls" aria-hidden="true">
          <span /><span /><span /><b>180</b>
        </div>
      </div>
    </motion.section>
  );
}
