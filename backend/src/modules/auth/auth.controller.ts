import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../students/student.model";
import { env } from "../../config/env";
import {
  verifyStudentSchema,
  setupPasswordSchema,
  loginSchema,
} from "./auth.validation";
import { sendSuccess, sendError } from "../../utils/api-response";

export const verifyStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = verifyStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message);
      return;
    }

    const { fullName, grade } = parsed.data;
    const student = await Student.findOne({ fullName, grade });

    if (!student) {
      sendError(res, "Student not found", 404);
      return;
    }

    sendSuccess(res, {
      studentId: student.studentId,
      isActivated: student.isActivated,
      fullName: student.fullName,
      grade: student.grade,
    });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};

export const setupPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = setupPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message);
      return;
    }

    const { studentId, password } = parsed.data;
    const student = await Student.findOne({ studentId });

    if (!student) {
      sendError(res, "Student not found", 404);
      return;
    }

    if (student.isActivated) {
      sendError(res, "Account already activated. Please login.", 400);
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    student.passwordHash = hash;
    student.isActivated = true;
    await student.save();

    sendSuccess(res, { success: true, message: "Password set successfully" });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message);
      return;
    }

    const { fullName, grade, password } = parsed.data;
    const student = await Student.findOne({ fullName, grade });

    if (!student) {
      sendError(res, "Invalid credentials", 400);
      return;
    }

    if (!student.isActivated || !student.passwordHash) {
      sendError(res, "Account not activated. Please set up your password first.", 400);
      return;
    }

    const match = await bcrypt.compare(password, student.passwordHash);
    if (!match) {
      sendError(res, "Wrong password", 401);
      return;
    }

    const token = jwt.sign(
      { id: student._id, grade: student.grade },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as string }
    );

    sendSuccess(res, {
      token,
      student: {
        id: student._id,
        fullName: student.fullName,
        grade: student.grade,
        studentId: student.studentId,
      },
    });
  } catch (err) {
    sendError(res, (err as Error).message, 500);
  }
};
