import Organization, { IOrganization } from "../organizations/organization.model";
import User from "../users/user.model";
import Admission from "../admissions/admission.model";
import ModelCatalogEntry, { IModelCatalogEntry } from "../mobile/model-catalog.model";
import { NotFoundError } from "../../shared/errors/errors";
import { UserRole } from "../../shared/types/auth.types";
import { logger } from "../../shared/utils/logger";

/**
 * Platform (super-admin) service — the ONLY place cross-tenant reads are
 * allowed (§12.2 `@PlatformScope`). Every method here deliberately bypasses
 * tenant scoping, so it must never be reachable by a non-SUPER_ADMIN. Access is
 * gated at the route layer and each call is audit-logged.
 *
 * These queries do NOT use TenantRepository precisely because they are
 * platform-scoped by design.
 */
export class PlatformService {
  /** Aggregate KPIs for the platform dashboard. */
  static async getStats() {
    const [organizations, activeOrgs, students, teachers, parents, admissions, pendingAdmissions] =
      await Promise.all([
        Organization.countDocuments({}),
        Organization.countDocuments({ "subscription.status": "Active" }),
        User.countDocuments({ role: UserRole.STUDENT }),
        User.countDocuments({ role: UserRole.TEACHER }),
        User.countDocuments({ role: UserRole.PARENT }),
        Admission.countDocuments({}),
        Admission.countDocuments({ status: "PENDING_REVIEW" }),
      ]);

    const aiUsage = await Organization.aggregate<{ _id: null; total: number; limit: number }>([
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$aiConfig.currentMonthlyUsage", 0] } },
          limit: { $sum: { $ifNull: ["$aiConfig.monthlyUsageLimit", 0] } },
        },
      },
    ]);

    return {
      organizations,
      activeOrgs,
      students,
      teachers,
      parents,
      admissions,
      pendingAdmissions,
      aiSpendUSD: Number((aiUsage[0]?.total ?? 0).toFixed(4)),
      aiBudgetUSD: aiUsage[0]?.limit ?? 0,
    };
  }

  /** All organizations with their headline numbers (cross-tenant). */
  static async listOrganizations() {
    const orgs = await Organization.find({}).sort({ createdAt: -1 }).lean();

    return Promise.all(
      orgs.map(async (org) => {
        const tenantId = org._id.toString();
        const [studentCount, staffCount] = await Promise.all([
          User.countDocuments({ tenantId, role: UserRole.STUDENT }),
          User.countDocuments({
            tenantId,
            role: { $in: [UserRole.TEACHER, UserRole.ORG_ADMIN, UserRole.ORG_OWNER, UserRole.DIRECTOR, UserRole.REGISTRAR] },
          }),
        ]);
        return {
          _id: org._id,
          name: org.name,
          slug: org.slug,
          isVerified: org.isVerified,
          suspendedAt: org.suspendedAt,
          plan: org.subscription?.plan ?? "Free",
          status: org.subscription?.status ?? "Trialing",
          aiUsage: org.aiConfig?.currentMonthlyUsage ?? 0,
          aiLimit: org.aiConfig?.monthlyUsageLimit ?? 0,
          studentCount,
          staffCount,
          createdAt: org.createdAt,
        };
      })
    );
  }

  /** Suspends an organization (read-only enforcement lives in the AI gateway). */
  static async setOrganizationSuspended(
    orgId: string,
    suspended: boolean,
    actorId: string
  ): Promise<IOrganization> {
    const org = await Organization.findById(orgId);
    if (!org) throw new NotFoundError("Organization not found");

    org.suspendedAt = suspended ? new Date() : undefined;
    if (org.subscription) {
      org.subscription.status = suspended ? "Suspended" : "Active";
    }
    await org.save();

    logger.warn("Platform-scope action: organization suspension changed", {
      orgId,
      suspended,
      actorId,
    });
    return org;
  }

  // ── Model catalog (ADR-003: models are DATA, managed here) ──

  static listModels(): Promise<IModelCatalogEntry[]> {
    return ModelCatalogEntry.find({}).sort({ modelId: 1, version: -1 }).lean() as unknown as Promise<
      IModelCatalogEntry[]
    >;
  }

  static async setModelStatus(
    id: string,
    status: "canary" | "stable" | "deprecated",
    actorId: string
  ): Promise<IModelCatalogEntry> {
    const entry = await ModelCatalogEntry.findById(id);
    if (!entry) throw new NotFoundError("Model catalog entry not found");

    entry.status = status;
    await entry.save();

    logger.info("Platform-scope action: model catalog status changed", {
      modelId: entry.modelId,
      version: entry.version,
      status,
      actorId,
    });
    return entry;
  }
}
