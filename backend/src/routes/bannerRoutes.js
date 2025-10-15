import express from "express";
import { createSanitizationMiddleware } from "../middleware/sanitization.js";
import bannerController from "../controllers/bannerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// Apply JWT decode middleware to all routes
router.use(authenticateToken);

router.post(
  "/",
  createSanitizationMiddleware({ mode: "auto" }),
  bannerController.createBanner.bind(bannerController)
);

// Other routes
router.get("/", bannerController.getAllBanners.bind(bannerController));
router.get("/:id", bannerController.getBannerById.bind(bannerController));
router.put(
  "/:id",
  createSanitizationMiddleware({ mode: "auto" }),
  bannerController.updateBanner.bind(bannerController)
);
router.delete("/:id", bannerController.deleteBanner.bind(bannerController));

export default router;
