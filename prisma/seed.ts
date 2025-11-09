// Seed script to add comprehensive test data for healthcare app

import prisma from "../lib/prisma"; // Import your singleton Prisma client

async function main() {
  // Clear existing data first
  console.log("🧹 Clearing existing data...");
  await prisma.shifts.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.organizations.deleteMany({});

  // Create sample users (mix of workers and managers)
  await prisma.users.createMany({
    data: [
      {
        id: "user1",
        email: "alice.johnson@citygeneral.com",
        name: "Alice Johnson",
        role: "worker",
        active: true,
      },
      {
        id: "user2",
        email: "robert.smith@citygeneral.com",
        name: "Dr. Robert Smith",
        role: "manager",
        active: true,
      },
      {
        id: "user3",
        email: "sarah.davis@citygeneral.com",
        name: "Sarah Davis",
        role: "worker",
        active: true,
      },
      {
        id: "user4",
        email: "michael.brown@citygeneral.com",
        name: "Michael Brown",
        role: "worker",
        active: true,
      },
      {
        id: "user5",
        email: "emma.wilson@citygeneral.com",
        name: "Emma Wilson",
        role: "worker",
        active: true,
      },
      {
        id: "user6",
        email: "james.garcia@citygeneral.com",
        name: "Dr. James Garcia",
        role: "manager",
        active: true,
      },
      {
        id: "user7",
        email: "lisa.martinez@citygeneral.com",
        name: "Lisa Martinez",
        role: "worker",
        active: true,
      },
      {
        id: "user8",
        email: "david.anderson@citygeneral.com",
        name: "David Anderson",
        role: "worker",
        active: true,
      },
      {
        id: "user9",
        email: "jennifer.lopez@citygeneral.com",
        name: "Dr. Jennifer Lopez",
        role: "manager",
        active: true,
      },
      {
        id: "user10",
        email: "chris.taylor@citygeneral.com",
        name: "Chris Taylor",
        role: "worker",
        active: true,
      },
      {
        id: "user11",
        email: "amy.white@citygeneral.com",
        name: "Amy White",
        role: "worker",
        active: true,
      },
      {
        id: "user12",
        email: "mark.johnson@citygeneral.com",
        name: "Dr. Mark Johnson",
        role: "manager",
        active: true,
      },
    ],
  });

  // Generate comprehensive shift data for the last 7 days
  const now = new Date();
  const shifts = [];

  // Helper function to generate random shifts
  const generateShiftsForUser = (userId: string, daysBack: number = 7) => {
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
          clock_in_time: clockInTime,
          clock_in_latitude: 12.9716 + (Math.random() - 0.5) * 0.01, // Slight GPS variation for City General Hospital
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
    shifts.push(...generateShiftsForUser(userId));
  }

  // Insert all shifts
  await prisma.shifts.createMany({
    data: shifts,
  });

  // Create organization
  await prisma.organizations.create({
    data: {
      id: "city-general",
      name: "City General Hospital",
      latitude: 12.9716,
      longitude: 77.5946,
      radius: 200,
    },
  });

  console.log(`✅ Seed data inserted successfully:`);
  console.log(`   - 1 organization (City General Hospital)`);
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
