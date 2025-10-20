/**
 * OneSignal Push Notification Example
 *
 * This file demonstrates how to use the OneSignal REST API to send push notifications.
 * Make sure to configure your .env file with the following variables:
 * - ONESIGNAL_APP_ID
 * - ONESIGNAL_REST_API_KEY
 *
 * Reference:
 * - https://documentation.onesignal.com/reference/push-notification
 * - https://onesignal.com/blog/send-push-notifications-with-the-onesignal-nodejs-client-sdk/
 */

import { sendPushNotification } from "../src/utils/oneSignal.js";

/**
 * Example 2: Send notification with custom data
 */
async function example_SendPushNotification() {
  console.log("\n📱 Example: Sending push notification");

  try {
    const response = await sendPushNotification({
      title: "New Message",
      message: "You have a new message",
      external_user_id: ["000000000000000002"],
    });

    console.log("✅ Notification sent successfully!");
    console.log("Notification ID:", response.id);
    return response.id;
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

/**
 * Main function to run all examples
 */
async function runExamples() {
  console.log("🚀 OneSignal REST API Examples");
  console.log("===============================");

  await example_SendPushNotification();

  console.log("\n✅ Examples completed!");
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { example_SendPushNotification };
