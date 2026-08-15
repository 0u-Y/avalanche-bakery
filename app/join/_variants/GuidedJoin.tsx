'use client';

import { useEffect, useState } from 'react';

import { CommonJoinFlow } from '../_shared/CommonJoinFlow';
import { CompletionScreen } from '../_shared/CompletionScreen';
import { JoinShell } from '../_shared/JoinShell';
import type { JoinSubmission } from '../_shared/joinTypes';

const GUIDED_STEPS = [
  ['사진 저장됨', '방금 찍은 사진을 안전하게 받았어요.'],
  ['증서 만드는 중', '사진과 이름을 오늘의 참가 증서에 담아요.'],
  ['굽는 중', '공개된 기록으로 남겨 누구나 확인할 수 있게 해요.'],
  ['진열 완료', '앞 화면 7번 칸에 당신의 증서가 놓였어요.'],
] as const;

export function GuidedJoin() {
  const [submission, setSubmission] = useState<JoinSubmission | null>(null);
  const [phase, setPhase] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!submission) return;
    const timers = [
      window.setTimeout(() => setPhase(1), 2_200),
      window.setTimeout(() => setPhase(2), 4_700),
      window.setTimeout(() => setPhase(3), 8_000),
      window.setTimeout(() => setComplete(true), 10_500),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [submission]);

  if (!submission) return <CommonJoinFlow onSubmit={setSubmission} />;
  if (complete) return <CompletionScreen submission={submission} />;

  return (
    <JoinShell currentStep={5}>
      <section className="join-step post-submit post-b">
        <header><span className="post-kicker">자동으로 진행 중</span><h1>쿠키가 증서가 되는 길</h1></header>
        <ol className="guided-steps">
          {GUIDED_STEPS.map(([title, copy], index) => (
            <li className={index === phase ? 'is-current' : index < phase ? 'is-past' : ''} key={title}>
              <i>{index + 1}</i><span><b>{title}</b><small>{copy}</small></span>
            </li>
          ))}
        </ol>
        <p className="guided-note">버튼을 누를 필요 없어요. 과정이 끝나면 알려드릴게요.</p>
      </section>
    </JoinShell>
  );
}
