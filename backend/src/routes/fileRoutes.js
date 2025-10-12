import express from "express";
import { createFileValidationMiddleware } from "../middleware/fileValidation.js";
import { createSanitizationMiddleware } from "../middleware/sanitization.js";
import fileController from "../controllers/fileController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply JWT decode middleware to all routes
router.use(authenticateToken);

// File upload dengan validation (multer integrated)
router.post(
  "/upload",
  createFileValidationMiddleware({
    maxSize: 10 * 1024 * 1024, // 10MB max
    allowedExtensions: [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".txt",
      ".json",
      ".html",
    ],
  }),
  createSanitizationMiddleware({ mode: "auto" }),
  fileController.uploadFile.bind(fileController)
);

// Other routes
router.get("/", fileController.getFiles.bind(fileController));
router.get("/:id", fileController.getFileById.bind(fileController));
router.get("/:id/download", fileController.downloadFile.bind(fileController));
router.delete("/:id", fileController.deleteFile.bind(fileController));

export default router;
