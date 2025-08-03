// app/components/GrommetProvider.tsx
"use client";
import { Grommet } from "grommet";
import { customTheme } from "./theme";
import { ReactNode } from "react";

// TypeScript interface for props
interface GrommetProviderProps {
  children: ReactNode;
}

export function GrommetProvider({ children }: GrommetProviderProps) {
  return (
    <Grommet theme={customTheme} full>
      {children}
    </Grommet>
  );
}
