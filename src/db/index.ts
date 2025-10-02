import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

/**
 * Create a connection pool to the PostgreSQL database using the connection
 * string from the environment variables.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ============================================================================
// DRIZZLE ORM INSTANCE
// ============================================================================

/**
 * Initialize Drizzle ORM with the PostgreSQL connection pool.
 * This instance is used throughout the application to interact with the database.
 */
export const db = drizzle(pool);
