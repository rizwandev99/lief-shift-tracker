// app/test-location/page.tsx  
// Enhanced location test page with hospital distance validation
// Tests both GPS functionality AND geofencing for healthcare workers

'use client'; // Browser-only component for GPS access

import { useState } from 'react';
import { Box, Heading, Text, Button, Card, CardBody, Select } from 'grommet';
import { Location, Alert, FormCheckmark, Refresh, MapLocation, Hospital } from 'grommet-icons';
import { useGeolocation } from '@/hooks/useGeolocation';
import { 
  validateLocationWithinRadius, 
  SAMPLE_HOSPITALS,
  createTestLocation,
  type LocationCoordinates 
} from '@/lib/locationUtils';

// 🎯 MAIN COMPONENT: Enhanced location testing with hospital validation
export default function EnhancedTestLocationPage() {
  // Get location functionality from our custom hook
  const { location, error, loading, getCurrentLocation } = useGeolocation();

  // State for hospital selection and testing
  const [selectedHospital, setSelectedHospital] = useState<string>('city-general');
  const [testMode, setTestMode] = useState<'real' | 'close' | 'far'>('real');

  // Get the coordinates for the selected hospital
  const hospitalLocation = SAMPLE_HOSPITALS[selectedHospital];

  // Calculate validation result if we have user location
  const validationResult = location ? validateLocationWithinRadius(
    testMode === 'real' ? location : 
    testMode === 'close' ? createTestLocation(hospitalLocation, 50) : // 50m away (should pass)
    createTestLocation(hospitalLocation, 500), // 500m away (should fail)
    hospitalLocation,
    100 // 100 meter radius requirement
  ) : null;

  return (
    <Box 
      fill 
      background="background-front" 
      pad="medium" 
      style={{ minHeight: '100vh' }}
    >
      
      {/* 📱 PAGE HEADER */}
      <Box align="center" margin={{ bottom: 'large' }}>
        <Hospital size="xlarge" color="brand" />
        <Heading level="2" margin="small" textAlign="center">
          🏥 Hospital Location Validator
        </Heading>
        <Text size="medium" color="text-weak" textAlign="center">
          Test if you're close enough to your healthcare facility to clock in
        </Text>
      </Box>

      {/* ⚙️ TEST CONTROLS */}
      <Card background="white" elevation="small" margin={{ bottom: 'medium' }}>
        <CardBody pad="medium">
          <Box gap="medium">
            
            {/* Hospital Selection */}
            <Box>
              <Text size="small" weight="bold" margin={{ bottom: 'small' }}>
                🏥 Select Hospital/Clinic:
              </Text>
              <Select
                options={[
                  { label: '🏥 City General Hospital (NYC)', value: 'city-general' },
                  { label: '🏥 Metro Health Center (LA)', value: 'metro-health' },
                  { label: '🏥 Downtown Clinic (Chicago)', value: 'downtown-clinic' }
                ]}
                value={selectedHospital}
                onChange={({ option }) => setSelectedHospital(option.value)}
              />
            </Box>

            {/* Test Mode Selection */}
            <Box>
              <Text size="small" weight="bold" margin={{ bottom: 'small' }}>
                🧪 Test Mode:
              </Text>
              <Select
                options={[
                  { label: '📍 Use My Real Location', value: 'real' },
                  { label: '✅ Simulate Being Close (50m)', value: 'close' },
                  { label: '❌ Simulate Being Far (500m)', value: 'far' }
                ]}
                value={testMode}
                onChange={({ option }) => setTestMode(option.value)}
              />
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* 🔘 GET LOCATION BUTTON */}
      <Box align="center" margin={{ bottom: 'large' }}>
        <Button
          icon={loading ? <Refresh /> : <Location />}
          label={loading ? 'Getting Your Location...' : 'Get My Location & Check Distance'}
          primary
          size="large"
          onClick={getCurrentLocation}
          disabled={loading}
        />
      </Box>

      {/* 📊 RESULTS SECTION */}
      <Box gap="medium">
        
        {/* ⏳ LOADING STATE */}
        {loading && (
          <Card background="white" elevation="small">
            <CardBody pad="medium">
              <Box direction="row" align="center" gap="small">
                <Refresh size="medium" color="accent-2" />
                <Text size="medium">
                  🔍 Getting your location and calculating distance to hospital...
                </Text>
              </Box>
            </CardBody>
          </Card>
        )}

        {/* ❌ ERROR STATE */}
        {error && (
          <Card background="status-error" elevation="small">
            <CardBody pad="medium">
              <Box direction="row" align="center" gap="small">
                <Alert size="medium" color="white" />
                <Box>
                  <Text size="medium" weight="bold" color="white">
                    ❌ Location Error
                  </Text>
                  <Text size="small" color="white">
                    {error}
                  </Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        )}

        {/* ✅ SUCCESS STATE WITH VALIDATION */}
        {location && validationResult && !loading && (
          <Box gap="medium">
            
            {/* GPS Location Info */}
            <Card background="white" elevation="small">
              <CardBody pad="medium">
                <Box direction="row" align="center" gap="small" margin={{ bottom: 'small' }}>
                  <FormCheckmark size="medium" color="status-ok" />
                  <Text size="medium" weight="bold" color="status-ok">
                    📍 Location Found!
                  </Text>
                </Box>
                
                <Box background="background-back" pad="small" round="small">
                  <Text size="small" weight="bold">
                    {testMode === 'real' ? 'Your Real GPS Coordinates:' : 
                     testMode === 'close' ? 'Simulated Close Location:' :
                     'Simulated Far Location:'}
                  </Text>
                  <Text size="small" family="monospace">
                    Lat: {(testMode === 'real' ? location.latitude : 
                            testMode === 'close' ? createTestLocation(hospitalLocation, 50).latitude :
                            createTestLocation(hospitalLocation, 500).latitude).toFixed(6)}
                  </Text>
                  <Text size="small" family="monospace">
                    Lon: {(testMode === 'real' ? location.longitude :
                            testMode === 'close' ? createTestLocation(hospitalLocation, 50).longitude :
                            createTestLocation(hospitalLocation, 500).longitude).toFixed(6)}
                  </Text>
                </Box>
              </CardBody>
            </Card>

            {/* Distance Validation Result */}
            <Card 
              background={validationResult.isWithinRadius ? "status-ok" : "status-error"} 
              elevation="small"
            >
              <CardBody pad="medium">
                <Box align="center" gap="small">
                  
                  {/* Success or Failure Icon */}
                  {validationResult.isWithinRadius ? (
                    <FormCheckmark size="large" color="white" />
                  ) : (
                    <Alert size="large" color="white" />
                  )}

                  {/* Main Status Message */}
                  <Text size="large" weight="bold" color="white" textAlign="center">
                    {validationResult.isWithinRadius ? 
                      '✅ You can clock in!' : 
                      '❌ Too far from hospital'}
                  </Text>

                  {/* Distance Details */}
                  <Box background="rgba(255,255,255,0.2)" pad="small" round="small" width="100%">
                    <Text size="small" color="white" textAlign="center" weight="bold">
                      📏 Distance to Hospital: {validationResult.distanceFriendly}
                    </Text>
                    <Text size="small" color="white" textAlign="center">
                      📍 Required: Within {validationResult.radiusMeters}m
                    </Text>
                    <Text size="small" color="white" textAlign="center">
                      🏥 Hospital: {selectedHospital.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </Box>

                  {/* Helpful Message */}
                  <Text size="small" color="white" textAlign="center">
                    {validationResult.isWithinRadius ? 
                      '🎉 You are within the allowed radius. Clock-in is permitted!' :
                      '🚶‍♂️ Please move closer to the hospital entrance to clock in.'}
                  </Text>
                </Box>
              </CardBody>
            </Card>

            {/* Map Link */}
            <Card background="white" elevation="small">
              <CardBody pad="small">
                <Text size="small" textAlign="center">
                  🗺️ <a 
                    href={`https://www.google.com/maps?q=${hospitalLocation.latitude},${hospitalLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'underline' }}
                  >
                    View {selectedHospital.replace('-', ' ')} on Google Maps
                  </a>
                </Text>
              </CardBody>
            </Card>
          </Box>
        )}

        {/* 💡 INITIAL STATE */}
        {!location && !error && !loading && (
          <Card background="white" elevation="small">
            <CardBody pad="medium">
              <Box align="center" gap="small">
                <MapLocation size="large" color="text-weak" />
                <Text size="medium" textAlign="center" color="text-weak">
                  Click the button above to test location-based clock-in validation
                </Text>
                <Text size="small" textAlign="center" color="text-weak">
                  💡 This simulates what healthcare workers will experience when clocking in
                </Text>
              </Box>
            </CardBody>
          </Card>
        )}
      </Box>

      {/* ℹ️ INFO CARD */}
      <Card background="accent-1" elevation="small" margin={{ top: 'large' }}>
        <CardBody pad="small">
          <Text size="small" color="white" textAlign="center">
            🏥 <strong>Healthcare Security:</strong> This ensures workers can only clock in when physically present at the facility, preventing time theft and ensuring patient care standards.
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
