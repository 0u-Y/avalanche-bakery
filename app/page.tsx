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
          <div className="home-shelf-preview" aria-hidden="true">
            {Array.from({ length: 15 }, (_, index) => <i data-filled={index < 4} key={index} />)}
          </div>
          <p><b>15</b><span>COOKIES<br />ONE SESSION</span></p>
        </section>

        <section className="home-launch-panel">
          <Link className="home-demo-link" href="/demo">
            <header><span>SESSION</span><strong>시작 <i aria-hidden="true">→</i></strong></header>
            <div className="home-demo-copy"><h2>A/B 데모</h2><p>폰부터 TV까지 한 번에</p></div>
            <div className="home-session-flow" aria-hidden="true">
              <div className="home-flow-stage is-phone"><span>PHONE</span><i><b /></i></div>
              <em>→</em>
              <div className="home-flow-stage is-oven"><span>OVEN</span><i><b /></i></div>
              <em>→</em>
              <div className="home-flow-stage is-tv"><span>TV</span><i>{Array.from({ length: 10 }, (_, index) => <b key={index} />)}</i></div>
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
