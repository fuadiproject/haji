// Test Users Seeder
// Users yang sesuai dengan mock JWT tokens di tests/mocks/jwtMocks.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding test users...");

  // Test users yang sesuai dengan mock JWT
  const testUsers = [
    {
      nik: "1234567890123456",
      nip: "123456789012345678",
      nama: "Test User 1",
      created_by: null,
      updated_by: null,
    },
    {
      nik: "9876543210987654",
      nip: "987654321098765432",
      nama: "Test User 2",
      created_by: null,
      updated_by: null,
    },
    {
      nik: "5555555555555555",
      nip: "555555555555555555",
      nama: "Test User 3",
      created_by: null,
      updated_by: null,
    },
    {
      nik: "1111111111111111",
      nip: "111111111111111111",
      nama: "Test User 4",
      created_by: null,
      updated_by: null,
    },
    {
      nik: "2222222222222222",
      nip: "222222222222222222",
      nama: "Test User 5",
      created_by: null,
      updated_by: null,
    },
  ];

  for (const user of testUsers) {
    try {
      // Upsert user (create if not exists, update if exists)
      await prisma.user.upsert({
        where: { nik: user.nik },
        update: {
          nama: user.nama,
          nip: user.nip,
          updated_by: user.updated_by,
        },
        create: user,
      });
      console.log(`✅ User ${user.nik} (${user.nama}) seeded`);
    } catch (error) {
      console.error(`❌ Error seeding user ${user.nik}:`, error);
    }
  }

  console.log("🎉 Test users seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
