export const SITE_STYLES = `
:root {
  color-scheme: dark;
  --radius: 14px;
  --mono: "Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace;
  --sans: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--sans);
  background:
    radial-gradient(900px 480px at 0% -5%, var(--accent-glow), transparent 60%),
    radial-gradient(700px 400px at 100% 0%, var(--accent-glow-2), transparent 55%),
    var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
  transition: background 0.25s ease, color 0.25s ease;
}
a { color: var(--accent); text-decoration: none; transition: color 0.15s ease; }
a:hover { color: var(--accent-2); }
.container { max-width: 1180px; margin: 0 auto; padding: 36px 20px 88px; }
.topbar {
  position: sticky; top: 0; z-index: 30;
  backdrop-filter: blur(14px); background: var(--topbar-bg);
  border-bottom: 1px solid var(--border);
  transition: background 0.25s ease, border-color 0.25s ease;
}
.topbar-inner {
  max-width: 1180px; margin: 0 auto; padding: 14px 20px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 20px; flex-wrap: nowrap;
}
.topbar-actions {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: nowrap;
}
.brand {
  display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit;
}
.brand:hover { color: inherit; text-decoration: none; }
.brand img {
  width: 44px; height: 44px; border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow);
}
.brand-text { display: flex; flex-direction: column; gap: 2px; }
.brand-text strong { font-size: 1.12rem; letter-spacing: 0.01em; }
.brand-text span { color: var(--muted); font-size: 0.84rem; }
.nav { display: flex; flex-wrap: nowrap; gap: 6px; align-items: center; }
.nav a, .nav .nav-cta {
  padding: 7px 12px; border-radius: 999px; border: 1px solid transparent;
  background: transparent; color: var(--muted); font-size: 0.86rem; font-weight: 500;
}
.nav a:hover { color: var(--text); background: var(--surface-2); text-decoration: none; }
.nav a.active {
  border-color: var(--accent); color: var(--accent);
  background: var(--accent-soft);
}
.nav .nav-cta {
  border-color: var(--accent);
  background: linear-gradient(135deg, var(--accent-soft), var(--surface-2));
  color: var(--text);
}
.nav .nav-cta:hover { color: var(--accent); text-decoration: none; }
.theme-switcher { position: relative; flex-shrink: 0; }
.theme-switcher-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 12px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--surface-2);
  color: var(--text); font: inherit; font-size: 0.86rem; font-weight: 600;
  cursor: pointer; white-space: nowrap;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}
.theme-switcher-btn:hover,
.theme-switcher-btn[aria-expanded="true"] {
  border-color: var(--accent); background: var(--accent-soft); color: var(--accent);
}
.theme-switcher-btn:focus-visible {
  outline: 2px solid var(--accent-soft); outline-offset: 2px;
}
.theme-swatch {
  width: 12px; height: 12px; border-radius: 999px;
  background: var(--accent); border: 1px solid var(--border); flex-shrink: 0;
}
.theme-switcher-text { max-width: 132px; overflow: hidden; text-overflow: ellipsis; }
.theme-chevron { color: var(--muted); font-size: 0.72rem; line-height: 1; }
.theme-switcher-list {
  position: absolute; top: calc(100% + 8px); right: 0; z-index: 50;
  min-width: 240px; max-height: min(360px, 60vh); overflow-y: auto;
  margin: 0; padding: 6px; list-style: none;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); box-shadow: var(--shadow);
}
.theme-switcher-list.open { display: block; }
.theme-switcher-option {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border: none; border-radius: 8px;
  background: transparent; color: var(--text);
  font: inherit; font-size: 0.86rem; text-align: left; cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.theme-switcher-option:hover,
.theme-switcher-option[aria-selected="true"] {
  background: var(--accent-soft); color: var(--accent);
}
.theme-switcher-option .theme-swatch { width: 14px; height: 14px; }
.subnav {
  border-bottom: 1px solid var(--border);
  background: var(--topbar-bg);
  margin-bottom: 24px;
}
.subnav-inner {
  max-width: 1180px; margin: 0 auto; padding: 10px 20px;
  display: flex; flex-wrap: wrap; gap: 8px;
}
.subnav a {
  padding: 5px 11px; border-radius: 999px; font-size: 0.82rem; color: var(--muted);
  border: 1px solid transparent;
}
.subnav a:hover { color: var(--text); background: var(--surface-2); text-decoration: none; }
.subnav a.active {
  color: var(--accent); border-color: var(--accent); background: var(--accent-soft);
}
.landing-grid {
  display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 22px; margin-bottom: 36px; align-items: stretch;
}
.landing-hero {
  position: relative; overflow: hidden;
  background: linear-gradient(145deg, var(--accent-glow), var(--surface));
  border: 1px solid var(--border); border-radius: calc(var(--radius) + 4px);
  padding: clamp(32px, 6vw, 56px) clamp(24px, 5vw, 48px);
  box-shadow: var(--shadow);
  transition: background 0.25s ease, border-color 0.25s ease;
}
.landing-hero::before {
  content: ""; position: absolute; inset: -40% -20% auto auto; width: 420px; height: 420px;
  background: radial-gradient(circle, var(--accent-glow-2), transparent 70%);
  pointer-events: none;
}
.landing-hero h1 {
  margin: 0 0 14px; font-size: clamp(2rem, 5vw, 3rem); line-height: 1.08;
  letter-spacing: -0.03em; max-width: 14ch;
}
.landing-hero .lead {
  margin: 0; color: var(--muted); font-size: clamp(1rem, 2.2vw, 1.15rem); max-width: 58ch;
}
.hero-eyebrow {
  display: inline-block; margin-bottom: 12px; padding: 4px 10px; border-radius: 999px;
  background: var(--accent-soft); border: 1px solid var(--accent);
  color: var(--accent); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase;
}
.page-header {
  margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border);
}
.page-header h1 {
  margin: 0 0 8px; font-size: clamp(1.6rem, 3.5vw, 2.1rem); letter-spacing: -0.02em;
}
.page-header p { margin: 0; color: var(--muted); max-width: 62ch; }
.cta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
.cta {
  display: inline-flex; align-items: center; gap: 6px; padding: 11px 16px;
  border-radius: 10px; font-size: 0.9rem; font-weight: 600; border: 1px solid var(--border);
  background: var(--surface-2); color: var(--text);
}
.cta:hover { border-color: var(--accent); color: var(--accent); text-decoration: none; }
.cta-primary {
  background: linear-gradient(135deg, var(--accent-soft), var(--surface-2));
  border-color: var(--accent);
}
.stats { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.stat {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px;
  padding: 12px 16px; min-width: 120px;
}
.stat strong { display: block; font-size: 1.35rem; font-weight: 700; }
.stat span { color: var(--muted); font-size: 0.82rem; }
.feature-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;
  margin-bottom: 40px;
}
.feature-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 24px; box-shadow: var(--shadow);
  transition: background 0.2s ease, border-color 0.2s ease;
}
.feature-card h2 { margin: 0 0 8px; font-size: 1.15rem; }
.feature-card p { margin: 0 0 16px; color: var(--muted); font-size: 0.92rem; }
.feature-card a.link {
  font-weight: 600; font-size: 0.9rem;
}
.theme-strip {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px;
}
.theme-strip .theme-card { padding: 0; }
.theme-gallery {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px;
}
.theme-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.15s ease, background 0.2s ease;
}
.theme-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.theme-preview {
  display: block; width: 100%; padding: 0; border: none; background: var(--code-bg);
  cursor: zoom-in; line-height: 0;
}
.theme-preview img {
  width: 100%; height: auto; display: block;
}
.theme-card-body { padding: 14px 16px 16px; }
.theme-card-body h3 { margin: 0 0 4px; font-size: 1rem; }
.theme-card-body p { margin: 0 0 12px; color: var(--muted); font-size: 0.86rem; }
.theme-card-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.theme-card-actions .button,
.theme-card-actions .try-theme {
  display: inline-block; padding: 7px 11px; border-radius: 8px; font-weight: 600; font-size: 0.82rem;
  background: var(--accent-soft); border: 1px solid var(--border); color: var(--accent);
  cursor: pointer; font-family: var(--sans);
}
.theme-card-actions .try-theme:hover { border-color: var(--accent); color: var(--accent-2); }
.syntax-preview {
  border: 1px solid var(--border); border-radius: calc(var(--radius) + 2px);
  overflow: hidden; box-shadow: var(--shadow); background: var(--surface);
}
.syntax-preview-chrome {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: var(--surface-2); border-bottom: 1px solid var(--border);
}
.syntax-preview-chrome .dot {
  width: 10px; height: 10px; border-radius: 999px; display: inline-block;
}
.syntax-preview-chrome .dot-red { background: var(--syn-variable); }
.syntax-preview-chrome .dot-yellow { background: var(--syn-number); }
.syntax-preview-chrome .dot-green { background: var(--syn-string); }
.syntax-preview-file {
  margin-left: 8px; color: var(--muted); font-size: 0.8rem; font-family: var(--mono);
}
.syntax-preview-code {
  margin: 0; padding: 16px 18px; overflow-x: auto; background: var(--code-bg);
  font-family: var(--mono); font-size: 0.82rem; line-height: 1.55;
}
.syn-keyword { color: var(--syn-keyword); }
.syn-string { color: var(--syn-string); }
.syn-function { color: var(--syn-function); }
.syn-type { color: var(--syn-type); }
.syn-variable { color: var(--syn-variable); }
.syn-number { color: var(--syn-number); }
.syn-comment { color: var(--syn-comment); }
.syn-default { color: var(--syn-default); }
.syn-cyan { color: var(--syn-cyan); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 20px; box-shadow: var(--shadow);
  transition: border-color 0.2s ease, transform 0.15s ease, background 0.2s ease;
}
.card:hover { border-color: var(--accent); transform: translateY(-2px); }
.card h2 { margin: 0 0 6px; font-size: 1.08rem; }
.card p { margin: 0 0 16px; color: var(--muted); font-size: 0.9rem; }
.card a.button {
  display: inline-block; padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 0.88rem;
  background: var(--accent-soft); border: 1px solid var(--accent); color: var(--accent);
}
.card a.button:hover { text-decoration: none; color: var(--accent-2); }
.search-wrap { position: relative; margin-bottom: 20px; }
.search {
  width: 100%; padding: 14px 16px 14px 42px; border-radius: var(--radius);
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
  font-size: 1rem; font-family: var(--sans);
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.search:focus { outline: 2px solid var(--accent-soft); outline-offset: 2px; border-color: var(--accent); }
.search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--muted); pointer-events: none; font-size: 1rem;
}
.section { margin-top: 40px; }
.section h2 { margin: 0 0 16px; font-size: 1.3rem; letter-spacing: -0.01em; }
.section-head {
  display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.section-head h2 { margin: 0; }
.grammar-list {
  display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px;
}
.grammar-pill {
  padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border);
  background: var(--surface-2); color: var(--muted); font-size: 0.84rem;
}
.category { margin-top: 32px; }
.category h3 {
  margin: 0 0 14px; font-size: 1.02rem; color: var(--accent); font-weight: 600;
  padding-bottom: 10px; border-bottom: 1px solid var(--border);
}
.snippet-list { display: grid; gap: 14px; }
.snippet {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  overflow: hidden; transition: border-color 0.15s ease;
}
.snippet:hover { border-color: var(--accent); }
.snippet-head {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--surface-2);
}
.snippet-head h4 { margin: 0; font-size: 0.98rem; font-weight: 600; flex: 1 1 220px; }
.snippet-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.snippet-meta .tag {
  border: 1px solid var(--border); border-radius: 999px; padding: 3px 9px;
  background: var(--surface-3); color: var(--muted); font-size: 0.78rem;
}
.prefix-pill {
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  border: 1px solid var(--accent); border-radius: 999px; padding: 4px 10px;
  background: var(--accent-soft); color: var(--accent); font-size: 0.8rem; font-weight: 600;
  font-family: var(--sans);
}
.prefix-pill:hover { border-color: var(--accent); }
.prefix-pill.copied { border-color: var(--success); color: var(--success); background: var(--accent-soft); }
pre {
  margin: 0; padding: 16px 18px; overflow-x: auto; background: var(--code-bg);
  font-family: var(--mono); font-size: 0.84rem; line-height: 1.55; color: var(--syn-default);
}
.table-wrap {
  overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--surface);
}
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { padding: 11px 14px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
th {
  background: var(--surface-2); color: var(--muted); font-weight: 600; font-size: 0.8rem;
  text-transform: uppercase; letter-spacing: 0.04em;
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: var(--hover-row); }
.footer {
  margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--border);
  color: var(--muted); font-size: 0.88rem;
}
.footer-links { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 10px; }
.empty-state { color: var(--muted); padding: 8px 0 16px; }
.hidden { display: none !important; }
.lightbox {
  position: fixed; inset: 0; z-index: 100; display: none; place-items: center;
  padding: 24px; background: var(--overlay-bg); backdrop-filter: blur(8px);
}
.lightbox.open { display: grid; }
.lightbox-dialog {
  width: min(100%, 720px); background: var(--surface); border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 2px); overflow: hidden; box-shadow: var(--shadow);
}
.lightbox-dialog img { width: 100%; height: auto; display: block; }
.lightbox-caption {
  padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; gap: 12px;
}
.lightbox-caption strong { font-size: 1rem; }
.lightbox-caption span { color: var(--muted); font-size: 0.88rem; }
.lightbox-close {
  position: absolute; top: 18px; right: 18px; width: 40px; height: 40px;
  border-radius: 999px; border: 1px solid var(--border); background: var(--surface);
  color: var(--text); font-size: 1.4rem; cursor: pointer; line-height: 1;
}
.snippet-prefix, .prefix-pill code, .page-header code {
  font-family: var(--mono); background: var(--code-bg); border: 1px solid var(--border);
  border-radius: 6px; padding: 2px 7px; color: var(--pill-code); font-size: 0.88em;
}
pre code { color: var(--syn-default); }
@media (max-width: 960px) {
  .landing-grid { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .brand-text span { display: none; }
  .theme-switcher-text { max-width: 96px; }
}
@media (max-width: 720px) {
  .topbar-inner { padding: 12px 16px; gap: 12px; }
  .container { padding: 28px 16px 72px; }
  .landing-hero { padding: 28px 20px; }
  .theme-gallery { grid-template-columns: 1fr; }
  .nav a { padding: 6px 10px; font-size: 0.82rem; }
  .theme-switcher-list { right: -8px; min-width: 210px; }
}
`;

export const SITE_SCRIPT = `
function filterSearchables(query, selector) {
  const q = query.trim().toLowerCase();
  const rows = document.querySelectorAll(selector || "[data-search]");
  let visible = 0;
  for (const row of rows) {
    const haystack = row.getAttribute("data-search") || "";
    const show = !q || haystack.includes(q);
    row.classList.toggle("hidden", !show);
    if (show) visible += 1;
  }
  const empty = document.getElementById("search-empty");
  if (empty) empty.classList.toggle("hidden", visible > 0 || !q);
}

async function copyPrefix(button) {
  const prefix = button.getAttribute("data-prefix");
  if (!prefix) return;
  try {
    await navigator.clipboard.writeText(prefix);
    button.classList.add("copied");
    const label = button.querySelector("[data-copy-label]");
    if (label) label.textContent = "Copied!";
    setTimeout(() => {
      button.classList.remove("copied");
      if (label) label.textContent = "Copy";
    }, 1400);
  } catch { /* clipboard unavailable */ }
}

function getThemeOption(themeId) {
  return document.querySelector('.theme-switcher-option[data-theme-id="' + themeId + '"]');
}

function updateThemeSwitcherUi(themeId) {
  const option = getThemeOption(themeId);
  const label = document.getElementById("theme-switcher-label");
  const swatch = document.getElementById("theme-switcher-swatch");
  if (option && label) {
    label.textContent = option.getAttribute("data-theme-label") || themeId;
  }
  if (option && swatch) {
    swatch.style.background = option.getAttribute("data-theme-accent") || "";
  }
  document.querySelectorAll(".theme-switcher-option").forEach((button) => {
    button.setAttribute(
      "aria-selected",
      button.getAttribute("data-theme-id") === themeId ? "true" : "false",
    );
  });
  const themeColor = option?.getAttribute("data-theme-color");
  if (themeColor) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", themeColor);
  }
}

function applySiteTheme(themeId) {
  if (!themeId) return;
  if (typeof window.__paintEtherTheme === "function") {
    window.__paintEtherTheme(themeId);
  } else {
    const theme = window.ETHER_SITE_THEMES?.[themeId];
    if (theme) {
      const root = document.documentElement;
      root.setAttribute("data-ether-theme", themeId);
      for (const [key, value] of Object.entries(theme.vars)) {
        root.style.setProperty(key, value);
      }
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta && theme.color) meta.setAttribute("content", theme.color);
    }
  }
  try {
    localStorage.setItem("ether-site-theme", themeId);
  } catch { /* storage unavailable */ }
  updateThemeSwitcherUi(themeId);
  const legacySelect = document.getElementById("site-theme-select");
  if (legacySelect && legacySelect.value !== themeId) legacySelect.value = themeId;
}

function closeThemeSwitcher() {
  const list = document.getElementById("theme-switcher-list");
  const button = document.getElementById("theme-switcher-btn");
  if (!list || !button) return;
  list.classList.remove("open");
  list.classList.add("hidden");
  button.setAttribute("aria-expanded", "false");
}

function initSiteTheme() {
  const list = document.getElementById("theme-switcher-list");
  const button = document.getElementById("theme-switcher-btn");
  const legacySelect = document.getElementById("site-theme-select");

  let saved = "";
  try {
    saved = localStorage.getItem("ether-site-theme") || "";
  } catch { /* storage unavailable */ }

  const defaultId =
    saved ||
    document.querySelector('.theme-switcher-option[aria-selected="true"]')?.getAttribute("data-theme-id") ||
    legacySelect?.value ||
    "ether-dusk";

  if (!list || !button) {
    if (legacySelect) {
      applySiteTheme(defaultId);
      legacySelect.addEventListener("change", () => applySiteTheme(legacySelect.value));
    }
    return;
  }

  applySiteTheme(defaultId);

  button.addEventListener("click", () => {
    const isOpen = list.classList.contains("open");
    if (isOpen) {
      closeThemeSwitcher();
      return;
    }
    list.classList.remove("hidden");
    list.classList.add("open");
    button.setAttribute("aria-expanded", "true");
  });

  list.querySelectorAll(".theme-switcher-option").forEach((option) => {
    option.addEventListener("click", () => {
      applySiteTheme(option.getAttribute("data-theme-id"));
      closeThemeSwitcher();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest("#theme-switcher")) closeThemeSwitcher();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeThemeSwitcher();
  });

  document.querySelectorAll("[data-apply-theme]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      applySiteTheme(trigger.getAttribute("data-apply-theme"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById("theme-lightbox");
  if (!lightbox) return;
  const img = lightbox.querySelector("img");
  const title = lightbox.querySelector("[data-lightbox-title]");
  const character = lightbox.querySelector("[data-lightbox-character]");
  const close = lightbox.querySelector(".lightbox-close");

  function openFrom(button) {
    const src = button.getAttribute("data-preview-src");
    const label = button.getAttribute("data-preview-label") || "";
    const desc = button.getAttribute("data-preview-desc") || "";
    if (!src || !img) return;
    img.src = src;
    img.alt = label + " theme preview";
    if (title) title.textContent = label;
    if (character) character.textContent = desc;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeBox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-theme-preview]").forEach((button) => {
    button.addEventListener("click", () => openFrom(button));
  });
  close?.addEventListener("click", closeBox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeBox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeBox();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const snippetSearch = document.getElementById("snippet-search");
  if (snippetSearch) {
    snippetSearch.addEventListener("input", () => filterSearchables(snippetSearch.value));
  }
  const themeSearch = document.getElementById("theme-search");
  if (themeSearch) {
    themeSearch.addEventListener("input", () => filterSearchables(themeSearch.value));
  }
  document.querySelectorAll("[data-copy-prefix]").forEach((button) => {
    button.addEventListener("click", () => copyPrefix(button));
  });
  initSiteTheme();
  initLightbox();
});
`;
