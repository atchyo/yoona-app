# Dashboard v2 Visual Polish Pass 04

작성일: 2026-04-27

## 작업 범위

- 이번 pass는 desktop light 화면의 미세 조정만 진행했다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드 polish, 모바일 대규모 수정은 하지 않았다.
- 전역 zoom, transform scale, body 전체 font-size 일괄 확대도 적용하지 않았다.

## Promo Card Bottom Alignment

- 좌측 sidebar promo card를 top 기준이 아니라 최근 복용 기록 카드와 bottom line 기준으로 다시 맞췄다.
- `src/dashboard-v2.css`에 `--dv2-promo-bottom-offset: 11px` 변수를 두고, sidebar card의 `margin-bottom`에 적용했다.
- Promo image는 계속 `object-fit: contain`을 유지해 clipping이 생기지 않게 했다.

### 1920x1080 CSS viewport + DPR 2

- Sidebar promo card top: `795.09px`
- Sidebar promo card bottom: `1043.00px`
- Recent medication card top: `785.89px`
- Recent medication card bottom: `1042.95px`
- Bottom delta: `0.05px`

합격 기준인 4px 이하를 만족한다.

### MacBook Retina Approximation

- Viewport: `1512x982`, DPR `2`
- Sidebar promo card bottom: `945.00px`
- Recent medication card bottom: `1076.33px`
- Bottom delta: `131.33px`

이 viewport에서는 최근 복용 기록 카드의 하단이 첫 화면 아래로 내려가므로 1920x1080 기준처럼 bottom line을 맞추지는 않았다. 이번 pass의 primary 기준은 1920x1080 desktop light다.

## Typography Micro Bump Level A

작은 텍스트만 0.5-1px 범위에서 키웠고, font weight는 다시 무겁게 올리지 않았다.

- Sidebar menu text: `14px -> 14.5px`
- Sidebar promo body: `12px -> 13px`
- Summary title: `13px -> 13.5px`
- Schedule row meta: `12px -> 13px`
- Medication name: `14px -> 14.5px`
- Warning body copy: `13px -> 14px`
- Family member name: `12px -> 12.5px`
- Pet name: `14px -> 14.5px`
- Pet meta: `12px -> 13px`
- Pet count/meta: `13px -> 13.5px`
- Recent date/dose: `12px -> 13px`
- Recent medication name: `13px -> 13.5px`
- AI answer copy: `13px -> 14px`
- AI input text: `12px -> 13px`
- Report title: `13px -> 13.5px`
- Report date: `12px -> 13px`

## Intentionally Maintained

- Greeting: `24px`, weight `760`.
- Summary numbers: `27px`, weight `770`.
- Section titles: `18px`, weight `720`.
- Badge text: `11px`, height `24px`.
- Large CTA button text: `13px`.
- Overall card layout, grid structure, and component hierarchy.

## UI Guide Updates

- `docs/UI_GUIDE.md`에 sidebar promo card는 최근 복용 기록 카드와 bottom line 정렬한다는 기준을 추가했다.
- Desktop light 1920x1080에서 promo bottom과 recent card bottom delta 4px 이하를 목표로 한다고 명시했다.
- `Typography Micro Bump Level A`를 문서화했다.
- 작은 텍스트는 0.5-1px만 키우고, greeting/summary number/section title/badge/large CTA는 크게 키우지 않는 기준을 추가했다.
- Font weight를 다시 무겁게 올리지 않는 기준을 추가했다.
- 다크모드와 모바일 polish는 별도 pass라는 기준을 유지했다.

## Screenshot Verification

| Screenshot | CSS viewport | DPR | Saved size |
| --- | ---: | ---: | ---: |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 | 2 | 3840x2160 |
| `screenshots/dashboard-v2-desktop.png` | 1920x1080 | 2 | 3840x2160 |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 | 1 | 1920x1080 |
| `screenshots/dashboard-v2-macbook-retina.png` | 1512x982 | 2 | 3024x1964 |

## Validation Notes

- 1920x1080 DPR 2에서 promo/recent bottom delta는 `0.05px`.
- 1920x1080 DPR 1에서도 delta는 `0.05px`.
- Promo image clipping 없음: `object-fit: contain`, image clientHeight `88px`.
- Horizontal overflow audit는 notification badge의 의도된 badge overlap 1건만 잡혔다.
- MacBook Retina approximation에서는 기존 3-column lower grid가 첫 화면 아래까지 내려가지만, 이번 pass 범위에서는 모바일/중간 viewport layout polish를 진행하지 않았다.

## 남은 시각적 아쉬움

- MacBook급 폭에서는 하단 3-column 카드가 좁아져 일부 row가 ellipsis/overflow audit에 잡힌다. 이는 별도 responsive desktop/tablet pass에서 다루는 편이 좋다.
- Typography Level A만 적용했기 때문에 전체가 커진 느낌은 피했지만, 더 읽기 편한 밀도를 원하면 Level B를 별도 pass로 설계해야 한다.
