// Response utility untuk konsistensi response API
const response = {
  // Success response
  success(res, message = "Success", data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  // Success response with pagination
  successWithPagination(
    res,
    message = "Success",
    data = null,
    pagination = null,
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination,
    });
  },

  // Error response
  error(res, error = "Internal Server Error", statusCode = 500) {
    // Sanitize error message untuk keamanan
    const sanitizedError = this.sanitizeError(error);

    return res.status(statusCode).json({
      success: false,
      error: sanitizedError,
    });
  },

  // Sanitize error message untuk keamanan
  sanitizeError(error) {
    if (typeof error !== "string") {
      error = error.toString();
    }

    // In production, return generic error
    if (process.env.NODE_ENV === "production") {
      return "An error occurred. Please try again later.";
    }

    // Hide database connection details
    if (
      error.includes("Can't reach database server") ||
      error.includes("database server is running") ||
      error.includes("ECONNREFUSED") ||
      error.includes("ENOTFOUND") ||
      error.includes("ETIMEDOUT")
    ) {
      return "Database connection error. Please try again later.";
    }

    // Hide Prisma internal errors
    if (
      error.includes("Invalid `prisma.") ||
      error.includes("PrismaClientKnownRequestError") ||
      error.includes("PrismaClientUnknownRequestError")
    ) {
      return "Database operation failed. Please try again later.";
    }

    // Hide file system errors
    if (
      error.includes("ENOENT") ||
      error.includes("EACCES") ||
      error.includes("EMFILE")
    ) {
      return "File system error. Please try again later.";
    }

    // Hide network errors
    if (
      error.includes("ECONNRESET") ||
      error.includes("ECONNABORTED") ||
      error.includes("ENETUNREACH")
    ) {
      return "Network error. Please try again later.";
    }

    // Hide AWS/S3 errors
    if (
      error.includes("AWS") ||
      error.includes("S3") ||
      error.includes("MinIO") ||
      error.includes("AccessDenied") ||
      error.includes("NoSuchBucket")
    ) {
      return "Storage service error. Please try again later.";
    }

    // In development, return original error
    return error;
  },

  // Created response (201)
  created(res, message = "Created successfully", data = null) {
    return this.success(res, message, data, 201);
  },

  // Not found response (404)
  notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  },

  // Bad request response (400)
  badRequest(res, message = "Bad request") {
    return this.error(res, message, 400);
  },

  // Unauthorized response (401)
  unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, 401);
  },

  // Forbidden response (403)
  forbidden(res, message = "Forbidden") {
    return this.error(res, message, 403);
  },

  // Validation error response (422)
  validationError(res, message = "Validation error") {
    return this.error(res, message, 422);
  },
};

export default response;
