import express from "express";
import { decodeJWT } from "../middleware/userAuthMiddleware.js";
import bannerController from "../controllers/bannerController.js";
import hyperlinkController from "../controllers/hyperlinkController.js";
import notificationController from "../controllers/notificationController.js";

const router = express.Router();

router.use(decodeJWT);

router.get(
  "/banners",
  bannerController.getAllBannersWithoutPagination.bind(bannerController)
);

router.get(
  "/hyperlinks",
  hyperlinkController.getAllHyperlinksWithoutPagination.bind(
    hyperlinkController
  )
);

router.get(
  "/notifications",
  notificationController.getNotificationsByNik.bind(notificationController)
);

router.get(
  "/notifications/not-read-count",
  notificationController.getNotReadCount.bind(notificationController)
);

router.put(
  "/notifications/:id/read",
  notificationController.updateNotificationRead.bind(notificationController)
);

// Read all notifications
router.put(
  "/notifications/read-all",
  notificationController.readAllNotifications.bind(notificationController)
);

export default router;
