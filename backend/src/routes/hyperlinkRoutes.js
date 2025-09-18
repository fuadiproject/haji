import express from "express";
import { createSanitizationMiddleware } from "../middleware/sanitization.js";
import { decodeJWT } from "../middleware/auth.js";
import hyperlinkController from "../controllers/hyperlinkController.js";

const router = express.Router();

// Apply JWT decode middleware to all routes
router.use(decodeJWT);

router.post(
  "/",
  createSanitizationMiddleware({ mode: "auto" }),
  hyperlinkController.createHyperlink.bind(hyperlinkController)
);

// Other routes
router.get("/", hyperlinkController.getAllHyperlinks.bind(hyperlinkController));
router.get(
  "/:id",
  hyperlinkController.getHyperlinkById.bind(hyperlinkController)
);
router.put(
  "/:id",
  createSanitizationMiddleware({ mode: "auto" }),
  hyperlinkController.updateHyperlink.bind(hyperlinkController)
);
router.delete(
  "/:id",
  hyperlinkController.deleteHyperlink.bind(hyperlinkController)
);

export default router;
