import userSuperAppModel from "../models/userSuperAppModel.js";
import response from "../utils/response.js";
import { generateToken } from "../utils/jwt.js";

/**
 * @typedef {import('../types/requests/authRequest.js').LoginRequest} LoginRequest
 * @typedef {import('../types/requests/authRequest.js').CreateUserRequest} CreateUserRequest
 */

class AuthController {
  /**
   * @param {import('../models/userSuperAppModel.js').UserSuperAppModel} userSuperAppModel
   * @param {import('../utils/response.js').response} response
   */
  constructor(userSuperAppModel, response) {
    this.userSuperAppModel = userSuperAppModel;
    this.response = response;
  }

  /**
   * User login
   * @param {import('express').Request & {body: LoginRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("HERE BROOOOO");

      console.log("email", email);
      console.log("password", password);

      // Validate input
      if (!email || !password) {
        return response.badRequest(res, "Username and password are required");
      }

      // Find user by username
      const user = await userSuperAppModel.findByEmail(email);
      if (!user) {
        return response.unauthorized(res, "Invalid credentials");
      }

      // Validate password
      const isValidPassword = await userSuperAppModel.validatePassword(
        password,
        user.password
      );

      if (!isValidPassword) {
        return response.unauthorized(res, "Username or password is incorrect");
      }

      // Generate JWT token
      const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      };

      const token = generateToken(tokenPayload);

      // Return user data without password
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return response.success(res, "Login successful", {
        user: userData,
        token,
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      return response.error(res, error.message);
    }
  };

  /**
   * Get current user profile
   * @param {import('express').Request & {user: Object}} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  getProfile = async (req, res) => {
    try {
      const { id } = req.user;

      const user = await this.userSuperAppModel.findById(id);
      if (!user) {
        return response.notFound(res, "User not found");
      }

      // Return user data without password
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return response.success(res, "Profile fetched successfully", userData);
    } catch (error) {
      console.error("❌ Get profile error:", error);
      return response.error(res, error.message);
    }
  };

  /**
   * Create new user (superadmin only)
   * @param {import('express').Request & {body: CreateUserRequest, user: Object}} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  createUser = async (req, res) => {
    try {
      const { email, name, password, role } = req.body;

      // Validate input
      if (!email || !name || !password || !role) {
        return response.badRequest(
          res,
          "Username, password, and role are required"
        );
      }

      // Validate password strength
      if (password.length < 6) {
        return response.badRequest(
          res,
          "Password must be at least 6 characters long"
        );
      }

      // Create user
      const user = await this.userSuperAppModel.createUser({
        email,
        name,
        password,
        role,
      });

      // Return user data without password
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return response.created(res, "User created successfully", userData);
    } catch (error) {
      console.error("❌ Create user error:", error);
      return response.error(res, error.message);
    }
  };

  /**
   * Get all users (superadmin only)
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  getAllUsers = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "", role = "" } = req.query;

      const users = await this.userSuperAppModel.getAllUsers(
        page,
        limit,
        search,
        role
      );

      // TODO: Make a class to control pagination
      const total = users.total;
      const totalPages = Math.ceil(total / parseInt(limit));

      const pagination = {
        currentPage: parseInt(page),
        totalPages: users.totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      };

      return response.successWithPagination(
        res,
        "Users fetched successfully",
        users.data,
        pagination
      );
    } catch (error) {
      console.error("❌ Get all users error:", error);
      return this.response.error(res, error.message);
    }
  };

  /**
   * Update user role (superadmin only)
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  updateUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role) {
        return this.response.badRequest(res, "Role is required");
      }

      const user = await this.userSuperAppModel.updateRole(id, role);

      // Return user data without password
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return this.response.success(
        res,
        "User role updated successfully",
        userData
      );
    } catch (error) {
      console.error("❌ Update user role error:", error);
      return this.response.error(res, error.message);
    }
  };

  /**
   * Delete user (superadmin only)
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (req.user.id === id) {
        return this.response.badRequest(res, "Cannot delete your own account");
      }

      await this.userSuperAppModel.deleteUser(id);

      return this.response.success(res, "User deleted successfully");
    } catch (error) {
      console.error("❌ Delete user error:", error);
      return this.response.error(res, error.message);
    }
  };
}

export default new AuthController(userSuperAppModel, response);
