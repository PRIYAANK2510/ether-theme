export interface PageSeo {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export const SITE_URL: string;
export const SITE_BASE: string;
export const SITE_NAME: string;
export const SITE_AUTHOR: string;
export const DEFAULT_OG_IMAGE: string;
export const VS_MARKETPLACE: string;
export const GITHUB_REPO: string;
export const HOME_SEO: PageSeo;
export const THEMES_SEO: PageSeo;
export const SNIPPETS_SEO: PageSeo;

export function snippetLanguageSeo(
  label: string,
  slug: string,
  count: number,
  extensions: string,
): PageSeo;

export function canonicalUrl(path: string): string;

export function allPageSeo(
  languages: Array<{ slug: string; label: string; count: number; extensions: string }>,
  counts?: { paletteCount?: number; catalogCount?: number },
): PageSeo[];

export function jsonLdWebSite(seo: PageSeo): string;
export function jsonLdSoftwareApplication(seo: PageSeo, version?: string): string;
