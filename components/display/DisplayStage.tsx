'use client';

import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { mockControls, useShowState } from '@/hooks/useShowState';

import { BakeryScene } from './BakeryScene';
import { DevPanel } from './DevPanel';
import { SlidesShell } from './SlidesShell';
import { DISPLAY_DURATION, DISPLAY_EASE } from './motion';

function useStageScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const resize = () => setScale(Math.min(
      window.innerWidth / 1920,
      window.innerHeight / 1080,
    ));
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  return scale;
}

function useCelebratingIds(entries: ReturnType<typeof useShowState>['entries']) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const previous = useRef(new Map(entries.map((entry) => [entry.id, entry.status])));
  useEffect(() => {
    const minted = entries.filter((entry) => (
      entry.status === 'MINTED' && previous.current.get(entry.id) === 'MINTING'
    )).map((entry) => entry.id);
    previous.current = new Map(entries.map((entry) => [entry.id, entry.status]));
    if (minted.length === 0) return;
    setIds((current) => new Set([...current, ...minted]));
    const timeout = window.setTimeout(() => setIds((current) => {
      const next = new Set(current);
      minted.forEach((id) => next.delete(id));
      return next;
    }), 700);
    return () => window.clearTimeout(timeout);
  }, [entries]);
  return ids;
}

export function DisplayStage({ devMode = false }: { devMode?: boolean }) {
  const state = useShowState();
  const scale = useStageScale();
  const celebratingIds = useCelebratingIds(state.entries);
  const reduceMotion = useReducedMotion();

  return (
    <main className="display-viewport">
      <MotionConfig reducedMotion="user">
        <div
          className="display-canvas"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state.show.mode === 'SLIDES' ? (
              <motion.div
                key="slides"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : DISPLAY_DURATION, ease: DISPLAY_EASE }}
              >
                <SlidesShell slideIndex={state.show.slideIndex} />
              </motion.div>
            ) : (
              <motion.div
                key="bakery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : DISPLAY_DURATION, ease: DISPLAY_EASE }}
              >
                <BakeryScene state={state} celebratingIds={celebratingIds} />
              </motion.div>
            )}
          </AnimatePresence>
          {devMode ? <DevPanel state={state} controls={mockControls} /> : null}
        </div>
      </MotionConfig>
    </main>
  );
}
