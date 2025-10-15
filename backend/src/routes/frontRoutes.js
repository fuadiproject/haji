import express from "express";
import { decodeJWT } from "../middleware/userAuthMiddleware.js";
import bannerController from "../controllers/bannerController.js";
import hyperlinkController from "../controllers/hyperlinkController.js";

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

export default router;
