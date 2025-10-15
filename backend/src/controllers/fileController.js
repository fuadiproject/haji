import fileModel from "../models/fileModel.js";
import storage from "../utils/storage.js";
import response from "../utils/response.js";

export class FileController {
  /**
   * @param {import('../models/fileModel.js').FileModel} fileModel
   * @param {import('../utils/storage.js').default} storage
   * @param {import('../utils/response.js').default} response
   */
  constructor(fileModel, storage, response) {
    this.fileModel = fileModel;
    this.storage = storage;
    this.response = response;
  }

  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return response.badRequest(res, "No file uploaded");
      }

      const { id } = req.user; // Get user NIK from JWT

      const data = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        key: req.file.key, // ✅ dari multer-s3
        filepath: req.file.location, // URL dari MinIO
        size: req.file.size, // tambah size
      };

      const file = await fileModel.createWithCreator(data, id);
      return response.created(res, "File uploaded successfully", file);
    } catch (error) {
      console.error("❌ Upload error:", error);
      return response.error(res, error.message);
    }
  }

  async getFiles(req, res) {
    try {
      const files = await fileModel.findMany();
      return this.response.success(res, "Files retrieved successfully", files);
    } catch (error) {
      return this.response.error(res, error.message);
    }
  }

  async getFileById(req, res) {
    const { id } = req.params;
    try {
      const file = await fileModel.findUnique({ where: { id } });
      if (!file) return this.response.notFound(res, "File not found");
      return this.response.success(res, "File retrieved successfully", file);
    } catch (error) {
      return this.response.error(res, error.message);
    }
  }

  async downloadFile(req, res) {
    const { id } = req.params;
    try {
      const file = await this.fileModel.findUnique({ where: { id } });
      if (!file) return response.notFound(res, "File not found");

      // Generate signed URL yang berlaku 5 menit
      const signedUrl = await this.storage.generateDownloadUrl(file.key, 5);

      const downloadData = {
        id: file.id,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        downloadUrl: signedUrl,
        expiresIn: "5 minutes",
        createdAt: file.created_at,
      };

      return this.response.success(
        res,
        "Signed URL generated successfully",
        downloadData
      );
    } catch (error) {
      return this.response.error(res, error.message);
    }
  }

  async deleteFile(req, res) {
    try {
      const { id } = req.params;

      // cari data file di DB
      const file = await this.fileModel.findUnique({ where: { id } });
      if (!file) return this.response.notFound(res, "File not found");

      // hapus file dari storage
      await this.storage.deleteFile(file.key);

      // hapus metadata di DB
      await this.fileModel.delete({ where: { id } });

      return this.response.success(res, "File deleted successfully");
    } catch (err) {
      console.error("❌ Error delete file:", err);
      return this.response.error(res, "Failed to delete file");
    }
  }
}

// Default instance
export default new FileController(fileModel, storage, response);
