/** @typedef {{ title: string, description: string, path: string, ogImage?: string }} PageSeo */

export const SITE_URL = "https://PRIYAANK2510.github.io/ether-theme/";
export const SITE_BASE = "/ether-theme";
export const SITE_NAME = "Ether Themes";
export const SITE_AUTHOR = "Priyaank";
export const DEFAULT_OG_IMAGE = `${SITE_BASE}/assets/og-image.png`;
export const VS_MARKETPLACE =
  "https://marketplace.visualstudio.com/items?itemName=Priyaank.ether-theme";
export const GITHUB_REPO = "https://github.com/PRIYAANK2510/ether-theme";

/** @type {PageSeo} */
export const HOME_SEO = {
  path: "/",
  title: "Ether Themes — Dark Themes & Snippets for VS Code and Cursor",
  description:
    "Install Ether Themes: 25 WCAG-validated dark color themes, 496 React/Next.js/TypeScript snippets, and bundled Astro, Vue, Svelte, MDX, Angular, Kotlin, AIDL, ProGuard & Dotenv syntax highlighting for VS Code and Cursor.",
};

/** @type {PageSeo} */
export const THEMES_SEO = {
  path: "/themes/",
  title: "Ether Themes Gallery — 25 Dark Color Themes",
  description:
    "Browse all 25 Ether dark themes with live previews. WCAG-validated palettes from Graphite and Storm to Abyss and Magma — install one extension for VS Code and Cursor.",
};

/** @type {PageSeo} */
export const SNIPPETS_SEO = {
  path: "/snippets/",
  title: "Ether Snippets — 496 VS Code & Cursor Prefixes",
  description:
    "Search 496 production-ready snippets for React 19, Next.js App Router, TypeScript, TanStack Query, Zod, Vitest, HTML, and CSS. Type a prefix, press Tab.",
};

/**
 * @param {string} label
 * @param {string} slug
 * @param {number} count
 * @param {string} extensions
 * @returns {PageSeo}
 */
export function snippetLanguageSeo(label, slug, count, extensions) {
  return {
    path: `/snippets/${slug}/`,
    title: `${label} Snippets · Ether Themes — ${count} Prefixes`,
    description: `${count} ${label} snippets (${extensions}) for VS Code and Cursor — React, Next.js, testing, validation, and modern web patterns with Ether Themes.`,
  };
}

/**
 * @param {string} path
 * @returns {string}
 */
export function canonicalUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withBase =
    normalized === "/"
      ? SITE_URL
      : `${SITE_URL.replace(/\/$/, "")}${normalized.replace(/\/$/, "")}/`;
  return withBase;
}

/**
 * @param {Array<{ slug: string, label: string, count: number, extensions: string }>} languages
 * @param {{ paletteCount?: number, catalogCount?: number }} [counts]
 * @returns {PageSeo[]}
 */
export function allPageSeo(languages, counts = {}) {
  const paletteCount = counts.paletteCount ?? 25;
  const catalogCount = counts.catalogCount ?? 496;

  return [
    {
      ...HOME_SEO,
      description: HOME_SEO.description
        .replace("25 WCAG", `${paletteCount} WCAG`)
        .replace("496 React", `${catalogCount} React`),
    },
    {
      ...THEMES_SEO,
      title: `Ether Themes Gallery — ${paletteCount} Dark Color Themes`,
      description: THEMES_SEO.description.replace(
        "25 Ether",
        `${paletteCount} Ether`,
      ),
    },
    {
      ...SNIPPETS_SEO,
      title: `Ether Snippets — ${catalogCount} VS Code & Cursor Prefixes`,
      description: SNIPPETS_SEO.description.replace(
        "496 production",
        `${catalogCount} production`,
      ),
    },
    ...languages.map((language) =>
      snippetLanguageSeo(
        language.label,
        language.slug,
        language.count,
        language.extensions,
      ),
    ),
  ];
}

/**
 * @param {PageSeo} seo
 * @returns {string}
 */
export function jsonLdWebSite(seo) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: seo.description,
    publisher: {
      "@type": "Person",
      name: SITE_AUTHOR,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL.replace(/\/$/, "")}/snippets/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

/**
 * @param {PageSeo} seo
 * @param {string} [version]
 * @returns {string}
 */
export function jsonLdSoftwareApplication(seo, version = "1.0.0") {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    description: seo.description,
    url: SITE_URL,
    downloadUrl: VS_MARKETPLACE,
    softwareVersion: version,
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  });
}
