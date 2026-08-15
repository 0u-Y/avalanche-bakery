'use client';

import { AnimatePresence, motion } from 'framer-motion';

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
  const active = entries.length > 0;
  return (
    <motion.section className="oven zone" layout transition={transition}>
      <ZoneHeading
        note={active ? '한 장을 굽고 있어요' : '다음 쿠키를 받을 준비'}
        label="증서 오븐"
        count={entries.length}
        className="oven-heading"
      />
      <div className="oven-body">
        <div className="oven-window">
          <div className={`oven-light ${active ? 'is-active' : ''}`} />
          <div className="oven-readout">
            <strong>{active ? '굽는 중' : '예열 완료'}</strong>
            <span>180°</span>
          </div>
          {!active ? (
            <div className="oven-ready">
              <i aria-hidden="true"><span /><span /><span /></i>
              <strong>다음 쿠키를<br />기다려요</strong>
            </div>
          ) : null}
          <div className="oven-grid">
            <AnimatePresence initial={false}>
              {entries.map((entry) => <CookieCard key={entry.id} entry={entry} />)}
            </AnimatePresence>
          </div>
          <div className="oven-rack" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
        <div className="oven-controls" aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>
    </motion.section>
  );
}
