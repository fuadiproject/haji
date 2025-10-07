import { BaseModel } from "./BaseModel.js";

/**
 * @typedef {class} FileModel
 * @extends {BaseModel}
 * @property {import('@prisma/client').PrismaClient} prisma - Prisma client instance
 * @property {import('@prisma/client').File} file - File model instance
 * @property {(filename: string) => Promise<import('@prisma/client').File>} findByFilename - Find file by filename
 * @property {(data: import('@prisma/client').File, userNik: string) => Promise<import('@prisma/client').File>} createWithCreator - Create file with creator tracking
 * @property {(id: string, data: import('@prisma/client').File, userNik: string) => Promise<import('@prisma/client').File>} updateWithUpdater - Update file with updater tracking
 * @property {(mimetype: string) => Promise<import('@prisma/client').File[]>} findByMimetype - Find files by mimetype
 * @property {(limit: number) => Promise<import('@prisma/client').File[]>} getRecentFiles - Get recent files
 * @property {(query: string) => Promise<import('@prisma/client').File[]>} searchFiles - Search files
 * @property {() => Promise<{total: number, byType: {type: string, count: number}[]}} getFileStats - Get file stats
 */
class FileModel extends BaseModel {
  constructor(prisma) {
    super(prisma, "file");
  }

  /**
   * Find file by filename
   * @param {string} filename
   * @returns {Promise<import('@prisma/client').File>}
   */
  async findByFilename(filename) {
    return await this.findFirstOrThrow({
      where: { filename },
    });
  }

  /**
   * Create file with creator
   * @param {import('@prisma/client').File} data
   * @param {string} userNik
   * @returns {Promise<import('@prisma/client').File>}
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
   * Update file with updater tracking
   * @param {string} id
   * @param {import('@prisma/client').File} data
   * @param {string} userNik
   * @returns {Promise<import('@prisma/client').File>}
   */
  async updateWithUpdater(id, data, userNik) {
    return await this.update({
      where: { id },
      data: {
        ...data,
        updated_by: userNik,
      },
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
   * Find files by mimetype
   * @param {string} mimetype
   * @returns {Promise<import('@prisma/client').File[]>}
   */
  async findByMimetype(mimetype) {
    return await this.findMany({
      where: { mimetype },
    });
  }

  /**
   * Get recent files
   * @param {number} limit
   * @returns {Promise<import('@prisma/client').File[]>}
   */
  async getRecentFiles(limit = 10) {
    return await this.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
    });
  }

  /**
   * Search files
   * @param {string} query
   * @returns {Promise<import('@prisma/client').File[]>}
   */
  async searchFiles(query) {
    return await this.findMany({
      where: {
        OR: [
          { filename: { contains: query, mode: "insensitive" } },
          { mimetype: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Get file stats
   * @returns {Promise<{total: number, byType: {type: string, count: number}[]}}>}
   */
  async getFileStats() {
    const total = await this.count();
    const byType = await this.groupBy({
      by: ["mimetype"],
      _count: {
        mimetype: true,
      },
    });

    return {
      total,
      byType: byType.map((item) => ({
        type: item.mimetype,
        count: item._count.mimetype,
      })),
    };
  }
}

// Default instance
import prisma from "../utils/prisma.js";
export default new FileModel(prisma);
