'use client';

import { MotionConfig } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';

import { BakeryScene } from '@/components/display/BakeryScene';

import { DemoPhone } from './DemoPhone';
import { DEMO_DURATION, makeDemoState, type DemoVariant } from './demoState';

const CONTROL_REVEAL_KEY = 'avalanche-bakery-demo-controls-until';
const POINTER_HIDE_MS = 1_000;
const KEYBOARD_REVEAL_MS = 2_000;
const TOUCH_REVEAL_MS = 4_000;

function useDemoScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const resize = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  return scale;
}

function isEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && (
    target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}

export function DemoExperience({ variant }: { variant: DemoVariant }) {
  const router = useRouter();
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const elapsedRef = useRef(0);
  const hideTimer = useRef<number | null>(null);
  const scale = useDemoScale();

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }, []);
  const revealControls = useCallback((duration?: number) => {
    clearHideTimer();
    setControlsVisible(true);
    if (duration) hideTimer.current = window.setTimeout(() => setControlsVisible(false), duration);
  }, [clearHideTimer]);
  const hideControlsAfter = useCallback((delay: number) => {
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), delay);
  }, [clearHideTimer]);
  const reset = useCallback(() => {
    elapsedRef.current = 0;
    setElapsed(0);
    setPlaying(true);
  }, []);
  const changeVariant = useCallback((next: DemoVariant, revealFor = 0) => {
    reset();
    if (revealFor > 0) {
      window.sessionStorage.setItem(CONTROL_REVEAL_KEY, String(Date.now() + revealFor));
    }
    router.push(`/demo/${next}`);
  }, [reset, router]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);
  useEffect(() => {
    const revealUntil = Number(window.sessionStorage.getItem(CONTROL_REVEAL_KEY));
    window.sessionStorage.removeItem(CONTROL_REVEAL_KEY);
    const remaining = revealUntil - Date.now();
    if (remaining <= 0) return;
    const timer = window.setTimeout(() => revealControls(remaining), 0);
    return () => window.clearTimeout(timer);
  }, [revealControls]);
  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => {
      elapsedRef.current = (elapsedRef.current + 100) % DEMO_DURATION;
      setElapsed(elapsedRef.current);
    }, 100);
    return () => window.clearInterval(interval);
  }, [playing]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (isEditable(event.target)) return;
      const key = event.key.toLowerCase();
      let handled = true;
      if (key === 'a' || key === 'b' || key === 'c') changeVariant(key, KEYBOARD_REVEAL_MS);
      else if (key === ' ') { event.preventDefault(); setPlaying((value) => !value); }
      else if (key === 'r') reset();
      else handled = false;
      if (handled) revealControls(KEYBOARD_REVEAL_MS);
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [changeVariant, reset, revealControls]);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) hideControlsAfter(POINTER_HIDE_MS);
  };
  const seconds = elapsed / 1_000;
  const state = makeDemoState(variant, seconds);

  return (
    <main className="demo-viewport">
      <div className="demo-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="demo-paper-plane" aria-hidden="true" />
        <div className="demo-bench-plane" aria-hidden="true" />
        <MotionConfig reducedMotion="user">
          <section className="demo-device-group">
            <article className="demo-phone-device" aria-label="참가자 폰 화면">
              <i className="phone-speaker" aria-hidden="true" />
              <i className="phone-volume" aria-hidden="true" />
              <i className="phone-power" aria-hidden="true" />
              <div className="demo-phone-screen"><div className="demo-phone-scale"><DemoPhone variant={variant} seconds={seconds} /></div></div>
            </article>
            <article className="demo-tv-device" aria-label="행사장 TV 화면">
              <div className="demo-tv-screen"><div className="demo-tv-scale"><BakeryScene state={state} /></div></div>
            </article>
          </section>
        </MotionConfig>
        <div
          className={`demo-control-zone ${controlsVisible ? 'is-visible' : ''}`}
          onPointerEnter={(event) => { if (event.pointerType !== 'touch') revealControls(); }}
          onPointerLeave={(event) => { if (event.pointerType !== 'touch') hideControlsAfter(POINTER_HIDE_MS); }}
          onFocusCapture={() => revealControls()}
          onBlurCapture={handleBlur}
        >
          <span className="demo-touch-target" onPointerDown={(event) => { if (event.pointerType === 'touch') revealControls(TOUCH_REVEAL_MS); }} />
          <div className="demo-hidden-controls">
            {(['a', 'b', 'c'] as DemoVariant[]).map((item) => <button type="button" aria-pressed={variant === item} onClick={() => changeVariant(item)} key={item}>{item.toUpperCase()}</button>)}
            <button className="is-wide" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? '정지' : '재생'}</button>
            <button className="is-wide" type="button" onClick={reset}>처음</button>
          </div>
        </div>
      </div>
    </main>
  );
}
