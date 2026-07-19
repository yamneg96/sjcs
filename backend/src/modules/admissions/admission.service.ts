import mongoose from "mongoose";
import crypto from "crypto";
import Admission, { AdmissionStatus, IAdmission } from "./admission.model";
import User, { IUser } from "../users/user.model";
import Section from "../sections/section.model";
import { NotificationService } from "../notifications/notification.service";
import { SubmitApplicationDTO, UpdateStatusDTO, EnrollDTO } from "./admission.validation";
import { NotFoundError, BadRequestError, ConflictError } from "../../shared/errors/errors";
import { UserRole } from "../../shared/types/auth.types";
import { eventBus } from "../../shared/events/event-bus";

// Valid state transitions for the admission workflow
const VALID_TRANSITIONS: Record<AdmissionStatus, AdmissionStatus[]> = {
  INQUIRY: ["PENDING_REVIEW"],
  PENDING_REVIEW: ["INTERVIEW_SCHEDULED", "APPROVED", "REJECTED", "WAITLISTED"],
  INTERVIEW_SCHEDULED: ["APPROVED", "REJECTED", "WAITLISTED"],
  WAITLISTED: ["INTERVIEW_SCHEDULED", "APPROVED", "REJECTED"],
  APPROVED: [],   // Terminal state
  REJECTED: [],   // Terminal state
};

export class AdmissionService {
  /**
   * Creates a new admission application within a tenant.
   */
  static async submitApplication(
    tenantId: string,
    data: SubmitApplicationDTO
  ): Promise<IAdmission> {
    const admission = await Admission.create({
      tenantId,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      studentFirstName: data.studentFirstName,
      studentLastName: data.studentLastName,
      studentDOB: new Date(data.studentDOB),
      studentGender: data.studentGender,
      gradeAppliedFor: data.gradeAppliedFor,
      previousSchool: data.previousSchool,
      transferReason: data.transferReason,
      status: "PENDING_REVIEW",
    });

    // Send confirmation email to parent
    await NotificationService.sendEmail(
      data.parentEmail,
      "Application Received — Lumora Admissions",
      `<h2>Dear ${data.parentName},</h2>
       <p>Thank you for submitting an admission application for <strong>${data.studentFirstName} ${data.studentLastName}</strong>.</p>
       <p>Your application is now under review. We will notify you of any updates.</p>
       <p>Application Reference: <strong>${admission._id}</strong></p>
       <br/>
       <p>Best regards,<br/>The Admissions Team</p>`
    );

    return admission;
  }

  /**
   * PUBLIC application tracking (§29) — a parent checks their application
   * status with the reference + the email they applied with. Deliberately
   * minimal: returns only status/timeline info, never documents, reviewer
   * notes, or other applicants' data. Requires BOTH the reference and the
   * matching email so the reference alone can't be enumerated.
   */
  static async trackApplication(
    tenantId: string,
    reference: string,
    email: string
  ): Promise<{
    reference: string;
    studentName: string;
    gradeAppliedFor: number;
    status: AdmissionStatus;
    submittedAt: Date;
    interviewDate?: Date;
    interviewTime?: string;
    enrolled: boolean;
  }> {
    // Invalid reference format → same generic error as "not found" (no probing).
    if (!mongoose.Types.ObjectId.isValid(reference)) {
      throw new NotFoundError("No application found with those details");
    }

    const admission = await Admission.findOne({
      _id: reference,
      tenantId,
      parentEmail: email.trim().toLowerCase(),
    }).lean();

    if (!admission) {
      throw new NotFoundError("No application found with those details");
    }

    return {
      reference: admission._id.toString(),
      studentName: `${admission.studentFirstName} ${admission.studentLastName}`,
      gradeAppliedFor: admission.gradeAppliedFor,
      status: admission.status,
      submittedAt: admission.createdAt,
      interviewDate: admission.interviewDate,
      interviewTime: admission.interviewTime,
      enrolled: !!admission.enrolledStudentId,
    };
  }

  /**
   * Updates an admission status with state machine validation.
   * Triggers email notifications on status transitions.
   */
  static async updateStatus(
    tenantId: string,
    admissionId: string,
    reviewerId: string,
    data: UpdateStatusDTO
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ _id: admissionId, tenantId });
    if (!admission) throw new NotFoundError("Admission application not found");

    const currentStatus = admission.status;
    const newStatus = data.status;

    // Validate state transition
    const allowedNext = VALID_TRANSITIONS[currentStatus];
    if (!allowedNext.includes(newStatus)) {
      throw new BadRequestError(
        `Invalid status transition: ${currentStatus} → ${newStatus}. Allowed: ${allowedNext.join(", ") || "none (terminal state)"}`
      );
    }

    admission.status = newStatus;
    admission.reviewedBy = reviewerId as unknown as typeof admission.reviewedBy;

    if (data.interviewDate) admission.interviewDate = new Date(data.interviewDate);
    if (data.interviewTime) admission.interviewTime = data.interviewTime;
    if (data.interviewNotes) admission.interviewNotes = data.interviewNotes;
    if (data.reviewerNotes) admission.reviewerNotes = data.reviewerNotes;

    await admission.save();

    // Trigger notification email based on new status
    await this.sendStatusNotification(admission);

    return admission;
  }

  /**
   * Lists all admission applications within a tenant, with optional status filter.
   */
  static async listApplications(
    tenantId: string,
    filters: { status?: AdmissionStatus; page?: number; limit?: number }
  ) {
    const query: Record<string, unknown> = { tenantId };
    if (filters.status) query.status = filters.status;

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Admission.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("reviewedBy", "name email")
        .lean(),
      Admission.countDocuments(query),
    ]);

    return {
      applications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Retrieves a single admission by ID within a tenant.
   */
  static async getById(tenantId: string, admissionId: string): Promise<IAdmission> {
    const admission = await Admission.findOne({ _id: admissionId, tenantId })
      .populate("reviewedBy", "name email")
      .lean() as IAdmission | null;

    if (!admission) throw new NotFoundError("Admission application not found");
    return admission;
  }

  /**
   * Adds a document reference (R2 URL) to an existing admission application.
   */
  static async addDocument(
    tenantId: string,
    admissionId: string,
    doc: { fileName: string; fileUrl: string; fileType: string; mimeType: string }
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ _id: admissionId, tenantId });
    if (!admission) throw new NotFoundError("Admission application not found");

    admission.documents.push({
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      mimeType: doc.mimeType,
      uploadedAt: new Date(),
    });

    await admission.save();
    return admission;
  }

  /**
   * Enrollment (§9.1): converts an APPROVED applicant into a real student
   * record — assigns a section (with capacity check), issues an admission
   * number, and optionally creates/links a parent guardian account. The
   * student is created in "Pending" status and activates via the normal
   * verify-student → setup-password flow.
   */
  static async enroll(
    tenantId: string,
    admissionId: string,
    actorId: string,
    data: EnrollDTO
  ): Promise<{ admission: IAdmission; student: IUser; parentLinked: boolean }> {
    const admission = await Admission.findOne({ _id: admissionId, tenantId });
    if (!admission) throw new NotFoundError("Admission application not found");
    if (admission.status !== "APPROVED") {
      throw new BadRequestError("Only APPROVED applications can be enrolled");
    }
    if (admission.enrolledStudentId) {
      throw new ConflictError("This applicant has already been enrolled");
    }

    // Validate the section: same tenant, matching grade, and not over capacity.
    const section = await Section.findOne({ _id: data.sectionId, tenantId });
    if (!section) throw new BadRequestError("Section not found");
    if (section.grade !== admission.gradeAppliedFor) {
      throw new BadRequestError(
        `Section is grade ${section.grade} but the applicant applied for grade ${admission.gradeAppliedFor}`
      );
    }
    const currentCount = await User.countDocuments({
      tenantId,
      sectionId: section._id,
      role: UserRole.STUDENT,
    });
    if (currentCount >= section.capacity) {
      throw new ConflictError("Section is at full capacity");
    }

    const orgObjectId = new mongoose.Types.ObjectId(tenantId);
    const fullName = `${admission.studentFirstName} ${admission.studentLastName}`.trim();
    const rand = () => crypto.randomBytes(3).toString("hex").toUpperCase();
    const admissionNo = `ADM-${new Date().getFullYear()}-${rand()}`;
    const studentId = `S${admission.gradeAppliedFor}-${rand()}`;

    // Create the student record (Pending until the family activates the account).
    const student = await User.create({
      tenantId,
      organizationId: orgObjectId,
      fullName,
      studentId,
      admissionNo,
      grade: admission.gradeAppliedFor,
      sectionId: section._id,
      role: UserRole.STUDENT,
      status: "Pending",
      isVerified: false,
      createdBy: actorId,
    });

    // Mark enrolled immediately so a retry can't double-enroll.
    admission.enrolledStudentId = student._id;
    admission.enrolledAt = new Date();
    await admission.save();

    // Optionally create/link a parent guardian account (email is globally unique).
    let parentLinked = false;
    if (data.createParentAccount) {
      let parent = await User.findOne({ email: admission.parentEmail });
      if (parent && parent.role !== UserRole.PARENT) {
        // Email already belongs to a non-parent account — skip to avoid a clash.
        parent = null;
      } else if (!parent) {
        parent = await User.create({
          tenantId,
          organizationId: orgObjectId,
          fullName: admission.parentName,
          email: admission.parentEmail,
          role: UserRole.PARENT,
          status: "Pending",
          isVerified: false,
          createdBy: actorId,
        });
      }
      if (parent) {
        student.guardianIds = [parent._id];
        await student.save();
        parentLinked = true;
      }
    }

    eventBus.emit("admission.enrolled", {
      tenantId,
      admissionId: admission._id,
      studentId: student._id,
      sectionId: section._id,
    });

    await NotificationService.sendEmail(
      admission.parentEmail,
      "Enrollment Confirmed — Welcome!",
      `<h2>Dear ${admission.parentName},</h2>
       <p><strong>${fullName}</strong> has been enrolled.</p>
       <ul>
         <li><strong>Admission No:</strong> ${admissionNo}</li>
         <li><strong>Class:</strong> Grade ${section.grade}${section.name}</li>
       </ul>
       <p>Your child can now activate their student account in the Lumora app using their full name and grade.</p>
       <br/><p>Welcome to the family!<br/>The Admissions Team</p>`
    );

    return { admission, student, parentLinked };
  }

  /**
   * Sends a status-based email to the parent.
   */
  private static async sendStatusNotification(admission: IAdmission): Promise<void> {
    const studentName = `${admission.studentFirstName} ${admission.studentLastName}`;
    let subject = "";
    let body = "";

    switch (admission.status) {
      case "INTERVIEW_SCHEDULED":
        subject = "Interview Scheduled — Admissions Update";
        body = `<h2>Dear ${admission.parentName},</h2>
                <p>We are pleased to inform you that an interview has been scheduled for <strong>${studentName}</strong>.</p>
                <p><strong>Date:</strong> ${admission.interviewDate ? new Date(admission.interviewDate).toLocaleDateString() : "TBD"}</p>
                <p><strong>Time:</strong> ${admission.interviewTime || "TBD"}</p>
                ${admission.interviewNotes ? `<p><strong>Notes:</strong> ${admission.interviewNotes}</p>` : ""}
                <p>Please arrive 15 minutes early with original copies of all submitted documents.</p>
                <br/><p>Best regards,<br/>The Admissions Team</p>`;
        break;

      case "APPROVED":
        subject = "🎉 Application Approved — Welcome!";
        body = `<h2>Dear ${admission.parentName},</h2>
                <p>Congratulations! We are delighted to inform you that <strong>${studentName}</strong> has been accepted.</p>
                <p>You will receive enrollment instructions and next steps shortly.</p>
                <br/><p>Welcome to the family!<br/>The Admissions Team</p>`;
        break;

      case "REJECTED":
        subject = "Application Update — Admissions Decision";
        body = `<h2>Dear ${admission.parentName},</h2>
                <p>Thank you for your interest. After careful review, we regret to inform you that we are unable to offer admission to <strong>${studentName}</strong> at this time.</p>
                ${admission.reviewerNotes ? `<p><strong>Feedback:</strong> ${admission.reviewerNotes}</p>` : ""}
                <p>We encourage you to reapply in future admission cycles.</p>
                <br/><p>Best regards,<br/>The Admissions Team</p>`;
        break;

      case "WAITLISTED":
        subject = "Application Waitlisted — Admissions Update";
        body = `<h2>Dear ${admission.parentName},</h2>
                <p><strong>${studentName}</strong> has been placed on our waiting list. We will notify you as soon as a spot becomes available.</p>
                <br/><p>Best regards,<br/>The Admissions Team</p>`;
        break;

      default:
        return; // No notification for other states
    }

    await NotificationService.sendEmail(admission.parentEmail, subject, body);
  }
}
