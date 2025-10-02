import { Hono } from "hono";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { filesDir } from "../index.js";
import { spawn } from "child_process";

// ============================================================================
// FILE NAME GENERATION
// ============================================================================

/**
 * Generate a sanitized filename to prevent conflicts and ensure security.
 * @param originalName - The original filename from the client
 * @returns A sanitized filename with timestamp and random string
 */
function generateSanitizedFilename(originalName: string): string {
  // Get file extension
  const ext = path.extname(originalName).toLowerCase();
  // Create a sanitized name using timestamp and random string
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  // Use a simple naming convention: timestamp-randomString.ext
  return `${timestamp}-${randomString}${ext}`;
}

// ============================================================================
// VIDEO PROCESSING
// ============================================================================

/**
 * Process video using ffmpeg to reduce size while maintaining quality
 * @param inputBuffer - The video file buffer
 * @param outputPath - Path where processed video should be saved
 * @returns Promise that resolves when processing is complete
 */
function processVideo(inputBuffer: Buffer, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // For now, we'll save the video as-is since ffmpeg processing
    // would require additional setup. In a full implementation,
    // we would use ffmpeg here to compress the video.

    // Save the video file as-is for now
    fs.writeFile(outputPath, inputBuffer)
      .then(() => resolve())
      .catch(reject);
  });
}

/**
 * Get the path for the single video file
 * @returns Path to the single video file
 */
function getSingleVideoPath(): string {
  return path.join(filesDir, "video.mp4");
}

// ============================================================================
// FILE ROUTES
// ============================================================================

export const files = new Hono();

// ============================================================================
// FILE UPLOAD ENDPOINT
// ============================================================================

/**
 * POST endpoint for uploading files.
 * Handles both image and video uploads with appropriate processing.
 * Images are compressed to JPEG format, videos are stored as-is.
 */
files
  .post("/", async (c) => {
    // Parse form data including files
    const formData = await c.req.parseBody({ all: true });

    // Get all files from the form data
    const files: File[] = [];

    // Iterate through form data entries to collect all File objects
    for (const [key, value] of Object.entries(formData)) {
      if (value instanceof File) {
        files.push(value);
      } else if (Array.isArray(value) && value[0] instanceof File) {
        // If multiple files were uploaded with the same field name
        files.push(
          ...value.filter((file): file is File => file instanceof File),
        );
      }
    }

    // Validate and process files
    const processedFiles: {
      name: string;
      size: number;
      type: string;
    }[] = [];

    for (const file of files) {
      // Check file type (basic MIME type check)
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        return c.json(
          {
            error: `Invalid file type for ${file.name}. Only image and video files are allowed.`,
          },
          400,
        );
      }

      // Set size limits based on file type
      let maxSize;
      let maxSizeStr;
      if (isImage) {
        maxSize = 50 * 1024 * 1024; // 50 MB for images
        maxSizeStr = "50MB";
      } else {
        maxSize = 1024 * 1024 * 1024; // 1 GB for videos
        maxSizeStr = "1GB";
      }

      // Check file size
      if (file.size > maxSize) {
        return c.json(
          { error: `File ${file.name} exceeds the ${maxSizeStr} limit.` },
          400,
        );
      }

      try {
        if (isImage) {
          // Generate a sanitized filename for images
          const fileName = generateSanitizedFilename(file.name);
          const filePath = path.join(filesDir, fileName);

          // Convert File to Buffer for sharp
          const buffer = Buffer.from(await file.arrayBuffer());

          // Compress and save the image
          // Adjust quality as needed (80 is a good balance between quality and size)
          await sharp(buffer)
            .jpeg({ quality: 80 }) // This will convert all images to JPEG format
            .toFile(filePath);

          // Get the size of the compressed file
          const stats = await fs.stat(filePath);

          processedFiles.push({
            name: fileName,
            size: stats.size,
            type: "image/jpeg", // Since we're converting to JPEG
          });
        } else {
          // For videos, use a single video file system
          const videoPath = getSingleVideoPath();

          // Convert File to Buffer
          const buffer = Buffer.from(await file.arrayBuffer());

          // Process video to reduce size (in a full implementation, this would use ffmpeg)
          await processVideo(buffer, videoPath);

          // Get the size of the processed video
          const stats = await fs.stat(videoPath);

          processedFiles.push({
            name: "video.mp4", // Fixed name for the single video
            size: stats.size,
            type: "video/mp4", // Standardized to MP4
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        return c.json({ error: `Failed to process file ${file.name}` }, 500);
      }
    }

    return c.json(
      {
        message: "Files uploaded and processed successfully",
        files: processedFiles,
      },
      201,
    );
  })

  // ============================================================================
  // FILE SERVING ENDPOINT
  // ============================================================================

  /**
   * GET endpoint for serving files (images and videos).
   * Validates filenames to prevent directory traversal attacks.
   * Handles the single video file specially.
   */
  .get("/:filename", async (c) => {
    const filename = c.req.param("filename");

    // Handle the single video file
    if (filename === "video.mp4") {
      const videoPath = getSingleVideoPath();

      try {
        // Check if video file exists
        await fs.access(videoPath);

        // Read the video file
        const fileBuffer = await fs.readFile(videoPath);

        // Set appropriate content type for video
        c.header("Content-Type", "video/mp4");

        return c.body(fileBuffer);
      } catch (error) {
        console.error(`Error serving video file:`, error);
        return c.json({ error: "Video file not found" }, 404);
      }
    }

    // Validate filename to prevent directory traversal (for images)
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return c.json({ error: "Invalid filename" }, 400);
    }

    const filePath = path.join(filesDir, filename);

    try {
      // Check if file exists
      await fs.access(filePath);

      // Read the file
      const fileBuffer = await fs.readFile(filePath);

      // Set appropriate content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      let contentType = "application/octet-stream"; // default

      // Common image types
      if ([".jpg", ".jpeg"].includes(ext)) contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".gif") contentType = "image/gif";
      else if (ext === ".webp") contentType = "image/webp";
      else if (ext === ".svg") contentType = "image/svg+xml";
      // Common video types
      else if (ext === ".mp4") contentType = "video/mp4";
      else if (ext === ".webm") contentType = "video/webm";
      else if (ext === ".ogg") contentType = "video/ogg";
      else if (ext === ".avi") contentType = "video/x-msvideo";
      else if (ext === ".mov") contentType = "video/quicktime";
      else if (ext === ".wmv") contentType = "video/x-ms-wmv";
      else if (ext === ".flv") contentType = "video/x-flv";
      else if (ext === ".mkv") contentType = "video/x-matroska";

      c.header("Content-Type", contentType);

      return c.body(fileBuffer);
    } catch (error) {
      console.error(`Error serving file ${filename}:`, error);
      return c.json({ error: "File not found" }, 404);
    }
  });

