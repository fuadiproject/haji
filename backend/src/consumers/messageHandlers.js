import notificationModel from "../models/notificationModel.js";

export async function handleNotificationRequest(data) {
  console.log("🔔 Processing notification request:", data);

  try {
    const notificationData = {
      type: data.type,
      title: data.title,
      message: data.message,
      userId: data.userId,
      data: data || {},
    };

    const notification = await notificationModel.createNotification(
      notificationData
    );
    console.log("✅ Notification processed:", notification.id);
  } catch (error) {
    console.error("❌ Failed to process notification:", error);
    throw error;
  }
}

// Export the topic-to-handler mapping
export function getMessageHandlers() {
  return {
    "notification-requests": handleNotificationRequest,
  };
}
