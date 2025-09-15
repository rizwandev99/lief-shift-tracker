// app/test/page.tsx
// Main test hub - central place to access all testing pages
// Following Next.js 15 nested routing best practices

import { Box, Heading, Text, Card, CardBody, Grid } from 'grommet';
import { 
  Test, 
  Database, 
  Location, 
  Lock,
  FormCheckmark,
  Tools
} from 'grommet-icons';

export default function TestHubPage() {
  return (
    <Box 
      fill 
      background="background-front" 
      pad="medium" 
      style={{ minHeight: '100vh' }}
    >
      
      {/* Page Header */}
      <Box align="center" margin={{ bottom: 'large' }}>
        <Tools size="xlarge" color="brand" />
        <Heading level="2" margin="small" textAlign="center">
          🧪 Test Hub
        </Heading>
        <Text size="medium" color="text-weak" textAlign="center">
          Central testing dashboard for all application components
        </Text>
      </Box>

      {/* Test Categories */}
      <Grid columns={{ count: 2, size: 'auto' }} gap="medium" responsive>
        
        {/* Authentication Test */}
        <a href="/test/auth" style={{ textDecoration: 'none' }}>
          <Card background="white" elevation="small" hoverElevation="medium">
            <CardBody pad="medium">
              <Box align="center" gap="medium">
                <Lock size="large" color="brand" />
                <Heading level="3" margin="none" textAlign="center">
                  🔐 Authentication
                </Heading>
                <Text size="small" textAlign="center" color="text-weak">
                  Test Auth0 login/logout flow, user sessions, and server-side authentication
                </Text>
                <Box direction="row" align="center" gap="small">
                  <FormCheckmark size="small" color="status-ok" />
                  <Text size="small" color="status-ok">Server-side Auth0</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </a>

        {/* Database Test */}
        <a href="/test/db" style={{ textDecoration: 'none' }}>
          <Card background="white" elevation="small" hoverElevation="medium">
            <CardBody pad="medium">
              <Box align="center" gap="medium">
                <Database size="large" color="accent-1" />
                <Heading level="3" margin="none" textAlign="center">
                  💾 Database
                </Heading>
                <Text size="small" textAlign="center" color="text-weak">
                  Test Supabase connection, table queries, and data operations
                </Text>
                <Box direction="row" align="center" gap="small">
                  <FormCheckmark size="small" color="status-ok" />
                  <Text size="small" color="status-ok">Supabase Connected</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </a>

        {/* Location Test */}
        <a href="/test/location" style={{ textDecoration: 'none' }}>
          <Card background="white" elevation="small" hoverElevation="medium">
            <CardBody pad="medium">
              <Box align="center" gap="medium">
                <Location size="large" color="accent-2" />
                <Heading level="3" margin="none" textAlign="center">
                  📍 Location Services
                </Heading>
                <Text size="small" textAlign="center" color="text-weak">
                  Test GPS location access, hospital distance validation, and geofencing
                </Text>
                <Box direction="row" align="center" gap="small">
                  <FormCheckmark size="small" color="status-ok" />
                  <Text size="small" color="status-ok">GPS & Geofencing</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </a>

        {/* Future Test Placeholder */}
        <Card background="background-back" elevation="none">
          <CardBody pad="medium">
            <Box align="center" gap="medium">
              <Test size="large" color="text-weak" />
              <Heading level="3" margin="none" textAlign="center" color="text-weak">
                🚀 More Tests
              </Heading>
              <Text size="small" textAlign="center" color="text-weak">
                Additional testing modules will be added as we build more features
              </Text>
              <Text size="small" textAlign="center" color="text-weak">
                Coming next: Clock-in/out, Manager Dashboard, Role Management
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Grid>

      {/* Navigation Back to Main App */}
      <Box align="center" margin={{ top: 'large' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <Card background="brand" elevation="small">
            <CardBody pad="small">
              <Text color="white" textAlign="center">
                ← Back to Main Application
              </Text>
            </CardBody>
          </Card>
        </a>
      </Box>

      {/* Development Info */}
      <Card background="accent-1" elevation="small" margin={{ top: 'medium' }}>
        <CardBody pad="small">
          <Text size="small" color="white" textAlign="center">
            🧪 <strong>Development Environment:</strong> This test hub helps verify all components work correctly. Remove before production deployment.
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
