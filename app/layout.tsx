// app/layout.js
// Root layout - sets up the basic HTML structure
import "./globals.css";
import { GrommetProvider } from "./components/GrommetProvider";

// App metadata (shows in browser tab)
export const metadata = {
  title: "Lief Shift Tracker - Healthcare Management",
  description: "Professional shift tracking for healthcare workers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap everything in our Grommet theme provider */}
        <GrommetProvider>{children}</GrommetProvider>
      </body>
    </html>
  );
}
