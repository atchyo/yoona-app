# Dashboard v2 AI Chat Bubble Repair Pass 12

## Scope

- 기준 화면: Current Dashboard v2 desktop light.
- 원본 이미지 비교는 사용하지 않았다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드, 모바일 레이아웃 수정은 하지 않았다.
- 이번 pass는 중앙 하단 `AI 건강 상담` 카드의 chat bubble UI만 수정했다.
- Section title color unification rule은 유지했다.

## Before Audit

| Item | Before |
| --- | --- |
| AI card size | 463.78px x 278.77px |
| User bubble radius | `18px 18px 6px` |
| User bubble tail | only `::after`, 12px rotated square, `z-index:-1`, bottom `-4px` |
| User bubble overflow | `visible` |
| User bubble issue | bottom-right radius가 tail 때문에 눌려 보이고, tail이 레이어 뒤에 숨은 것처럼 보임 |
| Assistant bubble size | 393.78px x 92.3px |
| Assistant bubble radius | `18px 18px 18px 6px` |
| Assistant bubble tail | only `::after`, 12px rotated square, `z-index:-1` |
| Assistant bubble issue | tail이 약하고, AI mark가 bubble 내부에 있어 rounded box처럼 보임 |
| AI card overflow | `visible` |
| AI card parent overflow | `visible` |
| Input bar height | 42px |
| Send button size | 42px x 42px |

## Changes

### User Bubble

- User bubble radius를 `22px`로 통일해 오른쪽 아래 모서리가 직각처럼 깨져 보이지 않게 했다.
- 기존 `z-index:-1` rotated square tail을 제거했다.
- Tail은 `::before` + `::after` 2-layer 방식으로 다시 구현했다.
- `::before`는 bubble과 같은 `#554EE3` 배경의 rounded tail body다.
- `::after`는 card background로 tail 바깥쪽을 깎아 iMessage식 곡선 꼬리처럼 보이게 한다.
- User bubble은 오른쪽 정렬, `white-space: nowrap`을 유지해 질문 문구가 한 줄로 보이게 했다.

### Assistant Bubble

- AI mark를 assistant bubble 내부에서 바깥 avatar처럼 분리했다.
- Assistant bubble radius를 `22px`로 통일했다.
- Assistant bubble max-width를 `calc(100% - 62px)`로 제한해 full-width box 느낌을 줄였다.
- Assistant tail도 `::before` + `::after` 방식으로 다시 구현했다.
- `::before`는 `#F2F4FF` bubble background와 light indigo border를 가진 왼쪽 하단 tail body다.
- `::after`는 card background로 tail 외곽을 깎아 왼쪽 하단 곡선 꼬리가 보이게 한다.
- 답변 bubble은 왼쪽 정렬을 유지하고, 실제 주고받는 말풍선처럼 보이도록 조정했다.

### Input And Grid Balance

- Input bar는 44px, send button은 42px 원형으로 맞췄다.
- Bubble padding과 vertical gap을 조정해 tail은 살리되 AI card가 과하게 커지지 않게 했다.
- 첫 조정에서 AI card가 298.66px까지 커졌지만, 최종적으로 282.66px로 줄여 하단 grid가 1080px viewport 안에 들어오게 했다.

## After Audit

| Item | After |
| --- | --- |
| AI card size | 463.78px x 282.66px |
| Lower grid bottom | 1079.2px, viewport 안에 유지 |
| User bubble radius | `22px` |
| User bubble tail implementation | `::before` rounded primary tail + `::after` white cutout |
| User bubble tail visibility | visible, no negative z-index |
| User bubble bottom-right radius | 22px radius 유지 |
| User bubble text | `white-space: nowrap`, visually one line |
| Assistant bubble size | 344.78px x 92.3px |
| Assistant bubble radius | `22px` |
| Assistant bubble max-width | `calc(100% - 62px)` |
| Assistant tail implementation | `::before` soft lavender tail + `::after` white cutout |
| Assistant tail visibility | visible left-bottom tail |
| AI mark placement | bubble outside avatar-like mark |
| AI card overflow | `visible` |
| AI card parent overflow | `visible` |
| Input bar height | 44px |
| Send button size | 42px x 42px |
| Lower card heights | recent 282.66px / AI 282.66px / report 282.66px |

## UI Guide Updates

- AI Consult Card rule을 `chat preview / iMessage-like bubble layout`으로 업데이트했다.
- User bubble은 오른쪽 정렬, primary background, white text, 오른쪽 하단 tail을 가진다고 명시했다.
- Assistant bubble은 왼쪽 정렬, soft lavender background, slate text, 왼쪽 하단 tail을 가진다고 명시했다.
- Tail이 parent/card overflow에 잘리거나 음수 z-index로 숨는 방식은 피한다고 명시했다.
- 답변 bubble은 full-width box가 아니라 max-width가 제한된 말풍선이어야 한다고 보강했다.
- Section title color unification rule, dark mode/mobile 별도 pass 기준은 유지했다.

## Screenshot Verification

| File | Viewport / DPR | Saved size |
| --- | --- | --- |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 CSS / DPR 2 | 3840x2160 |
| `screenshots/dashboard-v2-ai-chat-closeup.png` | AI card closeup / DPR 2 | 974x590 |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 CSS / DPR 1 | 1920x1080 |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 CSS / DPR 2 smoke check | 3024x1964 |

AI chat closeup에서 user bubble의 오른쪽 아래 radius와 tail이 깨지지 않고 붙어 있는 것을 확인했다. Assistant bubble도 왼쪽 하단 tail이 보이며, 이전보다 확실한 말풍선으로 읽힌다. Desktop 4K screenshot에서 하단 grid top line과 card height 균형도 유지된다.

## Remaining Visual Notes

- Assistant bubble tail은 현재 iMessage식 cutout 형태라 card background가 바뀌는 dark mode에서는 별도 pass에서 다시 검증해야 한다.
- 1512px MacBook Retina 폭은 smoke check만 했고, responsive desktop/tablet 조정은 이번 범위 밖이다.
