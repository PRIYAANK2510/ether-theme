import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { escapeHtml } from "../../../shared/html.js";
import {
  HOME_SEO,
  SITE_URL,
  allPageSeo,
  canonicalUrl,
  jsonLdSoftwareApplication,
  jsonLdWebSite,
} from "../../../shared/site-seo.js";

/**
 * @param {string} html
 */
function stripSeoTags(html) {
  return html
    .replace(/<meta name="description"[^>]*>\s*/g, "")
    .replace(/<meta name="author"[^>]*>\s*/g, "")
    .replace(/<link rel="canonical"[^>]*>\s*/g, "")
    .replace(/<meta property="og:[^"]+"[^>]*>\s*/g, "")
    .replace(/<meta name="twitter:[^"]+"[^>]*>\s*/g, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "");
}

/**
 * @param {string} html
 * @param {{ title: string, description: string, path: string }} seo
 * @param {string} version
 * @param {string} assetPrefix
 */
function renderHead(html, seo, version, assetPrefix = "/ether-theme") {
  const cleaned = stripSeoTags(html);
  const canonical = canonicalUrl(seo.path);
  const ogImage = `${canonicalUrl("/").replace(/\/$/, "")}${assetPrefix}/assets/og-image.png`;
  const webSiteLd = jsonLdWebSite(seo);
  const appLd = jsonLdSoftwareApplication(seo, version);

  const metaBlock = `
    <meta name="description" content="${escapeAttr(seo.description)}" />
    <meta name="author" content="Priyaank" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ether Themes" />
    <meta property="og:title" content="${escapeAttr(seo.title)}" />
    <meta property="og:description" content="${escapeAttr(seo.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(seo.title)}" />
    <meta name="twitter:description" content="${escapeAttr(seo.description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${webSiteLd}</script>
    <script type="application/ld+json">${appLd}</script>`;

  return cleaned
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
    .replace("</head>", `${metaBlock}\n  </head>`);
}

/** @param {string} value */
function escapeAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * @param {string} siteDir
 * @param {{ languages: Array<{ slug: string, label: string, count: number, extensions: string }>, paletteCount: number, catalogCount: number }} data
 */
export function writeSeoArtifacts(siteDir, data) {
  const templateHtml = readFileSync(join(siteDir, "index.html"), "utf8");
  const packageJson = JSON.parse(
    readFileSync(join(siteDir, "../package.json"), "utf8"),
  );
  const version = packageJson.version;
  const pages = allPageSeo(data.languages, {
    paletteCount: data.paletteCount,
    catalogCount: data.catalogCount,
  });

  const homeHtml = renderHead(templateHtml, HOME_SEO, version);
  writeFileSync(join(siteDir, "index.html"), homeHtml, "utf8");
  writeFileSync(join(siteDir, "404.html"), homeHtml, "utf8");

  for (const page of pages) {
    if (page.path === "/") {
      continue;
    }

    const segments = page.path.replace(/^\/|\/$/g, "").split("/");
    const routeDir = join(siteDir, ...segments);
    mkdirSync(routeDir, { recursive: true });
    writeFileSync(
      join(routeDir, "index.html"),
      renderHead(templateHtml, page, version),
      "utf8",
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((page) => {
      const loc = canonicalUrl(page.path);
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${page.path === "/" ? "1.0" : "0.8"}</priority>\n  </url>`;
    })
    .join("\n");

  writeFileSync(
    join(siteDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    "utf8",
  );

  writeFileSync(
    join(siteDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`,
    "utf8",
  );
}
