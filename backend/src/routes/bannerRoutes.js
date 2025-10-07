import express from "express";
import { createSanitizationMiddleware } from "../middleware/sanitization.js";
import { decodeJWT } from "../middleware/auth.js";
import bannerController from "../controllers/bannerController.js";

const router = express.Router();

// Apply JWT decode middleware to all routes
router.use(decodeJWT);

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
