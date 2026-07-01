import Organization from "../organizations/organization.model";
import { NotFoundError } from "../../shared/errors/errors";

export class BillingService {
  /**
   * Fetches monthly AI credit usage and subscription limits for a tenant.
   */
  static async getUsage(tenantId: string) {
    const org = await Organization.findOne({ tenantId }).lean();
    if (!org) throw new NotFoundError("Organization workspace not found");

    const plan = org.subscription?.plan || "Free";
    const creditLimit = org.aiConfig?.monthlyUsageLimit || 1000;
    const creditUsed = org.aiConfig?.currentMonthlyUsage || 0;

    return {
      name: org.name,
      plan,
      creditLimit,
      creditUsed,
      remaining: Math.max(0, creditLimit - creditUsed),
      status: org.subscription?.status || "Active",
    };
  }

  /**
   * Refuels organization credit limit
   */
  static async addCredits(tenantId: string, credits: number) {
    const org = await Organization.findOne({ tenantId });
    if (!org) throw new NotFoundError("Organization workspace not found");

    if (!org.aiConfig) {
      org.aiConfig = {
        allowedModels: ["bonsai", "gemma"],
        monthlyUsageLimit: 0,
        currentMonthlyUsage: 0
      };
    }

    org.aiConfig.monthlyUsageLimit = (org.aiConfig.monthlyUsageLimit || 0) + credits;
    await org.save();

    return org;
  }
}
