import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User, { IUser } from "../users/user.model";
import Organization, { IOrganization } from "../organizations/organization.model";
import { env } from "../../config/env";
import { UserRole, IJWTPayload } from "../../shared/types/auth.types";
import { generateSlug } from "../../shared/utils/slug";
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from "../../shared/errors/errors";
import { eventBus } from "../../shared/events/event-bus";
import { studentGradeAccessMap } from "../../shared/utils/grade-access-mapping";

export interface IRegisterIndividualDTO {
  fullName: string;
  email: string;
  password?: string;
  grade?: number;
}

export interface IRegisterOrgDTO {
  orgName: string;
  orgSlug?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword?: string;
}

export interface IEmailLoginDTO {
  email: string;
  password?: string;
}

export interface IStudentLoginDTO {
  orgSlug: string;
  fullName: string;
  grade: number;
  password?: string;
}

export type ILoginDTO = IEmailLoginDTO | IStudentLoginDTO;

export interface IVerifyStudentFirstTimeDTO {
  orgSlug: string;
  fullName: string;
  grade: number;
}

export interface ISetupPasswordFirstTimeDTO {
  userId: string;
  password?: string;
}

export interface IResetPasswordDTO {
  token: string;
  password?: string;
}

export class AuthService {
  /**
   * Register a new individual learner
   */
  static async registerIndividual(data: IRegisterIndividualDTO): Promise<IUser> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(data.password || "", 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const individual = await User.create({
      tenantId: "individual",
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      role: UserRole.INDIVIDUAL,
      grade: data.grade,
      status: "Pending", // Pending email verification
      isVerified: false,
      verificationToken,
    });

    eventBus.emit("user.registered", {
      userId: individual._id,
      email: individual.email,
      name: individual.fullName,
      token: verificationToken,
    });

    return individual;
  }

  /**
   * Register a new organization and its owner
   */
  static async registerOrganization(
    data: IRegisterOrgDTO
  ): Promise<{ organization: IOrganization; owner: IUser }> {
    const existingUser = await User.findOne({ email: data.ownerEmail });
    if (existingUser) {
      throw new ConflictError("Owner email already registered");
    }

    // Slug generation
    const slugSource = data.orgSlug || data.orgName;
    const orgSlug = generateSlug(slugSource);

    const existingOrg = await Organization.findOne({ slug: orgSlug });
    if (existingOrg) {
      throw new ConflictError("Organization slug/domain is already taken");
    }

    // 1. Create Organization
    const organization = new Organization({
      name: data.orgName,
      slug: orgSlug,
    });
    await organization.save();

    // 2. Create Owner User
    const passwordHash = await bcrypt.hash(data.ownerPassword || "", 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const owner = await User.create({
      tenantId: organization._id.toString(),
      organizationId: organization._id,
      fullName: data.ownerName,
      email: data.ownerEmail,
      passwordHash,
      role: UserRole.ORG_OWNER,
      status: "Pending",
      isVerified: false,
      verificationToken,
    });

    eventBus.emit("organization.registered", {
      orgId: organization._id,
      orgName: organization.name,
      ownerId: owner._id,
      email: owner.email,
      token: verificationToken,
    });

    return { organization, owner };
  }

  /**
   * Verify email verification token
   */
  static async verifyEmail(token: string): Promise<IUser> {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.status = "Active";
    user.verificationToken = undefined;
    await user.save();

    eventBus.emit("user.verified", { userId: user._id, email: user.email });

    return user;
  }

  /**
   * General Login flow (supports email and student names + org slug)
   */
  static async login(credentials: ILoginDTO): Promise<{ token: string; user: Partial<IUser> & { id: string } }> {
    let user: IUser | null = null;

    if ("email" in credentials) {
      // Email-based login
      user = await User.findOne({ email: credentials.email });
      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }

      if (!user.passwordHash) {
        throw new BadRequestError("Account not activated. Set up password first.");
      }

      const match = await bcrypt.compare(credentials.password || "", user.passwordHash);
      if (!match) {
        throw new UnauthorizedError("Invalid email or password");
      }
    } else {
      // Student-based login
      const { orgSlug, fullName, grade, password } = credentials;

      const org = await Organization.findOne({ slug: orgSlug });
      if (!org) {
        throw new UnauthorizedError("Invalid credentials");
      }

      user = await User.findOne({
        tenantId: org._id.toString(),
        fullName,
        grade,
        role: UserRole.STUDENT,
      });

      if (!user) {
        throw new UnauthorizedError("Invalid credentials");
      }

      if (!user.passwordHash) {
        throw new BadRequestError("Account not activated. Please setup your password first.");
      }

      const match = await bcrypt.compare(password || "", user.passwordHash);
      if (!match) {
        throw new UnauthorizedError("Invalid credentials");
      }
    }

    if (user.status === "Suspended") {
      throw new UnauthorizedError("Your account has been suspended. Contact support.");
    }

    // Determine grade access levels
    let accessibleGrades: number[] = [];
    if (user.role === UserRole.STUDENT || user.role === UserRole.INDIVIDUAL) {
      accessibleGrades = studentGradeAccessMap(user.grade || 9);
    } else if (user.role === UserRole.TEACHER) {
      accessibleGrades = user.grades || [];
    } else {
      // Admins have access to everything
      accessibleGrades = [9, 10, 11, 12];
    }

    const payload: IJWTPayload = {
      id: user._id.toString(),
      email: user.email || "",
      role: user.role,
      tenantId: user.tenantId,
      grades: accessibleGrades,
    };

    const token = jwt.sign(
      payload,
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        studentId: user.studentId,
        grade: user.grade,
      },
    };
  }

  /**
   * First-time student verification (identify student identity check)
   */
  static async verifyStudentFirstTime(
    data: IVerifyStudentFirstTimeDTO
  ): Promise<{ userId: string; isActivated: boolean }> {
    const org = await Organization.findOne({ slug: data.orgSlug });
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    const student = await User.findOne({
      tenantId: org._id.toString(),
      fullName: data.fullName,
      grade: data.grade,
      role: UserRole.STUDENT,
    });

    if (!student) {
      throw new NotFoundError("Student record not found in organization");
    }

    return {
      userId: student._id.toString(),
      isActivated: student.status === "Active" && !!student.passwordHash,
    };
  }

  /**
   * First-time student password activation setup
   */
  static async setupPasswordFirstTime(data: ISetupPasswordFirstTimeDTO): Promise<void> {
    const user = await User.findById(data.userId);
    if (!user) {
      throw new NotFoundError("Student record not found");
    }

    if (user.passwordHash) {
      throw new BadRequestError("Account already activated. Please login.");
    }

    const hash = await bcrypt.hash(data.password || "", 10);
    user.passwordHash = hash;
    user.status = "Active";
    user.isVerified = true;
    await user.save();

    eventBus.emit("user.activated", { userId: user._id, name: user.fullName });
  }

  /**
   * Send recovery password email link
   */
  static async requestPasswordReset(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      // Return resolve early to prevent user harvesting
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    eventBus.emit("user.password_reset_request", {
      userId: user._id,
      email: user.email,
      name: user.fullName,
      token: resetToken,
    });
  }

  /**
   * Reset user password
   */
  static async resetPassword(data: IResetPasswordDTO): Promise<void> {
    const user = await User.findOne({
      resetPasswordToken: data.token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestError("Invalid or expired password reset token");
    }

    const hash = await bcrypt.hash(data.password || "", 10);
    user.passwordHash = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    eventBus.emit("user.password_reset_success", { userId: user._id, email: user.email });
  }
}
