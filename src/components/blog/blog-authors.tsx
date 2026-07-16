import Image from "next/image";
import Link from "next/link";
import { getBlogAuthors } from "@/lib/blog";

export function BlogAuthors({
  ids,
  compact = false,
}: {
  ids: string[];
  compact?: boolean;
}) {
  const authors = getBlogAuthors(ids);
  if (authors.length === 0) return null;

  return (
    <div
      className={compact ? "flex flex-wrap gap-3" : "mt-7 flex flex-wrap gap-4"}
    >
      {authors.map((author) => (
        <div
          key={author.id}
          className={
            compact
              ? "flex items-center gap-2.5"
              : "flex w-full items-center gap-4 rounded-xl border border-fd-border bg-fd-card/60 p-4 sm:w-auto sm:min-w-80"
          }
        >
          <Image
            src={author.imageUrl}
            alt={`${author.name} profile photo`}
            width={compact ? 32 : 48}
            height={compact ? 32 : 48}
            sizes={compact ? "32px" : "48px"}
            className={`shrink-0 rounded-full object-cover ${compact ? "size-8" : "size-12"}`}
          />
          <div className="min-w-0">
            {compact ? (
              <p className="truncate text-xs font-semibold text-fd-muted-foreground">
                By {author.name}
              </p>
            ) : (
              <>
                <Link
                  href={author.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-fd-foreground no-underline transition-colors duration-200 hover:text-pastel-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-500 dark:hover:text-pastel-green-300"
                >
                  {author.name}
                </Link>
                <p className="mt-0.5 text-sm text-fd-muted-foreground">
                  {author.title}
                </p>
                <div className="mt-1.5 flex gap-3 text-xs font-semibold">
                  <Link
                    href={author.socials.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pastel-green-700 no-underline hover:underline dark:text-pastel-green-300"
                  >
                    Website
                  </Link>
                  <Link
                    href={`https://github.com/${author.socials.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pastel-green-700 no-underline hover:underline dark:text-pastel-green-300"
                  >
                    GitHub
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
