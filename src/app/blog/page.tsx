import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogAuthors } from "@/components/blog/blog-authors";
import { BlurBlob, DotGrid } from "@/components/decorative-shapes";
import { ArrowRightIcon } from "@/components/icons";
import {
  formatBlogDate,
  getBlogImage,
  getBlogPosts,
  getBlogTagLabel,
} from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Release notes, security research, and engineering updates from Coraza WAF Mod.",
  keywords: [
    "coraza waf mod blog",
    "waf release notes",
    "web application firewall",
    "security engineering",
    "go security",
  ],
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const [latest, ...rest] = posts;

  return (
    <div className="min-w-0 bg-fd-background text-fd-foreground [grid-area:main]">
      <header className="relative overflow-hidden border-b border-fd-border bg-gradient-to-b from-pastel-green-100/60 to-fd-background px-5 py-14 sm:px-8 dark:from-pastel-green-900/25">
        <BlurBlob className="-right-24 -top-32 size-96 bg-pixie-green-400/20" />
        <DotGrid className="inset-0 text-pastel-green-700/[0.05] dark:text-pastel-green-200/[0.05]" />
        <div className="relative mx-auto max-w-5xl">
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
        className="px-4 py-10 sm:px-8 sm:py-12"
        aria-labelledby="articles-heading"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id="articles-heading" className="text-lg font-bold">
              Latest articles
            </h2>
            <p className="text-sm text-fd-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {latest ? (
            <article className="group relative mb-6 overflow-hidden rounded-3xl border border-fd-border bg-fd-card transition duration-200 hover:border-pastel-green-500/50 hover:shadow-[0_22px_55px_rgba(16,34,18,0.12)]">
              <Link
                href={latest.url}
                className="flex flex-col no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-500 lg:flex-row"
              >
                <div className="relative aspect-[16/9] shrink-0 bg-pastel-green-50 lg:aspect-auto lg:w-[26rem] dark:bg-pastel-green-950">
                  <Image
                    src={getBlogImage(latest.data.slug)}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 416px"
                    className="object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-fd-muted-foreground">
                    <span className="rounded-full bg-pixie-green-100 px-2.5 py-1 font-bold uppercase tracking-[0.1em] text-pixie-green-800 dark:bg-pixie-green-900/50 dark:text-pixie-green-200">
                      Latest
                    </span>
                    <time dateTime={latest.data.date}>
                      {formatBlogDate(latest.data.date)}
                    </time>
                    {latest.data.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-pastel-green-100 px-2 py-0.5 text-pastel-green-800 dark:bg-pastel-green-900 dark:text-pastel-green-200"
                      >
                        {getBlogTagLabel(tag)}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-3 text-balance text-2xl font-bold leading-snug text-fd-card-foreground sm:text-3xl">
                    {latest.data.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-fd-muted-foreground sm:text-base">
                    {latest.data.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <BlogAuthors ids={latest.data.authors} compact />
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pastel-green-700 dark:text-pastel-green-300">
                      Read article
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        size={14}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((post) => (
              <article
                key={post.url}
                className="group flex flex-col overflow-hidden rounded-2xl border border-fd-border bg-fd-card transition duration-200 hover:-translate-y-0.5 hover:border-pastel-green-500/50 hover:shadow-[0_14px_35px_rgba(16,34,18,0.1)]"
              >
                <Link
                  href={post.url}
                  className="flex flex-1 flex-col no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-500"
                >
                  <div className="relative aspect-[16/9] shrink-0 bg-pastel-green-50 dark:bg-pastel-green-950">
                    <Image
                      src={getBlogImage(post.data.slug)}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-5">
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

                    <h3 className="mt-2 text-balance text-lg font-bold leading-snug text-fd-card-foreground">
                      {post.data.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-6 text-fd-muted-foreground">
                      {post.data.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <BlogAuthors ids={post.data.authors} compact />
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pastel-green-700 dark:text-pastel-green-300">
                        Read article
                        <ArrowRightIcon
                          aria-hidden="true"
                          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                          size={14}
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
