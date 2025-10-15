import { validationResult } from "express-validator";
import response from "../utils/response.js";

/**
 * Validate request middleware
 * Checks for validation errors and returns them if found
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return response.badRequest(res, "Validation failed", errorMessages);
  }

  next();
};
