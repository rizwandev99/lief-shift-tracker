// lib/locationUtils.ts
// Modern 2025 utilities for GPS distance calculations and geofencing
// Uses the industry-standard Haversine formula for precise Earth surface distances

// 🌍 EARTH'S RADIUS: Official value in meters (used by GPS systems worldwide)
const EARTH_RADIUS_METERS = 6371000; // 6,371 kilometers = 6,371,000 meters

// 🎯 TypeScript: Define the structure for GPS coordinates
export interface LocationCoordinates {
  latitude: number;   // North-South position (-90 to +90 degrees)
  longitude: number;  // East-West position (-180 to +180 degrees)
}

// 🎯 TypeScript: Define what our distance validation returns
export interface DistanceValidationResult {
  isWithinRadius: boolean;    // True if user is close enough to clock in
  distanceMeters: number;     // Exact distance in meters
  distanceFriendly: string;   // Human-readable distance like "50m" or "1.2km"
  radiusMeters: number;       // The allowed radius for reference
}

/**
 * 🧮 HAVERSINE FORMULA: Calculate precise distance between two GPS points
 * 
 * This is the gold standard for GPS distance calculation used by:
 * - Google Maps, Apple Maps, GPS navigation systems
 * - Aviation and maritime navigation
 * - Location-based services worldwide
 * 
 * @param point1 - First GPS coordinate (user's current location)
 * @param point2 - Second GPS coordinate (hospital location)
 * @returns Distance in meters (precise to within ~1 meter accuracy)
 */
export function calculateDistanceMeters(
  point1: LocationCoordinates, 
  point2: LocationCoordinates
): number {
  // Step 1: Convert degrees to radians (required for trigonometric functions)
  // Why? JavaScript's Math functions expect radians, not degrees
  const lat1Rad = degreesToRadians(point1.latitude);
  const lon1Rad = degreesToRadians(point1.longitude);
  const lat2Rad = degreesToRadians(point2.latitude);
  const lon2Rad = degreesToRadians(point2.longitude);

  // Step 2: Calculate the differences in coordinates
  const deltaLat = lat2Rad - lat1Rad;  // Difference in latitude
  const deltaLon = lon2Rad - lon1Rad;  // Difference in longitude

  // Step 3: Apply the Haversine formula
  // This accounts for Earth's spherical shape (Earth is not perfectly flat!)
  const a = 
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  // Step 4: Calculate the angular distance in radians
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Step 5: Convert to actual distance using Earth's radius
  const distanceMeters = EARTH_RADIUS_METERS * c;

  return distanceMeters;
}

/**
 * 🎯 GEOFENCING: Check if user is within allowed radius of hospital
 * 
 * This is what prevents "buddy punching" (clocking in from home!)
 * Healthcare facilities typically use 50-200 meter radius depending on:
 * - Size of facility (large hospitals need bigger radius)
 * - GPS accuracy in the area (urban vs rural)
 * - Security requirements (stricter = smaller radius)
 * 
 * @param userLocation - Where the healthcare worker currently is
 * @param facilityLocation - Where the hospital/clinic is located  
 * @param allowedRadiusMeters - How close they need to be (e.g., 100 meters)
 * @returns Complete validation result with distance and human-friendly messages
 */
export function validateLocationWithinRadius(
  userLocation: LocationCoordinates,
  facilityLocation: LocationCoordinates, 
  allowedRadiusMeters: number
): DistanceValidationResult {
  // Calculate the exact distance between user and hospital
  const distanceMeters = calculateDistanceMeters(userLocation, facilityLocation);
  
  // Check if they're close enough to clock in
  const isWithinRadius = distanceMeters <= allowedRadiusMeters;

  // Create a human-friendly distance string
  const distanceFriendly = formatDistanceForHumans(distanceMeters);

  return {
    isWithinRadius,
    distanceMeters: Math.round(distanceMeters), // Round to nearest meter
    distanceFriendly,
    radiusMeters: allowedRadiusMeters
  };
}

/**
 * 🔧 HELPER FUNCTION: Convert degrees to radians
 * 
 * GPS coordinates are given in degrees (e.g., 40.7128° N)
 * But trigonometric functions need radians
 * Formula: radians = degrees × (π ÷ 180)
 */
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 📏 HELPER FUNCTION: Format distance in human-readable way
 * 
 * Examples:
 * - 15 meters → "15m"
 * - 1,200 meters → "1.2km" 
 * - 500 meters → "500m"
 */
function formatDistanceForHumans(meters: number): string {
  if (meters < 1000) {
    // Less than 1km: show in meters
    return `${Math.round(meters)}m`;
  } else {
    // 1km or more: show in kilometers with 1 decimal place
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)}km`;
  }
}

// 🏥 SAMPLE HOSPITAL LOCATIONS (for testing)
// In real app, these would come from your Supabase database
export const SAMPLE_HOSPITALS: Record<string, LocationCoordinates> = {
  // These are real hospital coordinates for testing
  'city-general': {
    latitude: 40.7589,   // New York Presbyterian Hospital  
    longitude: -73.9441
  },
  'metro-health': {
    latitude: 34.0522,   // Cedar Sinai Medical Center, LA
    longitude: -118.3756
  },
  'downtown-clinic': {
    latitude: 41.8781,   // Northwestern Memorial Hospital, Chicago  
    longitude: -87.6298
  }
};

/**
 * 🧪 TESTING FUNCTION: Simulate being at different distances from hospital
 * This helps test the system without physically traveling
 */
export function createTestLocation(
  baseLocation: LocationCoordinates,
  offsetMeters: number
): LocationCoordinates {
  // Roughly 1 degree latitude ≈ 111,000 meters
  // This is approximate but good enough for testing
  const latOffset = offsetMeters / 111000;
  
  return {
    latitude: baseLocation.latitude + latOffset,
    longitude: baseLocation.longitude
  };
}
