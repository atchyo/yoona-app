# Dashboard v2 Typography Polish Pass 06

작성일: 2026-04-27

## 작업 범위

- 이번 pass는 4K desktop light 기준 typography polish만 진행했다.
- 새 기능, 새 화면, DB, 인증, 백엔드, 배포, 다크모드 수정, 모바일 레이아웃 수정은 하지 않았다.
- 전체 body font-size 일괄 확대, zoom, transform scale은 사용하지 않았다.
- Font weight는 더 굵게 만들지 않았고, 좌측 sidebar menu label은 `720 -> 690`으로 낮춰 더 샤프하게 정리했다.

## Before Computed Font Audit

기준: CSS viewport `1920x1080`, DPR `2`.

| Element | Font size | Weight | Line-height |
| --- | ---: | ---: | ---: |
| Sidebar menu label | 15px | 720 | 16.5px |
| Sidebar active menu label | 15px | 720 | 16.5px |
| Logo title `Opti-Me` | 19px | 840 | 19.95px |
| Logo subtitle `가족 약 관리` | 14px | 650 | 17.5px |
| Promo title | 15px | 700 | 19.2px |
| Promo body | 13.5px | 560 | 19.17px |
| Greeting | 25px | 760 | 27px |
| Summary title | 14px | 700 | 15.96px |
| Summary number | 28px | 770 | 29.68px |
| Section title | 18.5px | 720 | 22.2px |
| Medication name | 15px | 690 | 18px |
| Schedule meta | 13.5px | 580 | 16.2px |
| Recent date/dose | 13.5px | 620 | normal |
| Recent medication name | 14px | 700 | normal |
| AI body | 14.5px | 590 | 22.475px |
| Report title | 14px | 700 | 16.8px |
| Report date | 13.5px | 580 | normal |

## After Computed Font Audit

기준: CSS viewport `1920x1080`, DPR `2`.

| Element | Font size | Weight | Line-height |
| --- | ---: | ---: | ---: |
| Sidebar menu label | 15.5px | 690 | 21.39px |
| Sidebar active menu label | 15.5px | 690 | 21.39px |
| Logo title `Opti-Me` | 19.5px | 840 | 20.475px |
| Logo subtitle `가족 약 관리` | 14.5px | 650 | 18.125px |
| Promo title | 15.5px | 700 | 20.15px |
| Promo body | 14px | 560 | 20.02px |
| Greeting | 25px | 760 | 27px |
| Summary title | 14.5px | 700 | 15.95px |
| Summary number | 28px | 770 | 29.12px |
| Section title | 19px | 720 | 22.8px |
| Medication name | 15.5px | 690 | 18.6px |
| Schedule meta | 14px | 580 | 16.8px |
| Recent date/dose | 14px | 620 | normal |
| Recent medication name | 14.5px | 700 | normal |
| AI body | 15px | 590 | 23.25px |
| Report title | 14.5px | 700 | 17.4px |
| Report date | 14px | 580 | normal |

## 변경 요약

- Sidebar menu label: `15px -> 15.5px`, weight `720 -> 690`.
- Sidebar active menu label도 동일하게 `15.5px / 690`으로 맞췄다.
- Logo title/subtitle는 각각 `+0.5px`만 적용했고 weight는 올리지 않았다.
- Promo title/body도 각각 `+0.5px`만 적용했다.
- 오른쪽 콘텐츠는 대부분 `+0.5px`만 적용했다.
- Greeting과 summary number는 이미 상한에 도달해 크기를 유지했다.
- Badge, primary wide button, small pill button, user dropdown text, icon size는 유지했다.

## Layout Protection

| Metric | Before | After |
| --- | ---: | ---: |
| Sidebar menu row height | 40px | 40px |
| Schedule row height | 54.19px | 55.39px |
| Summary card height | 100.63px | 100.05px |
| Recent medication card height | 259.41px | 261.97px |
| Promo/recent bottom delta | 6.06px | 0.16px |

- Sidebar menu row height는 40px 그대로 유지했다.
- Schedule row height 변화는 `+1.2px`로 0-3px 허용 범위 안이다.
- Recent card height 변화는 `+2.56px`로 주요 카드 0-4px 허용 범위 안이다.
- Typography bump 이후 `--dv2-promo-bottom-offset`을 wide desktop에서 `0px`로 조정해 promo/recent bottom delta를 4px 이하로 회복했다.
- 4K overflow audit에는 notification badge와 summary text line-height rounding이 잡히지만, 실제 screenshot에서 텍스트 clipping이나 줄바꿈은 보이지 않는다.

## Screenshot Verification

| Screenshot | CSS viewport | DPR | Saved size |
| --- | ---: | ---: | ---: |
| `screenshots/dashboard-v2-desktop-4k.png` | 1920x1080 | 2 | 3840x2160 |
| `screenshots/dashboard-v2-desktop.png` | 1920x1080 | 2 | 3840x2160 |
| `screenshots/dashboard-v2-desktop-standard.png` | 1920x1080 | 1 | 1920x1080 |

## UI Guide Updates

- `docs/UI_GUIDE.md`에 Level B의 sidebar menu label 기준을 `15.5px` 전후로 명시했다.
- 좌측 메뉴와 오른쪽 콘텐츠가 typography density 균형을 맞춰야 한다는 기준을 추가했다.
- Sidebar menu line-height는 1.35-1.45 범위, row height는 40px 전후를 유지한다는 기준을 추가했다.
- Font weight는 유지하거나 낮추고, 더 무겁게 만들지 않는 기준을 유지했다.
- Promo/recent bottom alignment는 Level B 이후에도 delta 4px 이하를 유지한다고 명시했다.

## 남은 시각적 아쉬움

- Summary number는 28px 상한에 있어 더 키우지 않았다. 더 큰 숫자 위계를 원하면 summary card 구조 자체를 재조정하는 별도 pass가 필요하다.
- Logo title weight는 기존 840을 유지했다. 브랜드 텍스트를 더 샤프하게 만들려면 별도 brand polish pass에서 weight를 낮추는 편이 좋다.
