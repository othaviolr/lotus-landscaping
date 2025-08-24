export interface TokenPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface TokenService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
}
