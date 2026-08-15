'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { CommonJoinFlow } from '../_shared/CommonJoinFlow';
import { CompletionScreen } from '../_shared/CompletionScreen';
import { JoinShell } from '../_shared/JoinShell';
import type { JoinSubmission } from '../_shared/joinTypes';

export function ParticipatoryJoin() {
  const [submission, setSubmission] = useState<JoinSubmission | null>(null);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!started) return;
    const timer = window.setTimeout(() => setComplete(true), 8_000);
    return () => window.clearTimeout(timer);
  }, [started]);

  const startOven = () => {
    navigator.vibrate?.(45);
    setStarted(true);
  };

  if (!submission) return <CommonJoinFlow onSubmit={setSubmission} />;
  if (complete) return <CompletionScreen submission={submission} />;

  return (
    <JoinShell currentStep={5}>
      <section className={`join-step post-submit post-c ${started ? 'is-started' : ''}`}>
        {!started ? (
          <>
            <span className="post-kicker">모두 함께 시작해요</span>
            <h1>쿠키를 오븐에 넣을 준비가 됐어요</h1>
            <div className="operator-callout"><i /><b>운영자 안내를 기다려 주세요</b><small>“다 같이 눌러 주세요”라는 말을 들으면 시작해요.</small></div>
            <motion.button
              className="oven-action"
              type="button"
              onClick={startOven}
              whileTap={reduceMotion ? undefined : { scale: 0.94, y: 4 }}
              transition={{ duration: 0.16 }}
            >
              오븐에 넣기
            </motion.button>
          </>
        ) : (
          <div className="c-started-message">
            <span>오븐이 시작됐어요</span>
            <strong>고개를 들어<br />앞 화면을 보세요</strong>
            <p>{submission.nickname} 쿠키가 지금 오븐으로 이동해요.</p>
          </div>
        )}
      </section>
    </JoinShell>
  );
}
