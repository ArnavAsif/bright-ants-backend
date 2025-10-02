import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  CarouselImageCreateSchema,
  CarouselImageUpdateSchema,
} from "../types.js";
import path from "path";
import { filesDir } from "../index.js";
import { carouselImagesTable } from "../db/schema.js";
import { db } from "../db/index.js";
import fs from "fs/promises";
import z from "zod";
import { eq } from "drizzle-orm";

// ============================================================================
// CAROUSEL IMAGES ROUTES
// ============================================================================

export const carouselImages = new Hono();

// ============================================================================
// CREATE CAROUSEL IMAGE
// ============================================================================

/**
 * POST endpoint to create a new carousel image entry.
 * Validates that the specified file exists before creating the database entry.
 */
carouselImages
  .post("/", zValidator("json", CarouselImageCreateSchema), async (c) => {
    const { filename, row } = c.req.valid("json");

    // Check if file exists
    const filePath = path.join(filesDir, filename);
    try {
      await fs.access(filePath);
    } catch {
      return c.json({ error: "File not found" }, 404);
    }

    // Insert into database
    const result = await db
      .insert(carouselImagesTable)
      .values({
        filename,
        row,
      })
      .returning();

    return c.json(
      {
        message: "Carousel image created successfully",
        data: result[0],
      },
      201,
    );
  })

  // ============================================================================
  // UPDATE CAROUSEL IMAGE
  // ============================================================================

  /**
   * PATCH endpoint to update an existing carousel image entry.
   * Validates that the specified file exists if filename is being updated.
   */
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number().min(1),
      }),
    ),
    zValidator("json", CarouselImageUpdateSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { filename, row } = c.req.valid("json");

      // Validate input
      if (filename === undefined && row === undefined) {
        return c.json(
          { error: "At least one field (filename or row) is required" },
          400,
        );
      }

      // Check if file exists (if filename is being updated)
      if (filename) {
        const filePath = path.join(filesDir, filename);
        try {
          await fs.access(filePath);
        } catch {
          return c.json({ error: "File not found" }, 404);
        }
      }

      // Update database entry
      const updates: any = {};
      if (filename !== undefined) updates.filename = filename;
      if (row !== undefined) updates.row = row;

      const result = await db
        .update(carouselImagesTable)
        .set(updates)
        .where(eq(carouselImagesTable.id, id))
        .returning();

      if (result.length === 0) {
        return c.json({ error: "Carousel image not found" }, 404);
      }

      return c.json({
        message: "Carousel image updated successfully",
        data: result[0],
      });
    },
  )

  // ============================================================================
  // DELETE CAROUSEL IMAGE
  // ============================================================================

  /**
   * DELETE endpoint to remove a carousel image entry from the database.
   */
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number().min(1),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      // Delete from database
      const result = await db
        .delete(carouselImagesTable)
        .where(eq(carouselImagesTable.id, id))
        .returning();

      if (result.length === 0) {
        return c.json({ error: "Carousel image not found" }, 404);
      }

      return c.json({
        message: "Carousel image deleted successfully",
        data: result[0],
      });
    },
  )

  // ============================================================================
  // GET ALL CAROUSEL IMAGES
  // ============================================================================

  /**
   * GET endpoint to retrieve all carousel images from the database.
   */
  .get("/", async (c) => {
    const images = await db.select().from(carouselImagesTable);
    return c.json({ data: images });
  })

  // ============================================================================
  // GET CAROUSEL IMAGE BY ID
  // ============================================================================

  /**
   * GET endpoint to retrieve a specific carousel image by its ID.
   */
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number().min(1),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const image = await db
        .select()
        .from(carouselImagesTable)
        .where(eq(carouselImagesTable.id, id));

      if (image.length === 0) {
        return c.json({ error: "Carousel image not found" }, 404);
      }

      return c.json({ data: image[0] });
    },
  )

  // ============================================================================
  // GET CAROUSEL IMAGES BY ROW
  // ============================================================================

  /**
   * GET endpoint to retrieve all carousel images belonging to a specific row.
   * Results are ordered by their index within the row.
   */
  .get(
    "/row/:rowId",
    zValidator(
      "param",
      z.object({
        rowId: z.coerce.number().min(1),
      }),
    ),
    async (c) => {
      const { rowId } = c.req.valid("param");

      const images = await db
        .select()
        .from(carouselImagesTable)
        .where(eq(carouselImagesTable.row, rowId))
        .orderBy(carouselImagesTable.index);

      return c.json({ data: images });
    },
  );
