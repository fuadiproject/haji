import hyperlinkModel from "../models/hyperlinkModel.js";
import fileModel from "../models/fileModel.js";
import prisma from "../utils/prisma.js";
import response from "../utils/response.js";
import storage from "../utils/storage.js";
/**
 * @typedef {import('../types/requests/userRequest.js').UserRequest} UserRequest
 * @typedef {import('../types/requests/hyperlinkRequest.js').CreateHyperlinkRequest} CreateHyperlinkRequest
 */
class HyperlinkController {
  /**
   * @param {import('../models/hyperlinkModel.js').HyperlinkModel} hyperlinkModel
   * @param {import('../utils/response.js').default} response
   */
  constructor(hyperlinkModel, response) {
    this.hyperlinkModel = hyperlinkModel;
    this.response = response;
  }

  /**
   * Create hyperlink
   * @param {CreateHyperlinkRequest & {user: UserRequest, body: CreateHyperlinkRequest}} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async createHyperlink(req, res) {
    try {
      const { id: userId } = req.user;
      const data = {
        title: req.body.title,
        link: req.body.link,
        logo: req.body.logo,
        is_active: req.body.is_active,
      };

      const hyperlink = await hyperlinkModel.createWithCreator(data, userId);

      return this.response.created(
        res,
        "Hyperlink created successfully",
        hyperlink
      );
    } catch (error) {
      console.error("❌ Create hyperlink error:", error);
      return this.response.error(res, error.message);
    }
  }

  async getAllHyperlinksWithoutPagination(req, res) {
    try {
      const hyperlinks = await hyperlinkModel.getAllHyperLinks();

      if (!hyperlinks || hyperlinks.length === 0) {
        return this.response.success(res, "No hyperlinks found", []);
      }

      // map the hyperlinks to get the signed url of the image
      const hyperlinksWithSignedUrl = await Promise.all(
        hyperlinks.map(async (hyperlink) => {
          const signedUrl = await storage.generateSignedUrl(
            hyperlink.file.key,
            10 * 60
          );
          return {
            title: hyperlink.title,
            link: hyperlink.link,
            logo: signedUrl,
          };
        })
      );

      return this.response.success(
        res,
        "Hyperlinks fetched successfully",
        hyperlinksWithSignedUrl
      );
    } catch (error) {
      console.error("❌ Get all hyperlinks error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Get all hyperlinks
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getAllHyperlinks(req, res) {
    try {
      const { page = 1, limit = 10, search = "", is_active = true } = req.query;

      const hyperlinks = await hyperlinkModel.getAllHyperlinksWithPagination(
        page,
        limit,
        search,
        is_active
      );

      // map the hyperlinks to get the signed url of the image
      const hyperlinksWithSignedUrl = await Promise.all(
        hyperlinks.data.map(async (hyperlink) => {
          const signedUrl = await storage.generateSignedUrl(
            hyperlink.file.key,
            5 * 60
          );
          return {
            ...hyperlink,
            logo: signedUrl,
          };
        })
      );

      const total = hyperlinks.total;
      const totalPages = Math.ceil(total / parseInt(limit));

      const pagination = {
        currentPage: parseInt(page),
        totalPages: hyperlinks.totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      };

      return response.successWithPagination(
        res,
        "Hyperlinks fetched successfully",
        hyperlinksWithSignedUrl,
        pagination
      );
    } catch (error) {
      console.error("❌ Get all hyperlinks error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Get hyperlink by id
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async getHyperlinkById(req, res) {
    try {
      const { id } = req.params;
      const hyperlink = await hyperlinkModel.getHyperlinkById(id);
      return this.response.success(
        res,
        "Hyperlink fetched successfully",
        hyperlink
      );
    } catch (error) {
      console.error("❌ Get hyperlink by id error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Update hyperlink
   * @param {import('express').Request & {user: UserRequest, body: CreateHyperlinkRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async updateHyperlink(req, res) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const data = req.body;

      const existingHyperlink = await this.hyperlinkModel.findById(id);
      if (!existingHyperlink) {
        return this.response.error(res, "Hyperlink not found");
      }

      let oldFile = null;
      if (data.logo == null) {
        data.logo = existingHyperlink.logo;
      } else if (
        existingHyperlink.logo &&
        existingHyperlink.logo !== data.logo
      ) {
        oldFile = await fileModel.findById(existingHyperlink.logo);
      }

      const hyperlink = await prisma.$transaction(
        async (tx) => {
          if (oldFile) {
            await tx.file.delete({ where: { id: oldFile.id } });
          }

          const hyperlink = await tx.hyperlink.update({
            where: { id },
            data: { ...data, updated_by: userId },
            include: {
              creator: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          });

          return hyperlink;
        },
        { timeout: 15000 }
      );

      if (oldFile?.key) {
        await storage.deleteFile(oldFile.key);
      }

      return this.response.success(
        res,
        "Hyperlink updated successfully",
        hyperlink
      );
    } catch (error) {
      console.error("❌ Update hyperlink error:", error);
      return this.response.error(res, error.message);
    }
  }

  /**
   * Delete hyperlink
   * @param {import('express').Request & {user: UserRequest}} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async deleteHyperlink(req, res) {
    try {
      const { id } = req.params;
      const hyperlink = await this.hyperlinkModel.deleteHyperlink(id);
      return this.response.success(
        res,
        "Hyperlink deleted successfully",
        hyperlink
      );
    } catch (error) {
      console.error("❌ Delete hyperlink error:", error);
      return this.response.error(res, error.message);
    }
  }
}

export default new HyperlinkController(hyperlinkModel, response);
