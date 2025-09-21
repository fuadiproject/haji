import notificationModel from "../models/notificationModel";

export async function handleNotificationRequest(data) {
  console.log("🔔 Processing notification request:", data.notification_id);

  try {
    // Your notification processing logic
    const notification = await notificationModel.createNotification({
      data: {
        id: data.notification_id,
        type: data.type,
        title: data.title,
        message: data.message,
        userId: data.user_id,
        data: data.data || {},
      },
    });

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
