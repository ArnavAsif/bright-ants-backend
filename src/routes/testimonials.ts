import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { TestimonialCreateSchema, TestimonialUpdateSchema } from "../types.js";
import { testimonialsTable } from "../db/schema.js";
import { db } from "../db/index.js";
import z from "zod";
import { eq } from "drizzle-orm";

// ============================================================================
// TESTIMONIALS ROUTES
// ============================================================================

export const testimonials = new Hono();

// ============================================================================
// CREATE TESTIMONIAL
// ============================================================================

/**
 * POST endpoint to create a new testimonial.
 * Inserts the testimonial data into the database.
 */
testimonials.post("/", zValidator("json", TestimonialCreateSchema), async (c) => {
  const testimonialData = c.req.valid("json");

  try {
    const result = await db
      .insert(testimonialsTable)
      .values(testimonialData)
      .returning();

    return c.json(
      {
        message: "Testimonial created successfully",
        data: result[0],
      },
      201,
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return c.json({ error: "Failed to create testimonial" }, 500);
  }
})

// ============================================================================
// UPDATE TESTIMONIAL
// ============================================================================

/**
 * PATCH endpoint to update an existing testimonial.
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
  zValidator("json", TestimonialUpdateSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const testimonialData = c.req.valid("json");

    // Check if at least one field is provided for update
    if (Object.keys(testimonialData).length === 0) {
      return c.json(
        { error: "At least one field is required for update" },
        400,
      );
    }

    try {
      const result = await db
        .update(testimonialsTable)
        .set(testimonialData)
        .where(eq(testimonialsTable.id, id))
        .returning();

      if (result.length === 0) {
        return c.json({ error: "Testimonial not found" }, 404);
      }

      return c.json({
        message: "Testimonial updated successfully",
        data: result[0],
      });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      return c.json({ error: "Failed to update testimonial" }, 500);
    }
  },
)

// ============================================================================
// DELETE TESTIMONIAL
// ============================================================================

/**
 * DELETE endpoint to remove a testimonial from the database.
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
        .delete(testimonialsTable)
        .where(eq(testimonialsTable.id, id))
        .returning();

      if (result.length === 0) {
        return c.json({ error: "Testimonial not found" }, 404);
      }

      return c.json({
        message: "Testimonial deleted successfully",
        data: result[0],
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      return c.json({ error: "Failed to delete testimonial" }, 500);
    }
  },
)

// ============================================================================
// GET ALL TESTIMONIALS
// ============================================================================

/**
 * GET endpoint to retrieve all testimonials from the database.
 */
.get("/", async (c) => {
  try {
    const testimonials = await db.select().from(testimonialsTable);
    return c.json({ data: testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return c.json({ error: "Failed to fetch testimonials" }, 500);
  }
})

// ============================================================================
// GET TESTIMONIAL BY ID
// ============================================================================

/**
 * GET endpoint to retrieve a specific testimonial by its ID.
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
      const testimonial = await db
        .select()
        .from(testimonialsTable)
        .where(eq(testimonialsTable.id, id));

      if (testimonial.length === 0) {
        return c.json({ error: "Testimonial not found" }, 404);
      }

      return c.json({ data: testimonial[0] });
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      return c.json({ error: "Failed to fetch testimonial" }, 500);
    }
  },
);
