import Link from 'next/link';

const DIRECT_ROUTES = [
  { href: '/join/a', key: 'A', label: '자동' },
  { href: '/join/b', key: 'B', label: '단계' },
  { href: '/join/c', key: 'C', label: '직접' },
  { href: '/display', key: 'TV', label: '행사장' },
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
          <p>하나를 골라 바로 시작하세요.</p>
        </section>

        <section className="home-launch-panel">
          <Link className="home-demo-link" href="/demo">
            <span>SESSION</span>
            <h2>A/B 데모</h2>
            <p>폰부터 TV까지 한 번에</p>
            <strong>시작 <i aria-hidden="true">→</i></strong>
          </Link>

          <section className="home-direct-links">
            <header><span>DIRECT VIEW</span><h2>바로 열기</h2></header>
            <nav aria-label="개별 화면 바로 열기">
              {DIRECT_ROUTES.map((route) => (
                <Link href={route.href} key={route.href}>
                  <b>{route.key}</b>
                  <span>{route.label}</span>
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
