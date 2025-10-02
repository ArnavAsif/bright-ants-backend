import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { AttorneyCreateSchema, AttorneyUpdateSchema } from "../types.js";
import path from "path";
import fs from "fs/promises";
import { filesDir } from "../index.js";
import { attorneysTable } from "../db/schema.js";
import { db } from "../db/index.js";
import z from "zod";
import { eq } from "drizzle-orm";

// ============================================================================
// ATTORNEYS ROUTES
// ============================================================================

export const attorneys = new Hono();

// ============================================================================
// CREATE ATTORNEY
// ============================================================================

/**
 * POST endpoint to create a new attorney.
 * Validates that the specified image file exists before creating the database entry.
 */
attorneys
  .post("/", zValidator("json", AttorneyCreateSchema), async (c) => {
    const attorneyData = c.req.valid("json");

    // Check if file exists
    const filePath = path.join(filesDir, attorneyData.image);
    try {
      await fs.access(filePath);
    } catch {
      return c.json({ error: "File not found" }, 404);
    }

    try {
      const result = await db
        .insert(attorneysTable)
        .values(attorneyData)
        .returning();

      return c.json(
        {
          message: "Attorney created successfully",
          data: result[0],
        },
        201,
      );
    } catch (error) {
      console.error("Error creating attorney:", error);
      return c.json({ error: "Failed to create attorney" }, 500);
    }
  })

  // ============================================================================
  // UPDATE ATTORNEY
  // ============================================================================

  /**
   * PATCH endpoint to update an existing attorney.
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
    zValidator("json", AttorneyUpdateSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const attorneyData = c.req.valid("json");

      // Check if at least one field is provided for update
      if (Object.keys(attorneyData).length === 0) {
        return c.json(
          { error: "At least one field is required for update" },
          400,
        );
      }

      try {
        // Check if file exists (if image is being updated)
        if (attorneyData.image) {
          const filePath = path.join(filesDir, attorneyData.image);
          try {
            await fs.access(filePath);
          } catch {
            return c.json({ error: "File not found" }, 404);
          }
        }

        const result = await db
          .update(attorneysTable)
          .set(attorneyData)
          .where(eq(attorneysTable.id, id))
          .returning();

        if (result.length === 0) {
          return c.json({ error: "Attorney not found" }, 404);
        }

        return c.json({
          message: "Attorney updated successfully",
          data: result[0],
        });
      } catch (error) {
        console.error("Error updating attorney:", error);
        return c.json({ error: "Failed to update attorney" }, 500);
      }
    },
  )

  // ============================================================================
  // DELETE ATTORNEY
  // ============================================================================

  /**
   * DELETE endpoint to remove an attorney from the database.
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
          .delete(attorneysTable)
          .where(eq(attorneysTable.id, id))
          .returning();

        if (result.length === 0) {
          return c.json({ error: "Attorney not found" }, 404);
        }

        return c.json({
          message: "Attorney deleted successfully",
          data: result[0],
        });
      } catch (error) {
        console.error("Error deleting attorney:", error);
        return c.json({ error: "Failed to delete attorney" }, 500);
      }
    },
  )

  // ============================================================================
  // GET ALL ATTORNEYS
  // ============================================================================

  /**
   * GET endpoint to retrieve all attorneys from the database.
   */
  .get("/", async (c) => {
    try {
      const attorneys = await db.select().from(attorneysTable);
      return c.json({ data: attorneys });
    } catch (error) {
      console.error("Error fetching attorneys:", error);
      return c.json({ error: "Failed to fetch attorneys" }, 500);
    }
  })

  // ============================================================================
  // GET ATTORNEY BY ID
  // ============================================================================

  /**
   * GET endpoint to retrieve a specific attorney by its ID.
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
        const attorney = await db
          .select()
          .from(attorneysTable)
          .where(eq(attorneysTable.id, id));

        if (attorney.length === 0) {
          return c.json({ error: "Attorney not found" }, 404);
        }

        return c.json({ data: attorney[0] });
      } catch (error) {
        console.error("Error fetching attorney:", error);
        return c.json({ error: "Failed to fetch attorney" }, 500);
      }
    },
  );
