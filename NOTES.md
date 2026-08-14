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

## 임의로 결정한 것과 이유

- 별도 폰트를 내려받지 않고 A안은 `Arial Black`, B안은 `Impact`, C안은 `Georgia` 계열을 썼다. 새 패키지 금지와 행사장 네트워크 불확실성을 우선했다.
- 일반 `/display`의 30초 루프는 참가자를 1.1초 간격으로 넣고, 각 카드를 0.7초 간격으로 준비시킨 뒤 오븐에서 2.1초 머물게 했다. 약 20초에 15칸이 차고 완성 상태를 약 10초 보여준다.
- `?dev=1`은 빈 LIVE 화면에서 시작한다. 운영자가 원하는 수량과 실패 시점을 직접 만들기 쉽고, 세션 초반 빈 상태도 바로 검토할 수 있기 때문이다.
- QR은 시각 목업이며 실제 스캔 대상이 아니다. 백엔드와 공개 참가 URL이 정해지지 않아 `ava.bakery/join`을 자리표시자로 사용했다.
- 허용된 예외에 따라 오븐 내부만 `--ember`→`--ava` 방사형 발광을 썼다. 그 밖의 면에는 그라데이션이 없다.
- 여섯 번째 색은 추가하지 않았다. 투명도가 필요한 중간톤은 `--ink`와 `--paper`만 혼합했다.

## types.ts에 부족한 필드

계약은 수정하지 않았다. 실제 연동 전에 백엔드 담당자와 아래 항목을 논의할 필요가 있다.

- `statusChangedAt` 또는 `mintingStartedAt`: 여러 TV가 동일한 2초 오븐 체류 연출을 재현하려면 서버 기준 시각이 필요하다.
- `submittedAt`: `shelfIndex` 재계산이나 운영 기록에서 제출 순서를 검증할 때 필요하다.
- `failureReason`: TV에는 감추되 향후 `/admin`에서 재시도 판단을 하려면 필요하다.
- 행사명, 실제 `joinUrl`/QR payload, 슬라이드 콘텐츠: 현재 `ShowState`만으로는 행사별 문구와 교육 자료를 내려줄 수 없다.
- 응답 `revision` 또는 `updatedAt`: 1초 폴링 전환 시 오래된 응답이 최신 상태를 덮는 것을 막는 데 유용하다.

## 3안 중 추천

**A. 두꺼운 산세리프 간판**을 추천한다. 3m 거리에서 행사명·상태가 가장 빨리 읽히고, 큰 `--ava` 면이 베이커리 장식보다 Avalanche 브랜드를 먼저 기억하게 한다. B안의 수직 리듬은 상태 라벨에 일부 차용하고, C안의 세리프는 작은 진열 카드에서 읽힘이 떨어져 본 화면에는 쓰지 않았다.

## 오븐과 진열 연출 확인

- 오븐 목적 카드 크기를 작업대보다 작게 하고 진입 시 92%까지 축소한다.
- 오븐 발광과 1px 떨림은 MINTING 중에만 보이며, 최소 체류는 목업 스토어에서 2초로 강제한다.
- MINTED 이동 후반에 해당 슬롯이 0.4초간 `--gold`로 켜진다.
- 15번째 카드가 들어오면 진열장 프레임이 한 번 눌리고 `--gold`로 한 번 점등한 뒤 멈춘다.
