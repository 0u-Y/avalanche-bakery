'use client';

import { useEffect, useMemo, useState } from 'react';

import type { mockControls } from '@/hooks/useShowState';
import type { StateResponse } from '@/lib/types';

export function DevPanel({
  state,
  controls,
}: {
  state: StateResponse;
  controls: typeof mockControls;
}) {
  const [auto, setAuto] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const effectiveId = useMemo(() => (
    state.entries.some((entry) => entry.id === selectedId)
      ? selectedId
      : state.entries[0]?.id ?? ''
  ), [selectedId, state.entries]);

  useEffect(() => {
    if (!auto) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeoutId = setTimeout(() => {
        controls.autoStep();
        schedule();
      }, 2000 + Math.random() * 2000);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, [auto, controls]);

  return (
    <aside className={`dev-panel ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="dev-panel-head">
        <strong>MOCK CONTROL</strong>
        <button type="button" onClick={() => setCollapsed((value) => !value)}>
          {collapsed ? '열기' : '접기'}
        </button>
      </div>
      {!collapsed ? (
        <div className="dev-panel-body">
          <div className="dev-row">
            <button type="button" onClick={() => controls.addParticipants(1)}>참가자 +1</button>
            <button type="button" onClick={() => controls.addParticipants(5)}>참가자 +5</button>
          </div>
          <div className="dev-row">
            <button type="button" onClick={() => controls.advanceAll()}>전체 다음</button>
            <button
              type="button"
              className={auto ? 'is-active' : ''}
              aria-pressed={auto}
              onClick={() => setAuto((value) => !value)}
            >자동 {auto ? '켜짐' : '꺼짐'}</button>
          </div>
          <div className="dev-specific">
            <select
              value={effectiveId}
              onChange={(event) => setSelectedId(event.target.value)}
              aria-label="참가자 선택"
            >
              {state.entries.length === 0 ? <option value="">참가자 없음</option> : null}
              {state.entries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.nickname} · {entry.status}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!effectiveId}
              onClick={() => controls.advanceOne(effectiveId)}
            >1명 다음</button>
          </div>
          <button
            type="button"
            className="dev-wide dev-failure"
            onClick={() => controls.injectFailure()}
          >실패 1건 주입</button>
          <ViewButtons state={state} controls={controls} />
          <div className="dev-row">
            <button type="button" onClick={() => controls.toggleQr()}>
              QR {state.show.qrVisible ? '숨기기' : '보이기'}
            </button>
            <button
              type="button"
              className="dev-reset"
              onClick={() => { setAuto(false); controls.reset(); }}
            >초기화</button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function ViewButtons({ state, controls }: {
  state: StateResponse;
  controls: typeof mockControls;
}) {
  return (
    <div className="dev-row dev-view-row">
      {(['LIVE', 'GALLERY', 'SLIDES'] as const).map((view) => {
        const active = view === 'SLIDES'
          ? state.show.mode === 'SLIDES'
          : state.show.mode === 'BAKERY' && state.show.layout === view;
        return (
          <button
            key={view}
            type="button"
            className={active ? 'is-active' : ''}
            onClick={() => controls.setView(view)}
          >{view}</button>
        );
      })}
    </div>
  );
}
