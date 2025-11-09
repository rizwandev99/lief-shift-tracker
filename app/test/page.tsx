// app/test/page.tsx
// Main test hub - Fixed UI layout and spacing
export const dynamic = "force-dynamic";

// app/test/page.tsx
// Simple, clean test hub page

import { Box, Heading, Text, Button } from "grommet";
import { Tools } from "grommet-icons";
import Link from "next/link";

export default function TestHubPage() {
  return (
    <Box
      fill
      background="background-front"
      pad="medium"
      align="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      {/* Header */}
      <Box align="center" margin={{ bottom: "large" }}>
        <Tools size="large" color="brand" />
        <Heading level="2" margin="small">
          🧪 Test Hub
        </Heading>
        <Text size="medium" color="text-weak">
          Testing dashboard for all components
        </Text>
      </Box>

      {/* Test Links */}
      <Box gap="medium" width="medium">
        <a href="/test/auth" style={{ textDecoration: "none" }}>
          <Button label="🔐 Test Authentication" fill primary />
        </a>

        <a href="/test/db" style={{ textDecoration: "none" }}>
          <Button label="💾 Test Database" fill secondary />
        </a>

        <a href="/test/location" style={{ textDecoration: "none" }}>
          <Button label="📍 Test Location" fill secondary />
        </a>

        <Link href="/" style={{ textDecoration: "none" }}>
          <Button label="← Back to Home" fill />
        </Link>
      </Box>
    </Box>
  );
}
