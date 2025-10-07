import { NotificationConsumer } from "../consumers/NotificationConsumer.js";

export async function runConsumer() {
  console.log("🚀 Starting Consumer Mode...\n");

  const consumer = new NotificationConsumer();

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down consumer...");
    await consumer.stop();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\n🛑 Shutting down consumer...");
    await consumer.stop();
    process.exit(0);
  });

  try {
    await consumer.start();
    console.log("✅ Consumer is running... Press Ctrl+C to stop");

    // Keep running
    await new Promise(() => {});
  } catch (error) {
    console.error("❌ Error starting consumer:", error);
    process.exit(1);
  }
}
