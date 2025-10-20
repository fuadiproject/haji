import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import { sendPushNotification } from "../utils/oneSignal.js";

export async function handleNotificationRequest(data) {
  console.log("🔔 Processing notification request:", data);

  try {
    if (data.type === "blast") {
      const notifications = await handleBlastNotification(data);
      console.log("✅ Notification processed:", notifications.length);

      // Send push notification for blast
      await pushNotifications({
        title: data.title,
        message: data.message,
      });
    } else {
      const notification = await handleSingleNotification(data);
      console.log("✅ Notification processed:", notification.id);

      // Send push notification for single user
      await pushNotifications({
        title: notification.title,
        message: notification.message,
        userId: notification.userId,
      });
    }
  } catch (error) {
    console.error("❌ Failed to process notification:", error);
    throw error;
  }
}

async function handleBlastNotification(data) {
  const users = await userModel.getAllUsers();
  let notifications = [];
  for (const user of users) {
    notifications.push({
      type: data.type,
      title: data.title,
      message: data.message,
      userId: user.id,
      data: data || {},
    });
  }
  await notificationModel.createBulkNotifications(notifications);
  return notifications;
}

async function handleSingleNotification(data) {
  const notificationData = {
    type: data.type,
    title: data.title,
    message: data.message,
    userId: data.userId,
    data: data || {},
  };
  return await notificationModel.createNotification(notificationData);
}

// TODO: Check the scenario if let's say the subscriber is more than 1000, how to handle it? reference: https://documentation.onesignal.com/reference/rate-limits
async function pushNotifications(notification) {
  try {
    // Prepare notification data for OneSignal
    const pushOptions = {
      contents: {
        en: notification.message,
      },
      headings: {
        en: notification.title,
      },
    };

    // If userId is provided, target specific user
    // Note: You'll need to map your internal userId to OneSignal Player IDs
    if (notification.userId) {
      // For now, we'll use segments. You can implement user targeting later
      // by storing OneSignal Player IDs in your user model
      pushOptions.external_user_id = [notification.userId];
    }

    // Send push notification via OneSignal
    const response = await sendPushNotification(pushOptions);

    console.log("✅ OneSignal push notification sent:", response.id);
    return response;
  } catch (error) {
    console.error("❌ Failed to send OneSignal push notification:", error);
    throw error;
  }
}

// Export the topic-to-handler mapping
export function getMessageHandlers() {
  return {
    "notification-requests": handleNotificationRequest,
  };
}
