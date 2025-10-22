import notificationModel from "../models/notificationModel.js";
import response from "../utils/response.js";

/**
 * @typedef {import('../types/requests/userRequest.js').UserRequest} UserRequest
 * @typedef {import('../types/requests/notificationRequest.js').CreateNotificationRequest} CreateNotificationRequest
 * @typedef {import('../types/requests/notificationRequest.js').UpdateNotificationRequest} UpdateNotificationRequest
 */
class NotificationController {
  /**
   * @param {import('../models/notificationModel.js').NotificationModel} notificationModel
   * @param {import('../utils/response.js').default} response
   */
  constructor(notificationModel, response) {
    this.notificationModel = notificationModel;
    this.response = response;
  }

  /**
   * Create notification
   * @param {CreateNotificationRequest & {user: UserRequest, body: CreateNotificationRequest}} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async createNotification(req, res) {
    try {
      const data = {
        type: req.body.type,
        title: req.body.title,
        message: req.body.message,
        userId: req.body.userId,
        data: req.body || {},
      };

      const notification = await notificationModel.createNotification(data);
      return this.response.created(
        res,
        "Notification created successfully",
        notification
      );
    } catch (error) {
      console.error("❌ Create notification error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Get all notifications
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getAllNotifications(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        type = "",
        userId = "",
      } = req.query;

      const notifications = await this.notificationModel.getAllNotifications(
        page,
        limit,
        search,
        type,
        userId
      );

      const total = notifications.total;
      const totalPages = Math.ceil(total / parseInt(limit));

      const pagination = {
        currentPage: parseInt(page),
        totalPages: notifications.totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      };

      return this.response.successWithPagination(
        res,
        "Notifications fetched successfully",
        notifications.data,
        pagination
      );
    } catch (error) {
      console.error("❌ Get all notifications error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Get notification by id
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      const notification = await this.notificationModel.getNotificationById(id);
      return this.response.success(
        res,
        "Notification fetched successfully",
        notification
      );
    } catch (error) {
      console.error("❌ Get notification by id error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Get notifications by user ID
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getNotificationsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const notifications =
        await this.notificationModel.getNotificationByUserId(userId);
      return this.response.success(
        res,
        "User notifications fetched successfully",
        notifications
      );
    } catch (error) {
      console.error("❌ Get notifications by user ID error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Update notification
   * @param {import('express').Request & {user: UserRequest, body: UpdateNotificationRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async updateNotification(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const notification = await this.notificationModel.updateNotification(
        id,
        data
      );
      return this.response.success(
        res,
        "Notification updated successfully",
        notification
      );
    } catch (error) {
      console.error("❌ Update notification error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Delete notification
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const notification = await this.notificationModel.deleteNotification(id);
      return this.response.success(
        res,
        "Notification deleted successfully",
        notification
      );
    } catch (error) {
      console.error("❌ Delete notification error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Get notifications by NIP
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getNotificationsByNik(req, res) {
    try {
      const { page = 1, limit = 10, search = "", read = false } = req.query;

      const { nik: userId } = req.user;

      const notifications = await notificationModel.getAllNotifications(
        page,
        limit,
        search,
        read,
        userId
      );

      const total = notifications.total;
      const totalPages = Math.ceil(total / parseInt(limit));

      const pagination = {
        currentPage: parseInt(page),
        totalPages: notifications.totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      };

      return this.response.successWithPagination(
        res,
        "Notifications fetched successfully",
        notifications.data,
        pagination
      );
    } catch (error) {
      console.error("❌ Get all notifications error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Update notification read
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async updateNotificationRead(req, res) {
    try {
      const { id } = req.params;
      const { nik: userId } = req.user;
      const checkNotification = await notificationModel.getNotificationById(id);

      if (!checkNotification) {
        return this.response.notFound(res, "Notification not found");
      }

      if (checkNotification.userId !== userId) {
        return this.response.unauthorized(
          res,
          "You are not authorized to update this notification"
        );
      }

      const notification = await notificationModel.updateNotification(id, {
        read: true,
      });

      return this.response.success(
        res,
        "Notification read updated successfully",
        notification
      );
    } catch (error) {
      console.error("❌ Update notification read error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Get not read count
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getNotReadCount(req, res) {
    try {
      const { nik: userId } = req.user;
      const notReadCount = await notificationModel.getNotReadCount(userId);
      return this.response.success(
        res,
        "Not read count fetched successfully",
        notReadCount
      );
    } catch (error) {
      console.error("❌ Get not read count error:", error);
      return this.response.error(res, error.message);
    }
  }
}

export default new NotificationController(notificationModel, response);
