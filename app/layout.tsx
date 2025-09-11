// app/layout.tsx
import "./globals.css";
import { GrommetProvider } from "./components/GrommetProvider";
import { ReactNode } from "react";

// TypeScript interface for props
interface RootLayoutProps {
  children: ReactNode;
}

// App metadata
export const metadata = {
  title: "Lief Shift Tracker - Healthcare Management",
  description: "Professional shift tracking for healthcare workers",
};

// Properly typed layout component
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <GrommetProvider>{children}</GrommetProvider>
      </body>
    </html>
  );
}
