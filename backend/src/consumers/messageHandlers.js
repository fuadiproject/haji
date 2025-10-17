import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";

export async function handleNotificationRequest(data) {
  console.log("🔔 Processing notification request:", data);

  try {
    if (data.type === "blast") {
      const notifications = await handleBlastNotification(data);
      console.log("✅ Notification processed:", notifications.length);
    } else {
      const notification = await handleSingleNotification(data);
      console.log("✅ Notification processed:", notification.id);
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

async function pushNotifications(notification) {
  // TODO: Add aditional configuration for IOS
  // do one signal push notification
}

// Export the topic-to-handler mapping
export function getMessageHandlers() {
  return {
    "notification-requests": handleNotificationRequest,
  };
}
