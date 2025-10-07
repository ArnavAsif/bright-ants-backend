import z from "zod";

// ============================================================================
// CAROUSEL IMAGES TYPES
// ============================================================================

/**
 * Zod schema for validating carousel image objects.
 * Ensures that carousel images have the required fields with proper types.
 */
export const CarouselImageSchema = z
  .object({
    /** Unique identifier for the carousel image */
    id: z.coerce.number().min(1),
    /** Filename of the image stored on the server */
    filename: z.string().min(1),
    /** Row number in the carousel layout */
    row: z.coerce.number().min(1),
  })
  .strict();

/** Type definition for a carousel image based on the schema */
export type CarouselImage = z.infer<typeof CarouselImageSchema>;

/**
 * Zod schema for creating new carousel images.
 * Omit the ID since it's auto-generated.
 */
export const CarouselImageCreateSchema = CarouselImageSchema.omit({
  id: true,
});

/** Type definition for creating a new carousel image */
export type CarouselImageCreate = z.infer<typeof CarouselImageCreateSchema>;

/**
 * Zod schema for updating existing carousel images.
 * All fields are optional except ID, which is omitted.
 */
export const CarouselImageUpdateSchema = CarouselImageSchema.partial().omit({
  id: true,
});

/** Type definition for updating a carousel image */
export type CarouselImageUpdate = z.infer<typeof CarouselImageUpdateSchema>;

/**
 * Zod schema for deleting carousel images.
 * Only requires the ID of the image to delete.
 */
export const CarouselImageDeleteSchema = CarouselImageSchema.pick({
  id: true,
});

/** Type definition for deleting a carousel image */
export type CarouselImageDelete = z.infer<typeof CarouselImageDeleteSchema>;

// ============================================================================
// TESTIMONIALS TYPES
// ============================================================================

/**
 * Zod schema for validating testimonial objects.
 * Ensures that testimonials have the required fields with proper types.
 */
export const TestimonialSchema = z
  .object({
    /** Unique identifier for the testimonial */
    id: z.coerce.number().min(1),
    /** Name of the person giving the testimonial */
    name: z.string().min(1),
    /** Designation of the person */
    designation: z.string().min(1),
    /** Company of the person */
    company: z.string().min(1),
    /** Filename of the person's image */
    image: z.string().min(1),
    /** Testimonial content */
    content: z.string().min(1),
  })
  .strict();

/** Type definition for a testimonial based on the schema */
export type Testimonial = z.infer<typeof TestimonialSchema>;

/**
 * Zod schema for creating new testimonials.
 * Omit the ID since it's auto-generated.
 */
export const TestimonialCreateSchema = TestimonialSchema.omit({
  id: true,
});

/** Type definition for creating a new testimonial */
export type TestimonialCreate = z.infer<typeof TestimonialCreateSchema>;

/**
 * Zod schema for updating existing testimonials.
 * All fields are optional except ID, which is omitted.
 */
export const TestimonialUpdateSchema = TestimonialSchema.partial().omit({
  id: true,
});

/** Type definition for updating a testimonial */
export type TestimonialUpdate = z.infer<typeof TestimonialUpdateSchema>;

/**
 * Zod schema for deleting testimonials.
 * Only requires the ID of the testimonial to delete.
 */
export const TestimonialDeleteSchema = TestimonialSchema.pick({
  id: true,
});

/** Type definition for deleting a testimonial */
export type TestimonialDelete = z.infer<typeof TestimonialDeleteSchema>;

// ============================================================================
// PROMOTIONAL OFFERS TYPES
// ============================================================================

/**
 * Zod schema for validating promotional offer objects.
 * Ensures that promotional offers have the required fields with proper types.
 */
export const PromotionalOfferSchema = z
  .object({
    /** Unique identifier for the promotional offer */
    id: z.coerce.number().min(1),
    /** Title of the promotional offer */
    title: z.string().min(1),
    /** Description of the promotional offer */
    description: z.string().min(1),
    /** Array of image filenames associated with the offer */
    images: z.array(z.string()).min(1),
    /** Optional link to more information about the offer */
    link: z.string().optional(),
  })
  .strict();

/** Type definition for a promotional offer based on the schema */
export type PromotionalOffer = z.infer<typeof PromotionalOfferSchema>;

/**
 * Zod schema for creating new promotional offers.
 * Omit the ID since it's auto-generated.
 */
export const PromotionalOfferCreateSchema = PromotionalOfferSchema.omit({
  id: true,
});

/** Type definition for creating a new promotional offer */
export type PromotionalOfferCreate = z.infer<
  typeof PromotionalOfferCreateSchema
>;

/**
 * Zod schema for updating existing promotional offers.
 * All fields are optional except ID, which is omitted.
 */
export const PromotionalOfferUpdateSchema =
  PromotionalOfferSchema.partial().omit({
    id: true,
  });

/** Type definition for updating a promotional offer */
export type PromotionalOfferUpdate = z.infer<
  typeof PromotionalOfferUpdateSchema
>;

/**
 * Zod schema for deleting promotional offers.
 * Only requires the ID of the offer to delete.
 */
export const PromotionalOfferDeleteSchema = PromotionalOfferSchema.pick({
  id: true,
});

/** Type definition for deleting a promotional offer */
export type PromotionalOfferDelete = z.infer<
  typeof PromotionalOfferDeleteSchema
>;

// ============================================================================
// ATTORNEYS TYPES
// ============================================================================

/**
 * Zod schema for validating attorney objects.
 * Ensures that attorneys have the required fields with proper types.
 */
export const AttorneySchema = z
  .object({
    /** Unique identifier for the attorney */
    id: z.coerce.number().min(1),
    /** Name of the attorney */
    name: z.string().min(1),
    /** Designation of the attorney (default: "Attorney") */
    designation: z.string().min(1).optional().default("Attorney"),
    /** Filename of the attorney's profile image */
    image: z.string().min(1),
  })
  .strict();

/** Type definition for an attorney based on the schema */
export type Attorney = z.infer<typeof AttorneySchema>;

/**
 * Zod schema for creating new attorneys.
 * Omit the ID since it's auto-generated.
 */
export const AttorneyCreateSchema = AttorneySchema.omit({
  id: true,
});

/** Type definition for creating a new attorney */
export type AttorneyCreate = z.infer<typeof AttorneyCreateSchema>;

/**
 * Zod schema for updating existing attorneys.
 * All fields are optional except ID, which is omitted.
 */
export const AttorneyUpdateSchema = AttorneySchema.partial().omit({
  id: true,
});

/** Type definition for updating an attorney */
export type AttorneyUpdate = z.infer<typeof AttorneyUpdateSchema>;

/**
 * Zod schema for deleting attorneys.
 * Only requires the ID of the attorney to delete.
 */
export const AttorneyDeleteSchema = AttorneySchema.pick({
  id: true,
});

/** Type definition for deleting an attorney */
export type AttorneyDelete = z.infer<typeof AttorneyDeleteSchema>;

// ============================================================================
// WORKS TYPES
// ============================================================================

/**
 * Zod schema for validating work objects.
 * Ensures that works have the required fields with proper types.
 */
export const WorkSchema = z
  .object({
    /** Unique identifier for the work */
    id: z.coerce.number().min(1),
    /** Title of the work */
    title: z.string().min(1),
    /** Filename of the work's image */
    image: z.string().min(1),
  })
  .strict();

/** Type definition for a work based on the schema */
export type Work = z.infer<typeof WorkSchema>;

/**
 * Zod schema for creating new works.
 * Omit the ID since it's auto-generated.
 */
export const WorkCreateSchema = WorkSchema.omit({
  id: true,
});

/** Type definition for creating a new work */
export type WorkCreate = z.infer<typeof WorkCreateSchema>;

/**
 * Zod schema for updating existing works.
 * All fields are optional except ID, which is omitted.
 */
export const WorkUpdateSchema = WorkSchema.partial().omit({
  id: true,
});

/** Type definition for updating a work */
export type WorkUpdate = z.infer<typeof WorkUpdateSchema>;

/**
 * Zod schema for deleting works.
 * Only requires the ID of the work to delete.
 */
export const WorkDeleteSchema = WorkSchema.pick({
  id: true,
});

/** Type definition for deleting a work */
export type WorkDelete = z.infer<typeof WorkDeleteSchema>;

// ============================================================================
// OFFERS TYPES
// ============================================================================

/**
 * Zod schema for validating offer objects.
 * Ensures that offers have the required fields with proper types.
 */
export const OfferSchema = z
  .object({
    /** Unique identifier for the offer */
    id: z.coerce.number().min(1),
    /** Title of the offer */
    title: z.string().min(1),
    /** Description of the offer */
    description: z.string().min(1),
    /** Price of the offer */
    price: z.coerce.number().min(0),
  })
  .strict();

/** Type definition for an offer based on the schema */
export type Offer = z.infer<typeof OfferSchema>;

/**
 * Zod schema for creating new offers.
 * Omit the ID since it's auto-generated.
 */
export const OfferCreateSchema = OfferSchema.omit({
  id: true,
});

/** Type definition for creating a new offer */
export type OfferCreate = z.infer<typeof OfferCreateSchema>;

/**
 * Zod schema for updating existing offers.
 * All fields are optional except ID, which is omitted.
 */
export const OfferUpdateSchema = OfferSchema.partial().omit({
  id: true,
});

/** Type definition for updating an offer */
export type OfferUpdate = z.infer<typeof OfferUpdateSchema>;

/**
 * Zod schema for deleting offers.
 * Only requires the ID of the offer to delete.
 */
export const OfferDeleteSchema = OfferSchema.pick({
  id: true,
});

/** Type definition for deleting an offer */
export type OfferDelete = z.infer<typeof OfferDeleteSchema>;

// ============================================================================
// EMAIL TYPES
// ============================================================================

/**
 * Zod schema for validating email objects.
 * Ensures that emails have the required fields with proper types.
 */
export const EmailSchema = z
  .object({
    /** Sender's first name */
    firstname: z.string().min(1),
    /** Sender's last name */
    lastname: z.string().min(1),
    /** Sender's email address */
    email: z.email(),
    /** Message content */
    message: z.string().min(1),
  })
  .strict();

/** Type definition for an email based on the schema */
export type Email = z.infer<typeof EmailSchema>;

/**
 * Zod schema for sending emails.
 * This is the same as EmailSchema, but we define it separately for clarity.
 */
export const EmailSendSchema = EmailSchema;

/** Type definition for sending an email */
export type EmailSend = z.infer<typeof EmailSendSchema>;

// ============================================================================
// BLOGS TYPES
// ============================================================================

/**
 * Zod schema for validating blog objects.
 * Ensures that blogs have the required fields with proper types.
 */
export const BlogSchema = z
  .object({
    /** Unique identifier for the blog */
    id: z.coerce.number().min(1),
    /** Title of the blog */
    title: z.string().min(1),
    /** Author of the blog */
    author: z.string().min(1),
    /** Content of the blog */
    content: z.string().min(1),
    /** Image of the blog */
    image: z.string().min(1),
    /** Timestamp when the blog was created */
    created_at: z.string().datetime(),
    /** Timestamp when the blog was last updated */
    updated_at: z.string().datetime(),
  })
  .strict();

/** Type definition for a blog based on the schema */
export type Blog = z.infer<typeof BlogSchema>;

/**
 * Zod schema for creating new blogs.
 * Omit the ID and timestamps since they're auto-generated.
 */
export const BlogCreateSchema = BlogSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/** Type definition for creating a new blog */
export type BlogCreate = z.infer<typeof BlogCreateSchema>;

/**
 * Zod schema for updating existing blogs.
 * All fields are optional except ID and timestamps, which are omitted.
 */
export const BlogUpdateSchema = BlogSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/** Type definition for updating a blog */
export type BlogUpdate = z.infer<typeof BlogUpdateSchema>;

/**
 * Zod schema for deleting blogs.
 * Only requires the ID of the blog to delete.
 */
export const BlogDeleteSchema = BlogSchema.pick({
  id: true,
});

/** Type definition for deleting a blog */
export type BlogDelete = z.infer<typeof BlogDeleteSchema>;
