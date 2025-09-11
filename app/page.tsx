// app/page.tsx
// Simplified Auth0 v4.9.0 approach - NO custom imports needed
import { Box, Heading, Text, Card, CardBody, Button, Grid, Tag } from "grommet";
import { Shield, Clock, Analytics, User, Login, Logout } from "grommet-icons";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <Box pad="medium" style={{ minHeight: "100vh" }}>
      <Box direction="row" gap="small" align="center">
        <Shield size="large" color="brand" />
        <Heading level="2" margin="none">
          Lief Shift Tracker
        </Heading>
      </Box>

      {user ? (
        <Box gap="small" margin={{ top: "medium" }}>
          <Text>Welcome, {user.name}</Text>
          <a href="/auth/logout">
            <Button icon={<Logout />} label="Logout" secondary />
          </a>
        </Box>
      ) : (
        <Box gap="small" margin={{ top: "medium" }}>
          <a href="/auth/login">
            <Button icon={<Login />} label="Login" primary />
          </a>
        </Box>
      )}
    </Box>
  );
}
