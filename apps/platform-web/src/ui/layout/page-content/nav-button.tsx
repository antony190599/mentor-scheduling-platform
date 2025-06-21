"use client";


import { useContext } from "react";
import { SideNavContext } from "../main-nav";
import { Button, LayoutSidebar } from "@/ui/ui-components";

export function NavButton() {
  const { setIsOpen } = useContext(SideNavContext);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setIsOpen((o) => !o)}
      icon={<LayoutSidebar className="size-4" />}
      className="h-auto w-fit p-1 md:hidden"
    />
  );
}
