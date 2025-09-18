// JWT Decode Middleware (No Validation)
// JWT validation handled by API Manager

import jwt from "jsonwebtoken";

/**
 * Decode JWT token and attach user info to request
 * No validation - just decode and extract user info
 */
export const decodeJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authorization header required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Decode JWT without verification (API Manager handles validation)
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "Invalid token format",
      });
    }

    // Extract user info from JWT payload
    const { nama, nip } = decoded;

    if (!nama || !nip) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
      });
    }

    // Attach user info to request
    req.user = {
      nama,
      nip,
      role: "user", // Default role is 'user'
    };

    next();
  } catch (error) {
    console.error("❌ JWT decode error:", error);
    return res.status(401).json({
      success: false,
      error: "Token decode failed",
    });
  }
};

/**
 * Check if user is admin
 */
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }
  next();
};

/**
 * Check if user can access disposisi
 * Rules:
 * 1. User created the disposisi, OR
 * 2. User is in nik_penerima of this disposisi
 */
export const canAccessDisposisi = async (req, res, next) => {
  try {
    const { disposisi_id, id } = req.params;
    const disposisiId = disposisi_id || id;
    const { nik } = req.user;

    // If no disposisi ID, skip authorization (for routes that don't need it)
    if (!disposisiId) {
      return next();
    }

    // Import models dynamically to avoid circular dependency
    const disposisiModel = (await import("../models/disposisiModel.js"))
      .default;

    // Check if user can access this disposisi
    const canAccess = await disposisiModel.canUserAccess(disposisiId, nik);

    if (!canAccess) {
      // Always return 404 to prevent information disclosure
      // User should not know if the record exists or not
      return res.status(404).json({
        success: false,
        error: "Disposisi tidak ditemukan",
      });
    }

    next();
  } catch (error) {
    console.error("❌ Disposisi access check error:", error);
    return res.status(500).json({
      success: false,
      error: "Disposisi access check failed",
    });
  }
};
