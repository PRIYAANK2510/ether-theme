import { useEffect } from "react";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  canonicalUrl,
} from "../../../../shared/site-seo.js";

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

export function usePageSeo(seo: PageSeo) {
  useEffect(() => {
    const canonical = canonicalUrl(seo.path);
    const image = seo.ogImage ?? DEFAULT_OG_IMAGE;
    const imageUrl = image.startsWith("http")
      ? image
      : `${canonicalUrl("/").replace(/\/$/, "")}${image}`;

    document.title = seo.title;
    upsertMeta("name", "description", seo.description);
    upsertCanonical(canonical);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", imageUrl);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", imageUrl);
  }, [seo.description, seo.ogImage, seo.path, seo.title]);
}
