/**
 * @typedef {Object} LoginRequest
 * @property {string} username - Username
 * @property {string} password - Password
 */

/**
 * @typedef {Object} CreateUserRequest
 * @property {string} username - Username
 * @property {string} password - Password
 * @property {string} role - User role (superadmin | admin)
 */

/**
 * @typedef {Object} UpdateUserRoleRequest
 * @property {string} role - User role (superadmin | admin)
 */

/**
 * @typedef {Object} UpdatePasswordRequest
 * @property {string} currentPassword - Current password
 * @property {string} newPassword - New password
 */
