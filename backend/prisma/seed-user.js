// Test Users Seeder
// Users yang sesuai dengan mock JWT tokens di tests/mocks/jwtMocks.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding test users...");

  // Generate 150 test users using loop
  const testUsers = [];
  for (let i = 1; i <= 150; i++) {
    testUsers.push({
      nik: String(i).padStart(16, "0"), // 16-digit NIK
      nip: String(i).padStart(18, "0"), // 18-digit NIP
      nama: `Test User ${i}`,
      created_by: null,
      updated_by: null,
    });
  }

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
