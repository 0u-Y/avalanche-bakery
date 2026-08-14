# Avalanche Bakery

쿠키 클래스 현장의 1920×1080 TV에 참가증서 발행 흐름을 보여주는 프론트엔드 프로토타입입니다. 백엔드나 실제 API 없이 인메모리 목업으로만 동작합니다.

## 실행과 접속

```bash
npm install
npm run dev
```

- 자동 데모: [http://localhost:3000/display](http://localhost:3000/display)
- 수동 조작: [http://localhost:3000/display?dev=1](http://localhost:3000/display?dev=1)
- 디자인 3안: [http://localhost:3000/styleguide](http://localhost:3000/styleguide)

일반 화면은 15명이 작업대→오븐→진열장을 통과하는 과정을 30초마다 반복합니다. 마지막 참가자는 약 20초에 발행되고, 완성된 진열장은 약 10초 동안 유지됩니다.

## 개발 패널과 조작키

`?dev=1`에서는 자동 데모가 꺼지고 우측 아래 패널이 나타납니다. 패널 버튼과 다음 단축키는 같은 동작을 합니다.

| 키 | 동작 |
| --- | --- |
| `1` / `5` | 참가자 1명 / 5명 추가 |
| `A` | 전체 다음 상태 |
| `N` | 선택한 참가자 다음 상태 |
| `Space` | 2~4초 자동 진행 토글 |
| `F` | 실패 1건 주입 |
| `L` / `G` / `S` | LIVE / GALLERY / SLIDES |
| `Q` | QR 표시 토글 |
| `R` | 빈 LIVE 상태로 초기화 |

오븐에 들어간 카드는 다음 상태 명령이 바로 와도 최소 2초 동안 머뭅니다. `GALLERY`는 기존 진열장 요소를 유지한 채 중앙으로 확장합니다.

## 목업 이미지

`public/mock/`에 `cookie-1.jpg`~`cookie-6.jpg`, `certificate-1.jpg`~`certificate-6.jpg`를 넣으면 자동으로 표시됩니다. 파일이 없거나 로드에 실패하면 5색 팔레트로 만든 플레이스홀더가 나타납니다.

검증 명령은 `npm run lint`와 `npm run build`입니다.
