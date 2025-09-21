import prisma from "../utils/prisma";
import { BaseModel } from "./BaseModel";

/**
 * @typedef {class} NotificationModel
 * @extends {BaseModel}
 * @property {import('@prisma/client').PrismaClient} prisma - Prisma client instance
 * @property {import('@prisma/client').Notification} notification - Notification model instance
 * @property {(data: import('@prisma/client').Notification) => Promise<import('@prisma/client').Notification>} createNotification - Create notification
 * @property {(userId: string) => Promise<import('@prisma/client').Notification[]>} getNotificationByUserId - Get notification by user ID
 * @property {(id: string) => Promise<import('@prisma/client').Notification>} getNotificationById - Get notification by ID
 * @property {(id: string, data: import('@prisma/client').Notification) => Promise<import('@prisma/client').Notification>} updateNotification - Update notification
 */
class NotificationModel extends BaseModel {
  constructor(prisma) {
    super(prisma, "notification");
  }

  /**
   * Create notification
   * @param {import('@prisma/client').Notification} data
   * @returns {Promise<import('@prisma/client').Notification>}
   */
  async createNotification(data) {
    return await this.create({
      data: { ...data },
    });
  }

  /**
   * Get notification by user ID
   * @param {string} userId
   * @returns {Promise<import('@prisma/client').Notification[]>}
   */
  async getNotificationByUserId(userId) {
    return await this.findMany({
      where: { userId },
    });
  }

  /**
   * Get notification by ID
   * @param {string} id
   * @returns {Promise<import('@prisma/client').Notification>}
   */
  async getNotificationById(id) {
    return await this.findUnique({
      where: { id },
    });
  }

  /**
   * Update notification
   * @param {string} id
   * @param {import('@prisma/client').Notification} data
   * @returns {Promise<import('@prisma/client').Notification>}
   */
  async updateNotification(id, data) {
    return await this.update({
      where: { id },
      data: { ...data },
    });
  }
}

export default new NotificationModel(prisma);
