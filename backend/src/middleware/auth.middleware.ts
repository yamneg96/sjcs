import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthRequest, IJWTPayload, UserRole } from "../shared/types/auth.types";
import { UnauthorizedError, ForbiddenError } from "../shared/errors/errors";
import { patchContext } from "../shared/context/request-context";

/**
 * Protect routes - Verifies JWT token and populates req.user
 */
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as IJWTPayload;
    req.user = decoded;

    // Propagate identity into the request context (logging + tenant scoping)
    patchContext({
      userId: decoded.id,
      tenantId: decoded.tenantId,
      roles: decoded.role ? [decoded.role] : [],
    });

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Token expired"));
    } else {
      next(new UnauthorizedError("Invalid token"));
    }
  }
};

/**
 * Authorize roles - Checks if user has permission to access resource
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("You do not have permission to perform this action"));
    }

    next();
  };
};

/**
 * Tenant Guard - Middleware that enforces tenant isolation.
 * Automatically checks requests to see if user has access to this tenant.
 * Stuffs tenantId in request query or body if helpful, or validates access parameters.
 */
export const tenantGuard = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  // SuperAdmins bypass tenant check
  if (req.user.role === UserRole.SUPER_ADMIN) {
    return next();
  }

  // Identify tenant to verify (from params, query, or headers)
  const paramTenantId = req.params.tenantId || req.query.tenantId || req.body.tenantId;

  if (paramTenantId && paramTenantId !== req.user.tenantId) {
    return next(new ForbiddenError("Tenant mismatch - cross-tenant access denied"));
  }

  next();
};
