import { requireRole } from "@/lib/role-guards";
import { Box, Heading, Text } from "grommet";

export default async function ManagerPage() {
  const user = await requireRole("manager");
  return (
    <Box pad="medium">
      <Heading level="3">Manager Dashboard</Heading>
      <Text>Welcome, {user.email}</Text>
    </Box>
  );
}


