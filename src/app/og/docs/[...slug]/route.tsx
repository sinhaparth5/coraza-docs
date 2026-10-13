import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { Renderer } from "takumi-js/node";
import { ImageResponse } from "takumi-js/response";
import { appName } from "@/lib/shared";
import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

// Field-notes palette from global.css, in sRGB hex for the renderer.
const c = {
  paper: "#f8f4ec",
  card: "#fcfaf5",
  ink: "#1c2a23",
  soft: "#47554d",
  rule: "rgba(28,42,35,0.16)",
  highlight: "#cde59a",
  accent: "#2f7046",
  stamp: "#b8432f",
};

const fontDir = join(process.cwd(), "src/fonts/og");
const fonts = [
  { file: "calistoga-400.ttf", name: "Calistoga", weight: 400 },
  { file: "dm-sans-400.ttf", name: "DM Sans", weight: 400 },
  { file: "dm-sans-500.ttf", name: "DM Sans", weight: 500 },
  { file: "jetbrains-mono-400.ttf", name: "JetBrains Mono", weight: 400 },
  { file: "caveat-500.ttf", name: "Caveat", weight: 500 },
];

// One renderer for every page image, fonts and logo loaded once.
let ready: Promise<{ renderer: Renderer; logo: string }> | undefined;
function setup() {
  ready ??= (async () => {
    const renderer = new Renderer();
    for (const font of fonts) {
      await renderer.registerFont({
        name: font.name,
        weight: font.weight,
        data: await readFile(join(fontDir, font.file)),
      });
    }
    const svg = await readFile(
      join(process.cwd(), "src/static/img/logo.svg"),
      "base64",
    );
    return { renderer, logo: `data:image/svg+xml;base64,${svg}` };
  })();
  return ready;
}

// 45° hatching every 10px inside a 40px strip, as an SVG so the renderer
// doesn't have to tile a repeating gradient.
const wall = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="630"><g stroke="${c.ink}" stroke-width="1.5">${Array.from(
    { length: 68 },
    (_, i) => `<line x1="0" y1="${i * 10}" x2="40" y2="${i * 10 - 40}"/>`,
  ).join(
    "",
  )}</g><rect x="1" y="-2" width="38" height="634" fill="none" stroke="${c.ink}" stroke-width="2"/></svg>`,
).toString("base64")}`;

const titleCase = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">,
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const { renderer, logo } = await setup();
  const title = page.data.title;
  const section = page.slugs.length > 1 ? titleCase(page.slugs[0]) : "Docs";
  const titleSize = title.length > 34 ? 66 : 82;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: c.paper,
        color: c.ink,
        fontFamily: "DM Sans",
      }}
    >
      {/* Notebook margin rule. */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: "rgba(184,67,47,0.35)",
        }}
      />
      {/* The hatched wall, the site's mark, down the right edge. */}
      {/* biome-ignore lint/performance/noImgElement: rendered to an image, not the DOM */}
      <img
        src={wall}
        width={40}
        height={630}
        alt=""
        style={{ position: "absolute", left: 1088, top: 0 }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 180px 56px 104px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* biome-ignore lint/performance/noImgElement: rendered to an image, not the DOM */}
          <img src={logo} width={52} height={52} alt="" />
          <span style={{ fontFamily: "Calistoga", fontSize: 38 }}>
            {appName}
          </span>
          <span
            style={{
              marginLeft: 18,
              fontFamily: "JetBrains Mono",
              fontSize: 18,
              letterSpacing: 3,
              color: c.soft,
            }}
          >
            {`DOCS · ${section.toUpperCase()}`}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Calistoga",
              fontSize: titleSize,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            <span
              style={{
                paddingLeft: 6,
                paddingRight: 6,
                backgroundImage: `linear-gradient(to bottom, transparent 62%, ${c.highlight} 62%, ${c.highlight} 92%, transparent 92%)`,
              }}
            >
              {title}
            </span>
          </div>
          {page.data.description ? (
            <p
              style={{
                marginTop: 24,
                fontSize: 30,
                lineHeight: 1.4,
                color: c.soft,
                maxWidth: 860,
                lineClamp: 2,
              }}
            >
              {page.data.description}
            </p>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Caveat",
              fontSize: 34,
              color: c.soft,
              whiteSpace: "nowrap",
            }}
          >
            a WAF you can scp to a server
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 18,
              color: c.soft,
              whiteSpace: "nowrap",
            }}
          >
            waf.astrareconslabs.com/docs
          </span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      format: "webp",
      renderer,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
