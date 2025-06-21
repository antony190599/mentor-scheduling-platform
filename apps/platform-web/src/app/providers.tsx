"use client";

import {
  TooltipProvider,
  useRemoveGAParams,
} from "@/ui/ui-components";
import { ReactNode } from "react";
import { Toaster } from "sonner";


export default function RootProviders({ children }: { children: ReactNode }) {
  useRemoveGAParams();

  return (
      <TooltipProvider>
          <Toaster closeButton className="pointer-events-auto" />
          {children}
      </TooltipProvider>
  );
}
