'use client';

import { MotionConfig } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { BakeryScene } from '@/components/display/BakeryScene';

import { DemoPhone } from './DemoPhone';
import { DEMO_DURATION, isShelfArrival, makeDemoState, type DemoVariant } from './demoState';

const QUESTIONS = [
  '1. 참가자 입장에서 뭘 해야 할지 모르겠는 순간이 있었나요?',
  '2. 폰을 보게 되나요, 앞 화면을 보게 되나요? 어느 쪽이 맞다고 생각하세요?',
  '3. 민팅이 뭔지 모른다고 치고 — 방금 뭐가 일어난 것 같으세요?',
  '4. A / B / C 중 어느 쪽이고, 그 이유는?',
] as const;
const VARIANTS: DemoVariant[] = ['a', 'b', 'c'];

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

export function DemoExperience() {
  const [variant, setVariant] = useState<DemoVariant>('a');
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const scale = useDemoScale();

  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => {
      elapsedRef.current = (elapsedRef.current + 100) % DEMO_DURATION;
      setElapsed(elapsedRef.current);
    }, 100);
    return () => window.clearInterval(interval);
  }, [playing]);

  const reset = (nextVariant = variant) => {
    elapsedRef.current = 0;
    setElapsed(0);
    setVariant(nextVariant);
    setPlaying(true);
  };
  const seconds = elapsed / 1_000;
  const state = makeDemoState(variant, seconds);
  const celebrating = isShelfArrival(seconds) ? new Set(['entry-7']) : new Set<string>();

  return (
    <main className="demo-viewport">
      <div className="demo-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <header className="demo-toolbar">
          <div><span>TEAM REVIEW PROTOTYPE</span><h1>참가자 경험 비교</h1></div>
          <nav aria-label="비교할 안 선택">
            {VARIANTS.map((item) => (
              <button
                aria-label={`${item.toUpperCase()}안 보기`}
                aria-pressed={variant === item}
                className={variant === item ? 'is-active' : ''}
                onClick={() => reset(item)}
                key={item}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </nav>
          <div className="demo-controls">
            <span>{String(Math.floor(seconds)).padStart(2, '0')} / 40초</span>
            <button onClick={() => setPlaying((value) => !value)}>{playing ? '일시정지' : '재생'}</button>
            <button onClick={() => reset()}>처음으로</button>
          </div>
        </header>
        <MotionConfig reducedMotion="user">
          <section className="demo-workspace">
            <article className="demo-phone-panel">
              <h2><span>참가자 폰</span><b>{variant.toUpperCase()}안</b></h2>
              <div className="demo-phone-frame"><i className="phone-speaker" /><div className="demo-phone-scale"><DemoPhone variant={variant} seconds={seconds} /></div></div>
            </article>
            <article className="demo-tv-panel">
              <h2><span>행사장 앞 화면</span><b>같은 순간</b></h2>
              <div className="demo-tv-frame"><div className="demo-tv-scale"><BakeryScene state={state} celebratingIds={celebrating} /></div></div>
            </article>
          </section>
        </MotionConfig>
        <footer className="demo-feedback">
          <div><span>FEEDBACK QUESTIONS</span><h2>보면서 떠오른 그대로 말해 주세요</h2></div>
          <ol>{QUESTIONS.map((question) => <li key={question}>{question}</li>)}</ol>
        </footer>
      </div>
    </main>
  );
}
