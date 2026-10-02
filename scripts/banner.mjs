// Generates assets/banner-{light,dark}.svg, the profile README banner.
//
//   node scripts/banner.mjs
//
// The chrome J is embedded as a data URI (logo-112.webp, from the
// portfolio's public/logo.png) so the SVG needs no second request. Text
// uses system fonts: an SVG shown through <img> cannot load web fonts.
import { readFileSync, writeFileSync } from "node:fs";

const logo = readFileSync(new URL("./logo-112.webp", import.meta.url)).toString("base64");
const out = new URL("../assets", import.meta.url).pathname;

// Palettes mirror the jordanbuilds.io shader scenes (AmbientShaderScene.tsx)
// and theme tokens (style.css) as of 2026-10-02: light is the orange sunset
// with navy accent #002f72, dark is warm graphite with accent #2997ff.
const themes = {
  light: {
    bg: "#f4764b",
    blobs: ["#ff9f2e", "#ff3b14", "#ffb38a", "#ff6a2a"],
    blobOpacity: 0.85,
    glass: "#ffffff", glassOpacity: 0.3, rim: "#ffffff", rimOpacity: 0.6,
    text: "#1d1d1f", sub: "#333336", muted: "#3d2f2a", accent: "#002f72",
    tile: "#ffffff", tileOpacity: 0.35,
  },
  dark: {
    bg: "#0a0908",
    blobs: ["#2a1f1a", "#4a362c", "#3a2a22", "#1a1411"],
    blobOpacity: 0.9,
    glass: "#ffffff", glassOpacity: 0.05, rim: "#ffffff", rimOpacity: 0.14,
    text: "#f5f5f7", sub: "#d2d2d7", muted: "#98989d", accent: "#2997ff",
    tile: "#ffffff", tileOpacity: 0.07,
  },
};

const font = `Inter, 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

function svg(t) {
  const [b1, b2, b3, b4] = t.blobs;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="320" viewBox="0 0 1280 320" role="img" aria-labelledby="title desc">
  <title id="title">Jordan Ayala, Forward Deployed AI Engineer</title>
  <desc id="desc">Banner with a chrome J monogram on a frosted glass card over a soft gradient.</desc>
  <defs>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
    <clipPath id="frame"><rect width="1280" height="320" rx="28"/></clipPath>
    <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.rim}" stop-opacity="${t.rimOpacity}"/>
      <stop offset="1" stop-color="${t.rim}" stop-opacity="${t.rimOpacity * 0.25}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="${t.glassOpacity * 1.4}"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="${t.glassOpacity * 0.6}"/>
    </linearGradient>
  </defs>
  <style>
    .drift-a { animation: a 18s ease-in-out infinite alternate; }
    .drift-b { animation: b 22s ease-in-out infinite alternate; }
    .drift-c { animation: c 26s ease-in-out infinite alternate; }
    @keyframes a { to { transform: translate(140px, 40px); } }
    @keyframes b { to { transform: translate(-160px, -30px); } }
    @keyframes c { to { transform: translate(90px, -50px); } }
    @media (prefers-reduced-motion: reduce) { .drift-a, .drift-b, .drift-c { animation: none; } }
  </style>
  <g clip-path="url(#frame)">
    <rect width="1280" height="320" fill="${t.bg}"/>
    <g filter="url(#blur)" opacity="${t.blobOpacity}">
      <circle class="drift-a" cx="980" cy="60" r="190" fill="${b1}"/>
      <circle class="drift-b" cx="1180" cy="280" r="170" fill="${b3}"/>
      <circle class="drift-c" cx="260" cy="300" r="200" fill="${b2}"/>
      <circle class="drift-a" cx="620" cy="-20" r="150" fill="${b4}"/>
    </g>

    <!-- glass card -->
    <rect x="48" y="44" width="1184" height="232" rx="24" fill="url(#sheen)"/>
    <rect x="48.5" y="44.5" width="1183" height="231" rx="23.5" fill="none" stroke="url(#rim)"/>

    <!-- monogram tile -->
    <rect x="88" y="84" width="152" height="152" rx="32" fill="${t.tile}" fill-opacity="${t.tileOpacity}"/>
    <rect x="88.5" y="84.5" width="151" height="151" rx="31.5" fill="none" stroke="url(#rim)"/>
    <image x="108" y="104" width="112" height="112" href="data:image/webp;base64,${logo}"/>

    <g font-family="${font}">
      <text x="280" y="116" font-size="15" font-weight="600" letter-spacing="2.4" fill="${t.muted}">HELLO, I'M</text>
      <text x="277" y="172" font-size="58" font-weight="700" letter-spacing="-1.2" fill="${t.text}">Jordan Ayala</text>
      <text x="280" y="212" font-size="24" font-weight="600" fill="${t.accent}">Forward Deployed AI Engineer</text>
      <text x="280" y="246" font-size="21" font-weight="400" fill="${t.sub}">I build agentic systems and ship them to production.</text>
      <text x="1192" y="116" text-anchor="end" font-size="15" font-weight="600" letter-spacing="0.4" fill="${t.muted}">jordanbuilds.io ↗</text>
    </g>
  </g>
</svg>
`;
}

for (const [name, t] of Object.entries(themes)) {
  writeFileSync(`${out}/banner-${name}.svg`, svg(t));
}
