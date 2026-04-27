# Opti-Me Deployment Status

Checked on: 2026-04-28 KST

## Summary

`https://optime.jeongung.cloud/` is deployed through GitHub Pages, not Vercel,
Cloudflare Pages, Netlify, or a direct server deployment.

The production deployment is driven by the GitHub Actions workflow at
`.github/workflows/static.yml`. That workflow runs on pushes to `main`, builds
the Vite app, uploads `dist`, and deploys it with `actions/deploy-pages`.

Do not push yet. The current local `main` contains Dashboard v2/UI baseline work
that has not been pushed to `origin/main`, so it is not reflected on the live
site yet.

## Evidence

### Domain / Hosting

- `curl -I -L https://optime.jeongung.cloud` returns `server: GitHub.com`.
- DNS lookup:
  - `optime.jeongung.cloud` CNAME -> `atchyo.github.io.`
  - A/AAAA records resolve to GitHub Pages IP ranges.
- `public/CNAME` contains:

```text
optime.jeongung.cloud
```

### Deployment Config

The repository contains:

- `.github/workflows/static.yml`
- `public/CNAME`
- `vite.config.ts`
- `package.json`

No local deployment config was found for:

- Vercel (`vercel.json`, `.vercel`)
- Netlify (`netlify.toml`)
- Cloudflare Pages/Workers (`wrangler.toml`)
- Firebase Hosting (`firebase.json`, `.firebaserc`)
- Docker/direct server deployment (`Dockerfile`, `docker-compose*`)

GitHub Pages API could not be confirmed unauthenticated, but the live response
headers, DNS records, `public/CNAME`, and repository workflow all point to
GitHub Pages.

## Production Branch / Trigger

Production deployment trigger:

```yaml
on:
  push:
    branches: ["main"]
  workflow_dispatch:
```

Current remote heads:

- `origin/main` -> `ef8c606`
- `origin/ui/dashboard-v2-baseline` -> `b28a125`

Current local branch:

- `main` -> `fea305c`
- Local `main` is ahead of `origin/main` by 4 commits.

Conclusion: production is connected to `main` through GitHub Actions. Pushing
local `main` to `origin/main` should trigger an automatic GitHub Pages deploy.

## Automatic vs Manual Deploy

Expected automatic deploy:

```bash
git push origin main
```

That push should trigger `.github/workflows/static.yml`, which runs:

```bash
npm ci --ignore-scripts
npm run build
```

Then it uploads the `dist` folder and deploys through GitHub Pages.

Manual deploy is not normally required. The workflow also supports
`workflow_dispatch`, so it can be manually re-run from GitHub Actions if needed.

## Current Live Site vs Local

The live site is not showing the latest local UI baseline yet.

Evidence:

- Local `main` is ahead of `origin/main` by 4 commits.
- Latest local commit: `fea305c feat(ui): scaffold core menu layouts from dashboard baseline`
- `origin/main` still points to `ef8c606 Refine dashboard compact layout`.
- Live HTML currently references older assets such as:
  - `/assets/index-UPivimiW.js`
  - `/assets/index-UIn5leHy.css`
- Latest local build references different assets such as:
  - `/assets/index-CO4Y91jM.js`
  - `/assets/index-BoAQLZIM.css`

Conclusion: the Dashboard v2 design-system and menu scaffold commits are local
only until `main` is pushed.

## Pre-Deploy Verification Commands

Available scripts in `package.json`:

```json
{
  "dev": "vite --host 0.0.0.0",
  "build": "tsc -b && vite build",
  "preview": "vite preview --host 0.0.0.0",
  "generate:icons": "node scripts/generate-icons.mjs",
  "sync:drug-catalog": "node scripts/sync-drug-catalog.mjs"
}
```

Before deploying, run:

```bash
npm run build
```

There are no dedicated `lint`, `test`, or `typecheck` scripts at this time.
TypeScript checking is included in `npm run build` through `tsc -b`.

Last local verification:

```text
npm run build
```

Result: passed.

## Deployment Notes

- The app is a Vite React app with `base: "/"`, suitable for the custom root
  domain `https://optime.jeongung.cloud/`.
- Production auth/backend data depends on Supabase browser env values:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Supabase server/admin secrets must not be placed in Vite browser env files.
- Pushing local `main` is the likely next step when ready, but this check did
  not push or deploy anything.
