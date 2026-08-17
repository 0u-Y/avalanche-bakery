import Link from 'next/link';

const PHONE_ROUTES = [
  { href: '/join/a', key: 'A', title: '앞 화면에 집중', copy: '제출 뒤 TV로 시선을 넘겨요.' },
  { href: '/join/b', key: 'B', title: '단계 확인', copy: '폰에서 처리 과정을 따라가요.' },
  { href: '/join/c', key: 'C', title: '직접 시작', copy: '안내에 맞춰 오븐을 눌러요.' },
] as const;

export default function Home() {
  return (
    <main className="home-index">
      <section className="home-brand">
        <span className="home-kicker">AVALANCHE BAKERY</span>
        <h1>쿠키를 굽고,<br />오늘을 진열해요.</h1>
        <p>사진 한 장이 오븐을 지나<br />오래 남는 참가 증서가 됩니다.</p>
        <div className="home-stamp" aria-hidden="true"><b>15</b><span>COOKIES<br />ONE SESSION</span></div>
      </section>

      <section className="home-menu">
        <header className="home-menu-heading">
          <span>SESSION PREVIEW</span>
          <h2>어떤 화면을 열까요?</h2>
        </header>

        <Link className="home-demo-link" href="/demo">
          <span className="home-link-label">A / B 세션 시뮬레이터</span>
          <h3>폰에서 TV까지<br />한 흐름으로 보기</h3>
          <p>참가 인원과 제출 간격을 정하고 실제 행사처럼 재생합니다.</p>
          <ul aria-label="데모 기능">
            <li>A·B 비교</li><li>1–15명</li><li>폰·TV 전환</li>
          </ul>
          <strong>데모 열기 <i aria-hidden="true">→</i></strong>
        </Link>

        <div className="home-direct-grid">
          <section className="home-phone-links">
            <header><span>PHONE</span><h3>참가자 화면</h3></header>
            <nav aria-label="참가자 화면 선택">
              {PHONE_ROUTES.map((route) => (
                <Link href={route.href} key={route.href}>
                  <b>{route.key}</b>
                  <span><strong>{route.title}</strong><small>{route.copy}</small></span>
                  <i aria-hidden="true">→</i>
                </Link>
              ))}
            </nav>
          </section>

          <Link className="home-tv-link" href="/display">
            <span>TV</span>
            <h3>행사장<br />디스플레이</h3>
            <p>오븐과 15칸 진열장을 전체 화면으로 봅니다.</p>
            <strong>열기 <i aria-hidden="true">→</i></strong>
          </Link>
        </div>
      </section>
    </main>
  );
}
