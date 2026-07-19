import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/modules/users/user.model";
import Session from "../src/modules/auth/session.model";
import Organization from "../src/modules/organizations/organization.model";
import { AuthService } from "../src/modules/auth/auth.service";
import { UserRole } from "../src/shared/types/auth.types";

/**
 * Refresh-token rotation + reuse detection (§13.2, §47.2). Stealing a refresh
 * token must not grant durable access: reusing a rotated token revokes the
 * whole family.
 */

const EMAIL = "refresh-suite@test.et";

describe("refresh token rotation", () => {
  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), Session.deleteMany({}), Organization.deleteMany({})]);

    const org = await Organization.create({ name: "Test Org", slug: `t-${Date.now()}` });
    await User.create({
      tenantId: org._id.toString(),
      organizationId: org._id,
      fullName: "Refresh User",
      email: EMAIL,
      passwordHash: await bcrypt.hash("Passw0rd!", 10),
      role: UserRole.ORG_OWNER,
      status: "Active",
      isVerified: true,
    });
  });

  const login = () => AuthService.login({ email: EMAIL, password: "Passw0rd!" });

  it("issues an access token AND a refresh token on login", async () => {
    const res = await login();
    expect(res.token).toBeTruthy();
    expect(res.refreshToken).toBeTruthy();
  });

  it("stores only a hash of the refresh token, never the token itself", async () => {
    const { refreshToken } = await login();
    const stored = await Session.findOne({});
    expect(stored).toBeTruthy();
    expect(stored?.refreshTokenHash).not.toBe(refreshToken);
    expect(stored?.refreshTokenHash).toHaveLength(64); // sha256 hex
  });

  it("rotates: refreshing returns a NEW refresh token", async () => {
    const first = await login();
    const rotated = await AuthService.refreshTokens(first.refreshToken);

    expect(rotated.refreshToken).not.toBe(first.refreshToken);
    expect(rotated.token).toBeTruthy();
  });

  it("detects reuse of an already-rotated token and revokes the whole family", async () => {
    const first = await login();
    const rotated = await AuthService.refreshTokens(first.refreshToken);

    // Attacker replays the old token.
    await expect(AuthService.refreshTokens(first.refreshToken)).rejects.toThrow();

    // The legitimately-rotated token is now dead too (family revoked).
    await expect(AuthService.refreshTokens(rotated.refreshToken)).rejects.toThrow();

    const active = await Session.countDocuments({ revokedAt: null });
    expect(active).toBe(0);
  });

  it("rejects an unknown refresh token", async () => {
    await expect(AuthService.refreshTokens("not-a-real-token")).rejects.toThrow();
  });

  it("rejects an expired refresh token", async () => {
    const { refreshToken } = await login();
    await Session.updateOne({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });

    await expect(AuthService.refreshTokens(refreshToken)).rejects.toThrow();
  });

  it("logout revokes the session so the token can't refresh", async () => {
    const { refreshToken } = await login();
    await AuthService.logout(refreshToken);

    await expect(AuthService.refreshTokens(refreshToken)).rejects.toThrow();
  });

  it("logoutAll revokes every active session for the user", async () => {
    await login();
    await login();
    expect(await Session.countDocuments({ revokedAt: null })).toBe(2);

    const user = await User.findOne({ email: EMAIL });
    await AuthService.logoutAll(user!._id.toString());

    expect(await Session.countDocuments({ revokedAt: null })).toBe(0);
  });

  it("refuses to refresh for a suspended account", async () => {
    const { refreshToken } = await login();
    await User.updateOne({ email: EMAIL }, { $set: { status: "Suspended" } });

    await expect(AuthService.refreshTokens(refreshToken)).rejects.toThrow();
  });
});

describe("user index integrity", () => {
  it("allows many staff/parents without a studentId in one tenant", async () => {
    await User.deleteMany({});
    const tenantId = new mongoose.Types.ObjectId().toString();

    // Regression: a unique+sparse compound index used to reject the 2nd of these.
    await User.create({ tenantId, fullName: "Teacher A", role: UserRole.TEACHER, status: "Active" });
    await User.create({ tenantId, fullName: "Teacher B", role: UserRole.TEACHER, status: "Active" });
    await User.create({ tenantId, fullName: "Parent C", role: UserRole.PARENT, status: "Active" });

    expect(await User.countDocuments({ tenantId })).toBe(3);
  });

  it("still enforces studentId uniqueness within a tenant", async () => {
    await User.deleteMany({});
    const tenantId = new mongoose.Types.ObjectId().toString();

    await User.create({ tenantId, fullName: "S1", role: UserRole.STUDENT, studentId: "S9-DUP", status: "Active" });
    await expect(
      User.create({ tenantId, fullName: "S2", role: UserRole.STUDENT, studentId: "S9-DUP", status: "Active" })
    ).rejects.toThrow();
  });

  it("allows the same studentId in a different tenant", async () => {
    await User.deleteMany({});
    const a = new mongoose.Types.ObjectId().toString();
    const b = new mongoose.Types.ObjectId().toString();

    await User.create({ tenantId: a, fullName: "S1", role: UserRole.STUDENT, studentId: "S9-X", status: "Active" });
    await User.create({ tenantId: b, fullName: "S2", role: UserRole.STUDENT, studentId: "S9-X", status: "Active" });

    expect(await User.countDocuments({ studentId: "S9-X" })).toBe(2);
  });
});
