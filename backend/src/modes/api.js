// src/modes/api.js
import app from "../app.js";

export async function runApi(customPort = null) {
  const PORT = customPort || process.env.PORT || 3000;

  // Validate port number
  if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
    console.error(
      `❌ Invalid port number: ${PORT}. Port must be between 1 and 65535.`
    );
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 API Server running at http://localhost:${PORT}`);
  });
}
