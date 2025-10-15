import express from "express";
import authController from "../controllers/authController.js";
import {
  authenticateToken,
  requireSuperadmin,
} from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isLength({ min: 3 })
      .withMessage("Email must be at least 3 characters long"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validateRequest,
  authController.login
);

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile);

// Superadmin only routes
router.post(
  "/users",
  authenticateToken,
  requireSuperadmin,
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores"
      ),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["superadmin", "admin"])
      .withMessage("Role must be either 'superadmin' or 'admin'"),
  ],
  validateRequest,
  authController.createUser
);

router.get(
  "/users",
  authenticateToken,
  requireSuperadmin,
  authController.getAllUsers
);

router.put(
  "/users/:id/role",
  authenticateToken,
  requireSuperadmin,
  [
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["superadmin", "admin"])
      .withMessage("Role must be either 'superadmin' or 'admin'"),
  ],
  validateRequest,
  authController.updateUserRole
);

router.delete(
  "/users/:id",
  authenticateToken,
  requireSuperadmin,
  authController.deleteUser
);

export default router;
