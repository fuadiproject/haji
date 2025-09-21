// index.js (updated)
import { runApi } from "./src/modes/api.js";
import { runConsumer } from "./src/modes/consumer.js";

// Parse command line arguments
const args = process.argv.slice(2);
const mode =
  args.find((arg) => arg.startsWith("--mode="))?.split("=")[1] || "api";

// Or check for specific flags
const isConsumer = args.includes("--consumer");

async function main() {
  if (isConsumer || mode === "consumer") {
    await runConsumer();
  } else {
    await runApi();
  }
}

main().catch((error) => {
  console.error("❌ Application failed to start:", error);
  process.exit(1);
});
