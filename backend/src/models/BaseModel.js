/**
 * Base model class with common Prisma methods
 * @template T - The Prisma model type
 */
export class BaseModel {
  /**
   * @param {import('@prisma/client').PrismaClient} prisma
   * @param {string} modelName - Name of the Prisma model (e.g., 'file', 'user', 'banner')
   */
  constructor(prisma, modelName) {
    this.prisma = prisma;
    this.modelName = modelName;
    this.model = prisma[modelName];

    // Remove Object.assign - it interferes with IDE support
    // Object.assign(this, this.model);
  }

  // Explicitly declare ALL Prisma methods for IDE support

  /**
   * Find unique record
   * @param {any} args - Prisma find unique arguments
   * @returns {Promise<any>}
   */
  async findUnique(args) {
    return await this.model.findUnique(args);
  }

  /**
   * Find many records
   * @param {any} args - Prisma find many arguments
   * @returns {Promise<any[]>}
   */
  async findMany(args) {
    return await this.model.findMany(args);
  }

  /**
   * Find first record
   * @param {any} args - Prisma find first arguments
   * @returns {Promise<any>}
   */
  async findFirst(args) {
    return await this.model.findFirst(args);
  }

  /**
   * Find unique or throw
   * @param {any} args - Prisma find unique or throw arguments
   * @returns {Promise<any>}
   */
  async findUniqueOrThrow(args) {
    return await this.model.findUniqueOrThrow(args);
  }

  /**
   * Find first or throw
   * @param {any} args - Prisma find first or throw arguments
   * @returns {Promise<any>}
   */
  async findFirstOrThrow(args) {
    return await this.model.findFirstOrThrow(args);
  }

  /**
   * Create record
   * @param {any} args - Prisma create arguments
   * @returns {Promise<any>}
   */
  async create(args) {
    return await this.model.create(args);
  }

  /**
   * Update record
   * @param {any} args - Prisma update arguments
   * @returns {Promise<any>}
   */
  async update(args) {
    return await this.model.update(args);
  }

  /**
   * Delete record
   * @param {any} args - Prisma delete arguments
   * @returns {Promise<any>}
   */
  async delete(args) {
    return await this.model.delete(args);
  }

  /**
   * Count records
   * @param {any} args - Prisma count arguments
   * @returns {Promise<number>}
   */
  async count(args) {
    return await this.model.count(args);
  }

  /**
   * Group records by field
   * @param {any} args - Prisma group by arguments
   * @returns {Promise<any[]>}
   */
  async groupBy(args) {
    return await this.model.groupBy(args);
  }

  /**
   * Upsert record
   * @param {any} args - Prisma upsert arguments
   * @returns {Promise<any>}
   */
  async upsert(args) {
    return await this.model.upsert(args);
  }

  /**
   * Update many records
   * @param {any} args - Prisma update many arguments
   * @returns {Promise<any>}
   */
  async updateMany(args) {
    return await this.model.updateMany(args);
  }

  /**
   * Delete many records
   * @param {any} args - Prisma delete many arguments
   * @returns {Promise<any>}
   */
  async deleteMany(args) {
    return await this.model.deleteMany(args);
  }

  /**
   * Create many records
   * @param {any} args - Prisma create many arguments
   * @returns {Promise<any>}
   */
  async createMany(args) {
    return await this.model.createMany(args);
  }

  // Common utility methods that can be used by all models

  /**
   * Find by ID (assuming id field exists)
   * @param {string} id - Record ID
   * @param {any} include - Include relations
   * @returns {Promise<any>}
   */
  async findById(id, include = {}) {
    return await this.findUnique({
      where: { id },
      include,
    });
  }

  /**
   * Check if record exists
   * @param {any} where - Where conditions
   * @returns {Promise<boolean>}
   */
  async exists(where) {
    const count = await this.count({ where });
    return count > 0;
  }

  /**
   * Get paginated results
   * @param {number} page - Page number (1-based)
   * @param {string} limit - Items per page
   * @param {any} where - Where conditions
   * @param {any} orderBy - Order by conditions
   * @returns {Promise<{data: any[], total: number, page: number, totalPages: number}>}
   */
  async paginate(page = 1, limit = 10, where = {}, orderBy = {}) {
    const skip = (page - 1) * parseInt(limit);

    const [data, total] = await Promise.all([
      this.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
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
