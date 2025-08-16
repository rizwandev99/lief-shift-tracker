// hooks/useGeolocation.ts
// Modern 2025 React hook for getting user's GPS location
// Following latest React hooks best practices and TypeScript patterns

import { useState } from "react";

// TypeScript: Define exactly what data structure we'll get back
interface LocationCoordinates {
  latitude: number; // User's north-south position (like: 40.7128)
  longitude: number; // User's east-west position (like: -74.0060)
}

// TypeScript: Define all possible states our hook can be in
interface GeolocationState {
  location: LocationCoordinates | null; // Either we have coordinates, or we don't
  error: string | null; // Either there's an error message, or there isn't
  loading: boolean; // Are we currently trying to get location?
}

// 🎯 MAIN HOOK: This is what components will use to get location
export function useGeolocation() {
  // Modern React pattern: Single state object instead of multiple useState calls
  const [state, setState] = useState<GeolocationState>({
    location: null, // Start with no location
    error: null, // Start with no error
    loading: false, // Start not loading
  });

  // 🔧 FUNCTION: This actually gets the user's location
  const getCurrentLocation = (): void => {
    // Step 1: Tell the user we're starting to load
    setState((prevState) => ({
      ...prevState,
      loading: true, // Show loading spinner
      error: null, // Clear any previous errors
    }));

    // Step 2: Check if the browser even supports location services
    // (Modern browsers support this, but older ones might not)
    if (!navigator.geolocation) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error:
          "Your browser does not support location services. Please use a modern browser like Chrome, Firefox, or Safari.",
      }));
      return; // Stop here if no support
    }

    // Step 3: Ask the browser to get the user's current position
    // This will show a permission popup to the user
    navigator.geolocation.getCurrentPosition(
      // ✅ SUCCESS: User allowed location and we got their coordinates
      (position: GeolocationPosition) => {
        setState((prevState) => ({
          ...prevState,
          loading: false, // Stop loading
          error: null, // Clear errors
          location: {
            latitude: position.coords.latitude, // User's GPS latitude
            longitude: position.coords.longitude, // User's GPS longitude
          },
        }));
      },

      // ❌ ERROR: Something went wrong (user denied, GPS off, etc.)
      (error: GeolocationPositionError) => {
        // Convert technical error codes into human-friendly messages
        let friendlyErrorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            friendlyErrorMessage =
              "Location access denied. Please enable location permissions in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            friendlyErrorMessage =
              "Location information is unavailable. Please check your GPS settings.";
            break;
          case error.TIMEOUT:
            friendlyErrorMessage =
              "Location request timed out. Please try again.";
            break;
          default:
            friendlyErrorMessage =
              "An unknown error occurred while getting your location.";
            break;
        }

        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: friendlyErrorMessage,
          location: null, // Clear any previous location
        }));
      },

      // ⚙️ OPTIONS: How we want the GPS to behave (2025 best practices)
      {
        enableHighAccuracy: true, // Use GPS instead of cell towers (more accurate)
        timeout: 10000, // Give up after 10 seconds if no response
        maximumAge: 300000, // Accept cached location if it's less than 5 minutes old
      }
    );
  };

  // 🎁 RETURN: Give the component everything it needs
  // Modern pattern: Return both data and actions in one object
  return {
    // Current state data
    location: state.location, // The GPS coordinates (or null)
    error: state.error, // Any error message (or null)
    loading: state.loading, // Whether we're currently loading

    // Actions the component can trigger
    getCurrentLocation, // Function to start getting location
  };
}