"use client";

import { MainNav } from "@/ui/layout/main-nav";
import { AppSidebarNav } from "@/ui/layout/sidebar/app-sidebar-nav";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
      <SessionProvider>
        <div className="min-h-screen w-full bg-white">
          <MainNav
            sidebar={AppSidebarNav}
            toolContent={
              <>
                {/* Placeholder for tool content, if needed */}
              </>
            }
            newsContent={<></>}
            sidebarWidth={304} // TODO: Move into MainNav once app. and partners. are unified
          >
            {children}
          </MainNav>
        </div>
      </SessionProvider>
    );
  }