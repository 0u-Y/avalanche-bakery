'use client';

import { useEffect, useState } from 'react';

import { CommonJoinFlow } from '../_shared/CommonJoinFlow';
import { CompletionScreen } from '../_shared/CompletionScreen';
import { JoinShell } from '../_shared/JoinShell';
import type { JoinSubmission } from '../_shared/joinTypes';

export function AutomaticJoin() {
  const [submission, setSubmission] = useState<JoinSubmission | null>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!submission) return;
    const timer = window.setTimeout(() => setComplete(true), 8_000);
    return () => window.clearTimeout(timer);
  }, [submission]);

  if (!submission) return <CommonJoinFlow onSubmit={setSubmission} />;
  if (complete) return <CompletionScreen submission={submission} />;

  return (
    <JoinShell currentStep={5}>
      <section className="join-step post-submit post-a">
        <span className="post-kicker">자동으로 진행 중</span>
        <h1>당신의 쿠키를<br />굽고 있어요</h1>
        <div className="look-up-message">
          <small>지금은 폰에서 할 일이 없어요</small>
          <strong>고개를 들어<br />앞 화면을 보세요</strong>
        </div>
        <p>당신의 자리는 <b>{submission.shelfNumber}번 칸</b></p>
      </section>
    </JoinShell>
  );
}
