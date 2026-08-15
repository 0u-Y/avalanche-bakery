'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type { Entry } from '@/lib/types';

import { CookieCard } from './CookieCard';
import { ZoneHeading } from './ZoneHeading';
import type { CardMotionPhase } from './displaySequence';
import { OVEN_COMPLETE_MS } from './motion';

type LayoutTransition = { layout: { duration: number; ease: [number, number, number, number] } };

export function Oven({
  entries,
  phases,
  transition,
}: {
  entries: Entry[];
  phases: Map<string, CardMotionPhase>;
  transition: LayoutTransition;
}) {
  const active = entries.length > 0;
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
      <ZoneHeading
        note={active ? '한 장을 굽고 있어요' : '다음 쿠키를 받을 준비'}
        label="증서 오븐"
        count={entries.length}
        className="oven-heading"
      />
      <div className="oven-body">
        <div className="oven-window">
          <div className="oven-light" />
          <div className="oven-readout">
            <strong>{active ? '굽는 중' : '예열 완료'}</strong>
            <span>180°</span>
          </div>
          {!active ? (
            <div className="oven-ready">
              <strong>다음 쿠키를<br />기다려요</strong>
            </div>
          ) : null}
          <i className="oven-heat-lines" aria-hidden="true"><span /><span /><span /></i>
          <div className="oven-grid">
            <AnimatePresence initial={false}>
              {entries.map((entry) => <CookieCard key={entry.id} entry={entry} motionPhase={phases.get(entry.id)} />)}
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
