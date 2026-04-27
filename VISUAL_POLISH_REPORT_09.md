# Dashboard v2 Typography & Sidebar Scale Pass 09

작성일: 2026-04-27

## 작업 범위

- 이번 pass는 `Readable Scale Level 2 + Sidebar Priority Pass`로 진행했다.
- 기준 화면은 desktop light, CSS viewport `1920x1080`, DPR `2`, saved screenshot `3840x2160`이다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드 수정, 모바일 레이아웃 수정은 하지 않았다.
- 전체 body font-size 확대, zoom, transform scale은 사용하지 않았다.
- Font weight는 더 굵게 만들지 않았고, 주요 텍스트의 weight는 유지하거나 낮췄다.

## Before / After Audit

| Metric | Before | After |
| --- | ---: | ---: |
| Sidebar width | 272px | 296px |
| Opti-Me title | 22px / 740 | 26px / 735 |
| Opti-Me subtitle | 16px / 620 | 17px / 610 |
| Opti-Me title top | 43.34px | 43px |
| Greeting title top delta | 0.66px | 1px |
| Sidebar menu label | 17px / 670 / 23.8px | 19px / 660 / 26.6px |
| Sidebar active menu label | 17px | 19px |
| Sidebar menu row height | 48px | 54px |
| Page greeting | 28px / 740 | 30px / 735 |
| Summary title | 16px | 17px |
| Summary number | 32px / 745 | 34px / 735 |
| Section title | 21px / 700 | 23px / 690 |
| Medication name | 17px / 670 | 18px / 660 |
| Body copy | 16px | 16.5px |
| Meta copy | 15px | 16px |
| Promo title/body | 17px / 15px | 18px / 16px |
| Recent row date/name/dose | 15px / 16px / 15px | 16px / 17px / 16px |
| Report title/date | 16px / 15px | 17px / 16px |
| Badge text | 12.5px | 13px |

## AI Question Chip

| Metric | Before | After |
| --- | ---: | ---: |
| Text | 감기약 먹으면서 운전해도 될까요? | 감기약 먹으면서 운전해도 될까요? |
| Width | 230px | 228.59px |
| Font size | 15px | 15px |
| white-space | normal | nowrap |
| Line count | 2 | 1 |

AI 질문 chip은 font-size나 문구를 줄이지 않고 `white-space: nowrap`, `min-width: max-content`, `max-width: none`, flex 고정 폭 처리를 적용해 desktop 4K 기준에서 한 줄로 유지했다.

## Layout Scale

| Metric | Before | After |
| --- | ---: | ---: |
| Summary card height | 105.55px | 108.7px |
| Schedule row height | 58.39px | 60.78px |
| Lower grid height | 272.75px | 278.77px |
| Promo/recent bottom delta | 1.98px | 0.11px |

Sidebar와 오른쪽 콘텐츠를 키우면서 content right padding을 `44px`까지 낮추고 main/lower grid gap을 `24px`로 정리했다. Promo card bottom offset도 `-21px`로 조정해 최근 복용 기록 카드와 하단 라인을 다시 맞췄다.

## Weight Policy

- Font weight를 더 굵게 만들지 않았다.
- Sidebar nav는 `670 -> 660`으로 낮췄다.
- Opti-Me title은 `740 -> 735`로 낮췄다.
- Greeting은 `740 -> 735`로 낮췄다.
- Summary number는 `745 -> 735`로 낮췄다.
- Section title은 `700 -> 690`으로 낮췄다.
- Medication name은 `670 -> 660`으로 낮췄다.
- 800 이상 font-weight는 추가하지 않았다.

## Screenshot Verification

| Screenshot | CSS viewport | DPR | Saved size | Notes |
| --- | ---: | ---: | ---: | --- |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 | 2 | 3840x2160 | Primary verification |
| `screenshots/dashboard-v2-desktop.png` | 1920x1080 | 2 | 3840x2160 | 4K copy |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 | 1 | 1920x1080 | Standard desktop check |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 | 2 | 3024x1964 | Smoke check only |

MacBook Retina는 1512px CSS viewport라 wide desktop Level 2가 적용되지 않는다. 해당 폭의 압축/ellipsis 문제는 별도 responsive pass에서 다룬다.

## UI Guide Updates

- `docs/UI_GUIDE.md`에서 기준을 `Readable Scale Level 2 + Sidebar Priority Pass`로 업데이트했다.
- Wide desktop sidebar 기준을 `288-304px`, 기본 `296px` 전후로 수정했다.
- Opti-Me title 기준을 `26px` 전후로 수정했다.
- Opti-Me subtitle 기준을 `17px` 전후로 수정했다.
- Sidebar menu label 기준을 `19px` 전후로 수정했다.
- Page greeting 기준을 `30px` 전후로 수정했다.
- Summary number 기준을 `34px` 전후로 수정했다.
- Section title 기준을 `23px` 전후로 수정했다.
- Medication name 기준을 `18px` 전후로 수정했다.
- Body copy 기준을 `16-17px`, meta copy 기준을 `15.5-16px` 전후로 수정했다.
- AI question chip은 desktop에서 한 줄 유지한다는 규칙을 추가했다.
- Font weight를 더 무겁게 하지 않고 size와 spacing으로 readability를 확보한다는 기준을 유지했다.

## 남은 시각적 아쉬움

- 4K 기준에서는 sidebar와 전체 typography가 전보다 확실히 커졌고, AI 질문 chip도 한 줄로 보인다.
- Overflow audit에 heading/summary number의 line-height rounding이 잡히지만 실제 screenshot에서 clipping은 보이지 않는다.
- MacBook Retina 1512px 폭은 아직 Level 2 기준 화면이 아니므로 별도 responsive desktop/tablet pass에서 다루는 것이 좋다.
