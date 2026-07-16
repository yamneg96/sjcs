import { Response } from "express";
import { AuthRequest } from "../../shared/types/auth.types";
import { sendSuccess } from "../../shared/utils/api-response";
import { asyncHandler } from "../../shared/utils/async-handler";
import { BadRequestError } from "../../shared/errors/errors";
import { AssessmentService } from "./assessment.service";
import { MarkService } from "./mark.service";
import { PublishingService } from "./publishing.service";
import { AppealService } from "./appeal.service";
import {
  createAssessmentSchema,
  enterMarkSchema,
  bulkEnterMarksSchema,
  createPublishingSchema,
  schedulePublishingSchema,
  createAppealSchema,
  proposeAppealChangeSchema,
  resolveAppealSchema,
} from "./results.validation";

const requireUser = (req: AuthRequest) => {
  const id = req.user?.id;
  if (!id || !req.user) throw new BadRequestError("Auth context required");
  return req.user;
};

// ── Assessments ──────────────────────────────────────────────
export const createAssessment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const parsed = createAssessmentSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);
  const assessment = await AssessmentService.create(user.id, parsed.data);
  sendSuccess(res, assessment, "Assessment created", 201);
});

export const listAssessments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const list = await AssessmentService.list({
    academicYearId: req.query.academicYearId as string,
    term: req.query.term as string,
    sectionId: req.query.sectionId as string,
    subjectId: req.query.subjectId as string,
  });
  sendSuccess(res, list, "Assessments retrieved");
});

// ── Mark entry (teacher) ─────────────────────────────────────
export const enterMark = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const parsed = enterMarkSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);
  const mark = await MarkService.enterMark(req.params.assessmentId as string, user.id, parsed.data);
  sendSuccess(res, mark, "Mark saved");
});

export const bulkEnterMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const parsed = bulkEnterMarksSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);
  const results = [];
  for (const m of parsed.data.marks) {
    results.push(await MarkService.enterMark(req.params.assessmentId as string, user.id, m));
  }
  sendSuccess(res, { saved: results.length }, "Marks saved");
});

export const listAssessmentMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const list = await MarkService.listAssessmentMarks(req.params.assessmentId as string);
  sendSuccess(res, list, "Marks retrieved");
});

export const submitAssessmentMarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await MarkService.submitAssessment(req.params.assessmentId as string);
  sendSuccess(res, result, "Marks submitted");
});

// ── Time-locked results read (student/parent) ────────────────
export const getStudentResults = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const academicYearId = req.query.academicYearId as string;
  const term = req.query.term as string;
  if (!academicYearId || !term) {
    throw new BadRequestError("academicYearId and term are required");
  }
  const data = await MarkService.getResultsFor(user, req.params.studentId as string, {
    academicYearId,
    term,
  });
  sendSuccess(res, data, "Results retrieved");
});

// ── Publishing (director) ────────────────────────────────────
export const createPublishing = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const parsed = createPublishingSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);
  const publishing = await PublishingService.create(user.id, parsed.data);
  sendSuccess(res, publishing, "Publishing created", 201);
});

export const listPublishings = asyncHandler(async (_req: AuthRequest, res: Response) => {
  sendSuccess(res, await PublishingService.list(), "Publishings retrieved");
});

export const approvePublishing = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const publishing = await PublishingService.approve(req.params.publishingId as string, user.id);
  sendSuccess(res, publishing, "Publishing approved");
});

export const schedulePublishing = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const parsed = schedulePublishingSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);
  const publishing = await PublishingService.schedule(
    req.params.publishingId as string,
    user.id,
    parsed.data.releaseAt
  );
  sendSuccess(res, publishing, "Publishing scheduled");
});

// ── Appeals ──────────────────────────────────────────────────
export const createAppeal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const parsed = createAppealSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);
  const appeal = await AppealService.create(user, parsed.data);
  sendSuccess(res, appeal, "Appeal filed", 201);
});

export const listAppeals = asyncHandler(async (req: AuthRequest, res: Response) => {
  sendSuccess(res, await AppealService.list({ status: req.query.status as string }), "Appeals retrieved");
});

export const proposeAppealChange = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const parsed = proposeAppealChangeSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);
  const appeal = await AppealService.propose(req.params.appealId as string, user.id, parsed.data);
  sendSuccess(res, appeal, "Change proposed");
});

export const resolveAppeal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const parsed = resolveAppealSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError(parsed.error.errors[0].message);
  const appeal = await AppealService.resolve(req.params.appealId as string, user, parsed.data);
  sendSuccess(res, appeal, "Appeal resolved");
});
