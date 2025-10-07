import { BaseModel } from "./BaseModel.js";

/**
 * @typedef {class} HyperlinkModel
 * @extends {BaseModel}
 * @property {import('@prisma/client').PrismaClient} prisma - Prisma client instance
 * @property {import('@prisma/client').Hyperlink} hyperlink - Hyperlink model instance
 * @property {(data: import('@prisma/client').Hyperlink, userNik: string) => Promise<import('@prisma/client').Hyperlink>} createWithCreator - Create hyperlink with creator
 * @property {(id: string, data: import('@prisma/client').Hyperlink, userNik: string) => Promise<import('@prisma/client').Hyperlink>} updateWithUpdater - Update hyperlink with updater
 * @property {(page: number, limit: number, search: string, is_active: boolean) => Promise<import('@prisma/client').Hyperlink[]>} getAllHyperlinks - Get all hyperlinks
 * @property {(id: string) => Promise<import('@prisma/client').Hyperlink>} getHyperlinkById - Get hyperlink by ID
 * @property {(id: string) => Promise<import('@prisma/client').Hyperlink>} deleteHyperlink - Delete hyperlink
 */
class HyperlinkModel extends BaseModel {
  constructor(prisma) {
    super(prisma, "hyperlink");
  }

  /**
   * Create hyperlink with creator
   * @param {import('@prisma/client').Hyperlink} data
   * @param {string} userNik
   * @returns {Promise<import('@prisma/client').Hyperlink>}
   */
  async createWithCreator(data, userNik) {
    return await this.create({
      data: { ...data, created_by: userNik, updated_by: userNik },
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
   * Update hyperlink with updater
   * @param {string} id
   * @param {import('@prisma/client').Hyperlink} data
   * @param {string} userNik
   * @returns {Promise<import('@prisma/client').Hyperlink>}
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
   * Get all hyperlinks
   * @param {number} page
   * @param {number} limit
   * @param {string} search
   * @param {boolean} is_active
   * @returns {Promise<import('@prisma/client').Hyperlink[]>}
   */
  async getAllHyperlinks(page = 1, limit = 10, search = "", is_active = true) {
    const skip = (page - 1) * parseInt(limit);
    const where = {
      OR: [{ title: { contains: search, mode: "insensitive" } }],
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
   * Get hyperlink by ID
   * @param {string} id
   * @returns {Promise<import('@prisma/client').Hyperlink>}
   */
  async getHyperlinkById(id) {
    return await this.findUnique({
      where: { id },
    });
  }

  /**
   * Delete hyperlink
   * @param {string} id
   * @returns {Promise<import('@prisma/client').Hyperlink>}
   */
  async deleteHyperlink(id) {
    return await this.delete({
      where: { id },
    });
  }
}

// Default instance
import prisma from "../utils/prisma.js";
export default new HyperlinkModel(prisma);
