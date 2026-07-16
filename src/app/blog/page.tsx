import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogAuthors } from "@/components/blog/blog-authors";
import { formatBlogDate, getBlogPosts, getBlogTagLabel } from "@/lib/blog";
import seoImage from "@/static/img/seo_image.jpg";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Release notes, security research, and engineering updates from Coraza WAF Mod.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-w-0 bg-fd-background text-fd-foreground [grid-area:main]">
      <header className="border-b border-fd-border bg-gradient-to-b from-pastel-green-100/60 to-fd-background px-5 py-10 sm:px-8 dark:from-pastel-green-900/25">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-pastel-green-700 dark:text-pastel-green-300">
            Coraza WAF Mod
          </p>
          <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
            Security engineering notes
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-fd-muted-foreground">
            Release notes, implementation details, and lessons learned while
            building a single-binary WAF and reverse proxy.
          </p>
        </div>
      </header>

      <section
        className="px-4 py-8 sm:px-8 sm:py-10"
        aria-labelledby="articles-heading"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 id="articles-heading" className="text-lg font-bold">
              Latest articles
            </h2>
            <p className="text-sm text-fd-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <article
                key={post.url}
                className="group overflow-hidden rounded-xl border border-fd-border bg-fd-card transition duration-200 hover:border-pastel-green-500/50 hover:shadow-[0_10px_30px_rgba(8,45,6,0.08)]"
              >
                <Link
                  href={post.url}
                  className="flex min-h-44 flex-col no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-500 sm:flex-row"
                >
                  <div className="relative aspect-[16/7] overflow-hidden border-b border-fd-border sm:aspect-auto sm:w-44 sm:shrink-0 sm:border-b-0 sm:border-r">
                    <Image
                      src={seoImage}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-fd-muted-foreground">
                      <time dateTime={post.data.date}>
                        {formatBlogDate(post.data.date)}
                      </time>
                      {post.data.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-pastel-green-100 px-2 py-0.5 text-pastel-green-800 dark:bg-pastel-green-900 dark:text-pastel-green-200"
                        >
                          {getBlogTagLabel(tag)}
                        </span>
                      ))}
                    </div>

                    <h3 className="mt-2 text-balance text-lg font-bold leading-snug text-fd-card-foreground sm:text-xl">
                      {post.data.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-fd-muted-foreground">
                      {post.data.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <BlogAuthors ids={post.data.authors} compact />
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pastel-green-700 dark:text-pastel-green-300">
                        Read article
                        <ArrowRight
                          aria-hidden="true"
                          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
