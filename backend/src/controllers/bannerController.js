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
          const darkImageSignedUrl = await storage.generateSignedUrl(
            banner.file_dark.key,
            5 * 60
          );

          const lightImageSignedUrl = await storage.generateSignedUrl(
            banner.file_light.key,
            5 * 60
          );

          return {
            ...banner,
            dark_image: darkImageSignedUrl,
            light_image: lightImageSignedUrl,
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
        dark_image: req.body.dark_image,
        light_image: req.body.light_image,
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

      // Preload existing banner and potential old file to delete
      const existingBanner = await bannerModel.findById(id);
      if (!existingBanner) {
        return this.response.error(res, "Banner not found");
      }

      const fileFields = ["dark_image", "light_image"];
      const oldFilesToDelete = [];

      // Process file fields and collect old files to delete
      for (const key of fileFields) {
        if (req.body[key] == null) {
          req.body[key] = existingBanner[key];
        } else if (
          existingBanner[key] &&
          existingBanner[key] !== req.body[key]
        ) {
          const oldFile = await fileModel.findById(existingBanner[key]);
          if (oldFile) {
            oldFilesToDelete.push(oldFile);
          }
        }
      }

      // Update banner in transaction
      const banner = await prisma.$transaction(
        async (tx) => {
          // Delete old files from database
          for (const oldFile of oldFilesToDelete) {
            await tx.file.delete({ where: { id: oldFile.id } });
          }

          // Update banner
          const data = { ...req.body, updated_by: nip };
          return await tx.banner.update({
            where: { id },
            data,
          });
        },
        { timeout: 15000 }
      );

      // Delete old files from storage after successful database commit
      await Promise.all(
        oldFilesToDelete.map((oldFile) => storage.deleteFile(oldFile.key))
      );

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
        file_dark: true,
        file_light: true,
      });

      if (!banner) {
        return this.response.error(res, "Banner not found");
      }

      await prisma.$transaction(
        async (tx) => {
          if (banner.dark_image == banner.light_image) {
            if (banner.file_dark) {
              await tx.file.delete({ where: { id: banner.file_dark } });
            }
          } else {
            if (banner.file_dark) {
              await tx.file.delete({ where: { id: banner.file_dark } });
            }

            if (banner.file_light) {
              await tx.file.delete({ where: { id: banner.file_light } });
            }
          }

          await tx.banner.delete({ where: { id } });
        },
        { timeout: 15000 }
      );

      if (banner.file_dark?.key) {
        await storage.deleteFile(banner.file_dark.key);
      }

      if (banner.file_light?.key) {
        await storage.deleteFile(banner.file_light.key);
      }

      return this.response.success(res, "Banner deleted successfully");
    } catch (error) {
      console.error("❌ Delete banner error:", error);
      return this.response.error(res, error.message);
    }
  }
}

export default new BannerController(bannerModel, response);
