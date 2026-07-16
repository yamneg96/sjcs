import mongoose from "mongoose";
import Publishing, { IPublishing, PublishingStatus } from "./publishing.model";
import { TenantRepository } from "../../infrastructure/database/tenant-repository";
import { BadRequestError, NotFoundError } from "../../shared/errors/errors";
import { eventBus } from "../../shared/events/event-bus";
import { CreatePublishingInput } from "./results.validation";

const publishings = new TenantRepository<IPublishing>(Publishing);

const oid = (id: string) => new mongoose.Types.ObjectId(id) as unknown as mongoose.Types.ObjectId;

// Allowed publishing state transitions (§33).
const TRANSITIONS: Record<PublishingStatus, PublishingStatus[]> = {
  DRAFT: ["APPROVED"],
  APPROVED: ["SCHEDULED"],
  SCHEDULED: ["PUBLISHED", "APPROVED"], // can pull back to APPROVED to reschedule
  PUBLISHED: ["ARCHIVED"],
  ARCHIVED: [],
};

function assertTransition(from: PublishingStatus, to: PublishingStatus) {
  if (!TRANSITIONS[from].includes(to)) {
    throw new BadRequestError(`Invalid publishing transition: ${from} → ${to}`);
  }
}

export class PublishingService {
  static async create(createdBy: string, data: CreatePublishingInput): Promise<IPublishing> {
    return publishings.create({
      academicYearId: oid(data.academicYearId),
      term: data.term,
      grades: data.grades,
      status: "DRAFT",
      statusHistory: [{ status: "DRAFT", at: new Date(), actorId: oid(createdBy) }],
      createdBy: createdBy as unknown as IPublishing["createdBy"],
    });
  }

  static list(): Promise<IPublishing[]> {
    return publishings.find({}, { sort: { createdAt: -1 }, lean: true });
  }

  static async get(id: string): Promise<IPublishing> {
    const publishing = await publishings.findById(id);
    if (!publishing) throw new NotFoundError("Publishing not found");
    return publishing;
  }

  private static async advance(
    id: string,
    to: PublishingStatus,
    actorId: string,
    patch: Partial<IPublishing> = {}
  ): Promise<IPublishing> {
    const publishing = await publishings.findById(id);
    if (!publishing) throw new NotFoundError("Publishing not found");
    assertTransition(publishing.status, to);

    publishing.status = to;
    publishing.statusHistory.push({ status: to, at: new Date(), actorId: oid(actorId) });
    Object.assign(publishing, patch);
    await publishing.save();
    return publishing;
  }

  /** Director approves the publishing (after reviewing the marks). */
  static approve(id: string, directorId: string): Promise<IPublishing> {
    return this.advance(id, "APPROVED", directorId, { approvedBy: oid(directorId) });
  }

  /** Director schedules the release; the sweep publishes it at releaseAt. */
  static async schedule(id: string, directorId: string, releaseAt: Date): Promise<IPublishing> {
    return this.advance(id, "SCHEDULED", directorId, {
      scheduledBy: oid(directorId),
      releaseAt,
    });
  }

  static archive(id: string, actorId: string): Promise<IPublishing> {
    return this.advance(id, "ARCHIVED", actorId);
  }

  /**
   * Scheduler sweep (§33, §50) — flips every due SCHEDULED publishing to
   * PUBLISHED atomically. Cross-tenant by design (runs outside a request), so
   * it uses the raw model, not the tenant-scoped repository. Idempotent: the
   * `status: SCHEDULED` guard means a second sweep won't double-publish.
   */
  static async runReleaseSweep(now: Date = new Date()): Promise<number> {
    const due = await Publishing.find({
      status: "SCHEDULED",
      releaseAt: { $lte: now },
    });

    let published = 0;
    for (const p of due) {
      // Atomic guarded flip — only succeeds if still SCHEDULED.
      const res = await Publishing.updateOne(
        { _id: p._id, status: "SCHEDULED" },
        {
          $set: { status: "PUBLISHED", publishedAt: now },
          $push: { statusHistory: { status: "PUBLISHED", at: now } },
        }
      );
      if (res.modifiedCount > 0) {
        published++;
        eventBus.emit("results.published", {
          tenantId: p.tenantId,
          publishingId: p._id,
          academicYearId: p.academicYearId,
          term: p.term,
          grades: p.grades,
        });
      }
    }
    return published;
  }
}
