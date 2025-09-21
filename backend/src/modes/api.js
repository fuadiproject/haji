// src/modes/api.js
import app from "../app.js";

export async function runApi() {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 API Server running at http://localhost:${PORT}`);
  });
}
