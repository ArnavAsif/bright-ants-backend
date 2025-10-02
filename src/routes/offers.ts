import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { OfferCreateSchema, OfferUpdateSchema } from "../types.js";
import { offersTable } from "../db/schema.js";
import { db } from "../db/index.js";
import z from "zod";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

// ============================================================================
// OFFERS ROUTES
// ============================================================================

export const offers = new Hono();

// ============================================================================
// CREATE OFFER
// ============================================================================

/**
 * POST endpoint to create a new offer.
 * Inserts the offer data into the database.
 */
offers.post("/", zValidator("json", OfferCreateSchema), async (c) => {
  const offerData = c.req.valid("json");

  try {
    const result = await db
      .insert(offersTable)
      .values({
        title: offerData.title,
        description: offerData.description,
        price: sql`${offerData.price}::numeric`,
      })
      .returning();

    return c.json(
      {
        message: "Offer created successfully",
        data: result[0],
      },
      201,
    );
  } catch (error) {
    console.error("Error creating offer:", error);
    return c.json({ error: "Failed to create offer" }, 500);
  }
})

// ============================================================================
// UPDATE OFFER
// ============================================================================

/**
 * PATCH endpoint to update an existing offer.
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
  zValidator("json", OfferUpdateSchema),
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
      // Prepare update data
      const updates: any = {};
      if (offerData.title !== undefined) updates.title = offerData.title;
      if (offerData.description !== undefined) updates.description = offerData.description;
      if (offerData.price !== undefined) updates.price = sql`${offerData.price}::numeric`;

      const result = await db
        .update(offersTable)
        .set(updates)
        .where(eq(offersTable.id, id))
        .returning();

      if (result.length === 0) {
        return c.json({ error: "Offer not found" }, 404);
      }

      return c.json({
        message: "Offer updated successfully",
        data: result[0],
      });
    } catch (error) {
      console.error("Error updating offer:", error);
      return c.json({ error: "Failed to update offer" }, 500);
    }
  },
)

// ============================================================================
// DELETE OFFER
// ============================================================================

/**
 * DELETE endpoint to remove an offer from the database.
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
        .delete(offersTable)
        .where(eq(offersTable.id, id))
        .returning();

      if (result.length === 0) {
        return c.json({ error: "Offer not found" }, 404);
      }

      return c.json({
        message: "Offer deleted successfully",
        data: result[0],
      });
    } catch (error) {
      console.error("Error deleting offer:", error);
      return c.json({ error: "Failed to delete offer" }, 500);
    }
  },
)

// ============================================================================
// GET ALL OFFERS
// ============================================================================

/**
 * GET endpoint to retrieve all offers from the database.
 */
.get("/", async (c) => {
  try {
    const offers = await db.select().from(offersTable);
    return c.json({ data: offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return c.json({ error: "Failed to fetch offers" }, 500);
  }
})

// ============================================================================
// GET OFFER BY ID
// ============================================================================

/**
 * GET endpoint to retrieve a specific offer by its ID.
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
        .from(offersTable)
        .where(eq(offersTable.id, id));

      if (offer.length === 0) {
        return c.json({ error: "Offer not found" }, 404);
      }

      return c.json({ data: offer[0] });
    } catch (error) {
      console.error("Error fetching offer:", error);
      return c.json({ error: "Failed to fetch offer" }, 500);
    }
  },
);