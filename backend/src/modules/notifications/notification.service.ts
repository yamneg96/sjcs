import nodemailer from "nodemailer";
import { env } from "../../config/env";

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || "localhost",
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER || "dev_user",
      pass: env.SMTP_PASS || "dev_pass",
    },
  });

  /**
   * Dispatches an email notification.
   */
  static async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      if (env.NODE_ENV === "test") {
        console.log(`[TEST EMAIL] To: ${to}, Subject: ${subject}`);
        return true;
      }

      await this.transporter.sendMail({
        from: env.SMTP_FROM || "no-reply@lumora.edu",
        to,
        subject,
        html,
      });

      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
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
