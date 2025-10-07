import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { BlogCreateSchema, BlogUpdateSchema } from "../types.js";
import path from "path";
import fs from "fs/promises";
import { filesDir } from "../index.js";
import { blogsTable } from "../db/schema.js";
import { db } from "../db/index.js";
import z from "zod";
import { eq } from "drizzle-orm";

// ============================================================================
// BLOGS ROUTES
// ============================================================================

export const blogs = new Hono();

// ============================================================================
// CREATE BLOG
// ============================================================================

/**
 * POST endpoint to create a new blog.
 * Validates that the specified image file exists before creating the database entry.
 */
blogs
  .post("/", zValidator("json", BlogCreateSchema), async (c) => {
    const blogData = c.req.valid("json");

    // Check if file exists
    const filePath = path.join(filesDir, blogData.image);
    try {
      await fs.access(filePath);
    } catch {
      return c.json({ error: "File not found" }, 404);
    }

    try {
      const result = await db
        .insert(blogsTable)
        .values(blogData)
        .returning();

      return c.json(
        {
          message: "Blog created successfully",
          data: result[0],
        },
        201,
      );
    } catch (error) {
      console.error("Error creating blog:", error);
      return c.json({ error: "Failed to create blog" }, 500);
    }
  })

  // ============================================================================
  // UPDATE BLOG
  // ============================================================================

  /**
   * PATCH endpoint to update an existing blog.
   * Validates that the specified image file exists if the image is being updated.
   * Requires at least one field to be provided for update.
   */
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number().min(1),
      }),
    ),
    zValidator("json", BlogUpdateSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const blogData = c.req.valid("json");

      // Check if at least one field is provided for update
      if (Object.keys(blogData).length === 0) {
        return c.json(
          { error: "At least one field is required for update" },
          400,
        );
      }

      try {
        // Check if file exists (if image is being updated)
        if (blogData.image) {
          const filePath = path.join(filesDir, blogData.image);
          try {
            await fs.access(filePath);
          } catch {
            return c.json({ error: "File not found" }, 404);
          }
        }

        // Update the updated_at timestamp
        const result = await db
          .update(blogsTable)
          .set({ ...blogData, updated_at: new Date() })
          .where(eq(blogsTable.id, id))
          .returning();

        if (result.length === 0) {
          return c.json({ error: "Blog not found" }, 404);
        }

        return c.json({
          message: "Blog updated successfully",
          data: result[0],
        });
      } catch (error) {
        console.error("Error updating blog:", error);
        return c.json({ error: "Failed to update blog" }, 500);
      }
    },
  )

  // ============================================================================
  // DELETE BLOG
  // ============================================================================

  /**
   * DELETE endpoint to remove a blog from the database.
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

      try {
        const result = await db
          .delete(blogsTable)
          .where(eq(blogsTable.id, id))
          .returning();

        if (result.length === 0) {
          return c.json({ error: "Blog not found" }, 404);
        }

        return c.json({
          message: "Blog deleted successfully",
          data: result[0],
        });
      } catch (error) {
        console.error("Error deleting blog:", error);
        return c.json({ error: "Failed to delete blog" }, 500);
      }
    },
  )

  // ============================================================================
  // GET ALL BLOGS
  // ============================================================================

  /**
   * GET endpoint to retrieve all blogs from the database.
   */
  .get("/", async (c) => {
    try {
      const blogs = await db.select().from(blogsTable);
      return c.json({ data: blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return c.json({ error: "Failed to fetch blogs" }, 500);
    }
  })

  // ============================================================================
  // GET BLOG BY ID
  // ============================================================================

  /**
   * GET endpoint to retrieve a specific blog by its ID.
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

      try {
        const blog = await db
          .select()
          .from(blogsTable)
          .where(eq(blogsTable.id, id));

        if (blog.length === 0) {
          return c.json({ error: "Blog not found" }, 404);
        }

        return c.json({ data: blog[0] });
      } catch (error) {
        console.error("Error fetching blog:", error);
        return c.json({ error: "Failed to fetch blog" }, 500);
      }
    },
  );