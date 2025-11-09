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
        const { error } = await supabase
          .from("users")
          .select("*")
          .limit(1);

        if (error) {
          setConnectionStatus(`Error: ${error.message}`);
        } else {
          setConnectionStatus("✅ Database connected successfully!");
        }
      } catch {
        setConnectionStatus("❌ Connection failed");
      }
    }

    testConnection();
  }, []);

  return (
    <Box
      style={{ minHeight: "100vh" }}
      align="center"
      justify="center"
      pad="medium"
    >
      <Heading level="2">Database Connection Test</Heading>
      <Text size="large">{connectionStatus}</Text>
    </Box>
  );
}
