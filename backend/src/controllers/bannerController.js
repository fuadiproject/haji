import bannerModel from "../models/bannerModel.js";
import response from "../utils/response.js";

/**
 * @typedef {import('../types/requests/userRequest.js').UserRequest} UserRequest
 * @typedef {import('../types/requests/bannerRequest.js').CreateBannerRequest} CreateBannerRequest
 */

class BannerController {
  /**
   * @param {import('../models/bannerModel.js').BannerModel} bannerModel
   * @param {import('../utils/response.js').default} response
   */
  constructor(bannerModel, response) {
    this.bannerModel = bannerModel;
    this.response = response;
  }

  /**
   * Get all banners
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  async getAllBanners(req, res) {
    try {
      const { page = 1, limit = 10, search = "", is_active = true } = req.query;

      const banners = await bannerModel.getAllBanners(
        page,
        limit,
        search,
        is_active
      );

      // TODO: Make a class to control pagination
      const total = banners.total;
      const totalPages = Math.ceil(total / parseInt(limit));

      const pagination = {
        currentPage: parseInt(page),
        totalPages: banners.totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      };

      return response.successWithPagination(
        res,
        "Banners fetched successfully",
        banners.data,
        pagination
      );
    } catch (error) {
      console.error("❌ Get all banners error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Get banner by id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  async getBannerById(req, res) {
    try {
      const { id } = req.params;
      const banner = await bannerModel.findFirst({ where: { id } });
      return this.response.success(res, "Banner fetched successfully", banner);
    } catch (error) {
      console.error("❌ Get banner by id error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Create banner
   * @param {import('express').Request & {user: UserRequest, body: CreateBannerRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  async createBanner(req, res) {
    try {
      const { nip } = req.user;
      const data = {
        title: req.body.title,
        image: req.body.image,
        link: req.body.link,
        description: req.body.description,
        is_active: req.body.is_active,
      };

      const banner = await bannerModel.createWithCreator(data, nip);
      return this.response.created(res, "Banner created successfully", banner);
    } catch (error) {
      console.error("❌ Create banner error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Update banner
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  async updateBanner(req, res) {
    try {
      const { nip } = req.user;
      const { id } = req.params;
      const data = req.body;
      const banner = await bannerModel.updateWithUpdater(id, data, nip);
      return this.response.success(res, "Banner updated successfully", banner);
    } catch (error) {
      console.error("❌ Update banner error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Delete banner
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<import('express').Response>}
   */
  async deleteBanner(req, res) {
    try {
      const { id } = req.params;
      const banner = await bannerModel.delete(id);
      return this.response.success(res, "Banner deleted successfully", banner);
    } catch (error) {
      console.error("❌ Delete banner error:", error);
      return this.response.error(res, error.message);
    }
  }
}

export default new BannerController(bannerModel, response);
