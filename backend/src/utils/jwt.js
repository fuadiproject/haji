import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// Load Keycloak public key from certs folder
const KEYCLOAK_PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../../certs/public.pem"),
  "utf8"
);

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} payload.id - User ID
 * @param {string} payload.username - Username
 * @param {string} payload.role - User role
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT token using Keycloak public key (RS256) or fallback to JWT_SECRET
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded) {
    throw new Error("Invalid token");
  }

  const { header } = decoded;

  // If token uses RS256, verify with Keycloak public key
  if (header.alg === "RS256") {
    return jwt.verify(token, KEYCLOAK_PUBLIC_KEY, { algorithms: ["RS256"] });
  }

  // Fallback to JWT_SECRET for HS256 tokens
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false otherwise
 */
export const isTokenExpired = (decoded) => {
  try {
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};
