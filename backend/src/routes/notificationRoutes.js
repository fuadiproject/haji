import express from "express";
import { createSanitizationMiddleware } from "../middleware/sanitization.js";
import { decodeJWT } from "../middleware/auth.js";
import notificationController from "../controllers/notificationController.js";

const router = express.Router();

// Apply JWT decode middleware to all routes
router.use(decodeJWT);

// Create notification
router.post(
  "/",
  createSanitizationMiddleware({ mode: "auto" }),
  notificationController.createNotification.bind(notificationController)
);

// Get all notifications with pagination and filtering
router.get("/", notificationController.getAllNotifications.bind(notificationController));

// Get notification by ID
router.get(
  "/:id",
  notificationController.getNotificationById.bind(notificationController)
);

// Get notifications by user ID
router.get(
  "/user/:userId",
  notificationController.getNotificationsByUserId.bind(notificationController)
);

// Update notification
router.put(
  "/:id",
  createSanitizationMiddleware({ mode: "auto" }),
  notificationController.updateNotification.bind(notificationController)
);

// Delete notification
router.delete(
  "/:id",
  notificationController.deleteNotification.bind(notificationController)
);

export default router;
