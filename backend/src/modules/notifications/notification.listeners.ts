import mongoose from "mongoose";
import { eventBus } from "../../shared/events/event-bus";
import { NotificationService, INotifyInput } from "./notification.service";
import User from "../users/user.model";
import { UserRole } from "../../shared/types/auth.types";
import { logger } from "../../shared/utils/logger";

/**
 * Domain-event → notification fan-out (§16.5, §33).
 *
 * Publishing a results scope must reach the affected students AND their
 * guardians ("notifications fan out" at releaseAt). This listener is the piece
 * that makes that true; the publishing scheduler only flips the status.
 *
 * Everything here is best-effort: a notification failure must never affect the
 * release itself.
 */

interface ResultsPublishedEvent {
  tenantId: string;
  publishingId: mongoose.Types.ObjectId;
  academicYearId: mongoose.Types.ObjectId;
  term: string;
  grades: number[];
}

interface AppealResolvedEvent {
  tenantId: string;
  appealId: mongoose.Types.ObjectId;
  markId: mongoose.Types.ObjectId;
  outcome: string;
}

async function onResultsPublished(event: ResultsPublishedEvent) {
  try {
    // Students in the published grades, plus whoever guards them.
    const students = await User.find({
      tenantId: event.tenantId,
      role: UserRole.STUDENT,
      grade: { $in: event.grades },
    })
      .select("_id fullName guardianIds")
      .lean();

    if (students.length === 0) return;

    const messages: INotifyInput[] = [];

    for (const student of students) {
      messages.push({
        userId: student._id,
        tenantId: event.tenantId,
        kind: "results_published",
        title: `${event.term} results are out`,
        body: "Your results have been published. Tap to see them.",
        link: "/(tabs)/exams",
        data: { publishingId: String(event.publishingId), term: event.term },
      });

      for (const guardianId of student.guardianIds ?? []) {
        messages.push({
          userId: guardianId,
          tenantId: event.tenantId,
          kind: "results_published",
          title: `${event.term} results are out`,
          body: `${student.fullName}'s results have been published.`,
          link: "/portal",
          data: { publishingId: String(event.publishingId), term: event.term },
        });
      }
    }

    const sent = await NotificationService.notifyMany(messages);
    logger.info("results.published fan-out complete", {
      term: event.term,
      students: students.length,
      notifications: sent,
    });
  } catch (err) {
    logger.error("results.published fan-out failed", { message: (err as Error).message });
  }
}

async function onAppealResolved(event: AppealResolvedEvent) {
  try {
    const Appeal = mongoose.model("Appeal");
    const appeal = await Appeal.findById(event.appealId).lean<{
      requesterId: mongoose.Types.ObjectId;
    } | null>();
    if (!appeal) return;

    await NotificationService.notify({
      userId: appeal.requesterId,
      tenantId: event.tenantId,
      kind: "appeal_update",
      title: "Your review request was answered",
      body:
        event.outcome === "UPHELD"
          ? "The mark was reviewed and updated."
          : "The teacher has responded to your request.",
      link: "/portal",
      data: { appealId: String(event.appealId) },
    });
  } catch (err) {
    logger.error("appeal.resolved notification failed", { message: (err as Error).message });
  }
}

/** Registered once at boot (server.ts). */
export function registerNotificationListeners(): void {
  eventBus.on("results.published", (e) => void onResultsPublished(e as ResultsPublishedEvent));
  eventBus.on("appeal.resolved", (e) => void onAppealResolved(e as AppealResolvedEvent));
  logger.info("Notification listeners registered");
}
