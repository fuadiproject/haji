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

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Decode JWT without verification (API Manager handles validation)
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "Invalid token format",
      });
    }

    // Extract user info from JWT payload
    const { user_id, nik, role, exp } = decoded;

    if (!user_id || !nik) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
      });
    }

    // Attach user info to request
    req.user = {
      user_id,
      nik,
      role,
    };

    // Check if token is expired
    // if (exp < Date.now() / 1000) {
    //   return res.status(401).json({
    //     success: false,
    //     error: "Token expired",
    //   });
    // }

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
