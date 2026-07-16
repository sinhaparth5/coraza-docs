import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { GithubIcon } from "@/components/icons";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [
      { text: "Docs", url: "/docs" },
      { text: "Blog", url: "/blog" },
      {
        type: "icon",
        text: "GitHub",
        label: "GitHub",
        url: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
        external: true,
        icon: <GithubIcon aria-hidden="true" className="size-5" size={20} />,
      },
    ],
  };
}
