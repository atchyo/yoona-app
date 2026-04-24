import { execFileSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");
const sourceSvgPath = join(publicDir, "opti_me_app_icon.svg");
const sourcePngPath = join(publicDir, "opti_me_app_icon.png");
const flattenedJpegPath = join(publicDir, ".opti_me_app_icon_flat.jpg");

const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#ff9f16"/>
      <stop offset="54%" stop-color="#ff7a08"/>
      <stop offset="100%" stop-color="#ff6200"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#b54800" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g filter="url(#softShadow)">
    <g transform="translate(183 111) rotate(43)">
      <rect x="0" y="0" width="104" height="236" rx="52" fill="#fff"/>
      <rect x="23" y="31" width="27" height="68" rx="14" fill="#ff7a08"/>
      <rect x="56" y="31" width="27" height="68" rx="14" fill="#ff7a08"/>
      <rect x="44" y="119" width="18" height="84" rx="9" fill="#ff7a08"/>
    </g>
    <g transform="translate(292 244) rotate(-15)">
      <ellipse cx="70" cy="44" rx="72" ry="44" fill="#fff"/>
      <rect x="-2" y="39" width="144" height="10" rx="5" fill="#ff7a08"/>
      <rect x="66" y="0" width="10" height="88" rx="5" fill="#ff7a08"/>
    </g>
    <text
      x="256"
      y="406"
      fill="#fff"
      font-family="Arial Rounded MT Bold, Arial, Helvetica, sans-serif"
      font-size="76"
      font-weight="800"
      letter-spacing="-1"
      text-anchor="middle"
    >Opti-Me</text>
  </g>
</svg>
`;

writeFileSync(sourceSvgPath, iconSvg);
execFileSync("sips", ["-s", "format", "png", sourceSvgPath, "--out", sourcePngPath], { stdio: "ignore" });
execFileSync("sips", ["-s", "format", "jpeg", sourcePngPath, "--out", flattenedJpegPath], { stdio: "ignore" });
execFileSync("sips", ["-s", "format", "png", flattenedJpegPath, "--out", sourcePngPath], { stdio: "ignore" });

for (const [fileName, size] of [
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["favicon-32.png", 32],
]) {
  execFileSync("sips", ["-z", String(size), String(size), sourcePngPath, "--out", join(publicDir, fileName)], {
    stdio: "ignore",
  });
}

if (existsSync(flattenedJpegPath)) {
  rmSync(flattenedJpegPath);
}

if (existsSync(join(publicDir, "favicon.ico"))) {
  rmSync(join(publicDir, "favicon.ico"));
}
