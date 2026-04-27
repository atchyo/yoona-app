# Dashboard v2 Real Readable Scale Pass 08

작성일: 2026-04-27

## 작업 범위

- 이번 pass는 `Micro Bump`가 아니라 `Real Readable Scale Pass`로 진행했다.
- 기준 화면은 desktop light, CSS viewport `1920x1080`, DPR `2`, saved screenshot `3840x2160`이다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드 수정은 하지 않았다.
- 모바일 레이아웃은 수정하지 않았고, 기존 mobile route title의 과한 `900` weight만 `760`으로 낮춰 weight ceiling을 맞췄다.
- 전체 body font-size 확대, zoom, transform scale은 사용하지 않았다.
- Font weight는 더 굵게 만들지 않았고, 주요 큰 텍스트는 오히려 낮춰 더 샤프하게 유지했다.

## Before / After Audit

| Metric | Before | After |
| --- | ---: | ---: |
| Sidebar width | 252px | 272px |
| Sidebar rect width | 252px | 272px |
| Content shell width | 1668px | 1648px |
| Sidebar menu label | 16px / 690 / 22.4px | 17px / 670 / 23.8px |
| Sidebar active menu label | 16px / 690 / 22.4px | 17px / 670 / 23.8px |
| Opti-Me title | 20.5px / 760 / 21.115px | 22px / 740 / 22.44px |
| Opti-Me subtitle | 15px / 640 / 18.3px | 16px / 620 / 18.88px |
| Promo title | 16px / 700 / 20.8px | 17px / 690 / 22.1px |
| Promo body | 14.5px / 560 / 20.735px | 15px / 560 / 21.45px |
| Greeting title | 26px / 750 / 27.56px | 28px / 740 / 29.4px |
| Greeting subtitle | 15px / 560 / 18.6px | 16px / 560 / 19.84px |
| Summary title | 15px / 700 / 16.5px | 16px / 700 / 17.6px |
| Summary number | 30px / 750 / 30.9px | 32px / 745 / 32.96px |
| Section title | 20px / 710 / 24px | 21px / 700 / 25.2px |
| Medication name | 16px / 690 / 19.2px | 17px / 670 / 20.4px |
| Schedule meta | 14.5px / 580 / 17.4px | 15px / 580 / 18px |
| Warning title/body | 16px / 15px | 17px / 16px |
| Family label | 14px / 680 / 16.8px | 15px / 680 / 18px |
| Pet name/meta | 16px / 14px | 17px / 15px |
| Recent date/name/dose | 14px / 15px / 14px | 15px / 16px / 15px |
| AI body | 15px / 590 / 23.25px | 16px / 590 / 24.8px |
| Report title/date | 15px / 14px | 16px / 15px |

## Top Alignment

| Metric | Before | After |
| --- | ---: | ---: |
| brandTitleTop | 31.3px | 43.34px |
| greetingTitleTop | 44px | 44px |
| topDelta | 12.7px | 0.66px |

Opti-Me 텍스트 그룹 전체를 wide desktop에서 아래로 내려 `Opti-Me` title top과 greeting title top이 0-3px 이내로 맞도록 정리했다.

## Layout Scale

| Metric | Before | After |
| --- | ---: | ---: |
| Summary card height | 102.39px | 105.55px |
| Schedule row height | 56.58px | 58.39px |
| Recent card height | 265px | 272.75px |
| Lower grid height | 265px | 272.75px |
| Promo bottom | 1064px | 1064px |
| Recent card bottom | 1064.25px | 1062.02px |
| Promo/recent bottom delta | 0.25px | 1.98px |

폰트를 실제로 키우면서 오른쪽 lower card가 내려가는 문제가 생겨, font-size를 되돌리지 않고 wide desktop의 vertical gap과 오른쪽 상태 패널 padding을 조정했다. 최종 bottom delta는 4px 이하 기준을 유지한다.

## Typography Changes

- Sidebar width: `252px -> 272px`.
- Sidebar menu label: `16px -> 17px`, weight `690 -> 670`.
- Opti-Me title: `20.5px -> 22px`, weight `760 -> 740`.
- Opti-Me subtitle: `15px -> 16px`, weight `640 -> 620`.
- Greeting/subtitle: `26px -> 28px`, `15px -> 16px`.
- Summary title/number: `15px -> 16px`, `30px -> 32px`.
- Section title: `20px -> 21px`.
- Medication name/meta: `16px -> 17px`, `14.5px -> 15px`.
- Warning title/body: `16px / 15px -> 17px / 16px`.
- Family label: `14px -> 15px`.
- Pet name/meta: `16px / 14px -> 17px / 15px`.
- Recent row date/name/dose: `14px / 15px / 14px -> 15px / 16px / 15px`.
- AI body/input: `15px / 14px -> 16px / 15px`.
- Report title/date: `15px / 14px -> 16px / 15px`.
- Badge text: `12px -> 12.5px`.

## Weight Policy

- Font weight를 더 굵게 만들지 않았다.
- Sidebar nav는 `690 -> 670`으로 낮췄다.
- Logo title은 `760 -> 740`으로 낮췄다.
- Greeting은 `750 -> 740`으로 낮췄다.
- Summary number는 `750 -> 745`로 낮췄다.
- Section title은 `710 -> 700`으로 낮췄다.
- Medication name은 `690 -> 670`으로 낮췄다.
- 기존 mobile route title의 `900` weight는 layout 변경 없이 `760`으로 낮췄다.

## Screenshot Verification

| Screenshot | CSS viewport | DPR | Saved size | Notes |
| --- | ---: | ---: | ---: | --- |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 | 2 | 3840x2160 | Primary verification |
| `screenshots/dashboard-v2-desktop.png` | 1920x1080 | 2 | 3840x2160 | 4K copy |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 | 1 | 1920x1080 | Standard desktop check |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 | 2 | 3024x1964 | Smoke check only |

MacBook Retina는 1512px CSS viewport라 wide desktop Real Readable Scale이 적용되지 않는다. 해당 폭의 압축/ellipsis 문제는 별도 responsive pass에서 다룬다.

## UI Guide Updates

- `docs/UI_GUIDE.md`에서 Readable Scale 기준을 `Real Readable Scale Pass`로 업데이트했다.
- Wide desktop sidebar width 기준을 `264-280px`, 기본 `272px` 전후로 수정했다.
- Sidebar menu label 기준을 `17px` 전후로 수정했다.
- Opti-Me title 기준을 `22px` 전후로 수정했다.
- Opti-Me subtitle 기준을 `15.5-16px`으로 수정했다.
- Brand title top과 greeting title top을 `0-3px` 이내로 맞춘다는 규칙을 추가했다.
- Page greeting 기준을 `28px` 전후로 수정했다.
- Summary number 기준을 `32px` 전후로 수정했다.
- Section title 기준을 `21px` 전후로 수정했다.
- Medication name 기준을 `17px` 전후로 수정했다.
- Body copy 기준을 `15.5-16px`, meta copy 기준을 `15px` 전후로 수정했다.
- Font weight를 더 무겁게 하지 않고 size와 공간으로 readability를 확보한다는 기준을 유지했다.

## 남은 시각적 아쉬움

- 4K 기준에서는 전보다 확실히 읽기 편해졌고 grid는 무너지지 않았다.
- Overflow audit에 summary number와 heading의 line-height rounding이 잡히지만, 실제 screenshot에서 clipping이나 새 줄바꿈은 보이지 않는다.
- MacBook Retina 1512px 폭은 여전히 별도 responsive desktop/tablet pass에서 다루는 것이 좋다.
