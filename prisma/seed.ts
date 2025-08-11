// Seed script to add test data for healthcare app

import prisma from "../lib/prisma"; // Import your singleton Prisma client

async function main() {
  // Create sample organizations (hospitals)
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
    ],
    skipDuplicates: true, // Skip if already exists
  });

  // Create sample users linked to organizations
  await prisma.users.createMany({
    data: [
      {
        id: "user1",
        email: "nurse1@example.com",
        name: "Alice Johnson",
        role: "worker",
        organization_id: "org1",
        active: true,
      },
      {
        id: "user2",
        email: "doc1@example.com",
        name: "Dr. Robert Smith",
        role: "manager",
        organization_id: "org1",
        active: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
