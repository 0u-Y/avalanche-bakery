'use client';

import { useState } from 'react';
import type { DemoVariant, DemoView } from './demoState';

export function SimulationControls({
  variant,
  participantCount,
  currentParticipant,
  view,
  playing,
  complete,
  onView,
  onTogglePlaying,
  onReset,
  onSetup,
}: {
  variant: DemoVariant;
  participantCount: number;
  currentParticipant: number;
  view: DemoView;
  playing: boolean;
  complete: boolean;
  onView: (view: DemoView) => void;
  onTogglePlaying: () => void;
  onReset: () => void;
  onSetup: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const chooseView = (nextView: DemoView) => {
    onView(nextView);
    setExpanded(false);
  };

  return (
    <aside className="simulation-controls" data-view={view} aria-label="시뮬레이션 조작">
      <div className="simulation-status">
        <b>{variant.toUpperCase()}</b>
        <span>{complete ? '완료' : `${String(currentParticipant).padStart(2, '0')} / ${String(participantCount).padStart(2, '0')}`}</span>
      </div>
      <div className="simulation-view-switch" role="group" aria-label="관찰 화면">
        <button type="button" aria-pressed={view === 'phone'} onClick={() => chooseView('phone')}>휴대폰</button>
        <button type="button" aria-pressed={view === 'tv'} onClick={() => chooseView('tv')}>TV</button>
      </div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="simulation-session-actions"
        onClick={() => setExpanded((current) => !current)}
      >
        세션
      </button>
      <div id="simulation-session-actions" className="simulation-session-actions" data-open={expanded}>
        <button type="button" onClick={onTogglePlaying} disabled={complete}>{playing ? '정지' : '재생'}</button>
        <button type="button" onClick={onReset}>처음</button>
        <button type="button" onClick={onSetup}>설정</button>
      </div>
    </aside>
  );
}
