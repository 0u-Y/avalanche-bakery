import {
  Archivo_Black,
  Bodoni_Moda,
  Gothic_A1,
  Nanum_Myeongjo,
  Noto_Sans_KR,
  Oswald,
} from 'next/font/google';

const archivoBlack = Archivo_Black({
  weight: '400', subsets: ['latin'], variable: '--font-a-latin', display: 'swap',
});
const gothicA1 = Gothic_A1({
  weight: ['700', '900'], subsets: ['latin'], variable: '--font-a-korean', display: 'swap',
});
const oswald = Oswald({
  weight: 'variable', subsets: ['latin'], variable: '--font-b-latin', display: 'swap',
});
const notoSansKr = Noto_Sans_KR({
  weight: 'variable', subsets: ['latin'], variable: '--font-b-korean', display: 'swap',
});
const bodoniModa = Bodoni_Moda({
  weight: 'variable', style: ['normal', 'italic'], subsets: ['latin'],
  variable: '--font-c-latin', display: 'swap',
});
const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700', '800'], subsets: ['latin'],
  variable: '--font-c-korean', display: 'swap',
});

const CONCEPTS = [
  {
    id: 'a', label: 'A · 두꺼운 산세리프 간판', font: 'Archivo Black + Gothic A1',
    lines: ['두꺼운 글자와 넓은 레드 면이 행사 간판처럼 먼저 보입니다.', '각진 증서와 쿠키 도장형 빈 칸으로 힘 있고 친근합니다.'],
  },
  {
    id: 'b', label: 'B · 콘덴스드 고딕', font: 'Oswald + Noto Sans KR',
    lines: ['좁고 높은 글자와 촘촘한 정보로 공항 안내판의 긴장을 만듭니다.', '레드는 이름 블록에 집중하고 빈 칸은 split-flap 대기 표시로 남깁니다.'],
  },
  {
    id: 'c', label: 'C · 올드 제과점 세리프', font: 'Bodoni Moda + Nanum Myeongjo',
    lines: ['세리프 대비와 여백으로 오래된 양과자점 포장지처럼 보입니다.', '얇은 테두리와 아치형 빈 칸이 증서를 기념품처럼 다룹니다.'],
  },
] as const;

const fontVariables = [
  archivoBlack.variable, gothicA1.variable, oswald.variable,
  notoSansKr.variable, bodoniModa.variable, nanumMyeongjo.variable,
].join(' ');

export function Styleguide() {
  return (
    <main className={`styleguide-page ${fontVariables}`}>
      <header className="styleguide-intro">
        <span>AVALANCHE BAKERY · VISUAL DIRECTIONS</span>
        <h1>화면 분위기 3안</h1>
        <p>같은 내용, 다른 목소리. 타이포·색면·진열 방식까지 비교합니다.</p>
      </header>
      <TopBarComparison />
      {CONCEPTS.map((concept) => (
        <section className={`concept concept-${concept.id}`} key={concept.id}>
          <div className="concept-note">
            <span className="concept-index">DIRECTION {concept.id.toUpperCase()}</span>
            <h2>{concept.label}</h2>
            <p>{concept.lines[0]}<br />{concept.lines[1]}</p>
            <strong>FONT · {concept.font}</strong>
          </div>
          <ConceptStage id={concept.id} />
        </section>
      ))}
    </main>
  );
}

function TopBarComparison() {
  return (
    <section className="bar-comparison">
      <div className="comparison-heading">
        <span>TYPE &amp; INFORMATION RHYTHM</span>
        <h2>상단 바만 한눈에 비교</h2>
      </div>
      <div className="comparison-grid">
        {CONCEPTS.map((concept) => (
          <div className={`comparison-sample concept-${concept.id}`} key={concept.id}>
            <p><b>{concept.id.toUpperCase()}</b><span>{concept.font}</span></p>
            <ConceptBar compact />
          </div>
        ))}
      </div>
    </section>
  );
}

function ConceptStage({ id }: { id: 'a' | 'b' | 'c' }) {
  return (
    <div className="concept-stage">
      <ConceptBar />
      <div className="concept-body">
        <div className="concept-oven">
          <span>ON-CHAIN OVEN</span><strong>굽는 중</strong>
          <div className="sample-cookie-card"><i className="sample-cookie" /><b>민트별</b></div>
        </div>
        <div className="concept-showcase">
          <div className="concept-showcase-title"><span>BAKED TODAY</span><strong>오늘의 진열장</strong></div>
          <div className="concept-slots">
            {Array.from({ length: 5 }, (_, index) => (
              <div className={`concept-slot ${index < 3 ? 'is-filled' : 'is-empty'}`} key={index}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {index < 3 ? (
                  <div className="sample-certificate"><i className="sample-cookie" /><b>#{1042 + index}</b></div>
                ) : <EmptySlot id={id} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConceptBar({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`concept-bar ${compact ? 'is-compact' : ''}`}>
      <strong>AVALANCHE BAKERY</strong><span>COOKIE CLASS · SEOUL</span><b>제출 04 · 발행 03</b>
    </header>
  );
}

function EmptySlot({ id }: { id: 'a' | 'b' | 'c' }) {
  return <div className={`concept-empty empty-${id}`}><i /><em>{id === 'b' ? 'WAIT' : '다음 쿠키'}</em></div>;
}
