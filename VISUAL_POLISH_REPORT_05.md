# Dashboard v2 Visual Polish Pass 05

작성일: 2026-04-27

## 작업 범위

- 작업명: `Typography Micro Bump Level B for Wide Desktop`
- 이번 pass는 4K / wide desktop 기준의 typography micro bump만 진행했다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드 수정, 모바일 레이아웃 수정은 하지 않았다.
- 전체 body font-size 일괄 확대, zoom, transform scale은 사용하지 않았다.
- Font weight는 기존 Level A 기준을 유지했고 더 굵게 만들지 않았다.

## 적용 방식

- `src/dashboard-v2.css`에 `@media (min-width: 1800px)` 조건을 추가했다.
- Level B는 wide desktop 전용이므로 1920px CSS viewport에서는 적용되고, 1512px MacBook Retina smoke viewport에서는 적용되지 않는다.
- 4K screenshot 기준에서 글자가 커졌다기보다 읽기 편해지는 정도로만 조정했다.

## Typography Changes

Level A 대비 Level B에서 적용한 주요 변경은 아래와 같다.

- Sidebar menu text: `14.5px -> 15px`
- Sidebar promo body: `13px -> 13.5px`
- Greeting: `24px -> 25px`
- Summary title: `13.5px -> 14px`
- Summary number: `27px -> 28px`
- Small CTA text: `13px -> 13.5px`
- Section title: `18px -> 18.5px`
- Card date/meta near title: `13.5px -> 14px`
- Schedule row meta: `13px -> 13.5px`
- Medication name: `14.5px -> 15px`
- Warning item title: `15px -> 15.5px`
- Warning body copy: `14px -> 14.5px`
- Family member name: `12.5px -> 13px`
- Pet section title: `16px -> 16.5px`
- Pet name: `14.5px -> 15px`
- Pet meta: `13px -> 13.5px`
- Pet count: `13.5px -> 14px`
- Recent date/dose: `13px -> 13.5px`
- Recent medication name: `13.5px -> 14px`
- AI answer copy: `14px -> 14.5px`
- AI input text: `13px -> 13.5px`
- Report title: `13.5px -> 14px`
- Report date: `13px -> 13.5px`

Summary number는 28px을 넘기지 않았고, section title은 19px 미만, greeting은 25px 이하로 제한했다. Summary number는 line-height rounding으로 clipping audit에 걸리지 않도록 Level B 안에서만 line-height를 `1.06`으로 조정했다.

## Intentionally Maintained

- Badge text: `11px`, weight `760`
- Primary wide button text: `13px`, weight `720`
- Download pill button text: `11px`, weight `760`
- User dropdown text: `14px`, weight `760`
- Icon size
- Card grid, sidebar width, spacing, color tokens

## Layout Impact

- Summary card height: `100.63px`
- Schedule row height: `54.19px`
- Recent medication card height: `259.41px`
- Recent medication card height change from Pass 04: `+2.35px`
- Schedule row remains within the intended 0-3px micro-change range.
- Card height change remains within the intended 0-4px micro-change range.
- Overflow audit at 1920x1080 catches only the intentional notification badge overlap.

Pass 04에서 맞춘 sidebar promo card와 recent card bottom은 typography bump 때문에 `6.06px` delta로 바뀌었다. 이번 pass는 typography-only 범위라 promo 위치 offset은 다시 조정하지 않았다.

## Screenshot Verification

| Screenshot | CSS viewport | DPR | Saved size | Notes |
| --- | ---: | ---: | ---: | --- |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 | 2 | 3840x2160 | Primary visual target |
| `screenshots/dashboard-v2-desktop.png` | 1920x1080 | 2 | 3840x2160 | 4K capture copy |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 | 1 | 1920x1080 | Standard desktop check |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 | 2 | 3024x1964 | Smoke check only |

4K desktop light 화면은 이전보다 작은 텍스트의 가독성이 조금 나아졌고, 카드/row 크기는 눈에 띄게 흔들리지 않았다.

## MacBook Retina Notes

- `dashboard-v2-macbook-retina.png`는 파일이 깨진 것이 아니라 1512px CSS viewport 검증용 이미지다.
- Level B는 `min-width: 1800px` 조건이므로 MacBook Retina smoke viewport에는 적용되지 않는다.
- 1512px width에서 보이는 압축, ellipsis, lower grid 밀도 문제는 이번 pass에서 고치지 않았고 별도 responsive desktop/tablet pass backlog로 남긴다.

## UI Guide Updates

- `docs/UI_GUIDE.md`에 `Typography Micro Bump Level B` 섹션을 추가했다.
- Level B가 wide desktop 전용이며 `@media (min-width: 1800px)`에서만 적용된다는 기준을 추가했다.
- 4K desktop readability 개선용이며 전역 확대가 아니라는 점을 명시했다.
- body font-size 변경, zoom, transform scale 금지를 유지했다.
- font-weight를 다시 무겁게 만들지 않는 기준을 유지했다.
- MacBook Retina 1512px viewport는 별도 responsive pass에서 다룬다고 명시했다.

## 남은 시각적 아쉬움

- 1512px MacBook Retina smoke viewport에서는 하단 카드와 일부 row가 좁게 느껴진다. 이번 pass 범위 밖이므로 responsive pass에서 다루는 것이 좋다.
- Pass 05 typography bump 이후 promo/recent bottom delta가 4px을 살짝 넘는다. 다음 layout polish pass에서 bottom alignment를 다시 엄격하게 맞출 수 있다.
