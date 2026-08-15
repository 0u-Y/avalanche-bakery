import Link from 'next/link';

const ROUTES = [
  ['/demo', '여기부터 보세요', '폰과 행사장 화면이 함께 움직이는 40초 비교'],
  ['/join/a', 'A · 자동', '제출 뒤 시선을 앞 화면으로 바로 넘기는 안'],
  ['/join/b', 'B · 단계 공개', '진행 과정을 네 단계로 알려 주는 안'],
  ['/join/c', 'C · 참여형', '운영자 안내에 맞춰 직접 오븐을 시작하는 안'],
  ['/display', '행사장 TV', '15칸 진열장과 오븐을 보는 실제 디스플레이'],
] as const;

export default function Home() {
  return (
    <main className="route-index">
      <header><span>AVALANCHE BAKERY · PROTOTYPE</span><h1>어느 화면을 볼까요?</h1><p>팀 리뷰는 데모에서 시작하면 흐름을 한 번에 볼 수 있습니다.</p></header>
      <nav>
        {ROUTES.map(([href, label, copy], index) => (
          <Link className={index === 0 ? 'is-primary' : ''} href={href} key={href}>
            <span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b><small>{copy}</small><i aria-hidden="true">→</i>
          </Link>
        ))}
      </nav>
    </main>
  );
}
