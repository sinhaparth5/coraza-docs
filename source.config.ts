import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import {
  defineCollections,
  defineConfig,
  defineDocs,
} from "fumadocs-mdx/config";
import { z } from "zod";

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: pageSchema.extend({
    slug: z.string(),
    date: z.string(),
    authors: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }),
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
