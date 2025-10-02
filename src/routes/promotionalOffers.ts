import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  PromotionalOfferCreateSchema,
  PromotionalOfferUpdateSchema,
} from "../types.js";
import path from "path";
import { filesDir } from "../index.js";
import { db } from "../db/index.js";
import { promotionalOffersTable } from "../db/schema.js";
import fs from "fs/promises";
import z from "zod";
import { eq } from "drizzle-orm";

// ============================================================================
// PROMOTIONAL OFFERS ROUTES
// ============================================================================

export const promotionalOffers = new Hono();

// ============================================================================
// CREATE PROMOTIONAL OFFER
// ============================================================================

/**
 * POST endpoint to create a new promotional offer.
 * Validates that all specified image files exist before creating the database entry.
 */
promotionalOffers
  .post("/", zValidator("json", PromotionalOfferCreateSchema), async (c) => {
    const offerData = c.req.valid("json");

    try {
      // Validate that all image files exist
      for (const filename of offerData.images) {
        const filePath = path.join(filesDir, filename);
        try {
          await fs.access(filePath);
        } catch {
          return c.json({ error: `File not found: ${filename}` }, 404);
        }
      }

      const result = await db
        .insert(promotionalOffersTable)
        .values(offerData)
        .returning();

      return c.json(
        {
          message: "Promotional offer created successfully",
          data: result[0],
        },
        201,
      );
    } catch (error) {
      console.error("Error creating promotional offer:", error);
      return c.json({ error: "Failed to create promotional offer" }, 500);
    }
  })

  // ============================================================================
  // UPDATE PROMOTIONAL OFFER
  // ============================================================================

  /**
   * PATCH endpoint to update an existing promotional offer.
   * Validates that all specified image files exist if images are being updated.
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
    zValidator("json", PromotionalOfferUpdateSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const offerData = c.req.valid("json");

      // Check if at least one field is provided for update
      if (Object.keys(offerData).length === 0) {
        return c.json(
          { error: "At least one field is required for update" },
          400,
        );
      }

      try {
        // Validate that all image files exist (if images are being updated)
        if (offerData.images) {
          for (const filename of offerData.images) {
            const filePath = path.join(filesDir, filename);
            try {
              await fs.access(filePath);
            } catch {
              return c.json({ error: `File not found: ${filename}` }, 404);
            }
          }
        }

        const result = await db
          .update(promotionalOffersTable)
          .set(offerData)
          .where(eq(promotionalOffersTable.id, id))
          .returning();

        if (result.length === 0) {
          return c.json({ error: "Promotional offer not found" }, 404);
        }

        return c.json({
          message: "Promotional offer updated successfully",
          data: result[0],
        });
      } catch (error) {
        console.error("Error updating promotional offer:", error);
        return c.json({ error: "Failed to update promotional offer" }, 500);
      }
    },
  )

  // ============================================================================
  // DELETE PROMOTIONAL OFFER
  // ============================================================================

  /**
   * DELETE endpoint to remove a promotional offer from the database.
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
          .delete(promotionalOffersTable)
          .where(eq(promotionalOffersTable.id, id))
          .returning();

        if (result.length === 0) {
          return c.json({ error: "Promotional offer not found" }, 404);
        }

        return c.json({
          message: "Promotional offer deleted successfully",
          data: result[0],
        });
      } catch (error) {
        console.error("Error deleting promotional offer:", error);
        return c.json({ error: "Failed to delete promotional offer" }, 500);
      }
    },
  )

  // ============================================================================
  // GET ALL PROMOTIONAL OFFERS
  // ============================================================================

  /**
   * GET endpoint to retrieve all promotional offers from the database.
   */
  .get("/", async (c) => {
    try {
      const offers = await db.select().from(promotionalOffersTable);
      return c.json({ data: offers });
    } catch (error) {
      console.error("Error fetching promotional offers:", error);
      return c.json({ error: "Failed to fetch promotional offers" }, 500);
    }
  })

  // ============================================================================
  // GET PROMOTIONAL OFFER BY ID
  // ============================================================================

  /**
   * GET endpoint to retrieve a specific promotional offer by its ID.
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
        const offer = await db
          .select()
          .from(promotionalOffersTable)
          .where(eq(promotionalOffersTable.id, id));

        if (offer.length === 0) {
          return c.json({ error: "Promotional offer not found" }, 404);
        }

        return c.json({ data: offer[0] });
      } catch (error) {
        console.error("Error fetching promotional offer:", error);
        return c.json({ error: "Failed to fetch promotional offer" }, 500);
      }
    },
  );
