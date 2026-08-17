import Link from 'next/link';

const DIRECT_ROUTES = [
  { href: '/join/a', key: 'A', label: '자동', copy: '앞 화면 중심' },
  { href: '/join/b', key: 'B', label: '단계', copy: '과정 확인' },
  { href: '/join/c', key: 'C', label: '직접', copy: '함께 시작' },
  { href: '/display', key: 'TV', label: '행사장', copy: '전체 진열' },
] as const;

export default function Home() {
  return (
    <main className="home-index">
      <header className="home-topbar">
        <strong>AVALANCHE BAKERY</strong>
        <span>15 COOKIES · ONE SESSION</span>
      </header>

      <div className="home-content">
        <section className="home-title-panel">
          <span>UI PROTOTYPE</span>
          <h1>어떤 화면을<br />볼까요?</h1>
          <p className="home-title-copy">같은 세션을 두 가지<br />참가 경험으로 비교합니다.</p>
          <dl className="home-session-facts">
            <div><dt>PARTICIPANTS</dt><dd>15명</dd></div>
            <div><dt>SCREENS</dt><dd>PHONE / TV</dd></div>
          </dl>
        </section>

        <section className="home-launch-panel">
          <Link className="home-demo-link" href="/demo">
            <header><span>SESSION</span><strong>시작 <i aria-hidden="true">→</i></strong></header>
            <div className="home-demo-copy"><h2>A/B 데모</h2><p>폰부터 TV까지 한 번에</p></div>
            <div className="home-variant-summary">
              <section><b>A</b><span><strong>앞 화면 중심</strong><small>제출 뒤 TV로 시선을 넘깁니다.</small></span></section>
              <section><b>B</b><span><strong>단계 확인</strong><small>처리 과정을 폰에서도 확인합니다.</small></span></section>
            </div>
          </Link>

          <section className="home-direct-links">
            <header><span>DIRECT VIEW</span><h2>바로 열기</h2></header>
            <nav aria-label="개별 화면 바로 열기">
              {DIRECT_ROUTES.map((route) => (
                <Link href={route.href} key={route.href}>
                  <b>{route.key}</b>
                  <span><strong>{route.label}</strong><small>{route.copy}</small></span>
                  <i aria-hidden="true">→</i>
                </Link>
              ))}
            </nav>
          </section>
        </section>
      </div>
    </main>
  );
}
