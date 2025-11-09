// app/components/GrommetProvider.tsx
"use client";
import { Grommet } from "grommet";
import { lightTheme } from "./theme";
import { ReactNode } from "react";

// TypeScript interface for props
interface GrommetProviderProps {
  children: ReactNode;
}

export function GrommetProvider({ children }: GrommetProviderProps) {
  return (
    <Grommet theme={lightTheme} full>
      {children}
    </Grommet>
  );
}
