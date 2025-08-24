import jwt from "jsonwebtoken";
import {
  TokenService,
  TokenPayload,
} from "@/application/services/TokenService";

export class JwtTokenService implements TokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || "fallback-secret-key";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    if (!process.env.JWT_SECRET) {
      console.warn(
        "JWT_SECRET not found in environment variables. Using fallback."
      );
    }
  }

  generateToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"], // Type casting
      issuer: "paisagismo-ecommerce",
      audience: "paisagismo-api-users",
    };

    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret, {
        issuer: "paisagismo-ecommerce",
        audience: "paisagismo-api-users",
      }) as jwt.JwtPayload & TokenPayload;

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      throw new Error("Token verification failed");
    }
  }
}
