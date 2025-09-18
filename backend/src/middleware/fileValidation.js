// src/middleware/fileValidation.js
// File validation middleware with integrated multer

// Default configuration
const defaultConfig = {
  // Size limits
  maxSize: 10 * 1024 * 1024, // 10MB default
  minSize: 0, // 0 bytes default

  // Extension control - HIERARCHY
  allowedExtensions: "all", // 'all' = allow all, array = specific extensions only
  excludedExtensions: [], // Only used when allowedExtensions = 'all'

  // MIME type control - HIERARCHY
  allowedMimeTypes: "all", // 'all' = allow all, array = specific MIME types only
  excludedMimeTypes: [], // Only used when allowedMimeTypes = 'all'

  // Security
  blockExecutables: true, // Block .exe, .bat, .sh, etc.

  // Error messages
  errorMessages: {
    fileTooLarge: "File size exceeds maximum allowed size",
    fileTooSmall: "File size is below minimum required size",
    tooManyFiles: "Too many files uploaded",
    invalidExtension: "File type not allowed",
    invalidMimeType: "File MIME type not allowed",
    executableBlocked: "Executable files are not allowed",
  },
};

// Helper functions
const getFileExtension = (filename) => {
  return filename.substring(filename.lastIndexOf(".")).toLowerCase();
};

// Validation functions
const validateFileSize = (file, config) => {
  if (file.size > config.maxSize) {
    throw new Error(config.errorMessages.fileTooLarge);
  }
  if (file.size < config.minSize) {
    throw new Error(config.errorMessages.fileTooSmall);
  }
  return true;
};

const validateFileCount = (files, config) => {
  const fileCount = Array.isArray(files) ? files.length : 1;
  if (fileCount > config.maxFiles) {
    throw new Error(config.errorMessages.tooManyFiles);
  }
  return true;
};

const validateFileExtension = (file, config) => {
  const extension = getFileExtension(file.originalname);

  // HIERARCHY: If allowedExtensions is 'all', check excludedExtensions
  if (config.allowedExtensions === "all") {
    if (config.excludedExtensions.includes(extension)) {
      throw new Error(config.errorMessages.invalidExtension);
    }
  } else if (Array.isArray(config.allowedExtensions)) {
    // HIERARCHY: If specific extensions, only allow those
    if (!config.allowedExtensions.includes(extension)) {
      throw new Error(config.errorMessages.invalidExtension);
    }
  }

  return true;
};

const validateMimeType = (file, config) => {
  // HIERARCHY: If allowedMimeTypes is 'all', check excludedMimeTypes
  if (config.allowedMimeTypes === "all") {
    if (config.excludedMimeTypes.includes(file.mimetype)) {
      throw new Error(config.errorMessages.invalidMimeType);
    }
  } else if (Array.isArray(config.allowedMimeTypes)) {
    // HIERARCHY: If specific MIME types, only allow those
    if (!config.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(config.errorMessages.invalidMimeType);
    }
  }

  return true;
};

const validateExecutableFiles = (file, config) => {
  if (!config.blockExecutables) return true;

  const executableExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".sh",
    ".ps1",
    ".scr",
    ".com",
    ".pif",
  ];
  const extension = getFileExtension(file.originalname);

  if (executableExtensions.includes(extension)) {
    throw new Error(config.errorMessages.executableBlocked);
  }
  return true;
};

// Main middleware factory with integrated multer
export const createFileValidationMiddleware = (userConfig = {}) => {
  const config = { ...defaultConfig, ...userConfig };

  return async (req, res, next) => {
    try {
      // Import storage dynamically to avoid circular dependency
      const storageModule = await import("../utils/storage.js");
      const storage = storageModule.default;

      // Use multer from storage to process file upload
      storage.upload.single("file")(req, res, (err) => {
        if (err) {
          console.error("❌ Multer error:", err);
          return res.status(400).json({
            success: false,
            error: "File upload failed",
          });
        }

        try {
          // Check if there are files to validate
          const filesToValidate = req.files || (req.file ? [req.file] : []);

          if (filesToValidate.length === 0) {
            return next(); // No files to validate, proceed
          }

          // Validate file count
          if (req.files) {
            validateFileCount(req.files, config);

            // Validate each file
            for (const file of req.files) {
              validateFileSize(file, config);
              validateFileExtension(file, config);
              validateMimeType(file, config);
              validateExecutableFiles(file, config);
            }
          }

          // Validate single file
          if (req.file) {
            validateFileSize(req.file, config);
            validateFileExtension(req.file, config);
            validateMimeType(req.file, config);
            validateExecutableFiles(req.file, config);
          }

          next();
        } catch (error) {
          return res.status(400).json({
            success: false,
            error: error.message,
          });
        }
      });
    } catch (importError) {
      console.error("❌ Import error:", importError);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
};
