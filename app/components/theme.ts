// app/components/theme.ts
// Simplified theme that works perfectly with TypeScript + Grommet

import type { ThemeType } from "grommet";

export const customTheme: ThemeType = {
  // Main colors for our healthcare app
  global: {
    colors: {
      // Primary colors (main brand colors)
      brand: "#2563eb", // Professional blue
      "accent-1": "#10b981", // Healthcare green
      "accent-2": "#f59e0b", // Warning orange
      "accent-3": "#ef4444", // Alert red

      // Status colors (for different shift states)
      "status-ok": "#10b981", // Green - clocked in successfully
      "status-warning": "#f59e0b", // Orange - location issues
      "status-error": "#ef4444", // Red - errors
      "status-unknown": "#6b7280", // Gray - pending

      // Background colors
      "background-front": "#ffffff",
      "background-back": "#f8fafc",
    },

    // Font settings (readable and professional)
    font: {
      family: '"Inter", "Helvetica", "Arial", sans-serif',
    },

    // Spacing system (consistent gaps between elements)
    spacing: "24px",
  },

  // Button styles (how our buttons look)
  button: {
    border: {
      radius: "8px", // Rounded corners
    },
    padding: {
      horizontal: "24px", // Left/right padding
      vertical: "12px", // Top/bottom padding
    },
  },

  // Card styles (simplified to avoid TypeScript conflicts)
  card: {
    container: {
      elevation: "small", // Subtle shadow
    },
  },
};
