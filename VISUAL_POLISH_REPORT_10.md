# Dashboard v2 Brand Icon, Sidebar, Header, Section Color, AI Chat Polish Pass 10

## Scope

- 기준 화면: Current Dashboard v2 desktop light.
- 원본 이미지 비교는 사용하지 않았다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드, 모바일 레이아웃 수정은 하지 않았다.
- 이번 pass는 brand icon asset 적용, sidebar/header scale, section title color rule, AI chat preview polish만 다뤘다.

## Before Audit

| Item | Before |
| --- | --- |
| Sidebar width | 296px |
| Current logo mark type | CSS/SVG abstract mark |
| Logo rendered size | 44px x 44px |
| Logo clipping | false |
| Opti-Me title | 26px / 735 / top 43px |
| Opti-Me subtitle | 17px / 610 |
| Greeting title | 30px / top 44px |
| Brand/greeting top delta | 1px |
| Sidebar menu label | 19px / 660 / line-height 26.6px |
| Sidebar menu row height | 54px |
| Notification button | 40px x 40px CSS target |
| Help button | 13px / 40px height |
| User dropdown | 15px user text / 40px height |
| User icon | 30px circle |
| AI card height | 278.77px |
| AI question | chip layout, 1 line, 228.59px wide |

## Changes

### Brand Icon

- 새 로고 asset을 `public/assets/opti-me-icon.png`에 저장했다.
- 원본 첨부 파일은 `/Users/jeongungkim/Downloads/Opti-Me Layout/Opti-Me_icon.png`였고, 검정 corner/background를 화면에 보이지 않게 alpha 처리한 PNG asset으로 적용했다.
- Dashboard v2 desktop sidebar의 기존 CSS abstract logo를 `<img className="brand-icon brand-icon-image">`로 교체했다.
- Mobile header의 기존 mark는 이번 pass 범위 밖이라 유지했다.
- Logo CSS는 `object-fit: cover`, `aspect-ratio: 1 / 1`, `border-radius: 18px`, `overflow: hidden` 기준으로 정리했다.

### Sidebar And Brand Scale

- Sidebar width: 296px -> 312px.
- Opti-Me title: 26px -> 30px.
- Opti-Me subtitle: 17px -> 19px.
- Sidebar menu label: 19px -> 21px.
- Sidebar menu row height: 54px -> 59.22px rendered.
- Menu icon wrapper/icon도 30px/20px로 맞춰 label scale과 균형을 맞췄다.
- Font weight는 더 굵게 올리지 않았다.

### Header Actions

- Notification button: 40px -> 46px.
- Notification icon: 18px -> 21px.
- Notification badge: 18px -> 16px로 다듬고 text 10.5px 유지.
- Help button: 13px / 40px -> 16px / 46px.
- User dropdown: 40px -> 46px, user text 15px -> 16px, user icon 30px -> 36px.

### Section Title Color Rule

- Primary: 오늘의 복용 일정, AI 건강 상담.
- Danger: 주의가 필요한 상호작용.
- Slate: 가족 현황, 반려동물 현황, 최근 복용 기록, 복약 지도 리포트.
- 복약 지도 리포트 제목은 primary가 아니라 slate로 유지했다.

### AI Health Consult Card

- 기존 질문 chip + 안내 box 구조를 제거했다.
- 새 구조는 `AI 건강 상담` 제목, 오른쪽 user bubble, 왼쪽 assistant bubble, 하단 input bar/send button이다.
- User bubble text `감기약 먹으면서 운전해도 될까요?`는 4K desktop에서 한 줄 유지한다.
- 첫 시도에서 AI card height가 340.16px까지 커져 lower grid가 밀렸기 때문에, optional time text를 제거하고 bubble padding/gap/line-height를 압축했다.
- 최종 AI card height는 278.77px로 회복했고 lower grid card heights도 모두 278.77px로 정렬됐다.

## After Audit

| Item | After |
| --- | --- |
| Logo asset path | `/assets/opti-me-icon.png` |
| Logo natural size | 1254px x 1254px |
| Logo rendered size | 56px x 56px |
| Logo clipping | false |
| Black corner/background | false, closeup corner black pixels 0/0/0/0 |
| Sidebar width | 312px |
| Opti-Me title | 30px / 735 / top 43.72px |
| Opti-Me subtitle | 19px / 610 |
| Greeting title | 30px / top 44px |
| Brand/greeting top delta | 0.28px |
| Sidebar menu label | 21px / 660 / line-height 28.98px |
| Sidebar menu row height | 59.22px |
| Notification button | 46px x 46px |
| Help button | 16px / 46px |
| User dropdown | 16px user text / 46px height |
| User icon | 36px circle |
| AI question bubble | 16.5px, nowrap, 1 line, 254.47px wide |
| AI answer bubble | 16.5px, 3 lines |
| AI card height | 278.77px |
| Lower grid card heights | recent 278.77px / AI 278.77px / report 278.77px |
| Promo/recent bottom delta | 0.11px |

## Screenshot Verification

| File | Viewport / DPR | Saved size |
| --- | --- | --- |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 CSS / DPR 2 | 3840x2160 |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 CSS / DPR 1 | 1920x1080 |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 CSS / DPR 2 | 3024x1964 |
| `screenshots/dashboard-v2-logo-closeup.png` | brand block locator / DPR 2 | 510x112 |

4K/high-DPI 기준에서 로고는 검정 모서리 없이 app icon처럼 보인다. Standard desktop도 같은 레이아웃으로 안정적이다. MacBook Retina는 smoke check만 했고, 1512px 폭에서는 일부 콘텐츠 압축이 남아 있지만 이번 pass 범위가 아니므로 responsive desktop/tablet pass backlog로 남긴다.

## UI Guide Updates

- Dashboard v2 sidebar brand logo asset rule을 추가했다.
- 기존 CSS abstract mark를 Dashboard v2 sidebar brand logo에서 사용하지 않는 기준을 추가했다.
- Sidebar brand optical alignment rule을 보강했다.
- Sidebar scale 기준을 312px / 30px title / 19px subtitle / 21px nav label로 업데이트했다.
- Top action scale rule을 추가했다.
- Section title color rule을 추가했다.
- AI Consult Card를 chat preview / bubble layout 기준으로 업데이트했다.
- Dark mode와 mobile polish는 별도 pass 기준을 유지했다.

## Remaining Visual Notes

- 1512px MacBook Retina 폭에서는 summary title wrapping과 하단 카드 압축이 남아 있다. 이번 작업에서는 고치지 않았고 별도 responsive pass에서 다룬다.
- Mobile header는 이번 pass 범위 밖이므로 기존 brand mark를 유지했다.
- AI assistant 답변은 4K desktop에서 3줄로 안정적이지만, 좁은 desktop에서는 더 압축될 수 있다.
