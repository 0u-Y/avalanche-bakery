'use client';

import { ConsentStep, NicknameStep, SubmitStep } from '@/app/join/_shared/DetailSteps';
import { CompletionScreen } from '@/app/join/_shared/CompletionScreen';
import { JoinShell } from '@/app/join/_shared/JoinShell';
import { CodeStep, EmailStep } from '@/app/join/_shared/LoginSteps';
import { PhotoStep } from '@/app/join/_shared/PhotoStep';
import { AutomaticPost, GuidedPost, ParticipatoryPost } from '@/app/join/_variants/PostSubmitViews';

import { DEMO_SUBMISSION, type DemoVariant } from './demoState';

type CommonStage = 'email' | 'code' | 'photo' | 'nickname' | 'consent' | 'submit';

function commonStage(seconds: number): CommonStage {
  if (seconds < 3.4) return 'email';
  if (seconds < 6.4) return 'code';
  if (seconds < 9.4) return 'photo';
  if (seconds < 12.4) return 'nickname';
  if (seconds < 15.5) return 'consent';
  return 'submit';
}

function typed(source: string, progress: number) {
  return source.slice(0, Math.max(0, Math.floor(source.length * Math.min(progress, 1))));
}

export function DemoPhone({ variant, seconds }: { variant: DemoVariant; seconds: number }) {
  if (seconds >= 17) return <PostSubmitPhone variant={variant} seconds={seconds} />;
  const stage = commonStage(seconds);
  const step = { email: 1, code: 1, photo: 2, nickname: 3, consent: 4, submit: 5 }[stage];
  const email = typed('ovenstar@example.com', seconds / 2.8);
  const code = typed('481726', (seconds - 3.6) / 2.1);
  const nickname = typed('오븐별', (seconds - 9.7) / 1.8);
  const preview = seconds > 7.2 ? DEMO_SUBMISSION.photoPreview : null;
  const tv = seconds > 13.1;
  const nft = seconds > 14.2;

  return (
    <JoinShell currentStep={step} embedded>
      <section className="join-step">
        {stage === 'email' ? <EmailStep email={email} onEmail={() => {}} onCode={() => {}} onGoogle={() => {}} /> : null}
        {stage === 'code' ? <CodeStep code={code} email="ovenstar@example.com" onCode={() => {}} onNext={() => {}} onBack={() => {}} /> : null}
        {stage === 'photo' ? <PhotoStep preview={preview} onPhoto={() => {}} onSample={() => {}} onNext={() => {}} /> : null}
        {stage === 'nickname' ? <NicknameStep nickname={nickname} onNickname={() => {}} onNext={() => {}} onBack={() => {}} /> : null}
        {stage === 'consent' ? <ConsentStep tv={tv} nft={nft} onTv={() => {}} onNft={() => {}} onNext={() => {}} onBack={() => {}} /> : null}
        {stage === 'submit' ? <SubmitStep nickname={DEMO_SUBMISSION.nickname} preview={preview} onSubmit={() => {}} onBack={() => {}} /> : null}
      </section>
    </JoinShell>
  );
}

function PostSubmitPhone({ variant, seconds }: { variant: DemoVariant; seconds: number }) {
  const completeAt = 28;
  if (seconds >= completeAt) return <CompletionScreen submission={DEMO_SUBMISSION} embedded />;
  const guidedPhase = seconds < 19 ? 0 : seconds < 22 ? 1 : seconds < 25 ? 2 : 3;
  const cStarted = seconds >= 20.5;
  return (
    <JoinShell currentStep={5} embedded>
      {variant === 'a' ? <AutomaticPost submission={DEMO_SUBMISSION} /> : null}
      {variant === 'b' ? <GuidedPost phase={guidedPhase} /> : null}
      {variant === 'c' ? <ParticipatoryPost submission={DEMO_SUBMISSION} started={cStarted} onStart={() => {}} /> : null}
    </JoinShell>
  );
}
