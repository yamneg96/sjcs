import mongoose from "mongoose";
import User from "../src/modules/users/user.model";
import Notification from "../src/modules/notifications/notification.model";
import Publishing from "../src/modules/results/publishing.model";
import Device from "../src/modules/mobile/device.model";
import { PublishingService } from "../src/modules/results/publishing.service";
import { registerNotificationListeners } from "../src/modules/notifications/notification.listeners";
import { runWithContext } from "../src/shared/context/request-context";
import { UserRole } from "../src/shared/types/auth.types";

/**
 * §33: "At releaseAt … notifications fan out." The scheduler only flips the
 * status — this listener is what actually reaches families, so it needs its own
 * coverage.
 */

const ORG = new mongoose.Types.ObjectId().toString();
const DIRECTOR = new mongoose.Types.ObjectId().toString();

const asOrg = <T>(fn: () => Promise<T>) =>
  runWithContext({ requestId: "test", tenantId: ORG, userId: DIRECTOR }, fn);

/**
 * The event bus dispatches handlers asynchronously, so a fixed sleep is a race.
 * Poll until the expected state appears (or give up) — deterministic and fast
 * in the common case.
 */
async function waitFor(check: () => Promise<boolean>, timeoutMs = 8000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await check()) return;
    await new Promise((r) => setTimeout(r, 50));
  }
}

/** Settle window for assertions that expect NOTHING to happen. */
const settle = () => new Promise((r) => setTimeout(r, 400));

let yearId: string;

beforeAll(() => {
  registerNotificationListeners();
});

describe("results.published fan-out", () => {
  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Notification.deleteMany({}),
      Publishing.deleteMany({}),
      Device.deleteMany({}),
    ]);
    yearId = new mongoose.Types.ObjectId().toString();
  });

  const seedFamily = async (grade: number) => {
    const parent = await User.create({
      tenantId: ORG,
      fullName: "Parent",
      email: `p-${Math.random()}@t.et`,
      role: UserRole.PARENT,
      status: "Active",
    });
    const student = await User.create({
      tenantId: ORG,
      fullName: "Student",
      role: UserRole.STUDENT,
      grade,
      studentId: `S-${Math.random().toString(36).slice(2, 8)}`,
      guardianIds: [parent._id],
      status: "Active",
    });
    return { parent, student };
  };

  const publish = async (grades: number[]) => {
    const pub = await asOrg(() =>
      PublishingService.create(DIRECTOR, { academicYearId: yearId, term: "Term 1", grades })
    );
    await asOrg(() => PublishingService.approve(pub._id.toString(), DIRECTOR));
    await asOrg(() =>
      PublishingService.schedule(pub._id.toString(), DIRECTOR, new Date(Date.now() - 1000))
    );
    await PublishingService.runReleaseSweep();
    return pub;
  };

  it("notifies both the student and their guardian when results release", async () => {
    const { parent, student } = await seedFamily(9);
    await publish([9]);
    await waitFor(async () => (await Notification.countDocuments({})) >= 2);

    const studentNotes = await Notification.find({ userId: student._id });
    const parentNotes = await Notification.find({ userId: parent._id });

    expect(studentNotes).toHaveLength(1);
    expect(parentNotes).toHaveLength(1);
    expect(studentNotes[0].kind).toBe("results_published");
    // Each audience gets its own destination.
    expect(studentNotes[0].link).toBe("/(tabs)/exams");
    expect(parentNotes[0].link).toBe("/portal");
  });

  it("only notifies grades inside the publishing scope", async () => {
    const g9 = await seedFamily(9);
    const g10 = await seedFamily(10);

    await publish([9]); // grade 10 is NOT in scope
    await waitFor(async () => (await Notification.countDocuments({ userId: g9.student._id })) === 1);
    await settle();

    expect(await Notification.countDocuments({ userId: g9.student._id })).toBe(1);
    expect(await Notification.countDocuments({ userId: g10.student._id })).toBe(0);
    expect(await Notification.countDocuments({ userId: g10.parent._id })).toBe(0);
  });

  it("does not notify anyone while the release is still embargoed", async () => {
    const { student } = await seedFamily(9);

    const pub = await asOrg(() =>
      PublishingService.create(DIRECTOR, { academicYearId: yearId, term: "Term 1", grades: [9] })
    );
    await asOrg(() => PublishingService.approve(pub._id.toString(), DIRECTOR));
    await asOrg(() =>
      // releaseAt in the future — the sweep must not fire.
      PublishingService.schedule(pub._id.toString(), DIRECTOR, new Date(Date.now() + 3_600_000))
    );
    await PublishingService.runReleaseSweep();
    await settle();

    expect(await Notification.countDocuments({ userId: student._id })).toBe(0);
  });

  it("does not double-notify when the sweep runs again", async () => {
    const { student } = await seedFamily(9);
    await publish([9]);
    await waitFor(async () => (await Notification.countDocuments({ userId: student._id })) === 1);

    await PublishingService.runReleaseSweep(); // idempotent
    await settle();

    expect(await Notification.countDocuments({ userId: student._id })).toBe(1);
  });

  it("still records in-app notifications when no push token is registered", async () => {
    const { student } = await seedFamily(9);
    // No Device rows at all — push has nowhere to go, but the inbox must fill.
    await publish([9]);
    await waitFor(async () => (await Notification.countDocuments({ userId: student._id })) === 1);

    expect(await Notification.countDocuments({ userId: student._id })).toBe(1);
  });
});
