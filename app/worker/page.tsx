import { requireUser } from "@/lib/auth-guards";
import { Box, Heading, Text } from "grommet";

export default async function WorkerPage() {
  const user = await requireUser();
  return (
    <Box pad="medium">
      <Heading level="3">Worker Dashboard</Heading>
      <Text>Signed in as {user.email}</Text>
    </Box>
  );
}


