# Avalanche Bakery 작업 노트

## 레퍼런스

### 1. Avalanche 공식 브랜드
[Avalanche Brand Assets](https://support.avax.network/en/articles/4132288-avalanche-brand-assets)의 2026 가이드는 강한 레드, 수평 흐름, 수직 구획선, 굵은 대문자 제목을 핵심 문법으로 쓴다.
적용 규칙: `--ava`를 상단 바와 오븐 외장처럼 넓은 면에 쓰고, 화면의 세 구역은 수직선과 수평 리듬으로 명확히 나눈다.

### 2. 고급 베이커리·일본 양과자점
[Tartine Manufactory](https://juliettecezzar.com/Tartine-Manufactory)는 재료와 타이포 자체로, [Shiseido Parlour](https://parlour.shiseido.co.jp/en/history/)는 네오클래식 간판·패키지의 반복으로 따뜻함과 격을 만든다.
적용 규칙: 장식 이미지를 늘리지 않고 종이색 면, 단단한 테두리, 반복되는 라벨과 간판 타이포로 손으로 만든 포장 상자의 인상을 만든다.

### 3. 미술관·보석 쇼케이스 조명
[Canadian Conservation Institute](https://www.canada.ca/en/conservation-institute/services/conservation-preservation-publications/technical-bulletins/led-lighting-museums.html)는 광원이 관람객에게 직접 보이지 않게 하고 물체에만 정확히 빛을 모으라고 권한다.
적용 규칙: 진열장 광원 자체는 숨기고, 새 증서가 들어오는 0.4초 동안 해당 슬롯과 카드 가장자리만 `--gold`로 밝힌다.

### 4. 공항 split-flap 안내판
[Solari Cifra 3](https://cifra3.com/it/)는 흑백의 높은 대비, 즉시 읽히는 숫자, 짧고 분명한 기계적 전환으로 상태 변화를 사건처럼 만든다.
적용 규칙: 상태 라벨은 고정된 한 줄 슬롯에서만 바뀌고, 뒤집힘을 연상시키는 짧은 세로 스케일 전환 한 번으로 변화 시점을 알린다.

### 5. 자판기·크레인 게임
[Bandai Namco Strike Hook](https://sc.bandainamco-am.com/Ecommerce/category/commercial-games/strike-hook)은 잡기 전 긴장과 획득 순간의 명확한 도착을 분리해 보상을 체감시킨다.
적용 규칙: 오븐 체류 중에는 미세한 떨림만 허용하고, 진열장으로 나오는 이동과 슬롯 착지에만 가장 큰 크기 변화와 조명을 집중한다.

## Task 3 완성도 체크리스트

### 구조
- [x] 8px 그리드: 주요 높이·여백·간격을 8px 배수로 재정렬했다.
- [x] 타이포 5단계: 24 / 32 / 40 / 56 / 72px 토큰만 사용한다.
- [x] 테두리 2종: 2px와 4px만 사용한다.
- [x] 모서리 2종: 8px와 160px 아치만 사용한다. 원형 쿠키·노브는 도형이라 예외다.
- [x] easing 하나: `cubic-bezier(0.22, 1, 0.36, 1)`을 CSS와 Framer Motion에서 공유한다.

### 빈 상태
- [x] 15칸이 비면 각 칸에 케이크 돔과 큰 `대기` 라벨이 남아 진열 가구로 보인다.
- [x] 3 / 8 / 15칸은 고정 5×3 그리드와 `shelfIndex`로 확인했다. 수량과 무관하게 빈 칸 크기가 바뀌지 않는다.
- [x] 작업대가 비면 레드 믹싱볼과 `첫 쿠키를 기다려요` 안내가 QR 위에 남는다.

### 읽힘과 예외
- [x] 공개 화면의 최소 글자는 1920 기준 24px이며, 밝은 `--paper`가 화면 대부분을 차지한다.
- [x] 10자 초과 닉네임은 한 줄 말줄임하고 전체 카드 크기는 유지한다.
- [x] 세로 사진도 `object-fit: cover; object-position: center`로 정사각 프레임을 채운다.
- [x] FAILED는 작업대의 `다시 확인` 레드 라벨로만 보이며 기술 오류 문구를 노출하지 않는다.
- [x] hidden 카드는 해당 `shelfIndex`만 비워 두므로 이후 카드가 당겨지지 않는다.

### 모션
- [x] 상태 전환은 400~650ms 안에 끝나며 동일 easing을 사용한다.
- [x] 여러 카드가 움직여도 같은 경로·시간만 사용하고 별도 장식을 추가하지 않았다.
- [x] `prefers-reduced-motion`에서는 Framer 전환과 CSS 애니메이션을 즉시 끝낸다.
- [x] 상태 전달용 오븐 발광·미세 떨림·슬롯 점등 외 장식 모션은 없다.
