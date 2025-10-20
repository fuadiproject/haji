// Simple test script for notification endpoint
import app from "./src/app.js";
import request from "supertest";

// Create a proper JWT token with nama and nip fields
import jwt from "jsonwebtoken";

const mockPayload = {
  user_id: "clx1234567890abcdef",
  nama: "Test User",
  nip: "1234567890123456",
  role: "user",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
};

const mockJWT = jwt.sign(mockPayload, "test-secret");

async function testCreateNotification() {
  console.log("🧪 Testing create notification endpoint...");

  const notificationData = {
    type: "info",
    title: "Test Notification",
    message: "This is a test notification message",
    userId: "clx1234567890abcdef",
    data: {
      additionalInfo: "Some additional data",
      priority: "high",
    },
  };

  try {
    const response = await request(app)
      .post("/api/notifications")
      .set("Authorization", `Bearer ${mockJWT}`)
      .send(notificationData);

    console.log("📊 Response Status:", response.status);
    console.log("📄 Response Body:", JSON.stringify(response.body, null, 2));

    if (response.status === 201) {
      console.log("✅ Test PASSED: Notification created successfully!");
      return response.body.data;
    } else {
      console.log("❌ Test FAILED: Unexpected status code");
      return null;
    }
  } catch (error) {
    console.error("❌ Test ERROR:", error.message);
    return null;
  }
}

async function testGetNotification(id) {
  console.log("\n🧪 Testing get notification by ID...");

  try {
    const response = await request(app)
      .get(`/api/notifications/${id}`)
      .set("Authorization", `Bearer ${mockJWT}`);

    console.log("📊 Response Status:", response.status);
    console.log("📄 Response Body:", JSON.stringify(response.body, null, 2));

    if (response.status === 200) {
      console.log("✅ Test PASSED: Notification retrieved successfully!");
    } else {
      console.log("❌ Test FAILED: Unexpected status code");
    }
  } catch (error) {
    console.error("❌ Test ERROR:", error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting Notification CRUD Tests\n");

  // Test create notification
  const createdNotification = await testCreateNotification();

  // Test get notification if create was successful
  if (createdNotification && createdNotification.id) {
    await testGetNotification(createdNotification.id);
  }

  console.log("\n🏁 Tests completed!");
  process.exit(0);
}

runTests().catch((error) => {
  console.error("💥 Test suite failed:", error);
  process.exit(1);
});
