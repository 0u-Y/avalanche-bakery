export function TopBar({ counts }: { counts: { submitted: number; minted: number } }) {
  return (
    <header className="top-bar">
      <div className="brand-lockup">
        <span className="brand-mark">A</span>
        <strong>AVALANCHE<br />BAKERY</strong>
        <span className="event-name">오늘 구운 쿠키를 오래 간직하는 빵집</span>
      </div>
      <div
        className="counts"
        aria-label={`도착 ${counts.submitted}명, 진열 ${counts.minted}명`}
      >
        <span><small>도착</small><b>{String(counts.submitted).padStart(2, '0')}</b></span>
        <i />
        <span className="minted-count"><small>진열</small><b>{String(counts.minted).padStart(2, '0')}</b></span>
      </div>
    </header>
  );
}
