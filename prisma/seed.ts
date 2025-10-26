// Seed script to add comprehensive test data for healthcare app

import prisma from "../lib/prisma"; // Import your singleton Prisma client

async function main() {
  // Clear existing data first
  console.log("🧹 Clearing existing data...");
  await prisma.shifts.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.organizations.deleteMany({});

  // Create sample organizations (hospitals and clinics)
  await prisma.organizations.createMany({
    data: [
      {
        id: "org1",
        name: "City General Hospital",
        latitude: 12.9716,
        longitude: 77.5946,
        radius: 200, // 200 meters radius for geofence
      },
      {
        id: "org2",
        name: "Downtown Clinic",
        latitude: 12.9352,
        longitude: 77.6245,
        radius: 100,
      },
      {
        id: "org3",
        name: "Metro Medical Center",
        latitude: 12.9822,
        longitude: 77.6033,
        radius: 150,
      },
      {
        id: "org4",
        name: "Riverside Health Clinic",
        latitude: 12.9237,
        longitude: 77.6141,
        radius: 120,
      },
      {
        id: "org5",
        name: "Sunshine Children's Hospital",
        latitude: 12.9569,
        longitude: 77.7011,
        radius: 180,
      },
    ],
  });

  // Create sample users linked to organizations (mix of workers and managers)
  await prisma.users.createMany({
    data: [
      // City General Hospital
      {
        id: "user1",
        email: "alice.johnson@citygeneral.com",
        name: "Alice Johnson",
        role: "worker",
        organization_id: "org1",
        active: true,
      },
      {
        id: "user2",
        email: "robert.smith@citygeneral.com",
        name: "Dr. Robert Smith",
        role: "manager",
        organization_id: "org1",
        active: true,
      },
      {
        id: "user3",
        email: "sarah.davis@citygeneral.com",
        name: "Sarah Davis",
        role: "worker",
        organization_id: "org1",
        active: true,
      },
      {
        id: "user4",
        email: "michael.brown@citygeneral.com",
        name: "Michael Brown",
        role: "worker",
        organization_id: "org1",
        active: true,
      },

      // Downtown Clinic
      {
        id: "user5",
        email: "emma.wilson@downtownclinic.com",
        name: "Emma Wilson",
        role: "worker",
        organization_id: "org2",
        active: true,
      },
      {
        id: "user6",
        email: "james.garcia@downtownclinic.com",
        name: "Dr. James Garcia",
        role: "manager",
        organization_id: "org2",
        active: true,
      },
      {
        id: "user7",
        email: "lisa.martinez@downtownclinic.com",
        name: "Lisa Martinez",
        role: "worker",
        organization_id: "org2",
        active: true,
      },

      // Metro Medical Center
      {
        id: "user8",
        email: "david.anderson@metromedical.com",
        name: "David Anderson",
        role: "worker",
        organization_id: "org3",
        active: true,
      },
      {
        id: "user9",
        email: "jennifer.lopez@metromedical.com",
        name: "Dr. Jennifer Lopez",
        role: "manager",
        organization_id: "org3",
        active: true,
      },
      {
        id: "user10",
        email: "chris.taylor@metromedical.com",
        name: "Chris Taylor",
        role: "worker",
        organization_id: "org3",
        active: true,
      },

      // Riverside Health Clinic
      {
        id: "user11",
        email: "amy.white@riversidehealth.com",
        name: "Amy White",
        role: "worker",
        organization_id: "org4",
        active: true,
      },
      {
        id: "user12",
        email: "mark.johnson@riversidehealth.com",
        name: "Dr. Mark Johnson",
        role: "manager",
        organization_id: "org4",
        active: true,
      },
    ],
  });

  // Generate comprehensive shift data for the last 7 days
  const now = new Date();
  const shifts = [];

  // Helper function to generate random shifts
  const generateShiftsForUser = (userId: string, organizationId: string, daysBack: number = 7) => {
    const userShifts = [];
    const baseDate = new Date(now);
    baseDate.setDate(baseDate.getDate() - daysBack);

    // Generate 2-4 shifts per day for the last week
    for (let day = 0; day < daysBack; day++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + day);

      const numShifts = Math.floor(Math.random() * 3) + 2; // 2-4 shifts per day

      for (let shift = 0; shift < numShifts; shift++) {
        const clockInHour = 6 + Math.floor(Math.random() * 12); // 6 AM to 6 PM
        const shiftDuration = 4 + Math.floor(Math.random() * 8); // 4-12 hours

        const clockInTime = new Date(currentDate);
        clockInTime.setHours(clockInHour, Math.floor(Math.random() * 60), 0, 0);

        const clockOutTime = new Date(clockInTime);
        clockOutTime.setHours(clockInTime.getHours() + shiftDuration);

        // Some shifts are still active (no clock out time)
        const isActive = day === 0 && shift === 0 && Math.random() > 0.7; // 30% chance for active shift today

        userShifts.push({
          id: `shift_${userId}_${day}_${shift}`,
          user_id: userId,
          organization_id: organizationId,
          clock_in_time: clockInTime,
          clock_in_latitude: 12.9716 + (Math.random() - 0.5) * 0.01, // Slight GPS variation
          clock_in_longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
          clock_out_time: isActive ? null : clockOutTime,
          clock_out_latitude: isActive ? null : 12.9716 + (Math.random() - 0.5) * 0.01,
          clock_out_longitude: isActive ? null : 77.5946 + (Math.random() - 0.5) * 0.01,
          duration_minutes: isActive ? null : shiftDuration * 60,
          notes: isActive ? null : ["Smooth shift", "Busy day", "Quiet evening", "Emergency response"][Math.floor(Math.random() * 4)],
        });
      }
    }

    return userShifts;
  };

  // Generate shifts for all users
  const userIds = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10", "user11", "user12"];

  for (const userId of userIds) {
    // Determine organization based on user ID
    let orgId = "org1";
    if (userId.startsWith("user5") || userId.startsWith("user6") || userId.startsWith("user7")) orgId = "org2";
    else if (userId.startsWith("user8") || userId.startsWith("user9") || userId.startsWith("user10")) orgId = "org3";
    else if (userId.startsWith("user11") || userId.startsWith("user12")) orgId = "org4";

    shifts.push(...generateShiftsForUser(userId, orgId));
  }

  // Insert all shifts
  await prisma.shifts.createMany({
    data: shifts,
  });

  console.log(`✅ Seed data inserted successfully:`);
  console.log(`   - 5 organizations`);
  console.log(`   - 12 users (workers and managers)`);
  console.log(`   - ${shifts.length} shifts generated`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
