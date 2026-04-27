# Dashboard v2 Visual Polish Pass 03

작성일: 2026-04-27

## 작업 범위

- 이번 pass는 desktop light 화면의 visual polish만 진행했다.
- 다크모드는 수정하지 않았고, 모바일 레이아웃 polish도 별도 pass로 남겼다.
- tablet/mobile은 smoke screenshot으로 완전히 깨지지 않는지만 확인했다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 외부 UI 라이브러리는 건드리지 않았다.

## UI Guide 업데이트

- `docs/UI_GUIDE.md`를 새로 갈아엎지 않고 현재 Dashboard v2 기준으로 유지보수했다.
- desktop light baseline polish 단계임을 명시했다.
- 다크모드와 모바일 polish는 별도 pass에서 다룬다고 정리했다.
- 사람 아바타는 캐릭터형보다 미니멀 라인형을 우선한다는 규칙을 추가했다.
- 로고/이미지 clipping 방지 규칙을 보강했다.
- summary number font weight 기준을 760-780으로 낮췄다.
- greeting과 summary number는 pure black 대신 softened slate 계열을 쓰도록 반영했다.
- 외부 레퍼런스 재현 중심의 오래된 기준은 되살리지 않았다.

## 변경 내용

### Sidebar Promo Card

- sidebar promo card를 viewport 바닥에서 더 위로 올렸다.
- 1920x1080 CSS viewport 기준 card top은 `704px`, main lower grid top은 `784px`로, promo card가 하단 콘텐츠 영역과 더 자연스럽게 겹쳐 보이도록 조정했다.
- 이미지 `object-fit: contain`과 내부 padding은 유지해 clipping을 방지했다.

### Profile Icon

- 상단 프로필 칩의 캐릭터형 얼굴 아이콘을 제거하고 원형 컨테이너 안의 simple line user icon으로 바꿨다.
- 30px 원형 컨테이너, 연한 slate line, 1.7px 수준의 stroke 느낌으로 맞췄다.

### Family Avatars

- 가족 현황의 본인/아버지/어머니/김아들 아바타를 캐릭터 얼굴에서 line user icon으로 변경했다.
- 같은 아이콘 구조를 사용하고, 배경색과 line color만 부드럽게 달리했다.

### Dog Avatar

- 강아지 얼굴과 귀를 약 8-12% 줄이고 위치를 재조정했다.
- 가족 현황과 반려동물 현황 카드 모두 같은 dog avatar를 사용하며, 귀와 얼굴이 원형 컨테이너 안에 들어오도록 맞췄다.

### Report Document Icon

- 리포트 카드의 초록색 document icon이 위로 붙어 보이던 문제를 수정했다.
- report row 내부 `span` 공통 display 규칙이 icon circle의 flex 정렬을 덮고 있어, report icon circle만 `display: inline-flex`, `align-items: center`, `justify-content: center`로 다시 고정했다.
- 최종 center delta는 `dx: 0`, `dy: 0.75`로 수직/수평 중앙에 가깝게 정리했다.

### Opti-Me Logo

- 좌측 상단 로고 내부의 복잡한 shape를 단순하고 안정적인 orange abstract pill mark로 정리했다.
- 40px rounded square 안에서 내부 shape가 잘리거나 찌그러지지 않도록 box-shadow 기반 겹침을 제거했다.

### Font Weight / Text Color

- greeting: `840 -> 760`, color `#334155`.
- summary number: `820 -> 770`, normal number color `#334155`.
- medication name: `760 -> 690`.
- warning item title: `760 -> 700`.
- section title: `780 -> 720`.
- promo title: `820 -> 700`.
- greeting 문구는 `안녕하세요. JEONG UNG KIM님!`로 변경했다.

## Screenshot Verification

| Screenshot | CSS viewport | DPR | Saved size |
| --- | ---: | ---: | ---: |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 | 2 | 3840x2160 |
| `screenshots/dashboard-v2-desktop.png` | 1920x1080 | 2 | 3840x2160 |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 | 1 | 1920x1080 |
| `screenshots/dashboard-v2-desktop-wide.png` | 2560x1440 | 1 | 2560x1440 |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 | 2 | 3024x1964 |
| `screenshots/dashboard-v2-tablet-pass03.png` | 1024x768 | 1 | 1024x768 |
| `screenshots/dashboard-v2-mobile-pass03.png` | 390x844 | 3 | 1170x2532 |

## Browser Metrics

- 4K/high-DPI: `window.innerWidth 1920`, `window.innerHeight 1080`, `devicePixelRatio 2`.
- Standard desktop: `window.innerWidth 1920`, `window.innerHeight 1080`, `devicePixelRatio 1`.
- Wide desktop: `window.innerWidth 2560`, `window.innerHeight 1440`, `devicePixelRatio 1`.
- MacBook Retina approximation: `window.innerWidth 1512`, `window.innerHeight 982`, `devicePixelRatio 2`.
- Greeting text confirmed: `안녕하세요. JEONG UNG KIM님!`.
- Summary normal number confirmed: `rgb(51, 65, 85)`, font weight `770`.
- Profile avatar confirmed: `30x30`, line icon pseudo-elements visible.
- Report document icon confirmed: circle display `flex`, center delta `dx 0`, `dy 0.75`.

## 남은 시각적 아쉬움

- Wide desktop에서는 레이아웃이 깨지지는 않지만, 매우 넓은 화면에서 카드 폭을 어디까지 허용할지는 별도 layout pass에서 더 정교하게 볼 수 있다.
- Mobile greeting은 문구 반영과 smoke 확인만 했고, 긴 이름에서의 모바일 타이포그래피 polish는 다음 mobile pass로 남긴다.
- Notification badge는 버튼 바깥으로 살짝 걸치는 의도된 형태라 overflow audit에 1건으로 잡히지만, 시각적으로는 깨짐이 아니다.
