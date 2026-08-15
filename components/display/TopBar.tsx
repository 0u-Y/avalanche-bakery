'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { COUNTER_DURATION, EASE_SETTLE } from './motion';

export function TopBar({ counts }: { counts: { submitted: number; minted: number } }) {
  return (
    <header className="top-bar">
      <div className="brand-lockup">
        <span className="brand-mark">A</span>
        <strong>AVALANCHE<br />BAKERY</strong>
        <span className="event-name">오늘 구운 쿠키를 오래 간직하는 빵집</span>
      </div>
      <div className="counts" aria-label={`도착 ${counts.submitted}명, 진열 ${counts.minted}명`}>
        <span><small>도착</small><AnimatedCount value={counts.submitted} /></span>
        <i />
        <span className="minted-count"><small>진열</small><AnimatedCount value={counts.minted} /></span>
      </div>
    </header>
  );
}

function AnimatedCount({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <span className="count-value">
      <AnimatePresence initial={false}>
        <motion.b
          key={value}
          initial={reduceMotion ? false : { y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { y: 0, opacity: 0 } : { y: -14, opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : COUNTER_DURATION, ease: EASE_SETTLE }}
        >
          {String(value).padStart(2, '0')}
        </motion.b>
      </AnimatePresence>
    </span>
  );
}
