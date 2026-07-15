"use client";

import type { ReactNode } from "react";
import { GenderProvider } from "@/context/GenderContext";

// Client-side context providers mounted once at the root layout.
export default function Providers({ children }: { children: ReactNode }) {
  return <GenderProvider>{children}</GenderProvider>;
}
