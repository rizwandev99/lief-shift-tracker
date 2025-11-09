// app/components/client-providers.tsx
"use client";

import { GrommetProvider } from "@/app/components/grommet-provider";
import { ReactNode } from "react";

// TypeScript interface for props
interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <GrommetProvider>{children}</GrommetProvider>;
}
