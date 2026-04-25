import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync, inflateSync } from "node:zlib";

const publicDir = join(process.cwd(), "public");
const sourceSvgPath = join(publicDir, "opti_me_app_icon.svg");
const sourcePngPath = join(publicDir, "opti_me_app_icon.png");
const flattenedJpegPath = join(publicDir, ".opti_me_app_icon_flat.jpg");
const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

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

for (const fileName of ["opti_me_app_icon.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "favicon-32.png"]) {
  flattenPngAlpha(join(publicDir, fileName), [255, 122, 8]);
}

if (existsSync(flattenedJpegPath)) {
  rmSync(flattenedJpegPath);
}

if (existsSync(join(publicDir, "favicon.ico"))) {
  rmSync(join(publicDir, "favicon.ico"));
}

function flattenPngAlpha(filePath, matteRgb) {
  const png = decodePng(readFileSync(filePath));
  const rgb = Buffer.alloc(png.width * png.height * 3);

  for (let index = 0; index < png.width * png.height; index += 1) {
    const sourceOffset = index * png.channels;
    const outputOffset = index * 3;
    const alpha = png.channels === 4 ? png.pixels[sourceOffset + 3] / 255 : 1;

    rgb[outputOffset] = Math.round(png.pixels[sourceOffset] * alpha + matteRgb[0] * (1 - alpha));
    rgb[outputOffset + 1] = Math.round(png.pixels[sourceOffset + 1] * alpha + matteRgb[1] * (1 - alpha));
    rgb[outputOffset + 2] = Math.round(png.pixels[sourceOffset + 2] * alpha + matteRgb[2] * (1 - alpha));
  }

  writeFileSync(filePath, encodeRgbPng(png.width, png.height, rgb));
}

function decodePng(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error("Unsupported PNG signature");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
    throw new Error(`Unsupported PNG format: bit depth ${bitDepth}, color type ${colorType}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const stride = width * channels;
  const pixels = Buffer.alloc(width * height * channels);
  let inputOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const row = Buffer.from(inflated.subarray(inputOffset, inputOffset + stride));
    inputOffset += stride;
    const previousRow = y === 0 ? null : pixels.subarray((y - 1) * stride, y * stride);

    unfilterRow(row, previousRow, channels, filter);
    row.copy(pixels, y * stride);
  }

  return { width, height, channels, pixels };
}

function unfilterRow(row, previousRow, bytesPerPixel, filter) {
  for (let index = 0; index < row.length; index += 1) {
    const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
    const up = previousRow ? previousRow[index] : 0;
    const upLeft = previousRow && index >= bytesPerPixel ? previousRow[index - bytesPerPixel] : 0;

    if (filter === 1) {
      row[index] = (row[index] + left) & 0xff;
    } else if (filter === 2) {
      row[index] = (row[index] + up) & 0xff;
    } else if (filter === 3) {
      row[index] = (row[index] + Math.floor((left + up) / 2)) & 0xff;
    } else if (filter === 4) {
      row[index] = (row[index] + paeth(left, up, upLeft)) & 0xff;
    } else if (filter !== 0) {
      throw new Error(`Unsupported PNG filter: ${filter}`);
    }
  }
}

function paeth(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const distanceLeft = Math.abs(estimate - left);
  const distanceUp = Math.abs(estimate - up);
  const distanceUpLeft = Math.abs(estimate - upLeft);
  if (distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft) return left;
  if (distanceUp <= distanceUpLeft) return up;
  return upLeft;
}

function encodeRgbPng(width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const rawOffset = y * (stride + 1);
    raw[rawOffset] = 0;
    rgb.copy(raw, rawOffset + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", Buffer.from([
      (width >>> 24) & 0xff,
      (width >>> 16) & 0xff,
      (width >>> 8) & 0xff,
      width & 0xff,
      (height >>> 24) & 0xff,
      (height >>> 16) & 0xff,
      (height >>> 8) & 0xff,
      height & 0xff,
      8,
      2,
      0,
      0,
      0,
    ])),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
