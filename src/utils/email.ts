// src/utils/email.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ quiet: true });

// Define the SMTP configuration type
interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create a transporter object using the default SMTP transport
const createTransporter = () => {
  const config: SMTPConfig = {
    host: process.env.SMTP_HOST || "",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };

  // For testing purposes, you might want to override the recipient
  // This can be useful to ensure emails are sent to a test address
  if (process.env.EMAIL_TO_OVERRIDE) {
    // We'll handle this in the sendEmail function
  }

  return nodemailer.createTransport(config);
};

// Define the email options type
export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Sends an email using the configured transporter.
 * @param options - The email options including sender, recipient, subject, and content.
 * @returns A promise that resolves when the email is sent.
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();

  await transporter.sendMail(options);
};
