import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAuth() {
  try {
    console.log("🌱 Seeding authentication data...");

    // Check if superadmin already exists
    const existingSuperadmin = await prisma.userSuperApp.findFirst({
      where: { username: "superadmin" },
    });

    if (existingSuperadmin) {
      console.log("✅ Superadmin user already exists");
      return;
    }

    // Create superadmin user
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("superadmin123", saltRounds);

    const superadmin = await prisma.userSuperApp.create({
      data: {
        username: "superadmin",
        password: hashedPassword,
        role: "superadmin",
      },
    });

    console.log("✅ Superadmin user created:", {
      id: superadmin.id,
      username: superadmin.username,
      role: superadmin.role,
    });

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", saltRounds);

    const admin = await prisma.userSuperApp.create({
      data: {
        username: "admin",
        password: adminPassword,
        role: "admin",
      },
    });

    console.log("✅ Admin user created:", {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    });

    console.log("🎉 Authentication seeding completed!");
    console.log("\n📝 Default credentials:");
    console.log("Superadmin: username=superadmin, password=superadmin123");
    console.log("Admin: username=admin, password=admin123");
  } catch (error) {
    console.error("❌ Error seeding authentication data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAuth();
