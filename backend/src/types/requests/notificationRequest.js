/**
 * @typedef {Object} CreateNotificationRequest
 * @property {string} type - Type of notification
 * @property {string} title - Notification title
 * @property {string} message - Notification message
 * @property {string} userId - User ID to send notification to
 * @property {Object} [data] - Additional notification data
 */

/**
 * @typedef {Object} UpdateNotificationRequest
 * @property {string} [type] - Type of notification
 * @property {string} [title] - Notification title
 * @property {string} [message] - Notification message
 * @property {string} [userId] - User ID to send notification to
 * @property {Object} [data] - Additional notification data
 */

export { CreateNotificationRequest, UpdateNotificationRequest };
