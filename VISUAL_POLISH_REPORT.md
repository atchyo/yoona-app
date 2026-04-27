# Dashboard v2 Visual Polish Pass 02

작성일: 2026-04-27

## 기준 변경

- 이번 작업에서는 이전의 원본 이미지 대조 흐름을 중단했다.
- 현재 구현된 Dashboard v2를 기준 화면으로 삼고, `soft premium healthcare dashboard` 방향에 맞춰 시각적 완성도를 다듬었다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 외부 UI 라이브러리는 건드리지 않았다.

## Text Color

- Dashboard v2의 기본 텍스트 토큰을 pure black 계열에서 softened slate 계열로 낮췄다.
- 큰 제목, 숫자, 본문, 리스트 이름은 `#1F2937`, `#273142`, `#334155` 계열을 사용하도록 정리했다.
- 보조 텍스트와 메타 정보는 `#64748B`, `#7C8AA0`, `#94A3B8` 계열로 분리해 읽기 쉬운 대비를 유지했다.

## Danger Color

- 강한 빨강 중심의 danger 표현을 muted coral scale로 낮췄다.
- danger text는 `#B94743` / `#A9443F`, 배경은 `#FFF8F6`, soft background는 `#FFEDEA`, border는 `#F2D1CC` 계열로 정리했다.
- 상단 summary danger, 상호작용 카드, 경고 아이콘, danger CTA가 같은 색상 계열 안에서 보이도록 맞췄다.

## Logo Clipping

- 좌측 상단 Opti-Me logo mark wrapper를 40px 정사각형으로 고정했다.
- wrapper의 `inline-size`, `block-size`, `flex-basis`, `min-width`, `min-height`를 함께 지정해 flex 레이아웃 안에서도 줄어들지 않게 했다.
- 내부 그래픽 크기와 위치를 줄여 wrapper 안에 여백 있게 들어오도록 조정했다.

## Promo Image Clipping

- 좌측 하단 가족 일러스트 wrapper에 여백과 안정적인 높이를 부여했다.
- 이미지 `object-fit`을 `contain`으로 바꿔 얼굴과 몸이 과하게 crop되지 않게 했다.
- 이미지 배경과 카드 내부 간격을 정리해 프로모션 카드가 덜 답답하게 보이도록 조정했다.

## Summary Card Spacing

- 4개 summary card의 내부 구조를 같은 grid 규칙으로 통일했다.
- icon circle, content, CTA 영역을 분리하고 column gap을 확보했다.
- 제목과 숫자 사이 간격을 늘리고 숫자의 line-height를 안정화해 카드마다 baseline이 비슷하게 보이도록 조정했다.
- danger summary card도 동일한 구조를 유지하면서 색상만 muted danger scale을 사용하게 했다.

## Pet Card Hierarchy

- `반려동물 현황`은 section title로 유지하고, `강아지` 이름은 한 단계 낮은 primary text로 정리했다.
- `말티즈 | 9살` 설명은 secondary/muted 컬러와 작은 크기로 낮췄다.
- 우측 `1마리`와 화살표는 클릭 가능성은 유지하되 과하게 진하지 않게 톤을 낮췄다.

## Overall Polish

- 카드 border, radius, shadow 토큰을 정리해 주요 카드가 같은 시스템 안에 있는 것처럼 보이게 했다.
- badge padding, height, font weight, color를 조정해 가족/상태 badge의 밀도를 맞췄다.
- CTA와 primary button 색상을 조금 낮춰 화면에서 보라색 덩어리처럼 튀는 느낌을 줄였다.
- 아이콘 stroke width를 `1.8`로 낮춰 전체적으로 더 얇고 정돈된 라인 아이콘 톤에 맞췄다.
- `docs/UI_GUIDE.md`는 현재 Dashboard v2 baseline과 muted color system 기준으로 업데이트했다.

## Verification

- Before screenshot: `screenshots/dashboard-v2-before-polish02.png`
- After screenshot: `screenshots/dashboard-v2-desktop.png`
- Local verification URL: `http://localhost:5175/`
- `npm run build` 통과.

## 남은 시각적 아쉬움

- 현재 데스크톱 화면은 안정적이지만, 모바일/태블릿은 이번 범위에서 크게 손대지 않았다.
- 다크 모드도 이번 범위에서 제외했기 때문에 별도 pass에서 light 기준과 같은 토큰 정리가 필요하다.
- 일부 큰 headline과 숫자는 브랜드 성격상 선명하게 남겨 두었으나, 추후 더 차분한 톤을 원하면 font weight를 한 단계 더 낮출 수 있다.
