# Dashboard v2 Readable Scale Pass 07

작성일: 2026-04-27

## 작업 범위

- 이번 pass는 `Micro Bump`가 아니라 `Readable Scale Pass`로 진행했다.
- 기준 화면은 desktop light, CSS viewport `1920x1080`, DPR `2`, saved screenshot `3840x2160`이다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드 수정, 모바일 레이아웃 수정은 하지 않았다.
- 전체 body font-size 확대, zoom, transform scale은 사용하지 않았다.
- Font weight는 더 굵게 만들지 않았고, 일부 큰 텍스트는 오히려 낮춰 더 샤프하게 정리했다.

## Layout Scale

| Metric | Before | After |
| --- | ---: | ---: |
| Sidebar width | 224px | 252px |
| Content padding | 44px 132px 34px 34px | 44px 96px 34px 32px |
| Sidebar menu row height | 40px | 44px |
| Summary card height | 100.05px | 102.39px |
| Schedule row height | 55.39px | 56.58px |
| Recent card height | 261.97px | 265px |
| Promo/recent bottom delta | 0.16px | 0.25px |

Sidebar를 넓히면서 오른쪽 content의 우측 padding을 줄여 카드 폭이 좁아지지 않게 보정했다. Promo/recent bottom alignment는 4px 이하 기준을 유지했다.

## Before Computed Style Audit

| Element | Font size | Weight | Line-height |
| --- | ---: | ---: | ---: |
| Sidebar menu label | 15.5px | 690 | 21.39px |
| Sidebar active menu label | 15.5px | 690 | 21.39px |
| Logo title `Opti-Me` | 19.5px | 840 | 20.475px |
| Logo subtitle | 14.5px | 650 | 18.125px |
| Promo title | 15.5px | 700 | 20.15px |
| Promo body | 14px | 560 | 20.02px |
| Greeting | 25px | 760 | 27px |
| Greeting subtitle | 14px | 560 | 17.5px |
| Summary title | 14.5px | 700 | 15.95px |
| Summary number | 28px | 770 | 29.12px |
| Section title | 19px | 720 | 22.8px |
| Medication name | 15.5px | 690 | 18.6px |
| Schedule meta | 14px | 580 | 16.8px |
| Warning title/body | 15.5px / 15px | 700 / 620 | 18.6px / 21.75px |
| Family label | 13.5px | 680 | 16.2px |
| Pet name/meta | 15.5px / 14px | 720 / 520 | 17.825px / 16.8px |
| Recent date/name/dose | 14px / 14.5px / 14px | 620 / 700 / 620 | normal |
| AI body | 15px | 590 | 23.25px |
| Report title/date | 14.5px / 14px | 700 / 580 | 17.4px / normal |

## After Computed Style Audit

| Element | Font size | Weight | Line-height |
| --- | ---: | ---: | ---: |
| Sidebar menu label | 16px | 690 | 22.4px |
| Sidebar active menu label | 16px | 690 | 22.4px |
| Logo title `Opti-Me` | 20.5px | 760 | 21.115px |
| Logo subtitle | 15px | 640 | 18.3px |
| Promo title | 16px | 700 | 20.8px |
| Promo body | 14.5px | 560 | 20.735px |
| Greeting | 26px | 750 | 27.56px |
| Greeting subtitle | 15px | 560 | 18.6px |
| Summary title | 15px | 700 | 16.5px |
| Summary number | 30px | 750 | 30.9px |
| Section title | 20px | 710 | 24px |
| Medication name | 16px | 690 | 19.2px |
| Schedule meta | 14.5px | 580 | 17.4px |
| Warning title/body | 16px / 15px | 700 / 620 | 19.2px / 21.75px |
| Family label | 14px | 680 | 16.8px |
| Pet name/meta | 16px / 14px | 720 / 520 | 18.4px / 16.8px |
| Recent date/name/dose | 14px / 15px / 14px | 620 / 700 / 620 | normal |
| AI body | 15px | 590 | 23.25px |
| Report title/date | 15px / 14px | 700 / 580 | 18px / normal |

## Typography Changes

- Sidebar menu label: `15.5px -> 16px`.
- Sidebar width: `224px -> 252px`.
- Logo title: `19.5px -> 20.5px`, weight `840 -> 760`.
- Logo subtitle: `14.5px -> 15px`.
- Promo title/body: `15.5px -> 16px`, `14px -> 14.5px`.
- Greeting/subtitle: `25px -> 26px`, `14px -> 15px`.
- Summary title/number: `14.5px -> 15px`, `28px -> 30px`.
- Section title: `19px -> 20px`.
- Medication name/meta: `15.5px -> 16px`, `14px -> 14.5px`.
- Recent medication name: `14.5px -> 15px`.
- AI question text: `12px -> 14px`.
- Report title: `14.5px -> 15px`.
- Badge text: `11px -> 12px`.
- Primary wide button: `13px -> 14px`.

## Weight Policy

- Font weight를 더 굵게 만들지 않았다.
- Logo title은 `840 -> 760`으로 낮췄다.
- Greeting은 `760 -> 750`으로 낮췄다.
- Summary number는 `770 -> 750`으로 낮췄다.
- Section title은 `720 -> 710`으로 낮췄다.
- Sidebar nav는 `690`을 유지했다.

## Screenshot Verification

| Screenshot | CSS viewport | DPR | Saved size | Notes |
| --- | ---: | ---: | ---: | --- |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 | 2 | 3840x2160 | Primary visual target |
| `screenshots/dashboard-v2-desktop.png` | 1920x1080 | 2 | 3840x2160 | 4K copy |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 | 1 | 1920x1080 | Standard desktop check |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 | 2 | 3024x1964 | Smoke check only |

MacBook Retina smoke check는 기존 responsive backlog로 남겼다. 1512px viewport에는 wide desktop Readable Scale이 적용되지 않는다.

## UI Guide Updates

- `docs/UI_GUIDE.md`에서 Micro Bump 중심 설명을 Readable Scale Pass 기준으로 바꿨다.
- Wide desktop sidebar width 기준을 252px 전후로 업데이트했다.
- Sidebar menu label 기준을 16px 전후로 업데이트했다.
- Logo title 기준을 20px 전후로 업데이트했다.
- Page greeting 기준을 26px 전후로 업데이트했다.
- Summary number 기준을 30px 이하로 업데이트했다.
- Section title 기준을 20px 이하로 업데이트했다.
- Medication name은 16px 전후, body copy는 15px 전후, meta copy는 14px 전후로 업데이트했다.
- Font weight를 더 무겁게 하지 않고 크기와 공간으로 readability를 올린다는 기준을 명시했다.
- Dark mode와 mobile polish는 별도 pass라는 기준을 유지했다.

## 남은 시각적 아쉬움

- 4K 기준에서는 전체적으로 읽기 편해졌지만, summary card 내부 line-height rounding이 overflow audit에 잡힌다. 실제 screenshot에서는 clipping이나 줄바꿈은 보이지 않는다.
- MacBook Retina 1512px 폭은 여전히 별도 responsive pass에서 다루는 것이 좋다.
