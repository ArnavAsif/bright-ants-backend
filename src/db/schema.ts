import {
  integer,
  pgTable,
  varchar,
  smallserial,
  json,
  numeric,
} from "drizzle-orm/pg-core";

// ============================================================================
// CAROUSEL IMAGES TABLE
// ============================================================================

/**
 * Database table schema for carousel images.
 * Stores information about images used in the carousel component.
 */
export const carouselImagesTable = pgTable("carousel_images", {
  /** Unique identifier for the carousel image */
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  /** Filename of the image stored on the server */
  filename: varchar({ length: 255 }).notNull(),
  /** Row number in the carousel layout */
  row: integer().notNull(),
  /** Index position within the row */
  index: smallserial(),
});

// ============================================================================
// TESTIMONIALS TABLE
// ============================================================================

/**
 * Database table schema for testimonials.
 * Stores customer testimonials with associated information.
 */
export const testimonialsTable = pgTable("testimonials", {
  /** Unique identifier for the testimonial */
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  /** Name of the person giving the testimonial */
  name: varchar({ length: 255 }).notNull(),
  /** Designation of the person */
  designation: varchar({ length: 255 }).notNull(),
  /** Company of the person */
  company: varchar({ length: 255 }).notNull(),
  /** Filename of the person's image */
  image: varchar({ length: 255 }).notNull(),
  /** Testimonial content */
  content: varchar({ length: 255 }).notNull(),
});

// ============================================================================
// PROMOTIONAL OFFERS TABLE
// ============================================================================

/**
 * Database table schema for promotional offers.
 * Stores information about special offers and promotions.
 */
export const promotionalOffersTable = pgTable("promotional_offers", {
  /** Unique identifier for the promotional offer */
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  /** Title of the promotional offer */
  title: varchar({ length: 255 }).notNull(),
  /** Description of the promotional offer */
  description: varchar({ length: 255 }).notNull(),
  /** Array of image filenames associated with the offer */
  images: json("images").$type<string[]>().notNull(),
  /** Optional link to more information about the offer */
  link: varchar({ length: 255 }),
});

// ============================================================================
// ATTORNEYS TABLE
// ============================================================================

/**
 * Database table schema for attorneys.
 * Stores information about attorneys in the firm.
 */
export const attorneysTable = pgTable("attorneys", {
  /** Unique identifier for the attorney */
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  /** Name of the attorney */
  name: varchar({ length: 255 }).notNull(),
  /** Designation of the attorney (default: "Attorney") */
  designation: varchar({ length: 255 }).default("Attorney"),
  /** Filename of the attorney's profile image */
  image: varchar({ length: 255 }).notNull(),
});

// ============================================================================
// WORKS TABLE
// ============================================================================

/**
 * Database table schema for attorneys.
 * Stores information about attorneys in the firm.
 */
export const worksTable = pgTable("works", {
  /** Unique identifier for the attorney */
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  /** Title of the work */
  title: varchar({ length: 255 }).notNull(),
  /** Filename of the work's image */
  image: varchar({ length: 255 }).notNull(),
});

// ============================================================================
// OFFERS TABLE
// ============================================================================

/**
 * Database table schema for offers.
 * Stores information about service/product offers with pricing.
 */
export const offersTable = pgTable("offers", {
  /** Unique identifier for the offer */
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  /** Title of the offer */
  title: varchar({ length: 255 }).notNull(),
  /** Description of the offer */
  description: varchar({ length: 255 }).notNull(),
  /** Price of the offer */
  price: numeric({ precision: 10, scale: 2 }).notNull(),
});
