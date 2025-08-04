// app/test-db/page.tsx
// Test page to verify our database connection works

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Box, Heading, Text } from "grommet";

export default function TestDatabase() {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Testing...");

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to fetch from users table
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .limit(1);

        if (error) {
          setConnectionStatus(`Error: ${error.message}`);
        } else {
          setConnectionStatus("✅ Database connected successfully!");
        }
      } catch (err) {
        setConnectionStatus("❌ Connection failed");
      }
    }

    testConnection();
  }, []);

  return (
    <Box pad="medium" align="center">
      <Heading level="2">Database Connection Test</Heading>
      <Text size="large">{connectionStatus}</Text>
    </Box>
  );
}
