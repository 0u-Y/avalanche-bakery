const CONCEPTS = [
  {
    id: 'a',
    label: 'A · 두꺼운 산세리프 간판',
    font: 'Arial Black / Noto Sans KR',
    lines: ['큰 레드 면과 짧고 굵은 문장으로 행사 간판처럼 보입니다.', '멀리서 가장 빠르게 읽히고 Avalanche 브랜드가 먼저 남습니다.'],
  },
  {
    id: 'b',
    label: 'B · 콘덴스드 고딕',
    font: 'Impact / Arial Narrow',
    lines: ['좁고 높은 글자와 수직 구획으로 공항 안내판의 긴장을 만듭니다.', '정보 밀도가 높고 오븐에서 진열장으로 흐르는 방향이 선명합니다.'],
  },
  {
    id: 'c',
    label: 'C · 올드 제과점 세리프',
    font: 'Georgia / Times New Roman',
    lines: ['오래된 제과점 포장지처럼 차분하고 기념품다운 인상입니다.', '증서를 귀하게 보이게 하지만 실시간 상태의 속도감은 가장 낮습니다.'],
  },
] as const;

export function Styleguide() {
  return (
    <main className="styleguide-page">
      <header className="styleguide-intro">
        <span>AVALANCHE BAKERY · VISUAL DIRECTIONS</span>
        <h1>화면 분위기 3안</h1>
        <p>같은 내용, 다른 목소리. 1920px 기준 비교 시안입니다.</p>
      </header>
      {CONCEPTS.map((concept) => (
        <section className={`concept concept-${concept.id}`} key={concept.id}>
          <div className="concept-note">
            <span className="concept-index">DIRECTION {concept.id.toUpperCase()}</span>
            <h2>{concept.label}</h2>
            <p>{concept.lines[0]}<br />{concept.lines[1]}</p>
            <strong>FONT · {concept.font}</strong>
          </div>
          <ConceptStage />
        </section>
      ))}
    </main>
  );
}

function ConceptStage() {
  return (
    <div className="concept-stage">
      <header className="concept-bar">
        <strong>AVALANCHE BAKERY</strong>
        <span>COOKIE CLASS · SEOUL</span>
        <b>제출 04 · 발행 03</b>
      </header>
      <div className="concept-body">
        <div className="concept-oven">
          <span>ON-CHAIN OVEN</span>
          <strong>굽는 중</strong>
          <div className="sample-cookie-card">
            <i className="sample-cookie" />
            <b>민트별</b>
          </div>
        </div>
        <div className="concept-showcase">
          <div className="concept-showcase-title">
            <span>BAKED TODAY</span><strong>오늘의 진열장</strong>
          </div>
          <div className="concept-slots">
            {Array.from({ length: 5 }, (_, index) => (
              <div className={`concept-slot ${index < 3 ? 'is-filled' : ''}`} key={index}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {index < 3 ? (
                  <div className="sample-certificate">
                    <i className="sample-cookie" />
                    <b>#{1042 + index}</b>
                  </div>
                ) : <em>다음 쿠키</em>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
