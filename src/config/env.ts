// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config({ quiet: true });

/**
 * Zod schema for environment variable validation
 */
const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const num = parseInt(val, 10);
        return isNaN(num) ? val : num;
      }
      return val;
    },
    z.number().int().positive().min(1).max(65535)
  ),
  SMTP_SECURE: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true"),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_TO: z.string().email(),
  EMAIL_TO_OVERRIDE: z.string().email().optional(),
});

/**
 * Type definition for validated environment variables
 */
export type EnvConfig = z.infer<typeof EnvSchema>;

/**
 * Validates environment variables and returns typed configuration
 * @throws Error if validation fails
 */
export const validateEnvVars = (): EnvConfig => {
  try {
    const config = EnvSchema.parse(process.env);
    
    // Set EMAIL_FROM to SMTP_USER if not provided
    if (!config.EMAIL_FROM) {
      config.EMAIL_FROM = config.SMTP_USER;
    }
    
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join("."));
      throw new Error(
        `Missing or invalid environment variables: ${missingVars.join(", ")}
` +
        `Details: ${error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`
      );
    }
    throw error;
  }
};

// Export the validated environment configuration
let envConfig: EnvConfig | null = null;

export const getEnvConfig = (): EnvConfig => {
  if (!envConfig) {
    envConfig = validateEnvVars();
  }
  return envConfig;
};