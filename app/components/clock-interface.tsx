// app/components/clock-interface.tsx
// Healthcare shift tracker with shift history - Following naming conventions
"use client";

import { useState, useEffect } from "react";
// @ts-ignore
import { useUser } from "@auth0/nextjs-auth0";
import { useGeolocation } from "../../hooks/use-geolocation";
import {
  clockInAction,
  clockOutAction,
  getActiveShiftAction,
  getShiftHistoryAction, // Import the new action
} from "../actions/shift-actions";

interface ActiveShift {
  id: string;
  clock_in_time: Date;
  organization: {
    id: string;
    name: string;
  };
}

interface ShiftHistory {
  id: string;
  clock_in_time: Date;
  clock_out_time: Date | null;
  organization: {
    id: string;
    name: string;
  };
  notes?: string | null;
}

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
  shiftId?: string;
  shiftDuration?: number;
}

export default function ClockInterface() {
  // Auth0 user authentication
  const { user, isLoading: userLoading } = useUser();

  // Your existing geolocation hook
  const {
    location,
    error: locationError,
    loading: locationLoading,
    getCurrentLocation,
  } = useGeolocation();

  // Component state
  const [activeShift, setActiveShift] = useState<ActiveShift | null>(null);
  const [shiftHistory, setShiftHistory] = useState<ShiftHistory[]>([]); // New state for history
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);
  const [notes, setNotes] = useState("");

  // Load active shift and history when user is ready
  useEffect(() => {
    if (user && !userLoading) {
      loadActiveShift();
      loadShiftHistory(); // Load history too
    }
  }, [user, userLoading]);

  // Load active shift using existing server action
  const loadActiveShift = async () => {
    try {
      const result = await getActiveShiftAction();
      if (result.success && result.activeShift) {
        setActiveShift(result.activeShift);
      }
    } catch (error) {
      console.error("Error loading active shift:", error);
    }
  };

  // Load shift history using new server action
  const loadShiftHistory = async () => {
    try {
      const result = await getShiftHistoryAction();
      if (result.success && result.shiftHistory) {
        setShiftHistory(result.shiftHistory);
      }
    } catch (error) {
      console.error("Error loading shift history:", error);
    }
  };

  // Clock In using existing server action and schema fields
  const handleClockIn = async () => {
    if (!location?.latitude || !location?.longitude) {
      setActionResult({
        success: false,
        error:
          "Location is required to clock in. Please get your location first.",
      });
      return;
    }

    if (!user?.email) {
      setActionResult({
        success: false,
        error: "You must be logged in to clock in.",
      });
      return;
    }

    setIsSubmitting(true);
    setActionResult(null);

    try {
      const formData = new FormData();
      formData.append("organizationId", "org1"); // Using seeded organization
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());
      formData.append("notes", notes);

      const result = await clockInAction(formData);
      setActionResult(result);

      if (result.success) {
        await loadActiveShift();
        setNotes("");
      }
    } catch (error) {
      setActionResult({
        success: false,
        error: "Failed to clock in. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clock Out using existing server action and schema fields
  const handleClockOut = async () => {
    if (!location?.latitude || !location?.longitude) {
      setActionResult({
        success: false,
        error:
          "Location is required to clock out. Please get your location first.",
      });
      return;
    }

    if (!activeShift) {
      setActionResult({
        success: false,
        error: "No active shift found to clock out.",
      });
      return;
    }

    setIsSubmitting(true);
    setActionResult(null);

    try {
      const formData = new FormData();
      formData.append("shiftId", activeShift.id);
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());
      formData.append("notes", notes);

      const result = await clockOutAction(formData);
      setActionResult(result);

      if (result.success) {
        setActiveShift(null);
        setNotes("");
        // Reload history to show the completed shift
        await loadShiftHistory();
      }
    } catch (error) {
      setActionResult({
        success: false,
        error: "Failed to clock out. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to calculate shift duration
  const calculateShiftDuration = (clockIn: Date, clockOut: Date): number => {
    const durationMs =
      new Date(clockOut).getTime() - new Date(clockIn).getTime();
    return Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimal places
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Authentication required
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl text-gray-800 font-bold mb-4">
            🔒 Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access the healthcare shift tracker.
          </p>
          <a
            href="/auth/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Log In to Continue
          </a>
        </div>
      </div>
    );
  }

  // Main interface
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              🏥 Healthcare Shift Tracker
            </h1>
            <a
              href="/api/auth/logout"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              🚪 Logout
            </a>
          </div>
          <p className="text-gray-600">Welcome, {user.name || user.email}</p>
        </div>

        {/* Location Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">📍 Location Status</h3>
            <button
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
            >
              {locationLoading ? "Getting..." : "Get Location"}
            </button>
          </div>

          {locationLoading ? (
            <div className="flex items-center text-yellow-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              Getting your location...
            </div>
          ) : locationError ? (
            <p className="text-red-600">❌ {locationError}</p>
          ) : location ? (
            <div className="text-green-600">
              <p className="font-medium">✅ Location Ready</p>
              <p className="text-xs text-gray-500 mt-1">
                Lat: {location.latitude.toFixed(4)}, Lng:{" "}
                {location.longitude.toFixed(4)}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">
              Click "Get Location" to enable location access
            </p>
          )}
        </div>

        {/* Active Shift Status */}
        {activeShift && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">
              🕐 Current Shift
            </h3>
            <div className="text-green-700">
              <p className="font-medium">{activeShift.organization.name}</p>
              <p className="text-sm">
                Started: {new Date(activeShift.clock_in_time).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Notes Input */}
        <div className="mb-6">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Shift Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your shift..."
            className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Optional shift details</span>
            <span>{notes.length}/500</span>
          </div>
        </div>

        {/* Action Result */}
        {actionResult && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              actionResult.success
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <p className="font-medium">
              {actionResult.success ? "✅" : "❌"}{" "}
              {actionResult.message || actionResult.error}
            </p>
            {actionResult.shiftDuration && (
              <p className="text-sm mt-1">
                Total shift duration: {actionResult.shiftDuration} hours
              </p>
            )}
          </div>
        )}

        {/* Clock Buttons */}
        <div className="space-y-4">
          {!activeShift ? (
            <button
              onClick={handleClockIn}
              disabled={isSubmitting || locationLoading || !location}
              className={`w-full py-4 px-4 rounded-lg font-bold text-white text-lg transition-all duration-200 ${
                isSubmitting || locationLoading || !location
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:bg-green-800 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Clocking In...
                </div>
              ) : (
                "🟢 Clock In"
              )}
            </button>
          ) : (
            <button
              onClick={handleClockOut}
              disabled={isSubmitting || locationLoading || !location}
              className={`w-full py-4 px-4 rounded-lg font-bold text-white text-lg transition-all duration-200 ${
                isSubmitting || locationLoading || !location
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 active:bg-red-800 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Clocking Out...
                </div>
              ) : (
                "🔴 Clock Out"
              )}
            </button>
          )}
        </div>

        {/* NEW: Shift History Section */}
        {shiftHistory.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
              📊 Recent Shifts ({shiftHistory.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {shiftHistory.map((shift) => (
                <div
                  key={shift.id}
                  className="p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                >
                  {/* Organization and Date */}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800 text-sm">
                      {shift.organization.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(shift.clock_in_time).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Time Range */}
                  <div className="text-xs text-gray-600 mb-2">
                    <span className="inline-block mr-3">
                      ⏰ {new Date(shift.clock_in_time).toLocaleTimeString()} -{" "}
                      {new Date(shift.clock_out_time!).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-600 font-medium">
                      ⏱️ Duration:{" "}
                      {calculateShiftDuration(
                        shift.clock_in_time,
                        shift.clock_out_time!
                      )}
                      h
                    </span>
                    {shift.notes && <span className="text-gray-400">📝</span>}
                  </div>

                  {/* Notes (if any) */}
                  {shift.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      💬 {shift.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {!activeShift
              ? "Ensure you are at your assigned healthcare facility before clocking in."
              : "You must be at your work location to clock out successfully."}
          </p>
        </div>

        {/* Development Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs font-medium text-yellow-800 mb-1">
              Development Debug:
            </p>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>User: {user.email}</p>
              <p>
                Location:{" "}
                {location
                  ? `${location.latitude.toFixed(
                      4
                    )}, ${location.longitude.toFixed(4)}`
                  : "None"}
              </p>
              <p>Active Shift: {activeShift?.id || "None"}</p>
              <p>History Count: {shiftHistory.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
