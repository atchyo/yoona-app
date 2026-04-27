# Opti-Me Dashboard v2 UI Guide

## 기준 화면

현재 구현된 Dashboard v2를 baseline으로 삼는다. 목표는 `soft premium healthcare dashboard`이며, 부드러운 slate text, muted color system, 일관된 spacing, 정돈된 component hierarchy를 우선한다.

현재 단계는 `desktop light baseline polish`다. 다크모드와 모바일 레이아웃의 세부 polish는 별도 pass에서 진행하고, 이번 기준 문서는 desktop light 완성도를 우선한다.

Typography는 4K/wide desktop readability를 위한 `Readable Scale Level 2 + Brand/Icon Polish`를 기준으로 한다. 전역 확대, body 전체 font-size 변경, transform/zoom 기반 확대는 사용하지 않고, `@media (min-width: 1800px)`에서 sidebar width와 주요 텍스트 스케일을 실제로 키운다.

## 색상 규칙

- Primary: `#4F46E5`
- Secondary purple: `#5F5BE8`
- Page background: `#F6F8FC`
- Card background: `#FFFFFF`
- Card soft background: `#F8FAFD`
- Card border: `#DFE6F2`
- Text strongest: `#2F3A4A`
- Text primary: `#334155`
- Text soft: `#475569`
- Text secondary: `#64748B`
- Text muted: `#7C8AA0`
- Text faint: `#94A3B8`
- Danger text: `#B94743`
- Danger strong: `#A9443F`
- Danger background: `#FFF8F6`
- Danger soft background: `#FFEDEA`
- Danger border: `#F2D1CC`
- Success badge: pale mint background with `#0A8F67` text.

## 텍스트 위계

- Page greeting: 30px 전후, 720-750, `#334155`.
- Greeting subtitle: 17px 전후, `text secondary`.
- Sidebar logo title: 30px 전후, 720-750.
- Sidebar logo subtitle: 16px 전후, 600-630, `text soft`.
- Sidebar menu label: 21px 전후, 640-670.
- Section title: 23px 전후, 680-710, `text primary`.
- Card body title: 17-18px, 640-690, `text strongest`.
- Body copy: 16-17px 전후, `text secondary`.
- Meta copy: 15.5-16px 전후, `text muted`.
- Summary title: 17px 전후, 700, `text secondary`.
- Summary number: 34px 전후, 720-750, `#334155` for normal cards and muted danger scale for danger cards.
- CTA text: 16px 전후, 760, primary or muted danger scale.
- Badge text는 13px 전후를 기준으로 하고 pill이 답답해지면 padding을 먼저 조정한다.
- Font weight는 더 무겁게 올리지 않는다. Readable Scale Level 2는 크기와 공간을 키우는 pass이며, 굵기를 키우는 pass가 아니다.

## Readable Scale Level 2

- Readable Scale Level 2는 wide desktop 전용이며 `@media (min-width: 1800px)` 조건에서 적용한다.
- 목적은 1920x1080 CSS viewport + DPR 2의 4K screenshot에서 전보다 확실히 읽기 편한 밀도를 만드는 것이다.
- Level 2도 전역 확대가 아니며, body 전체 font-size 변경, zoom, transform scale은 사용하지 않는다.
- Sidebar width, sidebar menu label, logo title, summary, section title, body/meta text를 함께 키워 좌측과 오른쪽 콘텐츠의 typography 균형을 맞춘다.
- Sidebar menu label은 21px 전후, line-height는 1.35-1.42 범위를 기준으로 한다.
- Sidebar menu row height는 58-62px 전후를 허용하되, 메뉴 리스트가 아래로 밀려 promo card와 충돌하면 spacing을 다시 조정한다.
- Sidebar logo title은 30px 전후, subtitle은 16px 전후를 기준으로 한다. Subtitle은 브랜드명과 경쟁하지 않는 보조 텍스트여야 한다.
- Sidebar brand title top은 오른쪽 greeting title top과 0-3px 이내로 맞춘다. Computed delta가 작아도 스크린샷에서 optical mismatch가 보이면 brand block offset을 보정한다.
- Greeting은 30px 전후, section title은 23px 전후, summary number는 34px 전후를 기준으로 한다.
- Medication name은 18px 전후, body copy는 16-17px 전후, meta copy는 15.5-16px 전후를 기준으로 한다.
- AI 상담 카드는 desktop에서 chat preview / bubble layout을 사용한다. 사용자 질문 bubble은 한 줄 유지가 원칙이며, 텍스트를 줄이거나 문구를 바꾸지 않고 width/layout으로 해결한다.
- Font weight는 유지하거나 필요한 경우 낮추며, 800 이상으로 올리지 않는다.
- 1512px MacBook Retina viewport는 Level 2 기준 화면이 아니며, 해당 폭의 압축/ellipsis 문제는 별도 responsive desktop/tablet pass에서 다룬다.

## 카드 규칙

- 모든 Dashboard v2 카드는 `dv2-card` 기반을 사용한다.
- 기본 radius는 16px로 통일한다.
- 기본 border는 `#DFE6F2`를 사용한다.
- Shadow는 blue-gray 계열의 낮은 opacity만 사용한다.
- 카드 내부 padding은 22-24px을 기본값으로 한다.
- 위험 카드는 muted danger background와 border를 쓰되, 화면에서 과하게 튀지 않게 한다.

## Section Title Color 규칙

- 모든 Dashboard v2 section title은 `#334155` 또는 동일한 text primary token으로 통일한다.
- `오늘의 복용 일정`, `주의가 필요한 상호작용`, `가족 현황`, `반려동물 현황`, `최근 복용 기록`, `AI 건강 상담`, `복약 지도 리포트` 제목은 모두 같은 slate 계열이어야 한다.
- Primary color는 CTA, 링크, 버튼, active 상태, AI user bubble, send button처럼 기능적 강조에만 사용한다.
- Danger color는 `1건` count, 경고 icon, danger CTA, danger border/background처럼 위험 의미가 필요한 요소에만 사용한다.
- Success/green은 완료 badge, 리포트 document icon처럼 상태와 아이콘 표현에만 사용한다.
- 이전의 `primary: 오늘의 복용 일정/AI 건강 상담`, `danger: 주의가 필요한 상호작용`, `slate: 나머지` 제목 색상 규칙은 폐기한다.

## Summary Card 규칙

- 구조는 icon / content / CTA 3영역으로 고정한다.
- Card padding: 23-24px.
- Icon circle: 42px 이하, 내부 icon은 19px.
- Icon-content gap: 16px 전후.
- Title-number gap: 7px 전후.
- CTA는 오른쪽 영역에 고정하고 최소 폭을 둔다.
- 4개 카드의 number baseline과 CTA 위치가 같은 컴포넌트처럼 보여야 한다.
- Summary number는 너무 heavy하게 보이지 않도록 720-750 weight를 기준으로 한다.
- Normal number는 pure black이 아니라 softened slate (`#334155` 또는 `#2F3A4A`)를 사용한다.

## 버튼 규칙

- Text CTA는 primary를 사용하되, 과하게 밝은 보라색을 피한다.
- Primary wide button은 `#554EE3` 배경을 사용한다.
- Secondary button은 흰색 배경, 연한 border, softened primary text를 사용한다.
- Danger action은 primary purple이 아니라 muted danger scale을 사용한다.
- Top action button은 wide desktop에서 notification/help/user dropdown 모두 48px 전후 높이로 맞춘다.
- Help/user dropdown text는 17px 전후를 기준으로 하고, 알림 icon은 22px 전후를 사용한다.
- Notification badge는 16px 전후 circle로 유지하고, 세 action button은 같은 radius와 수직 중앙 정렬을 공유해야 한다.

## 뱃지 규칙

- 모든 뱃지는 24-26px 높이의 pill 형태를 유지한다.
- 가족/예정 뱃지: pale indigo background, softened primary text.
- 완료 뱃지: pale mint background, green text.
- 텍스트는 wide desktop에서 13px까지 허용하고, 760 weight 전후로 통일한다.

## 아이콘 규칙

- Dashboard v2는 `src/components/Icon.tsx`의 단일 라인 아이콘 세트를 사용한다.
- Stroke width는 1.8 전후로 유지한다.
- Summary icon은 원형 배경 안에 배치한다.
- Danger icon은 muted coral background와 danger text를 사용한다.
- 리스트 내부 작은 아이콘은 배경과 dot 색상을 낮춰 정보 보조 역할에 머무르게 한다.
- 사람 아바타는 캐릭터형 얼굴보다 head + shoulder 형태의 미니멀 라인형 아이콘을 우선한다.
- 가족 현황의 사람 아바타는 같은 라인 아이콘 구조를 유지하고, 배경색만 부드럽게 구분한다.
- 강아지 아바타는 귀여운 형태를 유지하되 컨테이너 안쪽에 8-12% 정도 여유를 둔다.
- 가족 현황과 반려동물 현황의 dog avatar는 같은 positioning rule을 사용한다. Ear graphic은 `translateY(3px) scale(0.94)` 전후, face graphic은 `scale(0.96)` 전후로 조정해 귀가 원형 위를 뚫고 나오는 느낌을 막는다.

## 이미지와 로고 규칙

- Dashboard v2 sidebar brand logo는 `public/assets/opti-me-icon.png` image asset을 사용한다.
- 기존 CSS abstract mark는 Dashboard v2 sidebar brand logo에서 사용하지 않는다.
- Sidebar brand logo image는 52-60px 범위, 기본 56px 전후를 사용한다.
- 로고는 rounded square app icon처럼 보여야 하며, 검정 모서리/검정 배경이 보이면 안 된다.
- `object-fit: cover`, `aspect-ratio: 1 / 1`, `border-radius: 16-18px`, `overflow: hidden`을 사용하되, 내부 사람/강아지 일러스트가 잘리거나 찌그러지면 안 된다.
- Sidebar brand subtitle `가족 약 관리`는 16px 전후로 낮춰 `Opti-Me` title과 위계가 분리되어야 한다.
- Sidebar promo image는 `object-fit: contain`을 우선하고, 얼굴이나 몸이 잘리지 않도록 padding을 둔다.
- 이미지와 텍스트 사이에는 10-12px 정도 여백을 둔다.

## 레이아웃 규칙

- Base desktop sidebar: 224px.
- Wide desktop sidebar: 304-320px, 기본 312px 전후.
- Base desktop content: 좌측 34px, 우측 132px, 상단 44px padding.
- Wide desktop content: sidebar 확장으로 오른쪽 카드가 좁아지지 않도록 우측 padding을 36-72px 범위로 줄인다.
- Sidebar promo card는 top 정렬이 아니라 최근 복용 기록 카드와 bottom line을 맞춘다.
- Desktop light 1920x1080 기준에서 sidebar promo card bottom과 recent medication card bottom delta는 4px 이하를 목표로 한다.
- Promo card bottom offset은 CSS 변수 `--dv2-promo-bottom-offset`으로 관리하며, wide desktop Readable Scale Level 2에서도 bottom delta 4px 이하를 유지한다.
- Summary: 4-column grid.
- Main: 오늘의 복용 일정 + 오른쪽 상태 패널의 2-column grid.
- Bottom: 최근 기록, AI 상담, 리포트의 3-column grid.
- Tablet/mobile은 완전히 깨지지 않는 선에서 기존 대응 범위를 유지한다.
- 다크모드와 모바일 레이아웃 polish는 별도 pass로 분리한다.

## AI Consult Card 규칙

- Desktop에서는 단순 질문 chip이 아니라 chat preview / iMessage-like bubble layout을 사용한다.
- 구성은 `AI 건강 상담` 제목, 오른쪽 정렬 user bubble, 왼쪽 정렬 assistant bubble, 하단 input bar와 send button 순서다.
- User bubble과 assistant bubble은 모두 명확한 tail이 있는 말풍선 형태여야 한다.
- User bubble은 오른쪽 정렬, primary 계열 배경, white text, 오른쪽 하단 tail을 사용한다. 오른쪽 아래 모서리는 직각처럼 깨지면 안 되고 22px 전후의 둥근 radius가 유지되어야 한다.
- Assistant bubble은 왼쪽 정렬, soft lavender/indigo 배경, slate text, 왼쪽 하단 tail을 사용한다. 단순한 full-width 사각형 박스처럼 보이면 실패로 본다.
- Bubble tail은 card나 parent overflow에 잘리면 안 된다. Tail 구현은 bubble wrapper의 `overflow: visible`을 기준으로 하고, 음수 z-index로 뒤에 숨기는 방식은 피한다.
- User bubble 문구 `감기약 먹으면서 운전해도 될까요?`는 desktop 4K 기준에서 한 줄로 유지한다.
- Assistant bubble은 max-width가 제한된 말풍선이어야 하며, very light indigo background와 softened slate text를 사용해 카드 시스템 안에 머물게 한다.
- AI mark/avatar는 답변 bubble 내부를 답답하게 만들지 않도록 bubble 바깥쪽의 작은 avatar처럼 배치할 수 있다.
- Input bar와 send button은 chat UI의 일부처럼 하단에 정렬되어야 하며, 과한 그림자나 강한 gradient를 쓰지 않는다.
- Send button은 primary 배경의 원형 button과 white line send icon을 사용한다.
- 말풍선 UI 때문에 lower grid 높이가 늘어나면 먼저 bubble padding, gap, line-height를 조정해 promo/recent bottom alignment를 유지한다.

## 재사용 컴포넌트 목록

- `SectionCard`
- `CardHeader`
- `SummaryCard`
- `MedicationScheduleCard`
- `InteractionWarningCard`
- `FamilyStatusCard`
- `PetStatusCard`
- `RecentMedicationCard`
- `AiConsultCard`
- `ReportCard`
- `Badge`
- `IconCircle`
- `MedicationDot`
- `FamilyAvatar`
