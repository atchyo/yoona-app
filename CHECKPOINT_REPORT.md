# Dashboard v2 Baseline Checkpoint Report

## Summary

- Purpose: preserve the current Dashboard v2 home screen/UI baseline.
- Baseline branch: `ui/dashboard-v2-baseline`
- Baseline commit: `a857dfe64de5315903392581fd7356693f9bcef1`
- Baseline commit message: `feat(ui): establish dashboard v2 baseline`
- Remote: `origin` (`git@github.com:atchyo/yoona-optime.git`)
- Push status: pushed to `origin/ui/dashboard-v2-baseline`
- Main/master push: not performed
- Production deploy: not performed

## Commands Run

```sh
git rev-parse --abbrev-ref HEAD
git status --short
git remote -v
git log --oneline -5
git checkout -b ui/dashboard-v2-baseline
npm run build
node -e "const p=require('./package.json'); console.log(JSON.stringify(p.scripts,null,2))"
sips -g pixelWidth -g pixelHeight screenshots/dashboard-v2-desktop-4k.png
git add src/components/AppShell.tsx src/components/Icon.tsx src/main.tsx src/pages/DashboardPage.tsx src/dashboard-v2.css docs/UI_GUIDE.md public/assets/opti-me-icon.png screenshots NIGHTLY_REPORT.md VISUAL_POLISH_REPORT.md VISUAL_POLISH_REPORT_03.md VISUAL_POLISH_REPORT_04.md VISUAL_POLISH_REPORT_05.md VISUAL_POLISH_REPORT_06.md VISUAL_POLISH_REPORT_07.md VISUAL_POLISH_REPORT_08.md VISUAL_POLISH_REPORT_09.md VISUAL_POLISH_REPORT_10.md VISUAL_POLISH_REPORT_11.md VISUAL_POLISH_REPORT_12.md
git commit -m "feat(ui): establish dashboard v2 baseline"
git push -u origin ui/dashboard-v2-baseline
```

## Build / Test / Lint

- `npm run build`: passed
- Build command executed by script: `tsc -b && vite build`
- Test script: not present in `package.json`
- Lint script: not present in `package.json`

## Screenshot Baseline

- 4K desktop light screenshot: `screenshots/dashboard-v2-desktop-4k.png`
- Screenshot dimensions: 3840 x 2160
- AI chat closeup: `screenshots/dashboard-v2-ai-chat-closeup.png`
- Standard desktop screenshot: `screenshots/dashboard-v2-desktop-standard.png`
- MacBook Retina smoke screenshot: `screenshots/dashboard-v2-macbook-retina.png`

## UI Guide

- Current Dashboard v2 design system guide: `docs/UI_GUIDE.md`
- The guide records the current baseline direction:
  - Current Dashboard v2 baseline
  - Desktop light priority
  - Soft premium healthcare dashboard
  - Slate section title unification
  - Readable Scale Level 2 typography
  - Sidebar brand icon asset rule
  - AI chat bubble layout rule
  - Dark mode and mobile polish deferred to separate passes

## Mock Data Still Used

The Dashboard v2 screen intentionally uses render-only fixtures/mock data in `src/pages/DashboardPage.tsx`.

- `dashboardDate`
- `summaryCards`
- `scheduleRows`
- `familyMembersFixture`
- `recentRows`
- `reportRows`
- AI consult example question/answer text

These fixtures are not written to DB and do not change backend behavior.

## Files Captured In Baseline

- Dashboard shell and header adjustments: `src/components/AppShell.tsx`
- Icon set additions and line style updates: `src/components/Icon.tsx`
- Dashboard v2 page composition and fixtures: `src/pages/DashboardPage.tsx`
- Dashboard v2 stylesheet: `src/dashboard-v2.css`
- CSS import: `src/main.tsx`
- Brand asset: `public/assets/opti-me-icon.png`
- UI guide: `docs/UI_GUIDE.md`
- Screenshots and polish reports under `screenshots/` and `VISUAL_POLISH_REPORT*.md`

## Next Recommended Steps

1. Review the pushed branch on GitHub before merging.
2. Open a PR from `ui/dashboard-v2-baseline` when ready.
3. Do not merge to any production-connected branch until the visual baseline is approved.
4. Plan a separate responsive desktop/tablet pass for 1512px MacBook Retina compression.
5. Plan dark mode and mobile polish as separate passes.
6. Replace Dashboard v2 render-only fixtures with real read-only data wiring only after the UI baseline is approved.
