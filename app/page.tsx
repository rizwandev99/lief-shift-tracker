// app/page.tsx
// Homepage using beautiful Grommet components - CORRECTED ICONS

"use client";
import {
  Box, // Like a container/div but smarter
  Heading, // Professional headings
  Text, // Styled text
  Card, // Beautiful cards/containers
  CardBody, // Content inside cards
  Button, // Professional buttons
  Grid, // Layout system
  Tag, // Status badges
} from "grommet";
import {
  Shield, // For healthcare/security (verified icon)
  Clock, // Clock icon (verified icon)
  Analytics, // Chart icon (verified icon)
  User, // User icon (verified icon)
} from "grommet-icons";

export default function Home() {
  return (
    // Main page container - like the hospital's main lobby
    <Box
      fill
      background="background-front"
      pad="medium"
      style={{ minHeight: "100vh" }}
    >
      {/* Header section - hospital welcome area */}
      <Box align="center" margin={{ bottom: "large" }}>
        {/* Main title with icon */}
        <Box
          direction="row"
          align="center"
          gap="small"
          margin={{ bottom: "medium" }}
        >
          <Shield size="large" color="brand" />
          <Heading size="large" margin="none" color="brand">
            Lief Shift Tracker
          </Heading>
        </Box>

        {/* Subtitle description */}
        <Text
          size="large"
          textAlign="center"
          color="text"
          margin={{ bottom: "medium" }}
        >
          Healthcare worker shift management made simple and secure
        </Text>

        {/* Development status badge */}
        <Tag
          value="🚧 Under Development - Feature by Feature"
          background="status-warning"
          size="medium"
        />
      </Box>

      {/* Feature showcase cards */}
      <Grid
        columns={{ count: 2, size: "auto" }}
        gap="medium"
        margin={{ bottom: "large" }}
        responsive
      >
        {/* Care Worker Features Card */}
        <Card background="white" elevation="small">
          <CardBody pad="medium">
            <Box
              direction="row"
              align="center"
              gap="small"
              margin={{ bottom: "medium" }}
            >
              <Clock size="medium" color="accent-1" />
              <Heading level="3" margin="none">
                👨‍⚕️ Care Workers
              </Heading>
            </Box>

            <Box gap="small">
              <Text>✅ Clock in/out with GPS verification</Text>
              <Text>📝 Add optional notes to shifts</Text>
              <Text>📍 Location-based shift validation</Text>
              <Text>📱 Mobile-friendly interface</Text>
            </Box>

            {/* Action button (not functional yet) */}
            <Box margin={{ top: "medium" }}>
              <Button label="Worker Login" primary color="accent-1" disabled />
            </Box>
          </CardBody>
        </Card>

        {/* Manager Features Card */}
        <Card background="white" elevation="small">
          <CardBody pad="medium">
            <Box
              direction="row"
              align="center"
              gap="small"
              margin={{ bottom: "medium" }}
            >
              <Analytics size="medium" color="brand" />
              <Heading level="3" margin="none">
                👩‍💼 Managers
              </Heading>
            </Box>

            <Box gap="small">
              <Text>👥 View all staff in real-time</Text>
              <Text>📊 Shift analytics and reports</Text>
              <Text>🎯 Set location perimeters</Text>
              <Text>📈 Track attendance patterns</Text>
            </Box>

            {/* Action button (not functional yet) */}
            <Box margin={{ top: "medium" }}>
              <Button
                label="Manager Dashboard"
                primary
                color="brand"
                disabled
              />
            </Box>
          </CardBody>
        </Card>
      </Grid>

      {/* Development progress tracker */}
      <Card background="white" elevation="small">
        <CardBody pad="medium">
          <Box
            direction="row"
            align="center"
            gap="small"
            margin={{ bottom: "medium" }}
          >
            <User size="medium" color="accent-2" />
            <Heading level="3" margin="none">
              🏗️ Development Progress
            </Heading>
          </Box>

          {/* Progress items */}
          <Box gap="small">
            <Box direction="row" align="center" gap="small">
              <Box
                width="12px"
                height="12px"
                background="status-ok"
                round="full"
              />
              <Text>✅ Project Setup Complete</Text>
            </Box>

            <Box direction="row" align="center" gap="small">
              <Box
                width="12px"
                height="12px"
                background="status-ok"
                round="full"
              />
              <Text>✅ UI Library Integration Complete</Text>
            </Box>

            <Box direction="row" align="center" gap="small">
              <Box
                width="12px"
                height="12px"
                background="status-unknown"
                round="full"
              />
              <Text>⏳ Database Setup (Next)</Text>
            </Box>

            <Box direction="row" align="center" gap="small">
              <Box
                width="12px"
                height="12px"
                background="status-unknown"
                round="full"
              />
              <Text>⏳ Authentication System (Coming Soon)</Text>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
