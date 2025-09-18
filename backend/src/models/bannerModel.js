import { BaseModel } from "./BaseModel.js";

/**
 * @typedef {class} BannerModel
 * @extends {BaseModel}
 * @property {import('@prisma/client').PrismaClient} prisma - Prisma client instance
 * @property {import('@prisma/client').Banner} banner - Banner model instance
 * @property {() => Promise<import('@prisma/client').Banner[]>} createWithCreator - Create banner with creator
 * @property {() => Promise<import('@prisma/client').Banner[]>} updateWithUpdater - Update banner with updater
 */
class BannerModel extends BaseModel {
  constructor(prisma) {
    super(prisma, "banner");
  }

  /**
   * Create banner with creator
   * @param {import('@prisma/client').Banner} data
   * @param {string} userNik
   * @returns {Promise<import('@prisma/client').Banner>}
   */
  async createWithCreator(data, userNik) {
    return await this.create({
      data: {
        ...data,
        created_by: userNik,
        updated_by: userNik,
      },
      include: {
        creator: {
          select: {
            nip: true,
            nama: true,
          },
        },
        updater: {
          select: {
            nip: true,
            nama: true,
          },
        },
      },
    });
  }

  /**
   * Update banner with updater
   * @param {string} id
   * @param {import('@prisma/client').Banner} data
   * @param {string} userNik
   * @returns {Promise<import('@prisma/client').Banner>}
   */
  async updateWithUpdater(id, data, userNik) {
    return await this.update({
      where: { id },
      data: { ...data, updated_by: userNik },
      include: {
        creator: {
          select: {
            nama: true,
            nip: true,
          },
        },
        updater: {
          select: {
            nama: true,
            nip: true,
          },
        },
      },
    });
  }

  /**
   * Get all banners
   * @param {number} page
   * @param {number} limit
   * @param {string} search
   * @param {boolean} is_active
   * @returns {Promise<import('@prisma/client').Banner[]>}
   */
  async getAllBanners(page = 1, limit = 10, search = "", is_active = true) {
    return await this.paginate(page, limit, {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
      is_active: is_active,
    });
  }
}

// Default instance
import prisma from "../utils/prisma.js";
export default new BannerModel(prisma);
