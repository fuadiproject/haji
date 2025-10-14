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
   * @param {string} userId
   * @returns {Promise<import('@prisma/client').Banner>}
   */
  async createWithCreator(data, userId) {
    return await this.create({
      data: {
        ...data,
        created_by: userId,
        updated_by: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Update banner with updater
   * @param {string} id
   * @param {import('@prisma/client').Banner} data
   * @param {string} userId
   * @returns {Promise<import('@prisma/client').Banner>}
   */
  async updateWithUpdater(id, data, userId) {
    return await this.update({
      where: { id },
      data: { ...data, updated_by: userId },
      include: {
        creator: {
          select: {
            name: true,
            id: true,
          },
        },
        updater: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }

  async getAllActiveBanners() {
    return await this.findMany({
      where: {
        is_active: true,
      },
      include: {
        file_dark: {
          select: {
            filepath: true,
            key: true,
          },
        },
        file_light: {
          select: {
            filepath: true,
            key: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
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
  async getAllBannersWithPagination(
    page = 1,
    limit = 10,
    search = "",
    is_active = true
  ) {
    const skip = (page - 1) * parseInt(limit);
    const where = {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
      is_active: is_active,
    };

    const [data, total] = await Promise.all([
      this.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          updater: {
            select: {
              id: true,
              name: true,
            },
          },
          file_dark: {
            select: {
              filepath: true,
              key: true,
            },
          },
          file_light: {
            select: {
              filepath: true,
              key: true,
            },
          },
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
}

// Default instance
import prisma from "../utils/prisma.js";
export default new BannerModel(prisma);
