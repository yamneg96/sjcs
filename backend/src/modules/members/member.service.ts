import User, { IUser } from "../users/user.model";
import { UserRole } from "../../shared/types/auth.types";
import { NotFoundError, BadRequestError, ConflictError } from "../../shared/errors/errors";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { eventBus } from "../../shared/events/event-bus";

export class MemberService {
  /**
   * Manually create a student in an organization
   */
  static async createStudent(tenantId: string, data: { fullName: string; studentId: string; grade: number }): Promise<IUser> {
    // Check if studentId already exists in this organization
    const existing = await User.findOne({ tenantId, studentId: data.studentId });
    if (existing) {
      throw new ConflictError(`Student with ID ${data.studentId} already exists in this organization`);
    }

    const student = await User.create({
      tenantId,
      organizationId: tenantId as any, // In our setup organizationId holds the ObjectId ref
      fullName: data.fullName,
      studentId: data.studentId,
      grade: data.grade,
      role: UserRole.STUDENT,
      status: "Pending", // Awaiting setup-password
      isVerified: false,
    });

    eventBus.emit("member.student_created", { studentId: student._id, tenantId });
    return student;
  }

  /**
   * Import students from array (CSV Upload fallback)
   */
  static async importStudents(
    tenantId: string,
    studentsList: Array<{ fullName: string; studentId: string; grade: number }>
  ): Promise<{ importedCount: number; errors: string[] }> {
    let importedCount = 0;
    const errors: string[] = [];

    for (const item of studentsList) {
      try {
        if (!item.fullName || !item.studentId || !item.grade) {
          errors.push(`Skipped row: Missing columns for studentId ${item.studentId || "unknown"}`);
          continue;
        }

        const existing = await User.findOne({ tenantId, studentId: item.studentId });
        if (existing) {
          errors.push(`Skipped: Student ID ${item.studentId} already exists`);
          continue;
        }

        await User.create({
          tenantId,
          organizationId: tenantId as any,
          fullName: item.fullName,
          studentId: item.studentId,
          grade: item.grade,
          role: UserRole.STUDENT,
          status: "Pending",
          isVerified: false,
        });

        importedCount++;
      } catch (err: any) {
        errors.push(`Error importing ${item.fullName || "unknown"}: ${err.message}`);
      }
    }

    eventBus.emit("member.students_imported", { tenantId, count: importedCount });
    return { importedCount, errors };
  }

  /**
   * Create a teacher in an organization
   */
  static async createTeacher(tenantId: string, data: { fullName: string; email: string; grades: number[] }): Promise<IUser> {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new ConflictError("Email already registered on the platform");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const teacher = await User.create({
      tenantId,
      organizationId: tenantId as any,
      fullName: data.fullName,
      email: data.email,
      grades: data.grades,
      role: UserRole.TEACHER,
      status: "Pending", // Pending email verification & password setup
      isVerified: false,
      verificationToken,
    });

    eventBus.emit("member.teacher_created", {
      teacherId: teacher._id,
      email: teacher.email,
      name: teacher.fullName,
      token: verificationToken,
    });

    return teacher;
  }

  /**
   * Suspend a member's account access
   */
  static async suspendMember(tenantId: string, memberId: string): Promise<IUser> {
    const member = await User.findOne({ _id: memberId, tenantId });
    if (!member) {
      throw new NotFoundError("Member not found in this organization");
    }

    if (member.role === UserRole.ORG_OWNER) {
      throw new BadRequestError("Cannot suspend organization owner");
    }

    member.status = "Suspended";
    await member.save();

    eventBus.emit("member.suspended", { memberId, tenantId });
    return member;
  }

  /**
   * Activate / Unsuspend a member
   */
  static async activateMember(tenantId: string, memberId: string): Promise<IUser> {
    const member = await User.findOne({ _id: memberId, tenantId });
    if (!member) {
      throw new NotFoundError("Member not found in this organization");
    }

    member.status = "Active";
    await member.save();

    eventBus.emit("member.activated", { memberId, tenantId });
    return member;
  }

  /**
   * Reset student password directly (Admin override)
   */
  static async resetStudentPassword(tenantId: string, studentId: string, newPassword: string): Promise<void> {
    const student = await User.findOne({ _id: studentId, tenantId, role: UserRole.STUDENT });
    if (!student) {
      throw new NotFoundError("Student not found in this organization");
    }

    const hash = await bcrypt.hash(newPassword, 10);
    student.passwordHash = hash;
    student.status = "Active"; // Ensure they can login immediately
    await student.save();

    eventBus.emit("member.password_reset_by_admin", { studentId, tenantId });
  }

  /**
   * List members by role with pagination
   */
  static async listMembers(
    tenantId: string,
    role: UserRole,
    page = 1,
    limit = 10,
    search = ""
  ): Promise<{ results: IUser[]; total: number }> {
    const query: any = { tenantId, role };

    if (search) {
      query.fullName = { $regex: search, $options: "i" };
    }

    const [results, total] = await Promise.all([
      User.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ fullName: 1 })
        .lean(),
      User.countDocuments(query),
    ]);

    return { results: results as any, total };
  }
}
