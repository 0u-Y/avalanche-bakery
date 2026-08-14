export function TopBar({ counts }: { counts: { submitted: number; minted: number } }) {
  return (
    <header className="top-bar">
      <div className="brand-lockup">
        <span className="brand-mark">AB</span>
        <strong>AVALANCHE BAKERY</strong>
        <span className="event-name">오늘 구운 쿠키를 오래 간직하는 빵집</span>
      </div>
      <div
        className="counts"
        aria-label={`제출 ${counts.submitted}명, 발행 ${counts.minted}명`}
      >
        <span><small>제출</small>{counts.submitted}</span>
        <i />
        <span className="minted-count"><small>발행</small>{counts.minted}</span>
      </div>
    </header>
  );
}
