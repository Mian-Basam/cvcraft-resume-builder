// Browser-only image helpers for turning an uploaded photo into an avatar.
// Everything runs on a canvas in the user's browser; the photo is never uploaded anywhere.

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = src;
  });
}

function toCanvas(img, maxSize) {
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
}

// ---------- Cartoon filters ----------

// Slider definitions for the "Adjust" controls.
export const ADJUSTMENTS = [
  { key: "smooth", label: "Smoothing", min: 0, max: 6, step: 1 },
  { key: "detail", label: "Colour detail", min: 3, max: 14, step: 1 },
  { key: "lineWidth", label: "Outline thickness", min: 0.6, max: 2.4, step: 0.1 },
  { key: "lineStrength", label: "Outline strength", min: 0, max: 1.5, step: 0.05 },
  { key: "saturation", label: "Colour intensity", min: 0, max: 2.2, step: 0.05 },
  { key: "brightness", label: "Brightness", min: -40, max: 40, step: 1 },
  { key: "contrast", label: "Contrast", min: 0.6, max: 1.6, step: 0.05 },
];

const ALL = ADJUSTMENTS.map((a) => a.key);
const NO_DETAIL = ALL.filter((k) => k !== "detail");
const MONO = ALL.filter((k) => k !== "saturation");
const MONO_NO_DETAIL = MONO.filter((k) => k !== "detail");

// kind picks the drawing method; defaults are where each slider starts; uses lists the sliders that apply.
export const FILTERS = [
  { id: "soft", name: "Soft", kind: "toon", hard: 0.12, uses: ALL, defaults: { smooth: 3, detail: 9, lineWidth: 1, lineStrength: 0.75, saturation: 1.18, brightness: 0, contrast: 1 } },
  { id: "comic", name: "Comic", kind: "toon", hard: 0.4, uses: ALL, defaults: { smooth: 4, detail: 5, lineWidth: 1.25, lineStrength: 1, saturation: 1.4, brightness: 0, contrast: 1.05 } },
  { id: "pop", name: "Pop art", kind: "toon", hard: 1, uses: ALL, defaults: { smooth: 4, detail: 4, lineWidth: 1.5, lineStrength: 1.1, saturation: 1.9, brightness: 6, contrast: 1.15 } },
  { id: "halftone", name: "Halftone", kind: "halftone", hard: 0.6, uses: ALL, defaults: { smooth: 3, detail: 5, lineWidth: 1.2, lineStrength: 1, saturation: 1.35, brightness: 6, contrast: 1.05 } },
  { id: "flat", name: "Flat vector", kind: "flat", uses: ALL, defaults: { smooth: 5, detail: 8, lineWidth: 1.1, lineStrength: 0.9, saturation: 1.25, brightness: 0, contrast: 1 } },
  { id: "watercolor", name: "Watercolour", kind: "watercolor", uses: NO_DETAIL, defaults: { smooth: 4, detail: 8, lineWidth: 0.9, lineStrength: 0.35, saturation: 1, brightness: 10, contrast: 0.95 } },
  { id: "oil", name: "Oil paint", kind: "oil", uses: NO_DETAIL, defaults: { smooth: 3, detail: 8, lineWidth: 1, lineStrength: 0.25, saturation: 1.25, brightness: 0, contrast: 1.05 } },
  { id: "sketch", name: "Pencil", kind: "sketch", uses: MONO_NO_DETAIL, defaults: { smooth: 2, detail: 8, lineWidth: 0.9, lineStrength: 0.9, saturation: 0, brightness: 0, contrast: 1 } },
  { id: "colorpencil", name: "Colour pencil", kind: "colorpencil", uses: NO_DETAIL, defaults: { smooth: 2, detail: 8, lineWidth: 0.9, lineStrength: 0.7, saturation: 1.15, brightness: 0, contrast: 1 } },
  { id: "noir", name: "Noir", kind: "noir", uses: MONO, defaults: { smooth: 3, detail: 3, lineWidth: 1.3, lineStrength: 1.1, saturation: 0, brightness: 0, contrast: 1.2 } },
];

export function getFilter(id) {
  return FILTERS.find((f) => f.id === id) || FILTERS[0];
}

// Gaussian blur of a single-channel float image (separable).
function gaussian(src, w, h, sigma) {
  const r = Math.max(1, Math.ceil(sigma * 3));
  const k = [];
  let sum = 0;
  for (let i = -r; i <= r; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    k.push(v);
    sum += v;
  }
  for (let i = 0; i < k.length; i++) k[i] /= sum;
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = 0;
      for (let i = -r; i <= r; i++) a += src[y * w + Math.min(w - 1, Math.max(0, x + i))] * k[i + r];
      tmp[y * w + x] = a;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = 0;
      for (let i = -r; i <= r; i++) a += tmp[Math.min(h - 1, Math.max(0, y + i)) * w + x] * k[i + r];
      out[y * w + x] = a;
    }
  }
  return out;
}

// One direction of a separable bilateral filter: averages neighbours of similar colour only,
// so skin and backgrounds go smooth while edges (eyes, jaw, hair line) stay sharp.
function bilateralPass(R, G, B, w, h, horizontal, radius, sigmaS, sigmaR) {
  const spatial = [];
  for (let i = -radius; i <= radius; i++) spatial.push(Math.exp(-(i * i) / (2 * sigmaS * sigmaS)));
  const lut = new Float32Array(4096);
  for (let i = 0; i < lut.length; i++) lut[i] = Math.exp(-(i * 64) / (2 * sigmaR * sigmaR));
  const oR = new Float32Array(w * h);
  const oG = new Float32Array(w * h);
  const oB = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = y * w + x;
      let sr = 0, sg = 0, sb = 0, sw = 0;
      for (let i = -radius; i <= radius; i++) {
        const n = horizontal ? y * w + Math.min(w - 1, Math.max(0, x + i)) : Math.min(h - 1, Math.max(0, y + i)) * w + x;
        const d = (R[n] - R[c]) ** 2 + (G[n] - G[c]) ** 2 + (B[n] - B[c]) ** 2;
        const wt = spatial[i + radius] * lut[Math.min(4095, d >> 6)];
        sr += R[n] * wt; sg += G[n] * wt; sb += B[n] * wt; sw += wt;
      }
      oR[c] = sr / sw; oG[c] = sg / sw; oB[c] = sb / sw;
    }
  }
  return [oR, oG, oB];
}

function bilateral(R, G, B, w, h, iterations, sigmaR = 24) {
  let ch = [R, G, B];
  for (let i = 0; i < iterations; i++) {
    ch = bilateralPass(...ch, w, h, true, 4, 3, sigmaR);
    ch = bilateralPass(...ch, w, h, false, 4, 3, sigmaR);
  }
  return ch;
}

// Kuwahara filter: each pixel takes the mean colour of its calmest neighbouring quadrant,
// which turns detail into brush-stroke-like patches (the "oil paint" look).
function kuwahara(R, G, B, w, h, r) {
  const W = w + 1;
  const sat = () => new Float64Array(W * (h + 1));
  const sR = sat(), sG = sat(), sB = sat(), sL = sat(), sL2 = sat();
  for (let y = 0; y < h; y++) {
    let aR = 0, aG = 0, aB = 0, aL = 0, aL2 = 0;
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const l = 0.299 * R[i] + 0.587 * G[i] + 0.114 * B[i];
      aR += R[i]; aG += G[i]; aB += B[i]; aL += l; aL2 += l * l;
      const j = (y + 1) * W + x + 1;
      sR[j] = sR[j - W] + aR; sG[j] = sG[j - W] + aG; sB[j] = sB[j - W] + aB; sL[j] = sL[j - W] + aL; sL2[j] = sL2[j - W] + aL2;
    }
  }
  const box = (s, x0, y0, x1, y1) => s[(y1 + 1) * W + x1 + 1] - s[y0 * W + x1 + 1] - s[(y1 + 1) * W + x0] + s[y0 * W + x0];
  const oR = new Float32Array(w * h), oG = new Float32Array(w * h), oB = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let best = Infinity, bx0 = 0, by0 = 0, bx1 = 0, by1 = 0;
      for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const x0 = Math.max(0, Math.min(x, x + dx * r)), x1 = Math.min(w - 1, Math.max(x, x + dx * r));
        const y0 = Math.max(0, Math.min(y, y + dy * r)), y1 = Math.min(h - 1, Math.max(y, y + dy * r));
        const n = (x1 - x0 + 1) * (y1 - y0 + 1);
        const m = box(sL, x0, y0, x1, y1) / n;
        const v = box(sL2, x0, y0, x1, y1) / n - m * m;
        if (v < best) { best = v; bx0 = x0; by0 = y0; bx1 = x1; by1 = y1; }
      }
      const n = (bx1 - bx0 + 1) * (by1 - by0 + 1);
      const i = y * w + x;
      oR[i] = box(sR, bx0, by0, bx1, by1) / n; oG[i] = box(sG, bx0, by0, bx1, by1) / n; oB[i] = box(sB, bx0, by0, bx1, by1) / n;
    }
  }
  return [oR, oG, oB];
}

// Small k-means palette for the flat vector look.
function nearest(centers, r, g, b) {
  let best = 0, bestD = Infinity;
  for (let i = 0; i < centers.length; i++) {
    const c = centers[i];
    const d = (c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2;
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}
function kmeans(R, G, B, k) {
  const n = R.length;
  const step = Math.max(1, Math.floor(n / 6000));
  const samples = [];
  for (let i = 0; i < n; i += step) samples.push([R[i], G[i], B[i]]);
  samples.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  let centers = Array.from({ length: k }, (_, i) => [...samples[Math.floor(((i + 0.5) / k) * samples.length)]]);
  for (let it = 0; it < 10; it++) {
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (const s of samples) {
      const c = nearest(centers, s[0], s[1], s[2]);
      sums[c][0] += s[0]; sums[c][1] += s[1]; sums[c][2] += s[2]; sums[c][3]++;
    }
    centers = centers.map((c, i) => (sums[i][3] ? [sums[i][0] / sums[i][3], sums[i][1] / sums[i][3], sums[i][2] / sums[i][3]] : c));
  }
  return centers;
}

// Scales colourfulness while keeping brightness (YCbCr chroma).
function saturateRGB(r, g, b, amount) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  return [y + (r - y) * amount, y + (g - y) * amount, y + (b - y) * amount];
}

// Turns a photo into an illustrated version in the browser.
// filterId: one of FILTERS; adjust: slider values that override the filter's defaults.
// Returns a JPEG data URL.
export async function cartoonize(src, filterId = "soft", adjust = {}, maxSize = 440) {
  const f = getFilter(filterId);
  const a = { ...f.defaults, ...adjust };
  const img = await loadImage(src);
  const { canvas, ctx } = toCanvas(img, maxSize);
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  const n = w * h;
  // Smaller previews get proportionally thinner lines and fewer smoothing passes.
  const scale = Math.max(w, h) / 440;

  // Brightness and contrast first, so every later step sees the adjusted photo.
  const R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n);
  const bc = (v) => (v - 128) * a.contrast + 128 + a.brightness * 2;
  for (let i = 0; i < n; i++) { R[i] = bc(px[i * 4]); G[i] = bc(px[i * 4 + 1]); B[i] = bc(px[i * 4 + 2]); }

  const passes = Math.round(a.smooth * Math.min(1, Math.max(0.4, scale)));
  let [sR, sG, sB] = f.kind === "oil" ? kuwahara(R, G, B, w, h, Math.max(2, Math.round((2 + a.smooth) * scale))) : bilateral(R, G, B, w, h, passes);

  // Ink lines: difference of two Gaussians on the smoothed brightness.
  const lum = new Float32Array(n);
  for (let i = 0; i < n; i++) lum[i] = Math.min(1, Math.max(0, (0.299 * sR[i] + 0.587 * sG[i] + 0.114 * sB[i]) / 255));
  const sigma = Math.max(0.55, a.lineWidth * Math.max(0.5, scale));
  const g1 = gaussian(lum, w, h, sigma);
  const g2 = gaussian(lum, w, h, sigma * 1.6);
  const ink = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const d = (g1[i] - 0.985 * g2[i]) * 100;
    ink[i] = d >= 0 ? 0 : Math.min(1, -Math.tanh(1.2 * d) * a.lineStrength);
  }

  const put = (i, r, g, b) => {
    const k = 1 - ink[i];
    px[i * 4] = r * k + 28 * ink[i];
    px[i * 4 + 1] = g * k + 24 * ink[i];
    px[i * 4 + 2] = b * k + 30 * ink[i];
  };
  // Soft brightness steps (Winnemöller toon shading); hard=1 gives crisp poster bands.
  const quantize = (l, levels, hard) => {
    const step = 1 / levels;
    const q = Math.round(l / step) * step;
    return q + (step / 2) * Math.tanh(hard * 12 * (l - q) / step);
  };

  if (f.kind === "sketch" || f.kind === "colorpencil") {
    const inv = new Float32Array(n);
    for (let i = 0; i < n; i++) inv[i] = 1 - lum[i];
    const blurInv = gaussian(inv, w, h, Math.max(3, 8 * scale));
    for (let i = 0; i < n; i++) {
      const dodge = Math.min(1, lum[i] / Math.max(0.02, 1 - blurInv[i]));
      const v = (Math.pow(dodge, 2.6) * 0.65 + lum[i] * 0.35) * (1 - ink[i] * 0.85);
      if (f.kind === "sketch") {
        px[i * 4] = 40 + v * 210; px[i * 4 + 1] = 38 + v * 208; px[i * 4 + 2] = 46 + v * 200;
      } else {
        const [r, g, b] = saturateRGB(sR[i], sG[i], sB[i], a.saturation);
        const t = 0.35 + 0.65 * v;
        px[i * 4] = (r * 0.75 + 64) * t; px[i * 4 + 1] = (g * 0.75 + 64) * t; px[i * 4 + 2] = (b * 0.75 + 60) * t;
      }
    }
  } else if (f.kind === "noir") {
    for (let i = 0; i < n; i++) {
      const v = quantize(lum[i], a.detail, 0.8) * 255;
      put(i, v * 0.96 + 6, v * 0.97 + 4, v + 8);
    }
  } else if (f.kind === "flat") {
    const centers = kmeans(sR, sG, sB, Math.round(a.detail));
    const colors = centers.map((c) => saturateRGB(c[0], c[1], c[2], a.saturation));
    const labels = new Uint8Array(n);
    for (let i = 0; i < n; i++) labels[i] = nearest(centers, sR[i], sG[i], sB[i]);
    // Majority pass removes speckles so areas read as clean vector shapes.
    const counts = new Uint16Array(centers.length);
    const clean = new Uint8Array(labels);
    for (let y = 2; y < h - 2; y++) {
      for (let x = 2; x < w - 2; x++) {
        counts.fill(0);
        let best = labels[y * w + x];
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          const l = labels[(y + dy) * w + x + dx];
          if (++counts[l] > counts[best]) best = l;
        }
        clean[y * w + x] = best;
      }
    }
    for (let i = 0; i < n; i++) put(i, ...colors[clean[i]]);
  } else if (f.kind === "watercolor") {
    const bR = gaussian(sR, w, h, 1.4 * Math.max(0.5, scale)), bG = gaussian(sG, w, h, 1.4 * Math.max(0.5, scale)), bB = gaussian(sB, w, h, 1.4 * Math.max(0.5, scale));
    // Paper grain: fixed pseudo-random noise, lightly blurred.
    const noise = new Float32Array(n);
    for (let i = 0; i < n; i++) { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; noise[i] = s - Math.floor(s) - 0.5; }
    const grain = gaussian(noise, w, h, 1.2);
    for (let i = 0; i < n; i++) {
      const gx = lum[Math.min(n - 1, i + 1)] - lum[Math.max(0, i - 1)];
      const gy = lum[Math.min(n - 1, i + w)] - lum[Math.max(0, i - w)];
      // Pigment pools at colour edges, like real watercolour.
      const edge = Math.min(0.3, Math.sqrt(gx * gx + gy * gy) * 1.6);
      const wash = (v) => (255 - (255 - v) * 0.82) * (1 - edge) * (1 + grain[i] * 0.35);
      const [r, g, b] = saturateRGB(bR[i], bG[i], bB[i], a.saturation);
      put(i, wash(r), wash(g), wash(b));
    }
  } else {
    // toon, halftone and oil: keep the photo's hues, step the brightness.
    const levels = f.kind === "oil" ? 14 : a.detail;
    const hard = f.kind === "oil" ? 0.05 : f.hard;
    const cell = Math.max(4, Math.round(6 * scale));
    for (let i = 0; i < n; i++) {
      let [r, g, b] = saturateRGB(sR[i], sG[i], sB[i], a.saturation);
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      const target = quantize(lum[i], levels, hard) * 255;
      const k = y > 1 ? target / y : 1;
      r = Math.min(255, r * k); g = Math.min(255, g * k); b = Math.min(255, b * k);
      if (f.kind === "halftone") {
        // Comic-book dots in the darker areas, on a 45-degree grid.
        const x = i % w, yy = (i / w) | 0;
        const u = (x + yy) / Math.SQRT2, v = (x - yy) / Math.SQRT2;
        const cu = (Math.floor(u / cell) + 0.5) * cell, cv = (Math.floor(v / cell) + 0.5) * cell;
        const dist = Math.hypot(u - cu, v - cv);
        const radius = cell * 0.62 * Math.sqrt(Math.max(0, 0.85 - lum[i]));
        if (dist < radius) { r *= 0.55; g *= 0.55; b *= 0.6; }
      }
      put(i, r, g, b);
    }
  }

  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function median(values) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}
const hex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

function isSkin(r, g, b) {
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return r > 50 && r > b && cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
}

// Guesses skin and hair colour from a portrait. Assumes the face is roughly centred,
// which is how resume photos are usually framed. Returns only the colours it found.
export async function readColors(src) {
  const img = await loadImage(src);
  const { canvas, ctx } = toCanvas(img, 120);
  const { width: w, height: h } = canvas;
  const px = ctx.getImageData(0, 0, w, h).data;
  const region = (x0, x1, y0, y1, test) => {
    const r = [], g = [], b = [];
    for (let y = Math.floor(y0 * h); y < y1 * h; y++) {
      for (let x = Math.floor(x0 * w); x < x1 * w; x++) {
        const i = (y * w + x) * 4;
        if (test(px[i], px[i + 1], px[i + 2])) { r.push(px[i]); g.push(px[i + 1]); b.push(px[i + 2]); }
      }
    }
    return r.length >= 12 ? [median(r), median(g), median(b)] : null;
  };

  const skin = region(0.3, 0.7, 0.3, 0.65, isSkin);
  const skinLum = skin ? 0.299 * skin[0] + 0.587 * skin[1] + 0.114 * skin[2] : 170;
  // Hair: pixels in the top of the frame that are clearly darker (or lighter and warm, for blond) than the skin.
  const hair = region(0.2, 0.8, 0.04, 0.32, (r, g, b) => {
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    // Dark brown hair has the same hue as skin, so darkness relative to the face decides.
    return l < skinLum - 45 || (!isSkin(r, g, b) && l > skinLum + 25 && l < 225 && r - b > 30);
  });
  const result = {};
  if (skin) result.skin = hex(skin);
  if (hair) result.hair = hex(hair);
  return result;
}
