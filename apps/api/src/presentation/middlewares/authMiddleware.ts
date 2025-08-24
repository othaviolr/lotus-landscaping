import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "@/infrastructure/services/JwtTokenService";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
  };
}

export class AuthMiddleware {
  constructor(private tokenService: JwtTokenService) {}

  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({ error: "Authorization header is required" });
        return;
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

      if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
      }

      const payload = this.tokenService.verifyToken(token);
      (req as AuthenticatedRequest).user = payload;

      next();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      res.status(401).json({ error: message });
    }
  };

  requireRole = (role: "ADMIN") => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const authenticatedReq = req as AuthenticatedRequest;

      if (!authenticatedReq.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (authenticatedReq.user.role !== role) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      next();
    };
  };
}
