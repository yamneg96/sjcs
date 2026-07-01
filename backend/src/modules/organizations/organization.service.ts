import Organization, { IOrganization } from "./organization.model";
import { NotFoundError, BadRequestError } from "../../shared/errors/errors";

export class OrganizationService {
  /**
   * Get organization profile by slug or ID
   */
  static async getOrganization(query: { id?: string; slug?: string }): Promise<IOrganization> {
    const filter = query.id ? { _id: query.id } : { slug: query.slug };
    const org = await Organization.findOne(filter);
    if (!org) {
      throw new NotFoundError("Organization not found");
    }
    return org;
  }

  /**
   * Update organization branding / info
   */
  static async updateOrganization(id: string, updateData: any): Promise<IOrganization> {
    const org = await Organization.findById(id);
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    if (updateData.name) {
      org.name = updateData.name;
    }
    if (updateData.branding) {
      org.branding = {
        ...org.branding,
        ...updateData.branding,
      };
    }
    if (updateData.logoUrl) {
      org.logoUrl = updateData.logoUrl;
    }

    await org.save();
    return org;
  }

  /**
   * Update organization AI config limits (SuperAdmin only)
   */
  static async updateAIConfig(id: string, aiConfig: any): Promise<IOrganization> {
    const org = await Organization.findById(id);
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    org.aiConfig = {
      ...org.aiConfig,
      ...aiConfig,
      allowedModels: aiConfig.allowedModels || org.aiConfig?.allowedModels || ["bonsai", "gemma"],
      monthlyUsageLimit: aiConfig.monthlyUsageLimit ?? org.aiConfig?.monthlyUsageLimit ?? 50.00,
    };

    await org.save();
    return org;
  }

  /**
   * Update subscription status (SuperAdmin/Billing webhook only)
   */
  static async updateSubscription(id: string, subscription: any): Promise<IOrganization> {
    const org = await Organization.findById(id);
    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    org.subscription = {
      ...org.subscription,
      ...subscription,
    };

    if (subscription.status === "Suspended") {
      org.suspendedAt = new Date();
    } else {
      org.suspendedAt = undefined;
    }

    await org.save();
    return org;
  }
}
