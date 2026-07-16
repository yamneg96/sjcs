import mongoose from "mongoose";
import Appeal, { IAppeal } from "./appeal.model";
import Mark, { IMark } from "./mark.model";
import { MarkService } from "./mark.service";
import { TenantRepository } from "../../infrastructure/database/tenant-repository";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/errors";
import { UserRole, IJWTPayload } from "../../shared/types/auth.types";
import { eventBus } from "../../shared/events/event-bus";
import {
  CreateAppealInput,
  ProposeAppealChangeInput,
  ResolveAppealInput,
} from "./results.validation";

const appeals = new TenantRepository<IAppeal>(Appeal);
const marks = new TenantRepository<IMark>(Mark);

const oid = (id: string) => new mongoose.Types.ObjectId(id) as unknown as mongoose.Types.ObjectId;

export class AppealService {
  /** Parent/student opens an appeal on a mark (one open appeal per mark). */
  static async create(requester: IJWTPayload, data: CreateAppealInput): Promise<IAppeal> {
    const mark = await marks.findById(data.markId);
    if (!mark) throw new NotFoundError("Mark not found");

    // Only the student or a guardian may appeal (checked against the mark's student).
    // (Guardian verification happens on the student record via the results read;
    // here we bind the appeal to the mark's student.)
    if (requester.role !== UserRole.STUDENT && requester.role !== UserRole.PARENT) {
      throw new ForbiddenError("Only students or parents can file an appeal");
    }
    if (requester.role === UserRole.STUDENT && mark.studentId.toString() !== requester.id) {
      throw new ForbiddenError("You can only appeal your own marks");
    }

    const openExisting = await appeals.findOne({ markId: mark._id, status: "OPEN" });
    if (openExisting) throw new ConflictError("An open appeal already exists for this mark");

    return appeals.create({
      markId: mark._id,
      studentId: mark.studentId,
      requesterId: oid(requester.id),
      reason: data.reason,
      thread: [{ authorId: oid(requester.id), body: data.reason, at: new Date() }],
      status: "OPEN",
      createdBy: requester.id as unknown as IAppeal["createdBy"],
    });
  }

  static list(filters: { status?: string }): Promise<IAppeal[]> {
    const filter: mongoose.FilterQuery<IAppeal> = {};
    if (filters.status) filter.status = filters.status;
    return appeals.find(filter, { sort: { createdAt: -1 }, lean: true });
  }

  /** Teacher proposes a correction (pending director countersign). */
  static async propose(
    appealId: string,
    teacherId: string,
    data: ProposeAppealChangeInput
  ): Promise<IAppeal> {
    const appeal = await appeals.findById(appealId);
    if (!appeal) throw new NotFoundError("Appeal not found");
    if (appeal.status !== "OPEN") throw new BadRequestError("Appeal is not open");

    appeal.proposedItems = data.proposedItems;
    appeal.proposedBy = oid(teacherId);
    if (data.message) {
      appeal.thread.push({ authorId: oid(teacherId), body: data.message, at: new Date() });
    }
    await appeal.save();
    return appeal;
  }

  /**
   * Director resolves the appeal. UPHELD applies the teacher's proposed change
   * with a MarkAudit (two-person rule: proposer ≠ countersigner). EXPLAINED
   * closes it with no change. Directors cannot self-approve their own proposal.
   */
  static async resolve(
    appealId: string,
    director: IJWTPayload,
    data: ResolveAppealInput
  ): Promise<IAppeal> {
    const appeal = await appeals.findById(appealId);
    if (!appeal) throw new NotFoundError("Appeal not found");
    if (appeal.status !== "OPEN") throw new BadRequestError("Appeal is not open");

    if (data.outcome === "UPHELD") {
      if (!appeal.proposedItems || !appeal.proposedBy) {
        throw new BadRequestError("No proposed change to uphold — a teacher must propose one first");
      }
      // Two-person rule: the countersigning director must differ from the proposer.
      if (appeal.proposedBy.toString() === director.id) {
        throw new ForbiddenError("The proposer cannot countersign their own mark change");
      }

      await MarkService.applyMarkChange(
        appeal.markId.toString(),
        appeal.proposedItems,
        appeal.proposedBy.toString(),
        director.id,
        `Appeal ${appeal._id}: ${data.reason}`
      );
      appeal.status = "UPHELD";
    } else {
      appeal.status = "EXPLAINED";
    }

    appeal.resolvedBy = oid(director.id);
    appeal.resolvedAt = new Date();
    appeal.thread.push({ authorId: oid(director.id), body: data.reason, at: new Date() });
    await appeal.save();

    eventBus.emit("appeal.resolved", {
      tenantId: appeal.tenantId,
      appealId: appeal._id,
      markId: appeal.markId,
      outcome: appeal.status,
    });

    return appeal;
  }
}
