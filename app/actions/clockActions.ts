"use server"; // This directive tells Next.js this code runs on the server

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { createServerClient } from "@/lib/supabase-server";

// 🎯 TypeScript: Define the data structure for clock operations
interface ClockActionData {
  latitude: number; // User's GPS latitude
  longitude: number; // User's GPS longitude
  action: "clock_in" | "clock_out"; // What operation user is performing
  notes?: string; // Optional notes about the shift
}

// 🎯 TypeScript: Define what we get back from the database
interface ActiveShift {
  id: string;
  clock_in_time: string;
  clock_in_latitude: number;
  clock_in_longitude: number;
  user_id: string;
  organization_id: string;
}

/**
 * 🕐 MAIN CLOCK ACTION: Handle both clock-in and clock-out operations
 *
 * This server action follows 2025 best practices:
 * - Server-side validation and security
 * - Type-safe database operations
 * - Proper error handling
 * - Cache revalidation for instant UI updates
 *
 * @param formData - Form data from the client (includes GPS coordinates and action)
 * @returns Success/error response
 */
export async function handleClockAction(formData: FormData) {
  try {
    // Step 1: Check if user is authenticated (using your existing Auth0 setup)
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user) {
      throw new Error("You must be logged in to clock in/out");
    }

    // Step 2: Extract and validate form data
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);
    const action = formData.get("action") as "clock_in" | "clock_out";
    const notes = (formData.get("notes") as string) || "";

    // Validate required data
    if (!latitude || !longitude) {
      throw new Error("Location data is required for clock operations");
    }

    if (!action) {
      throw new Error("Clock action (in/out) is required");
    }

    // Step 3: Initialize Supabase client (using your existing setup)
    const supabase = createServerClient();

    // Step 4: Get user's organization (which hospital they work at)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, organization_id")
      .eq("email", user.email) // Match by email from Auth0
      .single();

    if (userError || !userData) {
      throw new Error("User profile not found. Please contact admin.");
    }

    // Step 5: Handle Clock-In Operation
    if (action === "clock_in") {
      return await handleClockIn({
        latitude,
        longitude,
        notes,
        userId: userData.id,
        organizationId: userData.organization_id,
        supabase,
      });
    }

    // Step 6: Handle Clock-Out Operation
    if (action === "clock_out") {
      return await handleClockOut({
        latitude,
        longitude,
        notes,
        userId: userData.id,
        supabase,
      });
    }
  } catch (error) {
    // Step 7: Handle any errors that occur
    console.error("Clock action error:", error);

    // Return user-friendly error message
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * 🟢 CLOCK-IN HELPER: Handle the clock-in process
 *
 * This function:
 * - Checks if user is already clocked in (prevents double clock-in)
 * - Validates user is within hospital perimeter
 * - Creates new shift record in database
 * - Updates UI cache for instant feedback
 */
async function handleClockIn({
  latitude,
  longitude,
  notes,
  userId,
  organizationId,
  supabase,
}: {
  latitude: number;
  longitude: number;
  notes: string;
  userId: string;
  organizationId: string;
  supabase: any;
}) {
  // Check if user is already clocked in (prevent double clock-in)
  const { data: activeShift } = await supabase
    .from("shifts")
    .select("id")
    .eq("user_id", userId)
    .is("clock_out_time", null) // Find shifts without clock-out time
    .single();

  if (activeShift) {
    return {
      success: false,
      error: "You are already clocked in! Please clock out first.",
    };
  }

  // TODO: Add location validation here (we'll do this in the next step)
  // For now, we'll allow clock-in from anywhere during development

  // Create new shift record in database
  const { data: newShift, error: insertError } = await supabase
    .from("shifts")
    .insert({
      user_id: userId,
      organization_id: organizationId,
      clock_in_time: new Date().toISOString(), // Current timestamp
      clock_in_latitude: latitude,
      clock_in_longitude: longitude,
      notes: notes || null,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error("Failed to save clock-in record. Please try again.");
  }

  // Update the UI cache so user sees immediate feedback
  revalidatePath("/clock"); // This refreshes the clock page

  return {
    success: true,
    message: "Successfully clocked in!",
    shiftId: newShift.id,
    clockInTime: newShift.clock_in_time,
  };
}

/**
 * 🔴 CLOCK-OUT HELPER: Handle the clock-out process
 *
 * This function:
 * - Finds the user's active shift (must be clocked in)
 * - Updates the shift record with clock-out data
 * - Calculates total shift duration
 * - Updates UI cache for instant feedback
 */
async function handleClockOut({
  latitude,
  longitude,
  notes,
  userId,
  supabase,
}: {
  latitude: number;
  longitude: number;
  notes: string;
  userId: string;
  supabase: any;
}) {
  // Find user's active shift (they must be clocked in)
  const { data: activeShift, error: findError } = await supabase
    .from("shifts")
    .select("id, clock_in_time")
    .eq("user_id", userId)
    .is("clock_out_time", null) // Find shift without clock-out time
    .single();

  if (findError || !activeShift) {
    return {
      success: false,
      error: "No active shift found. Please clock in first.",
    };
  }

  // Update shift record with clock-out data
  const clockOutTime = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("shifts")
    .update({
      clock_out_time: clockOutTime,
      clock_out_latitude: latitude,
      clock_out_longitude: longitude,
      notes: notes ? `${notes}` : null, // Append to existing notes if any
    })
    .eq("id", activeShift.id);

  if (updateError) {
    throw new Error("Failed to save clock-out record. Please try again.");
  }

  // Calculate shift duration for user feedback
  const clockInTime = new Date(activeShift.clock_in_time);
  const clockOutTimeObj = new Date(clockOutTime);
  const durationMs = clockOutTimeObj.getTime() - clockInTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Update the UI cache so user sees immediate feedback
  revalidatePath("/clock"); // This refreshes the clock page

  return {
    success: true,
    message: "Successfully clocked out!",
    shiftId: activeShift.id,
    clockOutTime: clockOutTime,
    shiftDuration: `${durationHours}h ${durationMinutes}m`,
  };
}

/**
 * 🔍 GET ACTIVE SHIFT: Check if user currently has an active shift
 *
 * This helper function is used by the UI to determine:
 * - Whether to show "Clock In" or "Clock Out" button
 * - Current shift information to display
 * - Shift duration for real-time updates
 */
export async function getActiveShift(): Promise<ActiveShift | null> {
  try {
    // Get authenticated user (using your existing Auth0 setup)
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user) {
      return null; // User not logged in
    }

    // Initialize Supabase client
    const supabase = createServerClient();

    // Get user's database ID
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single();

    if (!userData) {
      return null; // User profile not found
    }

    // Find active shift (clocked in but not clocked out)
    const { data: activeShift } = await supabase
      .from("shifts")
      .select(
        `
        id,
        clock_in_time,
        clock_in_latitude,
        clock_in_longitude,
        user_id,
        organization_id
      `
      )
      .eq("user_id", userData.id)
      .is("clock_out_time", null) // Only shifts without clock-out
      .single();

    return activeShift || null;
  } catch (error) {
    console.error("Error fetching active shift:", error);
    return null;
  }
}
