import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAuth() {
  try {
    console.log("🌱 Seeding authentication data...");

    // Check if superadmin already exists
    const existingSuperadmin = await prisma.userSuperApp.findFirst({
      where: { email: "superadmin@email.com" },
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
        name: "Superadmin",
        email: "superadmin@email.com",
        password: hashedPassword,
        role: "superadmin",
      },
    });

    console.log("✅ Superadmin user created:", {
      id: superadmin.id,
      email: superadmin.email,
      role: superadmin.role,
    });

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", saltRounds);

    const admin = await prisma.userSuperApp.create({
      data: {
        name: "Admin",
        email: "admin@email.com",
        password: adminPassword,
        role: "admin",
      },
    });

    console.log("✅ Admin user created:", {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    console.log("🎉 Authentication seeding completed!");
    console.log("\n📝 Default credentials:");
    console.log(
      "Superadmin: email=superadmin@email.com, password=superadmin123"
    );
    console.log("Admin: email=admin@email.com, password=admin123");
  } catch (error) {
    console.error("❌ Error seeding authentication data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAuth();
