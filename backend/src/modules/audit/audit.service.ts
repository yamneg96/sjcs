import AuditLog from "./audit.model";

export class AuditService {
  /**
   * Records a user/tenant security or system action.
   */
  static async logAction(params: {
    tenantId: string;
    userId: string;
    action: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await AuditLog.create(params);
    } catch (err) {
      // Degrade gracefully so logger errors don't crash main business flows
      console.error("Failed to write audit log:", err);
    }
  }

  /**
   * Fetches audit logs for a specific tenant.
   */
  static async getTenantLogs(tenantId: string, limit = 50, skip = 0) {
    return AuditLog.find({ tenantId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}
