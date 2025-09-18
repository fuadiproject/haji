import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import hyperlinkRoutes from "./routes/hyperlinkRoutes.js";
import response from "./utils/response.js";

const app = express();

app.use(express.json());

app.use("/api/files", fileRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/hyperlinks", hyperlinkRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);

  // Handle different types of errors
  if (err.name === "ValidationError") {
    return response.validationError(res, "Validation failed");
  }

  if (err.name === "UnauthorizedError") {
    return response.unauthorized(res, "Unauthorized access");
  }

  if (err.name === "CastError") {
    return response.badRequest(res, "Invalid ID format");
  }

  // Default error handler
  return response.error(res, err.message);
});

// 404 handler
app.use((req, res) => {
  return response.notFound(res, "Route not found");
});

export default app;
