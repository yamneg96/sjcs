import nodemailer from "nodemailer";
import axios from "axios";
import mongoose from "mongoose";
import { env } from "../../config/env";
import Notification, { NotificationKind } from "./notification.model";
import Device from "../mobile/device.model";
import { logger } from "../../shared/utils/logger";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export interface INotifyInput {
  userId: string | mongoose.Types.ObjectId;
  tenantId?: string;
  kind: NotificationKind;
  title: string;
  body: string;
  link?: string;
  data?: Record<string, unknown>;
}

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
  /**
   * Records an in-app notification and pushes it to the user's devices.
   * Best-effort by design: a push failure must never break the flow that
   * triggered it (e.g. a results release), so this never throws.
   */
  static async notify(input: INotifyInput): Promise<void> {
    try {
      await Notification.create({
        userId: input.userId,
        tenantId: input.tenantId,
        kind: input.kind,
        title: input.title,
        body: input.body,
        link: input.link,
        data: input.data,
      });
      await this.sendPush(input);
    } catch (err) {
      logger.error("Failed to record/send notification", {
        userId: String(input.userId),
        kind: input.kind,
        message: (err as Error).message,
      });
    }
  }

  /** Fan-out helper: notify many users concurrently, tolerating failures. */
  static async notifyMany(inputs: INotifyInput[]): Promise<number> {
    const results = await Promise.allSettled(inputs.map((i) => this.notify(i)));
    return results.filter((r) => r.status === "fulfilled").length;
  }

  /**
   * Sends an Expo push to every registered device for the user. Devices
   * without a token (or with an invalid one) are skipped silently.
   */
  private static async sendPush(input: INotifyInput): Promise<void> {
    const devices = await Device.find({
      userId: input.userId,
      expoPushToken: { $exists: true, $ne: null },
    }).lean();

    const messages = devices
      .map((d) => d.expoPushToken)
      .filter((t): t is string => !!t && t.startsWith("ExponentPushToken"))
      .map((to) => ({
        to,
        title: input.title,
        body: input.body,
        data: { link: input.link, ...input.data },
        sound: "default" as const,
      }));

    if (messages.length === 0) return;

    try {
      // Expo accepts up to 100 messages per request.
      for (let i = 0; i < messages.length; i += 100) {
        await axios.post(EXPO_PUSH_URL, messages.slice(i, i + 100), {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });
      }
      logger.info("Push notifications sent", { count: messages.length, kind: input.kind });
    } catch (err) {
      logger.warn("Expo push delivery failed", { message: (err as Error).message });
    }
  }

  static async sendSMS(to: string, message: string): Promise<boolean> {
    console.log(`[SMS SEND] To: ${to}, Content: ${message}`);
    return true;
  }
}
