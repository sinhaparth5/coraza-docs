import authors from "../../content/blog/authors.json";
import tags from "../../content/blog/tags.json";
import { blogSource } from "./source";

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
