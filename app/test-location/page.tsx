// app/test-location/page.tsx
// Test page to verify GPS location services work properly
// This is a CLIENT COMPONENT because it uses browser APIs (GPS)

'use client'; // 🚨 REQUIRED: Tell Next.js this runs in the browser, not the server

import { Box, Heading, Text, Button, Card, CardBody } from 'grommet';
import { Location, Alert, FormCheckmark, Refresh } from 'grommet-icons';
import { useGeolocation } from '@/hooks/useGeolocation';

// 🎯 MAIN COMPONENT: Simple page to test location services
export default function TestLocationPage() {
  // Use our custom hook to get location functionality
  const { location, error, loading, getCurrentLocation } = useGeolocation();

  return (
    <Box 
      fill 
      background="background-front" 
      pad="medium" 
      align="center" 
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      
      {/* 📱 PAGE HEADER */}
      <Box align="center" margin={{ bottom: 'large' }}>
        <Location size="xlarge" color="brand" />
        <Heading level="2" margin="small" textAlign="center">
          🧪 Location Services Test
        </Heading>
        <Text size="medium" color="text-weak" textAlign="center">
          Test if your device can provide GPS coordinates for the healthcare app
        </Text>
      </Box>

      {/* 🔘 MAIN ACTION BUTTON */}
      <Box margin={{ bottom: 'large' }}>
        <Button
          icon={loading ? <Refresh /> : <Location />}
          label={loading ? 'Getting Your Location...' : 'Get My Current Location'}
          primary
          size="large"
          onClick={getCurrentLocation}
          disabled={loading}  // Disable button while loading
        />
      </Box>

      {/* 📊 RESULTS SECTION */}
      <Card background="white" elevation="small" width="large">
        <CardBody pad="medium">
          
          {/* ⏳ LOADING STATE */}
          {loading && (
            <Box direction="row" align="center" gap="small">
              <Refresh size="medium" color="accent-2" />
              <Text size="medium">
                🔍 Requesting location permission... Please allow access when prompted.
              </Text>
            </Box>
          )}

          {/* ❌ ERROR STATE */}
          {error && (
            <Box direction="row" align="center" gap="small">
              <Alert size="medium" color="status-error" />
              <Box>
                <Text size="medium" weight="bold" color="status-error">
                  ❌ Location Error
                </Text>
                <Text size="small" color="text-weak">
                  {error}
                </Text>
              </Box>
            </Box>
          )}

          {/* ✅ SUCCESS STATE */}
          {location && !loading && (
            <Box gap="small">
              <Box direction="row" align="center" gap="small">
                <FormCheckmark size="medium" color="status-ok" />
                <Text size="medium" weight="bold" color="status-ok">
                  ✅ Location Found!
                </Text>
              </Box>
              
              {/* 📍 COORDINATE DISPLAY */}
              <Box 
                background="background-back" 
                pad="small" 
                round="small"
                margin={{ top: 'small' }}
              >
                <Text size="small" weight="bold">📍 Your GPS Coordinates:</Text>
                <Text size="small" family="monospace">
                  Latitude: {location.latitude.toFixed(6)}
                </Text>
                <Text size="small" family="monospace">
                  Longitude: {location.longitude.toFixed(6)}
                </Text>
              </Box>

              {/* 🔗 HELPFUL LINKS */}
              <Box margin={{ top: 'small' }}>
                <Text size="small" color="text-weak">
                  🗺️ You can view this location on{' '}
                  <a 
                    href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'underline' }}
                  >
                    Google Maps
                  </a>
                </Text>
              </Box>
            </Box>
          )}

          {/* 💡 INITIAL STATE (no location yet) */}
          {!location && !error && !loading && (
            <Box align="center" gap="small">
              <Location size="large" color="text-weak" />
              <Text size="medium" textAlign="center" color="text-weak">
                Click the button above to test location services
              </Text>
              <Text size="small" textAlign="center" color="text-weak">
                💡 This will ask for permission to access your device's GPS
              </Text>
            </Box>
          )}

        </CardBody>
      </Card>

      {/* ℹ️ HELPFUL INFORMATION */}
      <Box margin={{ top: 'large' }} width="large">
        <Card background="accent-1" elevation="small">
          <CardBody pad="small">
            <Text size="small" color="white" textAlign="center">
              💡 <strong>For Healthcare Workers:</strong> This location feature will later ensure you can only clock in when you're physically at the hospital or clinic.
            </Text>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}


