'use client';

import { useEffect, useState } from 'react';

import { CommonJoinFlow } from '../_shared/CommonJoinFlow';
import { CompletionScreen } from '../_shared/CompletionScreen';
import { JoinShell } from '../_shared/JoinShell';
import type { JoinSubmission } from '../_shared/joinTypes';
import { AutomaticPost } from './PostSubmitViews';

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
      <AutomaticPost submission={submission} />
    </JoinShell>
  );
}
