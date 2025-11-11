export const dynamic = "force-dynamic"; // Add to your page

// app/test/auth/page.tsx
// Using environment variable for base URL - cleaner approach

import { Box, Heading, Text, Button } from "grommet";
import { Lock, Login, Logout } from "grommet-icons";
import { getSession } from "@auth0/nextjs-auth0";

export default async function TestAuthPage() {
  const session = await getSession();
  const user = session?.user;

  // Get base URL from environment variable, fallback to localhost
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3001";
  const returnPath = "/test/auth";
  const fullReturnUrl = `${baseUrl}${returnPath}`;

  console.log('Auth test page - Session:', !!session, 'User:', !!user);
  console.log('Base URL:', baseUrl, 'Return URL:', fullReturnUrl);
  console.log('APP_BASE_URL env:', process.env.APP_BASE_URL);
  console.log('AUTH0_BASE_URL env:', process.env.AUTH0_BASE_URL);

  // Force dynamic rendering to avoid caching issues
  const timestamp = Date.now();

  // If no session, redirect to login immediately for testing
  if (!session) {
    console.log('No session found, redirecting to login...');
    // Don't redirect automatically, let user click the button
  } else {
    console.log('Session found! User authenticated.');
  }

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
              href={`/api/auth/logout?returnTo=${encodeURIComponent(
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
              href={`/api/auth/login?returnTo=${encodeURIComponent(fullReturnUrl)}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                icon={<Login />}
                label="Test Login"
                primary
                size="large"
              />
            </a>

            {/* Debug Info */}
            <Box background="light-2" pad="small" round="small" margin={{ top: "medium" }}>
              <Text size="small" color="dark-3">
                <strong>Debug Info:</strong><br/>
                Base URL: {baseUrl}<br/>
                Return URL: {fullReturnUrl}<br/>
                Session: {session ? 'Yes' : 'No'}<br/>
                User: {user ? 'Yes' : 'No'}<br/>
                Timestamp: {timestamp}
              </Text>
            </Box>
          </Box>
        )}

        <a href="/test" style={{ textDecoration: "none" }}>
          <Button label="← Back to Test Hub" />
        </a>
      </Box>
    </Box>
  );
}
