// Simple original SVG illustrations (made by the team – no copyright issues).
// Each one is a flat mountain scene; real photos can replace them later (with permission + credit).

const scenes = {
  summer:  { sky: "#cfe8f7", far: "#8fb4c9", near: "#5d8a6b", ground: "#88b07a", sun: "#f6d77a", snow: false, extra: "lake" },
  winter:  { sky: "#dde8f2", far: "#9fb3c6", near: "#6f879c", ground: "#f4f7fa", sun: "#ffffff", snow: true, extra: "lift" },
  bike:    { sky: "#d8ecf5", far: "#97b7c4", near: "#6c8f64", ground: "#a5c08a", sun: "#f6d77a", snow: false, extra: "trail" },
  lake:    { sky: "#cde4f3", far: "#86a9bf", near: "#567e6a", ground: "#7da77a", sun: "#f9e29a", snow: true, extra: "lake" },
  ski:     { sky: "#e3edf6", far: "#a9bccd", near: "#7c93a7", ground: "#f7f9fb", sun: "#ffffff", snow: true, extra: "slope" },
  park:    { sky: "#e6eef5", far: "#aec0cf", near: "#8399ab", ground: "#f5f8fa", sun: "#ffffff", snow: true, extra: "ramp" },
  school:  { sky: "#e1ecf5", far: "#a3b8c9", near: "#7890a4", ground: "#f6f8fb", sun: "#fff4c2", snow: true, extra: "flags" },
  food:    { sky: "#f4e7d6", far: "#d9bf9c", near: "#b48c62", ground: "#efe0cc", sun: "#fff2cf", snow: false, extra: "plate" },
  cheese:  { sky: "#f6ecd9", far: "#e0c99f", near: "#c4a06a", ground: "#f3e6cf", sun: "#fff5d6", snow: false, extra: "cheese" },
  plate:   { sky: "#f2e4dc", far: "#d4b3a2", near: "#a97f6a", ground: "#efded3", sun: "#fff0e0", snow: false, extra: "plate" },
  village: { sky: "#d6e6f2", far: "#94b0c4", near: "#6a8aa0", ground: "#b9cdb0", sun: "#f6d77a", snow: true, extra: "houses" },
};

function extra(kind) {
  switch (kind) {
    case "lake": return `<path d="M120 300 Q400 270 680 300 Q400 330 120 300Z" fill="#7fb6d6" opacity=".9"/>`;
    case "lift": return `<path d="M60 120 L740 60" stroke="#55606a" stroke-width="3"/><rect x="300" y="88" width="34" height="26" rx="4" fill="#d2564a"/><rect x="520" y="70" width="34" height="26" rx="4" fill="#d2564a"/>`;
    case "trail": return `<path d="M380 380 C420 320 300 300 360 250 S470 200 430 160" fill="none" stroke="#e9dcc0" stroke-width="10" stroke-linecap="round"/>`;
    case "slope": return `<path d="M520 160 C470 230 440 280 330 380" fill="none" stroke="#c6d3de" stroke-width="6" stroke-dasharray="14 10"/>`;
    case "ramp": return `<path d="M300 380 L420 300 L470 300 L470 380Z" fill="#dfe7ee" stroke="#9aaebd" stroke-width="3"/>`;
    case "flags": return `<g fill="#d2564a"><path d="M330 300v-40l22 10-22 10"/><path d="M420 330v-40l22 10-22 10"/><path d="M510 300v-40l22 10-22 10"/></g><g stroke="#55606a" stroke-width="3"><path d="M330 300v40"/><path d="M420 330v40"/><path d="M510 300v40"/></g>`;
    case "plate": return `<ellipse cx="400" cy="330" rx="170" ry="40" fill="#ffffff" stroke="#c9b18f" stroke-width="4"/><ellipse cx="400" cy="320" rx="110" ry="22" fill="#9c7a4c"/><g fill="#5f8b4e"><circle cx="360" cy="312" r="8"/><circle cx="420" cy="316" r="7"/><circle cx="450" cy="310" r="6"/></g>`;
    case "cheese": return `<path d="M300 350 L520 350 L520 300 L300 330Z" fill="#f5d27a" stroke="#c99c3c" stroke-width="4"/><circle cx="380" cy="335" r="7" fill="#e2b75a"/><circle cx="460" cy="325" r="9" fill="#e2b75a"/>`;
    case "houses": return `<g fill="#f2ede4" stroke="#6b5b4b" stroke-width="2"><rect x="260" y="300" width="60" height="50"/><rect x="350" y="290" width="70" height="60"/><rect x="450" y="305" width="55" height="45"/></g><g fill="#8a4b3a"><path d="M250 300 L290 270 L330 300Z"/><path d="M340 290 L385 255 L430 290Z"/><path d="M440 305 L478 278 L515 305Z"/></g>`;
    default: return "";
  }
}

export function illustration(name) {
  const s = scenes[name];
  const snowcaps = s.snow
    ? `<path d="M230 150 L262 178 L245 176 L230 190 L214 176 L198 180Z M560 110 L600 150 L580 146 L562 160 L545 146 L522 152Z" fill="#ffffff"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img">
<rect width="800" height="450" fill="${s.sky}"/>
<circle cx="660" cy="90" r="38" fill="${s.sun}"/>
<path d="M0 300 L230 150 L380 250 L560 110 L800 280 L800 450 L0 450Z" fill="${s.far}"/>
${snowcaps}
<path d="M0 340 L150 250 L300 320 L470 220 L650 320 L800 260 L800 450 L0 450Z" fill="${s.near}"/>
<path d="M0 380 Q400 340 800 380 L800 450 L0 450Z" fill="${s.ground}"/>
${extra(s.extra)}
</svg>`;
}

export const names = Object.keys(scenes);

export const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#2f5f7d"/><path d="M6 36 L18 18 L25 27 L31 20 L42 36Z" fill="#ffffff"/><path d="M18 18 L22 24 L20 24 L18 22 L16 24 L14 24Z M31 20 L34 25 L32 24.5 L31 23.5 L29.8 24.5 L28.5 24Z" fill="#c8e6ff"/></svg>`;
