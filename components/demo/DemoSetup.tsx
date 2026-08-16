import type { DemoVariant } from './demoState';

const VARIANTS = [
  {
    id: 'a',
    title: '앞 화면에 집중',
    copy: '폰은 해야 할 일을 최소화하고, 굽고 진열되는 과정은 TV에서 보여줘요.',
  },
  {
    id: 'b',
    title: '폰에서도 단계 확인',
    copy: '폰에 네 단계를 차례로 보여주고, TV도 같은 처리 흐름을 따라가요.',
  },
] as const;

export function DemoSetup({
  variant,
  participantCount,
  scale,
  onVariant,
  onParticipantCount,
  onStart,
}: {
  variant: DemoVariant;
  participantCount: number;
  scale: number;
  onVariant: (variant: DemoVariant) => void;
  onParticipantCount: (count: number) => void;
  onStart: () => void;
}) {
  const setCount = (count: number) => onParticipantCount(Math.min(15, Math.max(1, count)));

  return (
    <main className="simulation-viewport">
      <div className="setup-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <section className="setup-brand-panel">
          <svg className="setup-brand-mark" viewBox="0 0 1503 1504" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M1502.5 752c0 414.77-336.23 751-751 751-414.766 0-751-336.23-751-751C.5 337.234 336.734 1 751.5 1c414.77 0 751 336.234 751 751Zm-963.812 298.86H392.94c-30.626 0-45.754 0-54.978-5.9-9.963-6.46-16.051-17.16-16.789-28.97-.554-10.88 7.011-24.168 22.139-50.735l359.87-634.32c15.313-26.936 23.061-40.404 32.839-45.385 10.516-5.35 23.062-5.35 33.578 0 9.778 4.981 17.527 18.449 32.839 45.385l73.982 129.144.377.659c16.539 28.897 24.926 43.551 28.588 58.931 4.058 16.789 4.058 34.5 0 51.289-3.69 15.497-11.992 30.257-28.781 59.591L687.573 964.702l-.489.856c-16.648 29.135-25.085 43.902-36.778 55.042-12.73 12.18-28.043 21.03-44.832 26.02-15.313 4.24-32.47 4.24-66.786 4.24Zm368.062 0h208.84c30.81 0 46.31 0 55.54-6.08 9.96-6.46 16.23-17.35 16.79-29.15.53-10.53-6.87-23.3-21.37-48.323-.5-.852-1-1.719-1.51-2.601L1060.43 785.75l-1.19-2.015c-14.7-24.858-22.12-37.411-31.65-42.263-10.51-5.351-22.88-5.351-33.391 0-9.594 4.981-17.342 18.08-32.655 44.462L857.306 964.891l-.357.616c-15.259 26.34-22.885 39.503-22.335 50.303.738 11.81 6.826 22.69 16.788 29.15 9.041 5.9 24.538 5.9 55.348 5.9Z" fill="currentColor" />
          </svg>
          <span>SESSION SIMULATOR</span>
          <h1>AVALANCHE<br />BAKERY</h1>
          <p>참가자 폰과 행사장 TV를 오가며<br />한 세션의 흐름을 직접 확인합니다.</p>
        </section>

        <section className="setup-form-panel">
          <header><span>경험 선택</span><h2>A와 B 중 하나를 골라요</h2></header>
          <div className="setup-variants">
            {VARIANTS.map((item) => (
              <button
                type="button"
                aria-pressed={variant === item.id}
                onClick={() => onVariant(item.id)}
                key={item.id}
              >
                <b>{item.id.toUpperCase()}</b>
                <span><strong>{item.title}</strong><small>{item.copy}</small></span>
              </button>
            ))}
          </div>

          <div className="setup-count">
            <div><span>참가 인원</span><strong>{String(participantCount).padStart(2, '0')}</strong><small>/ 15명</small></div>
            <div className="count-stepper">
              <button type="button" onClick={() => setCount(participantCount - 1)} aria-label="참가자 한 명 줄이기">−</button>
              <button type="button" onClick={() => setCount(participantCount + 1)} aria-label="참가자 한 명 늘리기">+</button>
            </div>
            <div className="count-presets">
              {[5, 10, 15].map((count) => <button type="button" aria-pressed={participantCount === count} onClick={() => setCount(count)} key={count}>{count}명</button>)}
            </div>
          </div>

          <button className="setup-start" type="button" onClick={onStart}>
            {participantCount}명 시뮬레이션 시작
          </button>
        </section>
      </div>
    </main>
  );
}
