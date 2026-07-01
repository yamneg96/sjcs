import nodemailer from "nodemailer";
import { env } from "../../config/env";

export class NotificationService {
  // Primary (Brevo SMTP Relay)
  private static primaryTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST || "smtp-relay.brevo.com",
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER || "",
      pass: env.SMTP_PASS || "",
    },
    connectionTimeout: 5000, // Timeout after 5 seconds to trigger fallback quickly
  });

  // Secondary/Fallback (Local/Dev SMTP config)
  private static fallbackTransporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025, // Maildev/Mailpit default dev port
    secure: false,
    auth: {
      user: "dev_user",
      pass: "dev_pass",
    },
  });

  /**
   * Dispatches an email notification.
   * Attempts primary SMTP (Brevo Relay) first, then falls back to local dev SMTP.
   */
  static async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const fromAddress = env.SMTP_FROM || "no-reply@lumora.edu";

    if (env.NODE_ENV === "test") {
      console.log(`[TEST EMAIL] To: ${to}, Subject: ${subject}`);
      return true;
    }

    // Try Primary SMTP (Brevo relay)
    try {
      if (!env.SMTP_USER || !env.SMTP_PASS) {
        throw new Error("Brevo SMTP credentials not configured. Skipping primary transporter.");
      }

      await this.primaryTransporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html,
      });
      console.log(`[NotificationService] Email sent successfully via Brevo SMTP to ${to}`);
      return true;
    } catch (primaryError: any) {
      console.warn(
        `⚠️ [NotificationService] Brevo SMTP failed: ${primaryError.message}. Switching to fallback...`
      );

      // Try Fallback Transporter (Nodemailer Dev/Local config)
      try {
        await this.fallbackTransporter.sendMail({
          from: fromAddress,
          to,
          subject,
          html,
        });
        console.log(`[NotificationService] Email sent successfully via Fallback SMTP to ${to}`);
        return true;
      } catch (fallbackError: any) {
        console.error(
          `🔴 [NotificationService] Fallback SMTP failed too: ${fallbackError.message}`
        );
        return false;
      }
    }
  }

  /**
   * Dispatches an SMS notification (stubbed provider).
   */
  static async sendSMS(to: string, message: string): Promise<boolean> {
    console.log(`[SMS SEND] To: ${to}, Content: ${message}`);
    return true;
  }
}
