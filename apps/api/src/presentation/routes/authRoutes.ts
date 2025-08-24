import { Router } from "express";
import { AuthController } from "@/presentation/controllers/AuthController";
import { validateRequest } from "@/presentation/middlewares/validationMiddleware";
import { AuthMiddleware } from "@/presentation/middlewares/authMiddleware";
import {
  createUserSchema,
  loginSchema,
} from "@/shared/validators/userValidators";

export function createAuthRoutes(
  authController: AuthController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  /**
   * @route POST /api/auth/register
   * @desc Register a new user
   * @access Public
   */
  router.post(
    "/register",
    validateRequest(createUserSchema),
    authController.register
  );

  /**
   * @route POST /api/auth/login
   * @desc Authenticate user and get token
   * @access Public
   */
  router.post("/login", validateRequest(loginSchema), authController.login);

  /**
   * @route GET /api/auth/profile
   * @desc Get current user profile
   * @access Private
   */
  router.get(
    "/profile",
    authMiddleware.authenticate,
    authController.getProfile
  );

  /**
   * @route POST /api/auth/logout
   * @desc Logout user
   * @access Private
   */
  router.post("/logout", authMiddleware.authenticate, authController.logout);

  return router;
}
