import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { EmailSendSchema } from "../types.js";
import { sendEmail } from "../utils/email.js";
import { generateEmailTemplate } from "../utils/emailTemplate.js";
import { getEnvConfig } from "../config/env.js";

// ============================================================================
// EMAIL ROUTES
// ============================================================================

export const email = new Hono();

// ============================================================================
// SEND EMAIL
// ============================================================================

/**
 * POST endpoint to send an email.
 * Validates the request body against the EmailSendSchema.
 */
email.post("/", zValidator("json", EmailSendSchema), async (c) => {
  const emailData = c.req.valid("json");
  const config = getEnvConfig();

  try {
    // Create subject line
    const subject = `New Contact Form Message from ${emailData.firstname} ${emailData.lastname}`;
    
    // Generate HTML template for the email
    const htmlContent = generateEmailTemplate(
      `${emailData.firstname} ${emailData.lastname} <${emailData.email}>`,
      subject,
      emailData.message
    );

    await sendEmail({
      from: emailData.email,
      to: config.EMAIL_TO, // Fixed recipient
      subject: subject,
      text: emailData.message,
      html: htmlContent,
    });

    return c.json(
      {
        message: "Email sent successfully",
      },
      200,
    );
  } catch (error) {
    console.error("Error sending email:", error);
    // Check if it's a specific nodemailer error or a general one
    if (error instanceof Error) {
      return c.json({ error: `Failed to send email: ${error.message}` }, 500);
    }
    return c.json({ error: "Failed to send email" }, 500);
  }
});
