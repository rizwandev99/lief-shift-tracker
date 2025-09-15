export const dynamic = "force-dynamic"; // Add to your page

// app/test/auth/page.tsx
// Using environment variable for base URL - cleaner approach

import { Box, Heading, Text, Button } from "grommet";
import { Lock, Login, Logout, User } from "grommet-icons";
import { auth0 } from "@/lib/auth0";

export default async function TestAuthPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  // Get base URL from environment variable, fallback to localhost
  const baseUrl =
    process.env.AUTH0_BASE_URL ||
    process.env.APP_BASE_URL ||
    "http://localhost:3000";
  const returnPath = "/test/auth";
  const fullReturnUrl = `${baseUrl}${returnPath}`;

  return (
    <Box
      fill
      background="background-front"
      pad="medium"
      align="center"
      justify="center"
      style={{ minHeight: "100vh" }}
      gap="medium"
    >
      {/* Header */}
      <Box align="center" gap="small">
        <Lock size="large" color="brand" />
        <Heading level="2" margin="none">
          🔐 Auth Test
        </Heading>
      </Box>

      {/* Auth Status */}
      <Box align="center" gap="medium" width="medium">
        {user ? (
          <Box align="center" gap="medium">
            <Box
              background="status-ok"
              pad="medium"
              round="small"
              align="center"
              gap="small"
            >
              <Text size="large" weight="bold" color="white">
                ✅ Authenticated
              </Text>
              <Text color="white">
                <strong>Name:</strong> {user.name}
              </Text>
              <Text color="white">
                <strong>Email:</strong> {user.email}
              </Text>
            </Box>

            {/* Logout - using environment variable + path */}
            <a
              href={`/auth/logout?returnTo=${encodeURIComponent(
                fullReturnUrl
              )}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                icon={<Logout />}
                label="Test Logout"
                secondary
                size="large"
              />
            </a>
          </Box>
        ) : (
          <Box align="center" gap="medium">
            <Box
              background="status-unknown"
              pad="medium"
              round="small"
              align="center"
            >
              <Text size="large" weight="bold" color="white">
                ❌ Not Authenticated
              </Text>
              <Text color="white" size="small" textAlign="center">
                Click login to test authentication flow
              </Text>
            </Box>

            {/* Login - using environment variable + path */}
            <a
              href={`/auth/login?returnTo=${encodeURIComponent(fullReturnUrl)}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                icon={<Login />}
                label="Test Login"
                primary
                size="large"
              />
            </a>
          </Box>
        )}

        <a href="/test" style={{ textDecoration: "none" }}>
          <Button label="← Back to Test Hub" />
        </a>
      </Box>
    </Box>
  );
}
