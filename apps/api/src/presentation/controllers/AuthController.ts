import { Request, Response } from "express";
import { CreateUserUseCase } from "@/application/use-cases/user/CreateUserUseCase";
import { AuthenticateUserUseCase } from "@/application/use-cases/user/AuthenticateUserUseCase";
import { GetUserUseCase } from "@/application/use-cases/user/GetUserUseCase";
import { AuthenticatedRequest } from "@/presentation/middlewares/authMiddleware";
import { asyncHandler } from "@/presentation/middlewares/errorMiddleware";

export class AuthController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private getUserUseCase: GetUserUseCase
  ) {}

  register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = await this.createUserUseCase.execute(req.body);

      const { password, ...userResponse } = user;

      res.status(201).json({
        message: "User created successfully",
        data: userResponse,
      });
    }
  );

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authenticateUserUseCase.execute(req.body);

    res.json({
      message: "Login successful",
      data: result,
    });
  });

  getProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const authenticatedReq = req as AuthenticatedRequest;
      const user = await this.getUserUseCase.execute(
        authenticatedReq.user.userId
      );

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({
        message: "Profile retrieved successfully",
        data: user,
      });
    }
  );

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({
      message: "Logout successful",
    });
  });
}
