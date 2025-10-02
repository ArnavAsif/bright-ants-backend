// ============================================================================
// IMPORTS
// ============================================================================

import dotenv from "dotenv";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { files } from "./routes/files.js";
import { carouselImages } from "./routes/carouselImages.js";
import { testimonials } from "./routes/testimonials.js";
import { promotionalOffers } from "./routes/promotionalOffers.js";
import { attorneys } from "./routes/attorneys.js";
import { works } from "./routes/works.js";
import { email } from "./routes/email.js"; // Import the new email route
import { offers } from "./routes/offers.js"; // Import the new offers route
import { validateEnvVars } from "./config/env.js"; // Import env validation

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Load environment variables from .env file.
 * The 'quiet' option suppresses console output when the file is not found.
 */
dotenv.config({
  quiet: true,
});

/**
 * Validate all required environment variables before starting the application.
 * This will throw an error and prevent the server from starting if any
 * required variables are missing or invalid.
 */
try {
  validateEnvVars();
  console.log("✅ All environment variables are properly configured");
} catch (error: unknown) {
  console.error("❌ Environment variable validation failed:", (error as Error).message);
  process.exit(1);
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

/**
 * Initialize the Hono application.
 * Hono is a small, simple, and ultrafast web framework for JavaScript.
 */
const app = new Hono();

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

/**
 * Enable Cross-Origin Resource Sharing (CORS) for all routes.
 * This allows the frontend to make requests to this backend API.
 */
app.use(cors());

// ============================================================================
// SERVER CONFIGURATION
// ============================================================================

/**
 * Define the directory for storing uploaded images and videos.
 * The directory is created in the user's home directory to persist data
 * even if the application is restarted.
 */
export const filesDir = path.join(os.homedir(), "bright-ants-files");

/**
 * Ensure the images directory exists, creating it if necessary.
 * The 'recursive' option allows nested directory creation.
 */
await fs.mkdir(filesDir, { recursive: true });

// ============================================================================
// ROUTE REGISTRATION
// ============================================================================

/**
 * Register all API routes with the application.
 * Each route is mounted under a specific path prefix.
 */
app.route("/files", files);
app.route("/carousel-images", carouselImages);
app.route("/testimonials", testimonials);
app.route("/promotional-offers", promotionalOffers);
app.route("/attorneys", attorneys);
app.route("/works", works);
app.route("/email", email); // Register the new email route
app.route("/offers", offers); // Register the new offers route

// ============================================================================
// SERVER STARTUP AND SHUTDOWN
// ============================================================================

/**
 * Start the HTTP server on port 3000.
 * The callback function logs a message when the server is running.
 */
const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

/**
 * Handle graceful shutdown on SIGINT signal (Ctrl+C).
 * Closes the server and exits the process cleanly.
 */
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});

/**
 * Handle graceful shutdown on SIGTERM signal.
 * Closes the server and exits the process cleanly.
 * Logs any errors that occur during shutdown.
 */
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});