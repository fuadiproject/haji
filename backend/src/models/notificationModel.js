import prisma from "../utils/prisma.js";
import { BaseModel } from "./BaseModel.js";

/**
 * @typedef {class} NotificationModel
 * @extends {BaseModel}
 * @property {import('@prisma/client').PrismaClient} prisma - Prisma client instance
 * @property {import('@prisma/client').Notification} notification - Notification model instance
 * @property {(data: import('@prisma/client').Notification) => Promise<import('@prisma/client').Notification>} createNotification - Create notification
 * @property {(userId: string) => Promise<import('@prisma/client').Notification[]>} getNotificationByUserId - Get notification by user ID
 * @property {(id: string) => Promise<import('@prisma/client').Notification>} getNotificationById - Get notification by ID
 * @property {(id: string, data: import('@prisma/client').Notification) => Promise<import('@prisma/client').Notification>} updateNotification - Update notification
 * @property {(page: number, limit: number, search: string, type: string, userId: string) => Promise<{data: import('@prisma/client').Notification[], total: number, totalPages: number}>} getAllNotifications - Get all notifications with pagination
 * @property {(id: string) => Promise<import('@prisma/client').Notification>} deleteNotification - Delete notification
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
   * Get all notifications with pagination
   * @param {number} page
   * @param {number} limit
   * @param {string} search
   * @param {string} type
   * @param {string} userId
   * @returns {Promise<{data: import('@prisma/client').Notification[], total: number, totalPages: number}>}
   */
  async getAllNotifications(
    page = 1,
    limit = 10,
    search = "",
    type = "",
    userId = ""
  ) {
    const whereConditions = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { message: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        type ? { type } : {},
        userId ? { userId } : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    };

    return await this.paginate(
      page,
      limit,
      whereConditions.AND.length > 0 ? whereConditions : {}
    );
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

  /**
   * Delete notification
   * @param {string} id
   * @returns {Promise<import('@prisma/client').Notification>}
   */
  async deleteNotification(id) {
    return await this.delete({
      where: { id },
    });
  }
}

export default new NotificationModel(prisma);
