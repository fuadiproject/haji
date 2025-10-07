import bannerModel from "../models/bannerModel.js";
import fileModel from "../models/fileModel.js";
import response from "../utils/response.js";
import storage from "../utils/storage.js";
import prisma from "../utils/prisma.js";

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

      // map the banners to get the signed url of the image
      const bannersWithSignedUrl = await Promise.all(
        banners.data.map(async (banner) => {
          const signedUrl = await storage.generateSignedUrl(
            banner.file.key,
            5 * 60
          );
          return {
            ...banner,
            image: signedUrl,
          };
        })
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
        bannersWithSignedUrl,
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
        file_id: req.body.file_id,
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

      let banner;

      // Preload existing banner and potential old file to delete
      const existingBanner = await bannerModel.findById(id);
      if (!existingBanner) {
        return this.response.error(res, "Banner not found");
      }

      let oldFileToDelete = null;
      if (req.body.file_id == null) {
        req.body.file_id = existingBanner.file_id;
      } else if (
        existingBanner.file_id &&
        existingBanner.file_id !== req.body.file_id
      ) {
        oldFileToDelete = await fileModel.findById(existingBanner.file_id);
      }

      await prisma.$transaction(
        async (tx) => {
          if (oldFileToDelete) {
            await tx.file.delete({ where: { id: oldFileToDelete.id } });
          }
          const data = { ...req.body, updated_by: nip };
          banner = await tx.banner.update({
            where: { id },
            data,
          });
        },
        { timeout: 15000 }
      );

      // Do storage deletion after commit
      if (oldFileToDelete) {
        await storage.deleteFile(oldFileToDelete.key);
      }

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

      const banner = await bannerModel.findById(id, {
        file: true,
      });
      if (!banner) {
        return this.response.error(res, "Banner not found");
      }

      await prisma.$transaction(
        async (tx) => {
          if (banner.file_id) {
            await tx.file.delete({ where: { id: banner.file_id } });
          }
          await tx.banner.delete({ where: { id } });
        },
        { timeout: 15000 }
      );

      if (banner.file?.key) {
        await storage.deleteFile(banner.file.key);
      }

      return this.response.success(res, "Banner deleted successfully");
    } catch (error) {
      console.error("❌ Delete banner error:", error);
      return this.response.error(res, error.message);
    }
  }
}

export default new BannerController(bannerModel, response);
