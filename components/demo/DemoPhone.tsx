import { CompletionScreen } from '@/app/join/_shared/CompletionScreen';
import { JoinShell } from '@/app/join/_shared/JoinShell';
import { SubmitStep } from '@/app/join/_shared/DetailSteps';
import { AutomaticPost, GuidedPost } from '@/app/join/_variants/PostSubmitViews';

import {
  GUIDED_COMPLETE_AT_MS,
  MINTED_AT_MS,
  makeSubmission,
  type DemoVariant,
} from './demoState';

function guidedPhase(localMs: number) {
  if (localMs < 1_400) return 0;
  if (localMs < 3_000) return 1;
  if (localMs < MINTED_AT_MS) return 2;
  return 3;
}

export function DemoPhone({
  variant,
  participantIndex,
  localMs,
}: {
  variant: DemoVariant;
  participantIndex: number;
  localMs: number;
}) {
  const submission = makeSubmission(participantIndex);
  const completeAt = variant === 'a' ? MINTED_AT_MS : GUIDED_COMPLETE_AT_MS;

  if (localMs >= completeAt) {
    return <CompletionScreen submission={submission} embedded />;
  }

  return (
    <JoinShell currentStep={5} embedded>
      {localMs < 600 ? (
        <section className="join-step">
          <SubmitStep
            nickname={submission.nickname}
            preview={submission.photoPreview}
            onSubmit={() => {}}
            onBack={() => {}}
          />
        </section>
      ) : null}
      {localMs >= 600 && variant === 'a' ? <AutomaticPost submission={submission} /> : null}
      {localMs >= 600 && variant === 'b' ? <GuidedPost phase={guidedPhase(localMs)} /> : null}
    </JoinShell>
  );
}
