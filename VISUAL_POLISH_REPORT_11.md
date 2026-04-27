# Dashboard v2 Color Unification + AI Chat Bubble Repair + Header Polish Pass 11

## Scope

- 기준 화면: Current Dashboard v2 desktop light.
- 원본 이미지 비교는 사용하지 않았다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드, 모바일 레이아웃 수정은 하지 않았다.
- 이번 pass는 section title color unification, AI chat bubble repair, sidebar subtitle hierarchy, top header action scale, dog avatar positioning만 다뤘다.

## Before Audit

| Item | Before |
| --- | --- |
| Section title colors | 일정 `rgb(79,70,229)`, 주의 `rgb(169,68,63)`, AI `rgb(79,70,229)`, 나머지 `rgb(51,65,85)` |
| 오늘의 복용 일정 title | `rgb(79, 70, 229)` |
| 주의가 필요한 상호작용 title | `rgb(169, 68, 63)` |
| 가족 현황 title | `rgb(51, 65, 85)` |
| 반려동물 현황 title | `rgb(51, 65, 85)` |
| 최근 복용 기록 title | `rgb(51, 65, 85)` |
| AI 건강 상담 title | `rgb(79, 70, 229)` |
| 복약 지도 리포트 title | `rgb(51, 65, 85)` |
| AI user bubble tail | `::after`, background `rgb(95,91,232)`, no z-index, tail layer looked broken |
| AI assistant answer | Rounded rectangle, no `::after` tail |
| AI card height | 278.77px |
| Sidebar subtitle | 19px / 610 / `rgb(71,85,105)` |
| Top notification button | 46px x 46px, icon 21px |
| Help button | 16px / 46px height |
| User dropdown | text 16px / 46px height / avatar 36px |
| Dog avatar position | ears top 554.19px family, 699.22px pet; face transform none |

## Changes

### Section Title Color Unification

- 모든 section title을 `#334155` / `rgb(51, 65, 85)` slate 계열로 통일했다.
- 이전의 의미별 title color 규칙은 폐기했다.
- Primary color는 CTA, active state, AI user bubble, send button에만 남겼다.
- Danger color는 warning count `1건`, warning icon, danger action, warning background/border에만 남겼다.
- Success/green은 완료 badge와 리포트 document icon 같은 상태/아이콘 표현에만 남겼다.

### AI Chat Bubble Repair

- User bubble background를 solid primary `#554EE3`로 정리해 tail과 bubble 색상이 정확히 맞게 했다.
- User bubble tail은 `::after` pseudo-element, `position:absolute`, `z-index:-1`, `isolation:isolate`, `12px` rotated square 방식으로 안정화했다.
- Assistant answer를 full-width rounded box 느낌에서 벗어나도록 `max-width: calc(100% - 24px)`로 줄이고, left-aligned bubble tail을 추가했다.
- Assistant bubble은 soft lavender `#F2F4FF`, slate text, light indigo border를 사용한다.
- Input bar는 `1fr + 42px send button` grid로 정리하고, send button과 icon을 42px / 18px로 키웠다.

### Sidebar Brand Subtitle

- `가족 약 관리` subtitle을 19px에서 16px로 줄였다.
- Opti-Me title은 30px을 유지하고, subtitle은 `#475569` / 610 weight로 보조 위계가 되게 했다.

### Top Header Actions

- Notification button: 46px -> 48px, icon 21px -> 22px.
- Help button: 16px / 46px -> 17px / 48px.
- User dropdown: 46px -> 48px, user text 16px -> 17px, avatar 36px -> 38px.
- 세 action button의 radius와 vertical alignment를 48px 시스템에 맞췄다.

### Dog Avatar Positioning

- 가족 현황과 반려동물 현황 dog avatar에 동일한 positioning rule을 적용했다.
- Ear transform: `translateY(3px) scale(0.94)` + 방향별 rotate/flip.
- Face transform: `scale(0.96)`, `bottom: 6px`.
- 귀가 원형 위쪽을 뚫고 나오는 느낌을 줄이고, 얼굴을 원 안에서 안정적으로 보이게 했다.

## After Audit

| Item | After |
| --- | --- |
| Final section title color | all `rgb(51, 65, 85)` / `#334155` |
| 오늘의 복용 일정 title | `rgb(51, 65, 85)` |
| 주의가 필요한 상호작용 title | `rgb(51, 65, 85)` |
| 가족 현황 title | `rgb(51, 65, 85)` |
| 반려동물 현황 title | `rgb(51, 65, 85)` |
| 최근 복용 기록 title | `rgb(51, 65, 85)` |
| AI 건강 상담 title | `rgb(51, 65, 85)` |
| 복약 지도 리포트 title | `rgb(51, 65, 85)` |
| AI user bubble tail | `::after`, same bg `rgb(85,78,227)`, `z-index:-1`, rotated 12px square |
| AI user question line count | 1 line |
| AI assistant bubble tail | `::after`, same bg `rgb(242,244,255)`, light border, `z-index:-1` |
| AI assistant answer | Actual left-aligned bubble, 393.78px width, 3 lines |
| AI card height | 278.77px |
| Lower grid card heights | recent 278.77px / AI 278.77px / report 278.77px |
| Sidebar subtitle | 16px / 610 / `rgb(71,85,105)` |
| Top notification button | 48px x 48px, icon 22px |
| Help button | 17px / 48px height |
| User dropdown | text 17px / 48px height / avatar 38px |
| Dog avatar transform | ears `matrix(..., 0, 3)` from `translateY(3px) scale(0.94)`, face `matrix(0.96, 0, 0, 0.96, 0, 0)` |
| Dog clipping | no visible clipping in family or pet avatar closeup |
| Promo/recent bottom delta | 0.31px |

## UI Guide Updates

- Section title color unification rule을 추가하고, 이전 primary/danger/slate title mapping을 폐기했다.
- Primary/danger/success 색상은 title이 아니라 CTA, icon, badge, count, 상태 표현에만 사용하도록 정리했다.
- AI Consult Card rule을 user/assistant 양쪽 모두 tail이 있는 bubble layout으로 보강했다.
- Sidebar brand subtitle rule을 16px 전후로 업데이트했다.
- Top action scale rule을 48px 기준으로 업데이트했다.
- Dog avatar positioning rule을 가족 현황과 반려동물 현황에 동일하게 적용하도록 추가했다.
- 다크모드와 모바일 polish는 별도 pass 기준을 유지했다.

## Screenshot Verification

| File | Viewport / DPR | Saved size |
| --- | --- | --- |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 CSS / DPR 2 | 3840x2160 |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 CSS / DPR 1 | 1920x1080 |
| `screenshots/dashboard-v2-ai-chat-closeup.png` | AI card closeup / DPR 2 | 930x560 |
| `screenshots/dashboard-v2-dog-avatar-closeup.png` | Dog avatar closeup / DPR 2 | 1038x486 |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 CSS / DPR 2 smoke check | 3024x1964 |

AI chat closeup에서 user bubble tail과 assistant bubble tail 모두 깨지지 않는 것을 확인했다. Dog avatar closeup에서 가족 현황과 반려동물 현황의 귀/얼굴 위치가 원형 컨테이너 안에서 안정적으로 보이는 것을 확인했다.

## Remaining Visual Notes

- 1512px MacBook Retina 폭의 압축/ellipsis 문제는 이번 pass 범위가 아니며 별도 responsive desktop/tablet pass에서 다룬다.
- 다크모드는 이번 pass에서 조정하지 않았다.
- 모바일 레이아웃 polish도 이번 pass에서 조정하지 않았다.
