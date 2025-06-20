"use client";

import { APP_DOMAIN, cn, createHref, fetcher } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ComponentProps, ReactNode, useEffect, useState } from "react";
import useSWR from "swr";
import { AnimatedSizeContainer } from "../animated-size-container";
import { ButtonProps, buttonVariants } from "../button";
import { NavItemChild, NavItemChildren } from "../content";
import {
  DubAnalyticsIcon,
  DubApiIcon,
  DubLinksIcon,
  DubPartnersIcon,
} from "../icons";
import { navItems, type NavTheme } from "./nav";

const specialIcons: Record<string, ReactNode> = {
  "Dub Links": (
    <div className="flex size-5 items-center justify-center rounded bg-orange-400">
      <DubLinksIcon className="size-3 text-orange-900" />
    </div>
  ),
  "Dub Partners": (
    <div className="flex size-5 items-center justify-center rounded bg-violet-400">
      <DubPartnersIcon className="size-3 text-violet-900" />
    </div>
  ),
  "Dub Analytics": (
    <div className="flex size-5 items-center justify-center rounded bg-green-400">
      <DubAnalyticsIcon className="size-3 text-green-900" />
    </div>
  ),
  "Dub API": (
    <div className="flex size-5 items-center justify-center rounded bg-neutral-400">
      <DubApiIcon className="size-3 text-neutral-900" />
    </div>
  ),
};

export function NavMobile({
  theme = "light",
  staticDomain,
}: {
  theme?: NavTheme;
  staticDomain?: string;
}) {
  let { domain = "dub.co" } = useParams() as { domain: string };
  if (staticDomain) {
    domain = staticDomain;
  }

  const [open, setOpen] = useState(false);
  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const { data: session, isLoading } = useSWR(
    domain.endsWith("dub.co") && "/api/auth/session",
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return (
    <div
      className={cn(
        "fixed right-0 top-0 z-40 flex items-center gap-4 p-2.5 lg:hidden",
        theme === "dark" && "dark",
      )}
    >
      {session && Object.keys(session).length > 0 ? (
        <AuthButton href={APP_DOMAIN} className="max-[280px]:hidden">
          Dashboard
        </AuthButton>
      ) : !isLoading ? (
        <div className="flex gap-2 max-[280px]:hidden">
          <AuthButton variant="secondary" href={`${APP_DOMAIN}/login`}>
            Log in
          </AuthButton>

          <AuthButton href={`${APP_DOMAIN}/register`}>Sign Up</AuthButton>
        </div>
      ) : null}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "z-30 rounded-full p-2 transition-colors duration-200 hover:bg-neutral-200 focus:outline-none active:bg-neutral-300 dark:hover:bg-white/20 dark:active:bg-white/30",
          open && "hover:bg-neutral-100 active:bg-neutral-200",
        )}
      >
        {open ? (
          <X className="h-5 w-5 text-neutral-600 dark:text-white/70" />
        ) : (
          <Menu className="h-5 w-5 text-neutral-600 dark:text-white/70" />
        )}
      </button>
      <nav
        className={cn(
          "fixed inset-0 z-20 hidden max-h-screen w-full overflow-y-auto bg-white px-5 py-16 lg:hidden dark:bg-black dark:text-white/70",
          open && "block",
        )}
      >
        <ul className="grid divide-y divide-neutral-200 dark:divide-white/[0.15]">
          {navItems.map(({ name, href, childItems }, idx) => (
            <MobileNavItem
              key={idx}
              name={name}
              href={href}
              childItems={childItems}
              setOpen={setOpen}
            />
          ))}

          {session && Object.keys(session).length > 0 ? (
            <li className="py-3 min-[281px]:hidden">
              <Link
                href={APP_DOMAIN}
                className="flex w-full font-semibold capitalize"
              >
                Dashboard
              </Link>
            </li>
          ) : (
            <>
              <li className="py-3 min-[281px]:hidden">
                <Link
                  href={`${APP_DOMAIN}/login`}
                  className="flex w-full font-semibold capitalize"
                >
                  Log in
                </Link>
              </li>

              <li className="py-3 min-[281px]:hidden">
                <Link
                  href={`${APP_DOMAIN}/register`}
                  className="flex w-full font-semibold capitalize"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

const MobileNavItem = ({
  name,
  href,
  childItems,
  setOpen,
}: {
  name: string;
  href?: string;
  childItems?: NavItemChildren;
  setOpen: (open: boolean) => void;
}) => {
  const { domain = "dub.co" } = useParams() as { domain: string };
  const [expanded, setExpanded] = useState(false);

  if (childItems) {
    return (
      <li className="py-3">
        <AnimatedSizeContainer height>
          <button
            className="flex w-full justify-between"
            onClick={() => setExpanded(!expanded)}
          >
            <p className="font-semibold">{name}</p>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-neutral-500 transition-all dark:text-white/50",
                expanded && "rotate-180",
              )}
            />
          </button>
          {expanded && (
            <div className="grid grid-cols-1 gap-4 overflow-hidden py-4">
              {childItems.map((item, idx) =>
                "items" in item ? (
                  <div key={idx} className="grid grid-cols-1 gap-3">
                    <span className="text-xs font-medium uppercase text-neutral-500 dark:text-white/50">
                      {item.label}
                    </span>
                    {item.items.map((childItem, childIdx) => (
                      <ChildItem
                        key={childIdx}
                        item={childItem}
                        setOpen={setOpen}
                        size="small"
                      />
                    ))}
                  </div>
                ) : (
                  <ChildItem key={idx} item={item} setOpen={setOpen} />
                ),
              )}
            </div>
          )}
        </AnimatedSizeContainer>
      </li>
    );
  }

  if (!href) {
    return null;
  }

  return (
    <li className="py-3">
      <Link
        href={createHref(href, domain, {
          utm_source: "Custom Domain",
          utm_medium: "Navbar",
          utm_campaign: domain,
          utm_content: name,
        })}
        onClick={() => setOpen(false)}
        className="flex w-full font-semibold capitalize"
      >
        {name}
      </Link>
    </li>
  );
};

const ChildItem = ({
  item: { title, description, href, icon: Icon },
  setOpen,
  size = "normal",
}: {
  item: NavItemChild;
  setOpen: (open: boolean) => void;
  size?: "normal" | "small";
}) => {
  const { domain = "dub.co" } = useParams() as { domain: string };

  const SpecialIcon = specialIcons?.[title];

  return (
    <Link
      href={createHref(href, domain, {
        utm_source: "Custom Domain",
        utm_medium: "Navbar",
        utm_campaign: domain,
        utm_content: title,
      })}
      onClick={() => setOpen(false)}
      className="flex w-full items-center gap-3"
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-lg border border-neutral-200 bg-gradient-to-t from-neutral-100",
          size === "small" && "size-8",
        )}
      >
        {SpecialIcon ?? (
          <Icon
            className={cn(
              "size-5 text-neutral-700 grayscale",
              size === "small" && "size-4",
            )}
          />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-neutral-900">{title}</h2>
        </div>
        {description && (
          <p className="text-sm text-neutral-500">{description}</p>
        )}
      </div>
    </Link>
  );
};

export function AuthButton({
  variant,
  className,
  ...rest
}: Pick<ButtonProps, "variant"> & ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      className={cn(
        "flex h-8 w-fit items-center whitespace-nowrap rounded-lg border px-3 text-[0.8125rem]",
        buttonVariants({ variant }),
        className,
      )}
    />
  );
}
