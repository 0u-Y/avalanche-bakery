import type { ReactNode } from 'react';

import { STEP_LABELS } from './joinTypes';

export function JoinShell({
  currentStep,
  children,
  embedded = false,
}: {
  currentStep: number;
  children: ReactNode;
  embedded?: boolean;
}) {
  return (
    <main className={`join-page ${embedded ? 'is-embedded' : ''}`}>
      <div className="join-phone-canvas">
        <header className="join-header">
          <div className="join-brand"><b>AVALANCHE</b><span>BAKERY</span></div>
          <ol className="join-progress" aria-label={`5단계 중 ${currentStep}단계`}>
            {STEP_LABELS.map((label, index) => {
              const number = index + 1;
              return (
                <li
                  className={number === currentStep ? 'is-current' : number < currentStep ? 'is-done' : ''}
                  key={label}
                >
                  <i />
                  <span>{label}</span>
                </li>
              );
            })}
          </ol>
        </header>
        <div className="join-content">{children}</div>
      </div>
    </main>
  );
}

export function StepHeading({ eyebrow, title, copy }: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <header className="join-step-heading">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
    </header>
  );
}
