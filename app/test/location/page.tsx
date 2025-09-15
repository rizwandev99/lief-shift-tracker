// app/test/location/page.tsx
// Fixed UI - no overlapping text, clean layout

"use client";

import { Box, Heading, Text, Button } from "grommet";
import { Location, Refresh } from "grommet-icons";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function TestLocationPage() {
  const { location, error, loading, getCurrentLocation } = useGeolocation();

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
        <Location size="large" color="brand" />
        <Heading level="2" margin="none">
          📍 Location Test
        </Heading>
      </Box>

      {/* Main Button */}
      <Button
        icon={loading ? <Refresh /> : <Location />}
        label={loading ? "Getting Location..." : "Get My Location"}
        primary
        size="large"
        onClick={getCurrentLocation}
        disabled={loading}
      />

      {/* Results Section */}
      <Box align="center" gap="small" width="medium">
        {error && (
          <Box background="status-error" pad="small" round="small">
            <Text color="white" textAlign="center">
              ❌ Error: {error}
            </Text>
          </Box>
        )}

        {location && (
          <Box
            background="status-ok"
            pad="medium"
            round="small"
            align="center"
            gap="small"
          >
            <Text size="large" weight="bold" color="white">
              ✅ Location Found
            </Text>
            <Box gap="xsmall">
              <Text color="white" textAlign="center">
                <strong>Latitude:</strong> {location.latitude.toFixed(6)}
              </Text>
              <Text color="white" textAlign="center">
                <strong>Longitude:</strong> {location.longitude.toFixed(6)}
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Back Button */}
      <a href="/test" style={{ textDecoration: "none" }}>
        <Button label="← Back to Test Hub" />
      </a>
    </Box>
  );
}
