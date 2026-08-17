'use client';

import { useEffect, useState } from 'react';

import { CommonJoinFlow } from '../_shared/CommonJoinFlow';
import { CompletionScreen } from '../_shared/CompletionScreen';
import { JoinShell } from '../_shared/JoinShell';
import type { JoinSubmission } from '../_shared/joinTypes';
import { GuidedPost } from './PostSubmitViews';

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
  if (complete) return <CompletionScreen submission={submission} showProcess />;

  return (
    <JoinShell currentStep={4} back={{ label: '처음 화면', href: '/' }}>
      <GuidedPost phase={phase} submission={submission} />
    </JoinShell>
  );
}
