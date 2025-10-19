/**
 * OneSignal Push Notification Utility
 * Using REST API directly instead of SDK
 *
 * Reference: https://documentation.onesignal.com/reference/push-notification
 */

import dotenv from "dotenv";

dotenv.config();

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const ONESIGNAL_API_URL = "https://api.onesignal.com";

// Validate environment variables
if (!ONESIGNAL_APP_ID) {
  console.warn(
    "⚠️  ONESIGNAL_APP_ID is not set. Push notifications will not work."
  );
}

if (!ONESIGNAL_REST_API_KEY) {
  console.warn(
    "⚠️  ONESIGNAL_REST_API_KEY is not set. Push notifications will not work."
  );
}

/**
 * Make a request to OneSignal REST API
 * @param {string} endpoint - API endpoint path
 * @param {string} method - HTTP method (GET, POST, DELETE, etc.)
 * @param {Object} body - Request body (for POST requests)
 * @returns {Promise<Object>} API response
 */
async function makeOneSignalRequest(endpoint, method = "GET", body = null) {
  const url = `${ONESIGNAL_API_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
    },
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(body);
  }

  console.log("URL", url);
  console.log("OPTIONS", options);

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        `OneSignal API Error: ${response.status} ${response.statusText}`
      );
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.response) {
      console.error("OneSignal API Error Response:", error.response);
    }
    throw error;
  }
}

/**
 * Send a push notification using OneSignal REST API
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title (optional)
 * @param {string} options.message - Notification message content (required)
 * @param {Array<string>} options.external_user_id - Specific external user IDs to target (optional)
 * @returns {Promise<Object>} Notification response with id
 */
export async function sendPushNotification(options) {
  try {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      throw new Error(
        "OneSignal credentials not configured. Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in environment variables."
      );
    }

    // Build the notification payload
    const payload = {
      app_id: ONESIGNAL_APP_ID,
      target_channel: "push",
    };

    // Set notification contents (required)
    payload.contents = options.contents || {
      en: options.message,
    };

    // Set notification headings (title) - optional
    if (options.title) {
      payload.headings = options.headings || {
        en: options.title,
      };
    }

    // Set target audience (mutually exclusive)
    if (options.external_user_id && options.external_user_id.length > 0) {
      // Target specific users by their external IDs
      payload.include_aliases = {
        external_id: options.external_user_id,
      };
    } else {
      // Target segments (default: all subscribed users)
      payload.included_segments = options.segments || ["Active Subscriptions"];
    }

    // Send the notification via REST API
    const response = await makeOneSignalRequest(
      "/notifications?c=push",
      "POST",
      payload
    );

    console.log("✅ Push notification sent successfully:", response.id);
    return response;
  } catch (error) {
    console.error("❌ Failed to send push notification:", error.message);
    if (error.response) {
      console.error("Error details:", JSON.stringify(error.response, null, 2));
    }
    throw error;
  }
}

/**
 * View a specific notification by ID
 * Reference: https://documentation.onesignal.com/reference/view-notification
 * @param {string} notificationId - OneSignal notification ID
 * @returns {Promise<Object>} Notification details and outcomes
 */
export async function viewNotification(notificationId) {
  try {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      throw new Error(
        "OneSignal credentials not configured. Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in environment variables."
      );
    }

    const response = await makeOneSignalRequest(
      `/notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`,
      "GET"
    );

    console.log("📊 Notification details retrieved:", notificationId);
    return response;
  } catch (error) {
    console.error("❌ Failed to retrieve notification:", error.message);
    throw error;
  }
}

/**
 * View all notifications for the app
 * Reference: https://documentation.onesignal.com/reference/view-notifications
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of notifications to return (default: 50, max: 50)
 * @param {number} options.offset - Number of notifications to skip (default: 0)
 * @param {string} options.kind - Filter by notification kind (optional)
 * @returns {Promise<Object>} List of notifications
 */
export async function viewNotifications(options = {}) {
  try {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      throw new Error(
        "OneSignal credentials not configured. Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in environment variables."
      );
    }

    const params = new URLSearchParams({
      app_id: ONESIGNAL_APP_ID,
      limit: options.limit || 50,
      offset: options.offset || 0,
    });

    if (options.kind) {
      params.append("kind", options.kind);
    }

    const response = await makeOneSignalRequest(
      `/notifications?${params.toString()}`,
      "GET"
    );

    console.log("📊 Retrieved notifications list");
    return response;
  } catch (error) {
    console.error("❌ Failed to retrieve notifications:", error.message);
    throw error;
  }
}

/**
 * Cancel a scheduled notification
 * Reference: https://documentation.onesignal.com/reference/cancel-notification
 * @param {string} notificationId - OneSignal notification ID
 * @returns {Promise<Object>} Cancellation response
 */
export async function cancelNotification(notificationId) {
  try {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      throw new Error(
        "OneSignal credentials not configured. Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in environment variables."
      );
    }

    const response = await makeOneSignalRequest(
      `/notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`,
      "DELETE"
    );

    console.log("🚫 Notification cancelled:", notificationId);
    return response;
  } catch (error) {
    console.error("❌ Failed to cancel notification:", error.message);
    throw error;
  }
}

/**
 * Get notification history
 * Reference: https://documentation.onesignal.com/reference/notification-history
 * @param {string} notificationId - OneSignal notification ID
 * @param {Object} options - Query options
 * @param {string} options.email - Email address to get history for
 * @returns {Promise<Object>} Notification history
 */
export async function getNotificationHistory(notificationId, options = {}) {
  try {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      throw new Error(
        "OneSignal credentials not configured. Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in environment variables."
      );
    }

    const body = {
      events: "clicked",
      email: options.email,
    };

    const response = await makeOneSignalRequest(
      `/notifications/${notificationId}/history`,
      "POST",
      body
    );

    console.log("📊 Notification history retrieved:", notificationId);
    return response;
  } catch (error) {
    console.error("❌ Failed to retrieve notification history:", error.message);
    throw error;
  }
}

export { ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY };
export default {
  sendPushNotification,
  viewNotification,
  viewNotifications,
  cancelNotification,
  getNotificationHistory,
  appId: ONESIGNAL_APP_ID,
};
