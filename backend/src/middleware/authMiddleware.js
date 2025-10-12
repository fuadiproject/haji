import { verifyToken, isTokenExpired } from "../utils/jwt.js";

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authorization header required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Check if token is expired
    if (isTokenExpired(token)) {
      return res.status(401).json({
        success: false,
        error: "Token has expired",
      });
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    // Extract user info from JWT payload
    const { id, email, role } = decoded;

    if (!id || !email || !role) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
      });
    }

    // Attach user info to request
    req.user = {
      id,
      email,
      role,
    };

    next();
  } catch (error) {
    console.error("❌ JWT authentication error:", error);
    return res.status(401).json({
      success: false,
      error: "Token verification failed",
    });
  }
};

/**
 * Require Superadmin role
 */
export const requireSuperadmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      error: "Superadmin access required",
    });
  }
  next();
};

/**
 * Require Admin or Superadmin role
 */
export const requireAdmin = (req, res, next) => {
  if (!["admin", "superadmin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }
  next();
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present and valid, but doesn't require it
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.replace("Bearer ", "");

    // Check if token is expired
    if (isTokenExpired(token)) {
      return next();
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    if (decoded && decoded.id && decoded.email && decoded.role) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
