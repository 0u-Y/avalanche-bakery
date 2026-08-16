'use client';

import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { BakeryScene } from '@/components/display/BakeryScene';

import { DemoPhone } from './DemoPhone';
import { DemoSetup } from './DemoSetup';
import { SimulationControls } from './SimulationControls';
import {
  DEFAULT_PARTICIPANTS,
  makeSimulationState,
  participantLocalTime,
  sessionDuration,
  type DemoVariant,
  type DemoView,
  type SubmissionPattern,
} from './demoState';

function useViewportScale(width: number, height: number) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const resize = () => setScale(Math.min(window.innerWidth / width, window.innerHeight / height));
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [height, width]);
  return scale;
}

function isEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && (
    target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}

export function DemoExperience({ initialVariant = 'a' }: { initialVariant?: DemoVariant }) {
  const reduceMotion = useReducedMotion();
  const [variant, setVariant] = useState<DemoVariant>(initialVariant);
  const [participantCount, setParticipantCount] = useState(DEFAULT_PARTICIPANTS);
  const [pattern, setPattern] = useState<SubmissionPattern>('BURST');
  const [started, setStarted] = useState(false);
  const [view, setView] = useState<DemoView>('phone');
  const [selectedParticipant, setSelectedParticipant] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const duration = sessionDuration(participantCount, pattern);
  const scale = useViewportScale(started && view === 'tv' ? 1920 : 1600, started && view === 'tv' ? 1080 : 900);
  const state = makeSimulationState(participantCount, elapsed, pattern);
  const phoneLocalMs = participantLocalTime(selectedParticipant, elapsed, pattern);
  const complete = elapsed >= duration;

  const start = useCallback(() => {
    setElapsed(0);
    setView('phone');
    setSelectedParticipant(0);
    setPlaying(true);
    setStarted(true);
  }, []);
  const reset = useCallback(() => {
    setElapsed(0);
    setPlaying(true);
  }, []);
  const openSetup = useCallback(() => {
    setPlaying(false);
    setElapsed(0);
    setStarted(false);
  }, []);

  useEffect(() => {
    if (!started || !playing) return;
    const interval = window.setInterval(() => {
      setElapsed((current) => {
        const next = Math.min(current + 100, duration);
        if (next >= duration) window.clearInterval(interval);
        return next;
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [duration, playing, started]);
  useEffect(() => {
    if (!started) return;
    const keydown = (event: KeyboardEvent) => {
      if (isEditable(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === 'p') setView('phone');
      else if (key === 't') setView('tv');
      else if (key === 'r') reset();
      else if (event.key === 'Escape') openSetup();
      else if (event.code === 'Space' && !complete) {
        event.preventDefault();
        setPlaying((current) => !current);
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [complete, openSetup, reset, started]);

  if (!started) {
    return (
      <DemoSetup
        variant={variant}
        participantCount={participantCount}
        pattern={pattern}
        scale={scale}
        onVariant={setVariant}
        onParticipantCount={setParticipantCount}
        onPattern={setPattern}
        onStart={start}
      />
    );
  }

  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] as const };
  return (
    <main className="simulation-viewport">
      <MotionConfig reducedMotion="user">
        <AnimatePresence initial={false}>
          {view === 'phone' ? (
            <motion.section className="simulation-stage" key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <div className="simulation-phone-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
                <div className="simulation-paper-plane" aria-hidden="true" />
                <div className="simulation-bench-plane" aria-hidden="true" />
                <article className="simulation-phone-device" aria-label={`${selectedParticipant + 1}번째 참가자 휴대폰`}>
                  <i className="simulation-speaker" aria-hidden="true" />
                  <i className="simulation-volume" aria-hidden="true" />
                  <i className="simulation-power" aria-hidden="true" />
                  <div className="simulation-phone-screen">
                    <div className="simulation-phone-scale">
                      <DemoPhone
                        variant={variant}
                        participantIndex={selectedParticipant}
                        localMs={phoneLocalMs}
                        pattern={pattern}
                      />
                    </div>
                  </div>
                </article>
              </div>
            </motion.section>
          ) : (
            <motion.section className="simulation-stage" key="tv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <div className="simulation-tv-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
                <BakeryScene state={state} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </MotionConfig>
      <SimulationControls
        variant={variant}
        participantCount={participantCount}
        selectedParticipant={selectedParticipant}
        submittedCount={state.counts.submitted}
        view={view}
        playing={playing && !complete}
        complete={complete}
        onView={setView}
        onParticipant={(offset) => setSelectedParticipant((current) => (
          Math.min(participantCount - 1, Math.max(0, current + offset))
        ))}
        onTogglePlaying={() => setPlaying((current) => !current)}
        onReset={reset}
        onSetup={openSetup}
      />
    </main>
  );
}
