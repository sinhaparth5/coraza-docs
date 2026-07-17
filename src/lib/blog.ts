import type { StaticImageData } from "next/image";
import authors from "../../content/blog/authors.json";
import tags from "../../content/blog/tags.json";
import defeatingZapImage from "../static/img/blog/defeating-zap-browser-challenge-bypass.png";
import externalDatabaseBackendsImage from "../static/img/blog/external-database-backends.png";
import ja4AutobanImage from "../static/img/blog/ja4-autoban-email-alerts.png";
import perServiceWafImage from "../static/img/blog/per-service-waf-rule-exceptions.png";
import seoImage from "../static/img/seo_image.jpg";
import { blogSource } from "./source";

const blogImages: Record<string, StaticImageData> = {
  "defeating-zap-browser-challenge-bypass": defeatingZapImage,
  "external-database-backends": externalDatabaseBackendsImage,
  "ja4-autoban-email-alerts": ja4AutobanImage,
  "per-service-waf-rule-exceptions": perServiceWafImage,
};

export function getBlogImage(slug: string): StaticImageData {
  return blogImages[slug] ?? seoImage;
}

export function getBlogPosts() {
  return blogSource
    .getPages()
    .toSorted((a, b) => b.data.date.localeCompare(a.data.date));
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function getBlogAuthors(ids: string[]) {
  return ids.flatMap((id) => {
    const author = authors[id as keyof typeof authors];
    return author ? [{ id, ...author }] : [];
  });
}

export function getBlogTagLabel(tag: string) {
  return tags[tag as keyof typeof tags]?.label ?? tag;
}
