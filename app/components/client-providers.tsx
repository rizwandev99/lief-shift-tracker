// app/components/client-providers.tsx
"use client";

import { GrommetProvider } from "@/app/components/grommet-provider";
import { ReactNode } from "react";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";

// TypeScript interface for props
interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Auth0Provider>
      <GrommetProvider>
        {children}
      </GrommetProvider>
    </Auth0Provider>
  );
}
