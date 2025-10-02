import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { WorkCreateSchema, WorkUpdateSchema } from "../types.js";
import path from "path";
import { filesDir } from "../index.js";
import { worksTable } from "../db/schema.js";
import { db } from "../db/index.js";
import fs from "fs/promises";
import z from "zod";
import { eq } from "drizzle-orm";

// ============================================================================
// WORKS ROUTES
// ============================================================================

export const works = new Hono();

// ============================================================================
// CREATE WORK
// ============================================================================

/**
 * POST endpoint to create a new work entry.
 * Validates that the specified file exists before creating the database entry.
 */
works
  .post("/", zValidator("json", WorkCreateSchema), async (c) => {
    const { title, image } = c.req.valid("json");

    // Check if file exists
    const filePath = path.join(filesDir, image);
    try {
      await fs.access(filePath);
    } catch {
      return c.json({ error: "File not found" }, 404);
    }

    // Insert into database
    const result = await db
      .insert(worksTable)
      .values({
        title,
        image,
      })
      .returning();

    return c.json(
      {
        message: "Work created successfully",
        data: result[0],
      },
      201,
    );
  })

  // ============================================================================
  // UPDATE WORK
  // ============================================================================

  /**
   * PATCH endpoint to update an existing work entry.
   * Validates that the specified file exists if image is being updated.
   */
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number().min(1),
      }),
    ),
    zValidator("json", WorkUpdateSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { title, image } = c.req.valid("json");

      // Validate input
      if (title === undefined && image === undefined) {
        return c.json(
          { error: "At least one field (title or image) is required" },
          400,
        );
      }

      // Check if file exists (if image is being updated)
      if (image) {
        const filePath = path.join(filesDir, image);
        try {
          await fs.access(filePath);
        } catch {
          return c.json({ error: "File not found" }, 404);
        }
      }

      // Update database entry
      const updates: any = {};
      if (title !== undefined) updates.title = title;
      if (image !== undefined) updates.image = image;

      const result = await db
        .update(worksTable)
        .set(updates)
        .where(eq(worksTable.id, id))
        .returning();

      if (result.length === 0) {
        return c.json({ error: "Work not found" }, 404);
      }

      return c.json({
        message: "Work updated successfully",
        data: result[0],
      });
    },
  )

  // ============================================================================
  // DELETE WORK
  // ============================================================================

  /**
   * DELETE endpoint to remove a work entry from the database.
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
        .delete(worksTable)
        .where(eq(worksTable.id, id))
        .returning();

      if (result.length === 0) {
        return c.json({ error: "Work not found" }, 404);
      }

      return c.json({
        message: "Work deleted successfully",
        data: result[0],
      });
    },
  )

  // ============================================================================
  // GET ALL WORKS
  // ============================================================================

  /**
   * GET endpoint to retrieve all works from the database.
   */
  .get("/", async (c) => {
    const works = await db.select().from(worksTable);
    return c.json({ data: works });
  })

  // ============================================================================
  // GET WORK BY ID
  // ============================================================================

  /**
   * GET endpoint to retrieve a specific work by its ID.
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

      const work = await db
        .select()
        .from(worksTable)
        .where(eq(worksTable.id, id));

      if (work.length === 0) {
        return c.json({ error: "Work not found" }, 404);
      }

      return c.json({ data: work[0] });
    },
  );

