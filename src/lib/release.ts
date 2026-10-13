import { gitConfig } from "./shared";

export type Release = { tag: string; url: string; date: string };

/**
 * Latest published release of the product repo. Cached and refreshed hourly
 * (ISR), so a new GitHub release shows up on the site without a redeploy.
 * Returns null when GitHub is unreachable so the page still renders.
 */
export async function getLatestRelease(): Promise<Release | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${gitConfig.user}/${gitConfig.repo}/releases/latest`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      tag_name?: string;
      html_url?: string;
      published_at?: string;
    };
    if (!data.tag_name || !data.html_url) return null;
    return {
      tag: data.tag_name,
      url: data.html_url,
      date: data.published_at ?? "",
    };
  } catch {
    return null;
  }
}
