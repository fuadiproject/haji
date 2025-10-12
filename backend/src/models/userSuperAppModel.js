import { BaseModel } from "./BaseModel.js";
import bcrypt from "bcryptjs";

/**
 * @typedef {class} UserSuperAppModel
 * @extends {BaseModel}
 * @property {import('@prisma/client').PrismaClient} prisma - Prisma client instance
 * @property {() => Promise<import('@prisma/client').UserSuperApp>} createUser - Create user with hashed password
 * @property {() => Promise<import('@prisma/client').UserSuperApp>} findByUsername - Find user by username
 * @property {() => Promise<boolean>} validatePassword - Validate user password
 */
class UserSuperAppModel extends BaseModel {
  constructor(prisma) {
    super(prisma, "userSuperApp");
  }

  /**
   * Create user with hashed password
   * @param {Object} data - User data
   * @param {string} data.username - Username
   * @param {string} data.password - Plain text password
   * @param {string} data.role - User role (superadmin | admin)
   * @returns {Promise<import('@prisma/client').UserSuperApp>}
   */
  async createUser(data) {
    const { username, password, role } = data;

    // Validate role
    if (!["superadmin", "admin"].includes(role)) {
      throw new Error("Invalid role. Must be 'superadmin' or 'admin'");
    }

    // Check if username already exists
    const existingUser = await this.findFirst({ where: { username } });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await this.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
  }

  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<import('@prisma/client').UserSuperApp|null>}
   */
  async findByUsername(username) {
    return await this.findFirst({
      where: { username },
    });
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<import('@prisma/client').UserSuperApp|null>}
   */
  async findById(id) {
    return await this.findFirst({
      where: { id },
    });
  }

  /**
   * Validate user password
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>}
   */
  async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user password
   * @param {string} id - User ID
   * @param {string} newPassword - New plain text password
   * @returns {Promise<import('@prisma/client').UserSuperApp>}
   */
  async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    return await this.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  /**
   * Update user role
   * @param {string} id - User ID
   * @param {string} role - New role
   * @returns {Promise<import('@prisma/client').UserSuperApp>}
   */
  async updateRole(id, role) {
    if (!["superadmin", "admin"].includes(role)) {
      throw new Error("Invalid role. Must be 'superadmin' or 'admin'");
    }

    return await this.update({
      where: { id },
      data: { role },
    });
  }

  /**
   * Get all users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search term
   * @param {string} role - Filter by role
   * @returns {Promise<Object>}
   */
  async getAllUsers(page = 1, limit = 10, search = "", role = "") {
    const skip = (page - 1) * parseInt(limit);
    const where = {
      OR: [{ username: { contains: search, mode: "insensitive" } }],
    };

    // Add role filter if specified
    if (role && ["superadmin", "admin"].includes(role)) {
      where.role = role;
    }

    const [data, total] = await Promise.all([
      this.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          username: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
      }),
      this.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<import('@prisma/client').UserSuperApp>}
   */
  async deleteUser(id) {
    return await this.delete({
      where: { id },
    });
  }
}

// Default instance
import prisma from "../utils/prisma.js";
export default new UserSuperAppModel(prisma);
