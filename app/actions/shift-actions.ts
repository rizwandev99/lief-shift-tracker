// app/actions/shift-actions.ts
// Server Actions for clock-in/clock-out functionality with location validation
// Following Next.js 15 and 2025 best practices

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";
import { z } from "zod";

// 📋 VALIDATION SCHEMAS - Define what data we expect from the client
const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
});

const ClockInSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  location: LocationSchema,
  notes: z.string().optional(),
});

const ClockOutSchema = z.object({
  shiftId: z.string().min(1, "Shift ID is required"),
  location: LocationSchema,
  notes: z.string().optional(),
});

// 🔧 HELPER FUNCTIONS

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in meters
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Get current authenticated user from Auth0 session
 */
async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    // Get user from database using Auth0 email
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    return user;
  } catch (error) {
    throw new Error(
      `Authentication failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// 🔒 MAIN SERVER ACTIONS

/**
 * Clock In Action - Start a new shift
 * Validates user location against organization's geofence
 */
export async function clockInAction(formData: FormData) {
  try {
    // 1️⃣ Parse and validate form data
    const rawData = {
      organizationId: formData.get("organizationId") as string,
      location: {
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
      },
      notes: (formData.get("notes") as string) || "",
    };

    const validatedData = ClockInSchema.parse(rawData);

    // 2️⃣ Get authenticated user
    const user = await getCurrentUser();

    // 3️⃣ Verify user belongs to this organization
    if (user.organization_id !== validatedData.organizationId) {
      throw new Error(
        "You are not authorized to clock in at this organization"
      );
    }

    // 4️⃣ Get organization details for location validation
    const organization = await prisma.organizations.findUnique({
      where: { id: validatedData.organizationId },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (
      !organization.radius ||
      organization.latitude == null ||
      organization.longitude == null
    ) {
      throw new Error("Organization location/radius not properly configured");
    }

    // 5️⃣ Validate user is within organization's geofence
    const distance = calculateDistance(
      validatedData.location.latitude,
      validatedData.location.longitude,
      organization.latitude,
      organization.longitude
    );

    if (distance > organization.radius) {
      throw new Error(
        `You must be within ${organization.radius}m of ${organization.name} to clock in. ` +
          `You are currently ${Math.round(distance)}m away.`
      );
    }

    // 6️⃣ Check if user already has an active shift
    const existingShift = await prisma.shifts.findFirst({
      where: {
        user_id: user.id,
        clock_out_time: null, // Active shift has no clock-out time
      },
    });

    if (existingShift) {
      throw new Error(
        "You already have an active shift. Please clock out first."
      );
    }

    // 7️⃣ Create new shift record
    const newShift = await prisma.shifts.create({
      data: {
        user_id: user.id,
        organization_id: validatedData.organizationId,
        clock_in_time: new Date(),
        clock_in_latitude: validatedData.location.latitude, // Float field from your schema
        clock_in_longitude: validatedData.location.longitude, // Float field from your schema
        notes: validatedData.notes,
      },
    });

    // 8️⃣ Revalidate relevant pages to show updated data
    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: `Successfully clocked in at ${organization.name}`,
      shiftId: newShift.id,
    };
  } catch (error) {
    console.error("Clock in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clock in",
    };
  }
}

/**
 * Clock Out Action - End current shift
 * Validates user location and closes active shift
 */
export async function clockOutAction(formData: FormData) {
  try {
    // 1️⃣ Parse and validate form data
    const rawData = {
      shiftId: formData.get("shiftId") as string,
      location: {
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
      },
      notes: (formData.get("notes") as string) || "",
    };

    const validatedData = ClockOutSchema.parse(rawData);

    // 2️⃣ Get authenticated user
    const user = await getCurrentUser();

    // 3️⃣ Get the shift to be closed
    const shift = await prisma.shifts.findUnique({
      where: { id: validatedData.shiftId },
      include: { organization: true },
    });

    if (!shift) {
      throw new Error("Shift not found");
    }

    // 4️⃣ Verify this shift belongs to the current user
    if (shift.user_id !== user.id) {
      throw new Error("You can only clock out of your own shifts");
    }

    // 5️⃣ Verify shift is still active (not already clocked out)
    if (shift.clock_out_time) {
      throw new Error("This shift has already been closed");
    }

    // 6️⃣ Validate user is within organization's geofence
    const distance = calculateDistance(
      validatedData.location.latitude,
      validatedData.location.longitude,
      shift.organization.latitude || 0,
      shift.organization.longitude || 0
    );

    if (distance > shift.organization.radius) {
      throw new Error(
        `You must be within ${shift.organization.radius}m of ${shift.organization.name} to clock out. ` +
          `You are currently ${Math.round(distance)}m away.`
      );
    }

    // 7️⃣ Calculate shift duration
    const clockOutTime = new Date();
    const shiftDurationMs =
      clockOutTime.getTime() - shift.clock_in_time.getTime();
    const shiftDurationHours =
      Math.round((shiftDurationMs / (1000 * 60 * 60)) * 100) / 100;

    // 8️⃣ Update shift record with clock-out info
    const updatedShift = await prisma.shifts.update({
      where: { id: shift.id },

      data: {
        clock_out_time: clockOutTime,
        clock_out_latitude: validatedData.location.latitude,
        clock_out_longitude: validatedData.location.longitude,
        notes: shift.notes
          ? `${shift.notes}\n\nClock-out: ${validatedData.notes}`
          : validatedData.notes,
      },
    });

    // 9️⃣ Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: `Successfully clocked out. Shift duration: ${shiftDurationHours} hours`,
      shiftDuration: shiftDurationHours,
    };
  } catch (error) {
    console.error("Clock out error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clock out",
    };
  }
}

/**
 * Get Active Shift - Check if user has an ongoing shift
 */
export async function getActiveShiftAction() {
  try {
    const user = await getCurrentUser();

    const activeShift = await prisma.shifts.findFirst({
      where: {
        user_id: user.id,
        clock_out_time: null,
      },
      include: {
        organization: {
          select: { name: true, id: true },
        },
      },
    });

    return {
      success: true,
      activeShift,
    };
  } catch (error) {
    console.error("Get active shift error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get active shift",
    };
  }
}
