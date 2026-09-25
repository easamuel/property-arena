/**
 * Make logo canvas transparent via flood-fill from edges.
 * Keeps brand whites (house fill, "Property" plate) intact.
 */
const Jimp = require('jimp');
const path = require('path');

const SRC = path.join(__dirname, '../public/logo-source.jpg');
const OUT = path.join(__dirname, '../public/logo.png');

const isNearWhite = (r, g, b) => r >= 240 && g >= 240 && b >= 240;

(async () => {
  const img = await Jimp.read(SRC);
  const { width, height, data } = img.bitmap;
  const visited = new Uint8Array(width * height);
  const queue = [];

  const pushIfWhite = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (visited[i]) return;
    const idx = i * 4;
    if (!isNearWhite(data[idx], data[idx + 1], data[idx + 2])) return;
    visited[i] = 1;
    queue.push(i);
  };

  for (let x = 0; x < width; x++) {
    pushIfWhite(x, 0);
    pushIfWhite(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfWhite(0, y);
    pushIfWhite(width - 1, y);
  }

  while (queue.length) {
    const i = queue.pop();
    const x = i % width;
    const y = (i / width) | 0;
    data[i * 4 + 3] = 0;
    pushIfWhite(x + 1, y);
    pushIfWhite(x - 1, y);
    pushIfWhite(x, y + 1);
    pushIfWhite(x, y - 1);
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > 8) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  const pad = 2;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  img.crop(minX, minY, maxX - minX + 1, maxY - minY + 1);
  await img.writeAsync(OUT);
  console.log(`Wrote ${OUT} (${img.bitmap.width}x${img.bitmap.height})`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
