// app/layout.tsx
import "./globals.css";
import { ClientProviders } from "@/app/components/client-providers";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// TypeScript interface for props
interface RootLayoutProps {
  children: ReactNode;
}

// App metadata
export const metadata = {
  title: "Lief Shift Tracker - Healthcare Management",
  description: "Professional shift tracking for healthcare workers",
  icons: {
    icon: '/lief-logo-with-name.svg',
  },
};

// Properly typed layout component
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
