import multer from "multer";
import multerS3 from "multer-s3";
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

// S3 Client configuration
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT, // URL MinIO
  region: process.env.S3_REGION, // region bebas
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY, // ganti dengan akses key MinIO kamu
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // penting untuk MinIO
});

// Multer S3 storage configuration
const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET, // pastikan bucket sudah ada
  acl: process.env.S3_ACL, // kalau mau bisa diakses publik
  key: (req, file, cb) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 01-12
    const filename = Date.now().toString() + "-" + file.originalname;

    // hasil path: uploads/2025/01/1693742123456-report.pdf
    cb(null, `uploads/${year}/${month}/${filename}`);
  },
});

/**
 * @typedef {class} StorageUtils
 * @property {import('@aws-sdk/client-s3').S3Client} client - S3 client instance
 * @property {string} bucket - Bucket name
 * @property {import('multer').Multer} upload - Multer upload middleware
 * @property {(key: string) => Promise<any>} deleteFile - Delete file from storage
 * @property {(key: string, expiresIn?: number) => Promise<string>} generateSignedUrl - Generate signed URL
 * @property {(key: string, expiresInMinutes?: number) => Promise<string>} generateDownloadUrl - Generate download URL
 */

class StorageUtils {
  constructor() {
    this.client = s3;
    this.bucket = process.env.S3_BUCKET;
    this.upload = multer({ storage });
  }

  /**
   * Delete file from storage
   * @param {string} key - File key to delete
   * @returns {Promise<any>} Delete result
   */
  async deleteFile(key) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return await this.client.send(command);
  }

  /**
   * Generate signed URL for download
   * @param {string} key - File key
   * @param {number} [expiresIn=300] - Expiration time in seconds
   * @returns {Promise<string>} Signed URL
   */
  async generateSignedUrl(key, expiresIn = 300) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return await getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Generate signed URL with custom expiration
   * @param {string} key - File key in storage
   * @param {number} [expiresInMinutes=5] - Expiration time in minutes
   * @returns {Promise<string>} Signed URL
   */
  async generateDownloadUrl(key, expiresInMinutes = 5) {
    const expiresIn = expiresInMinutes * 60; // convert to seconds
    return await this.generateSignedUrl(key, expiresIn);
  }
}

export default new StorageUtils();
