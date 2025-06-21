/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouterStuff } from "@/ui/ui-components";
import {
  Globe,
  Tag,
} from "@/ui/ui-components/icons";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { Compass } from "./icons/compass";
import { Hyperlink } from "./icons/hyperlink";
import { SidebarNav, SidebarNavAreas, SidebarNavGroups } from "./sidebar-nav";
import { CursorRays } from "./icons/cursor-rays";
import { LinesY } from "./icons/lines-y";

type SidebarNavData = {
  slug: string;
  pathname: string;
  queryString: string;
  session?: Session | null;
  showNews?: boolean;
};

const FIVE_YEARS_SECONDS = 60 * 60 * 24 * 365 * 5;

const NAV_GROUPS: SidebarNavGroups<SidebarNavData> = ({
  slug,
  pathname,
}) => [
  {
    name: "Scheduling",
    description:
      "Sample Page",
    learnMoreHref: "https://dub.co/links",
    icon: Compass,
    href: "/workspaces",
    active: pathname.startsWith(`/workspaces`),

    onClick: () => {
      document.cookie = `dub_product:${slug}=links;path=/;max-age=${FIVE_YEARS_SECONDS}`;
    },
  },
];

const NAV_AREAS: SidebarNavAreas<SidebarNavData> = {
  // Top-level
  default: ({ slug, pathname, queryString, showNews }) => ({
    title: "Scheduling",
    showNews,
    direction: "left",
    content: [
      {
        items: [
          {
            name: "Workspace",
            icon: LinesY,
            href: `/workspaces`,
            isActive: (pathname: string, href: string) => {
              const basePath = href.split("?")[0];

              // Exact match for the base links page
              if (pathname === basePath) return true;

              // Check if it's a link detail page (path segment after base contains a dot for domain)
              if (pathname.startsWith(basePath + "/")) {
                const nextSegment = pathname
                  .slice(basePath.length + 1)
                  .split("/")[0];
                return nextSegment.includes(".");
              }

              return false;
            },
          },
          // Add items for a mentor-scheduling-platform mentor & enterpreuners
          {
            name: "Scheduling",
            icon: Hyperlink,
            href: `/scheduling`,
            isActive: (pathname: string, href: string) => {
              const basePath = href.split("?")[0];
              return pathname.startsWith(basePath);
            },
          },

          {
            name: "Sessions",
            icon: CursorRays,
            href: `/sessions`,
            isActive: (pathname: string, href: string) => {
              const basePath = href.split("?")[0];
              return pathname.startsWith(basePath);
            },
          },

          {
            name: "Resources",
            icon: Tag,
            href: `/resources`,
            isActive: (pathname: string, href: string) => {
              const basePath = href.split("?")[0];
              return pathname.startsWith(basePath);
            },
          },





        ],
      },
    ],
  }),
};

export function AppSidebarNav({
  toolContent,
  newsContent,
}: {
  toolContent?: ReactNode;
  newsContent?: ReactNode;
}) {
  const { slug } = useParams() as { slug?: string };
  const pathname = usePathname();
  const { getQueryString } = useRouterStuff();
  const { data: session } = useSession();

  // const currentArea = useMemo(() => {
  //   return pathname.startsWith("/workspace")
  //     ? "userSettings"
  //     : pathname.startsWith(`/${slug}/settings`)
  //       ? "workspaceSettings"
  //       : pathname.startsWith(`/${slug}/program`)
  //         ? "program"
  //         : "default";
  // }, [slug, pathname]);
  const currentArea = "default";

  return (
    <SidebarNav
      groups={NAV_GROUPS}
      areas={NAV_AREAS}
      currentArea={currentArea}
      data={{
        slug: slug || "",
        pathname,
        queryString: getQueryString(undefined, {
          include: ["folderId", "tagIds"],
        }),
        session: session || undefined,
        showNews: pathname.startsWith(`/${slug}/program`) ? false : true,
      }}
      toolContent={toolContent}
      newsContent={newsContent}
    />
  );
}
