"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

// The type comes from the package root. next-themes 0.4.x removed the
// "next-themes/dist/types" subpath entirely, so importing it is a build failure.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
