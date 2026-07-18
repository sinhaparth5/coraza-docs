import { DocsBody, DocsPage } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogAuthors } from "@/components/blog/blog-authors";
import { DotGrid } from "@/components/decorative-shapes";
import { ArrowLeftIcon } from "@/components/icons";
import { getMDXComponents } from "@/components/mdx";
import {
  formatBlogDate,
  getBlogAuthors,
  getBlogImage,
  getBlogPosts,
  getBlogTagLabel,
} from "@/lib/blog";
import { blogSource } from "@/lib/source";

const baseUrl = "https://waf.astrareconslabs.com";

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const image = getBlogImage(page.data.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.data.title,
    description: page.data.description,
    datePublished: page.data.date,
    image: `${baseUrl}${image.src}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${page.url}`,
    },
    author: getBlogAuthors(page.data.authors).map((author) => ({
      "@type": "Person",
      name: author.name,
      url: author.url,
    })),
    publisher: {
      "@type": "Organization",
      name: "Coraza WAF Mod",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/img/logo.svg`,
      },
    },
  };

  return (
    <DocsPage
      toc={page.data.toc}
      breadcrumb={{ enabled: false }}
      footer={{ enabled: false }}
      className="gap-0 py-12 text-fd-foreground sm:px-8 lg:py-16"
    >
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-controlled JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <Link
          href="/blog"
          className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-fd-muted-foreground no-underline transition-colors duration-200 hover:text-pastel-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-500 dark:hover:text-pastel-green-300"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" size={16} />
          All articles
        </Link>

        <header className="relative mb-10">
          <DotGrid className="-right-8 -top-8 hidden size-40 text-pastel-green-700/[0.08] sm:block dark:text-pastel-green-200/[0.07]" />
          <div className="flex flex-wrap items-center gap-2 text-sm text-fd-muted-foreground">
            <time dateTime={page.data.date}>
              {formatBlogDate(page.data.date)}
            </time>
          </div>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl">
            {page.data.title}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-8 text-fd-muted-foreground">
            {page.data.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {page.data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-pastel-green-100 px-3 py-1.5 text-xs font-semibold text-pastel-green-800 dark:bg-pastel-green-900 dark:text-pastel-green-200"
              >
                {getBlogTagLabel(tag)}
              </span>
            ))}
          </div>
          <BlogAuthors ids={page.data.authors} />
        </header>

        <Image
          src={getBlogImage(page.data.slug)}
          alt=""
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="mb-12 aspect-[12/7] w-full object-contain"
        />

        <DocsBody className="max-w-none">
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(blogSource, page),
            })}
          />
        </DocsBody>
      </div>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slugs[0] }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();

  const image = getBlogImage(page.data.slug);

  return {
    title: page.data.title,
    description: page.data.description,
    keywords: page.data.keywords,
    openGraph: {
      type: "article",
      publishedTime: page.data.date,
      tags: page.data.tags,
      images: [
        {
          url: image.src,
          width: image.width,
          height: image.height,
          alt: page.data.title,
        },
      ],
    },
  };
}
