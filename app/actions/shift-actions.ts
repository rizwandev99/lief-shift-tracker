// app/actions/shift-actions.ts
// Server Actions for clock-in/clock-out functionality with location validation
// Following Next.js 15 and 2025 best practices

"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";
import { z } from "zod";

// 📋 VALIDATION SCHEMAS - Define what data we expect from the client
const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
});

const ClockInSchema = z.object({
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
    // In development mode, use a simpler approach
    if (process.env.NODE_ENV === "development") {
      // Try to get the authenticated user first
      try {
        const session = await getSession();
        if (session?.user?.email) {
          // Get user from database using Auth0 email
          const user = await prisma.users.findUnique({
            where: { email: session.user.email },
          });

          if (user) {
            return user;
          }
        }
      } catch (authError) {
        console.log("Auth0 session not available, using fallback");
      }

      // Fallback: Use first manager user for development testing
      const managerUser = await prisma.users.findFirst({
        where: { role: "manager" },
      });

      if (managerUser) {
        console.log("Using fallback manager user for development:", managerUser.email);
        return managerUser;
      }

      // Last resort: Use any user
      const anyUser = await prisma.users.findFirst({});
      if (anyUser) {
        console.log("Using fallback user for development:", anyUser.email);
        return anyUser;
      }

      throw new Error("No users found in database");
    } else {
      // Production mode - require proper Auth0 authentication
      const session = await getSession();
      if (!session?.user?.email) {
        throw new Error("User not authenticated");
      }

      // Get user from database using Auth0 email
      const user = await prisma.users.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        throw new Error("User not found in database");
      }

      return user;
    }
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
      location: {
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
      },
      notes: (formData.get("notes") as string) || "",
    };

    const validatedData = ClockInSchema.parse(rawData);

    // 2️⃣ Get authenticated user
    const user = await getCurrentUser();

    // 3️⃣ Get organization details from database
    const organization = await prisma.organizations.findFirst();
    if (!organization) {
      throw new Error("No organization configured. Please contact your administrator.");
    }

    // 4️⃣ Validate user is within organization's geofence
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

    // 5️⃣ Check if user already has an active shift
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

    // 6️⃣ Create new shift record
    const newShift = await prisma.shifts.create({
      data: {
        user_id: user.id,
        clock_in_time: new Date(),
        clock_in_latitude: validatedData.location.latitude, // Float field from your schema
        clock_in_longitude: validatedData.location.longitude, // Float field from your schema
        notes: validatedData.notes,
      },
    });

    // 7️⃣ Revalidate relevant pages to show updated data
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

    // 6️⃣ Get organization details from database
    const organization = await prisma.organizations.findFirst();
    if (!organization) {
      throw new Error("No organization configured. Please contact your administrator.");
    }

    // 7️⃣ Validate user is within organization's geofence
    const distance = calculateDistance(
      validatedData.location.latitude,
      validatedData.location.longitude,
      organization.latitude,
      organization.longitude
    );

    if (distance > organization.radius) {
      throw new Error(
        `You must be within ${organization.radius}m of ${organization.name} to clock out. ` +
          `You are currently ${Math.round(distance)}m away.`
      );
    }

    // 8️⃣ Calculate shift duration
    const clockOutTime = new Date();
    const shiftDurationMs =
      clockOutTime.getTime() - shift.clock_in_time.getTime();
    const shiftDurationHours =
      Math.round((shiftDurationMs / (1000 * 60 * 60)) * 100) / 100;

    // 9️⃣ Update shift record with clock-out info
    await prisma.shifts.update({
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

    // 10️⃣ Revalidate relevant pages
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

/**
 * Get Shift History (in Worker Dashboard) - Get user's completed shifts
 */
export async function getShiftHistoryAction() {
  try {
    const user = await getCurrentUser();

    const shiftHistory = await prisma.shifts.findMany({
      where: {
        user_id: user.id,
        clock_out_time: { not: null }, // Only completed shifts
      },
      orderBy: {
        clock_in_time: "desc", // Most recent first
      },
      take: 10, // Last 10 shifts
    });

    return {
      success: true,
      shiftHistory,
    };
  } catch (error) {
    console.error("Get shift history error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get shift history",
    };
  }
}

/**
 * Manager Actions - Get all currently clocked-in staff
 */
export async function getActiveStaffAction() {
  try {
    const user = await getCurrentUser();

    // Check if user has manager or admin role
    if (user.role !== "manager" && user.role !== "admin") {
      throw new Error("Access denied. Manager or admin role required.");
    }

    const activeStaff = await prisma.shifts.findMany({
      where: {
        clock_out_time: null, // Currently active shifts
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        clock_in_time: "desc",
      },
    });
    console.log("Activa", activeStaff);
    return {
      success: true,
      activeStaff,
    };
  } catch (error) {
    console.error("Get active staff error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get active staff",
    };
  }
}

/**
 * Manager Actions - Get all staff shift history
 */
export async function getAllStaffHistoryAction() {
  try {
    const user = await getCurrentUser();

    // Check if user has manager or admin role
    if (user.role !== "manager" && user.role !== "admin") {
      throw new Error("Access denied. Manager or admin role required.");
    }

    const staffHistory = await prisma.shifts.findMany({
      where: {
        clock_out_time: { not: null }, // Completed shifts only
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        clock_out_time: "desc",
      },
      take: 50, // Last 50 completed shifts
    });

    return {
      success: true,
      staffHistory,
    };
  } catch (error) {
    console.error("Get all staff history error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get staff history",
    };
  }
}

/**
 * Manager Actions - Get analytics data
 */
export async function getAnalyticsAction() {
  try {
    const user = await getCurrentUser();

    // Check if user has manager or admin role
    if (user.role !== "manager" && user.role !== "admin") {
      throw new Error("Access denied. Manager or admin role required.");
    }

    // Get data for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Total active staff today
    const activeToday = await prisma.shifts.count({
      where: {
        clock_in_time: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today
        },
        clock_out_time: null,
      },
    });

    // Total shifts last 7 days
    const shiftsLastWeek = await prisma.shifts.findMany({
      where: {
        clock_in_time: {
          gte: sevenDaysAgo,
        },
        clock_out_time: { not: null },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Calculate average hours per day
    const totalHours = shiftsLastWeek.reduce((sum, shift) => {
      if (shift.clock_out_time) {
        const duration =
          (new Date(shift.clock_out_time).getTime() -
            new Date(shift.clock_in_time).getTime()) /
          (1000 * 60 * 60);
        return sum + duration;
      }
      return sum;
    }, 0);

    const avgHoursPerDay = totalHours / 7;

    // Daily clock-ins for last 7 days
    const dailyClockIns: Array<{ date: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await prisma.shifts.count({
        where: {
          clock_in_time: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      dailyClockIns.push({
        date: startOfDay.toDateString(),
        count,
      });
    }

    return {
      success: true,
      analytics: {
        activeToday,
        avgHoursPerDay: Math.round(avgHoursPerDay * 100) / 100,
        totalShiftsLastWeek: shiftsLastWeek.length,
        dailyClockIns,
        shiftsLastWeek: shiftsLastWeek.slice(0, 10), // Top 10 recent shifts
      },
    };
  } catch (error) {
    console.error("Get analytics error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get analytics",
    };
  }
}

/**
 * Manager Actions - Update organization settings (location perimeter)
 */
export async function updateOrganizationSettingsAction(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // Check if user has manager or admin role
    if (user.role !== "manager" && user.role !== "admin") {
      throw new Error("Access denied. Manager or admin role required.");
    }

    const radius = parseFloat(formData.get("radius") as string);
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);

    if (!radius || !latitude || !longitude) {
      throw new Error("All fields are required");
    }

    // Update the organization settings in database
    await prisma.organizations.updateMany({
      data: {
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
        radius: parseInt(formData.get("radius") as string),
      },
    });

    revalidatePath("/manager");

    return {
      success: true,
      message: `Updated organization location settings`,
    };
  } catch (error) {
    console.error("Update organization error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update organization",
    };
  }
}

/*
Manager actions - Get organizations details to see for updating settings
*/

export async function getOrganizationSettingsAction() {
  try {
    const user = await getCurrentUser();

    // Check if user has manager or admin role
    if (user.role !== "manager" && user.role !== "admin") {
      throw new Error("Access denied. Manager or admin role required.");
    }

    // Hardcoded organization settings for "City General Hospital"
    const organizations = [
      {
        id: "city-general",
        name: "City General Hospital",
        latitude: 12.9716,
        longitude: 77.5946,
        radius: 200,
      },
    ];

    return {
      success: true,
      organizations,
    };
  } catch (error) {
    console.error("Get organization settings error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get organization settings",
    };
  }
}
