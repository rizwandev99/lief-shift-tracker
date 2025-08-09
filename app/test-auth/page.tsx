export const dynamic = "force-dynamic"; // Add to your page
// app/test-auth/page.tsx
// Clean, simple authentication test page using your working pattern

import { Box, Heading, Text, Button, Card, CardBody } from "grommet";
import {
  Lock,
  Login,
  Logout,
  User,
  FormCheckmark,
  StatusInfo,
} from "grommet-icons";
import { auth0 } from "@/lib/auth0";

export default async function TestAuthPage() {
  // Same pattern as your homepage
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <Box
      fill
      background="background-front"
      pad="medium"
      align="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      {/* Page Header */}
      <Box align="center" margin={{ bottom: "large" }}>
        <Lock size="xlarge" color="brand" />
        <Heading level="2" margin="small">
          🔐 Auth Test
        </Heading>
        <Text size="medium" color="text-weak" textAlign="center">
          Simple authentication testing page
        </Text>
      </Box>

      {/* Authentication Status */}
      <Card background="white" elevation="small" width="large">
        <CardBody pad="medium">
          <Box align="center" gap="medium">
            {user ? (
              <Box align="center" gap="medium">
                <FormCheckmark size="large" color="status-ok" />
                <Text size="large" weight="bold" color="status-ok">
                  ✅ Authenticated
                </Text>
                <Box align="center" gap="small">
                  <Text>
                    <strong>Name:</strong> {user.name}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {user.email}
                  </Text>
                </Box>
                <a href="/auth/logout">
                  <Button icon={<Logout />} label="Logout" secondary />
                </a>
              </Box>
            ) : (
              <Box align="center" gap="medium">
                <StatusInfo size="large" color="text-weak" />
                <Text size="large" weight="bold">
                  Not Authenticated
                </Text>
                <Text size="small" color="text-weak">
                  Click login to test authentication
                </Text>
                <a href="/auth/login">
                  <Button icon={<Login />} label="Login" primary />
                </a>
              </Box>
            )}
          </Box>
        </CardBody>
      </Card>

      {/* Navigation */}
      <Box direction="row" gap="small" margin={{ top: "medium" }}>
        <a href="/">
          <Button label="Home" />
        </a>
        <a href="/test-db">
          <Button label="Test DB" />
        </a>
        <a href="/test-location">
          <Button label="Test Location" />
        </a>
      </Box>
    </Box>
  );
}
