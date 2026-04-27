# NIGHTLY REPORT - Opti-Me Dashboard v2

## 무엇을 만들었는지

Opti-Me Dashboard v2를 기준 화면으로 정리했다. 실제 데이터가 부족해도 완성된 서비스 화면처럼 보이도록 대시보드 렌더링 전용 mock fixture를 사용했다.

## 수정한 파일

- `src/pages/DashboardPage.tsx`
- `src/dashboard-v2.css`
- `src/components/AppShell.tsx`
- `src/components/Icon.tsx`
- `src/main.tsx`
- `docs/UI_GUIDE.md`
- `NIGHTLY_REPORT.md`

## Dashboard v2 확인 경로

- 로컬: `http://localhost:5175/`
- 운영 배포는 하지 않았다.

## Mock data 사용 위치

- `src/pages/DashboardPage.tsx`
- 사용한 mock fixture:
  - 4개 summary card
  - 오늘의 복용 일정 5개
  - 주의 상호작용 1건
  - 가족 현황 5명 + 추가 버튼
  - 반려동물 현황 1마리
  - 최근 복용 기록 4개
  - AI 상담 예시
  - 복약 지도 리포트 3개

## 현재 Dashboard v2에서 정리한 부분

- 흰색 sidebar와 연한 blue-gray page background.
- active menu의 연한 indigo 배경과 primary text.
- 상단 인사말, 알림, 도움말, 유저 드롭다운 구조.
- 4개 summary card의 낮고 넓은 구조, 원형 아이콘, 작은 CTA.
- 오늘의 복용 일정 5-row 구조와 우측 가족/상태 뱃지 정렬.
- muted danger 스타일의 상호작용 카드.
- 가족 아바타 row, 반려동물 카드, 하단 3-column 카드 구조.

## 남은 시각적 점검 항목

- Desktop light에서 텍스트가 너무 무겁지 않은지 확인.
- Danger 영역이 의미는 유지하되 화면에서 과하게 튀지 않는지 확인.
- Sidebar logo와 promo image가 잘려 보이지 않는지 확인.
- Summary card 숫자와 CTA 간격이 답답하지 않은지 확인.
- 반려동물 카드의 제목, 이름, 설명 위계가 분명한지 확인.

## 저장한 스크린샷

- `screenshots/dashboard-v2-desktop.png`
- `screenshots/dashboard-v2-desktop-dark.png`
- `screenshots/dashboard-v2-tablet.png`
- `screenshots/dashboard-v2-mobile.png`
