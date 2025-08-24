import { Router } from "express";
import { createAuthRoutes } from "./authRoutes";
import { createProductRoutes } from "./productRoutes";

import { AuthController } from "@/presentation/controllers/AuthController";
import { ProductController } from "@/presentation/controllers/ProductController";
import { AuthMiddleware } from "@/presentation/middlewares/authMiddleware";

interface ControllerDependencies {
  authController: AuthController;
  productController: ProductController;
  authMiddleware: AuthMiddleware;
}

export function createMainRoutes(dependencies: ControllerDependencies): Router {
  const router = Router();

  router.get("/health", (req, res) => {
    res.json({
      status: "OK",
      message: "Paisagismo E-commerce API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

  router.get("/", (req, res) => {
    res.json({
      name: "Paisagismo E-commerce API",
      version: "1.0.0",
      description: "API para e-commerce de produtos de paisagismo e jardinagem",
      author: "Seu Nome",
      endpoints: {
        auth: "/api/auth",
        products: "/api/products",
        health: "/api/health",
      },
      documentation: "/api/docs",
    });
  });

  router.use(
    "/auth",
    createAuthRoutes(dependencies.authController, dependencies.authMiddleware)
  );

  router.use(
    "/products",
    createProductRoutes(
      dependencies.productController,
      dependencies.authMiddleware
    )
  );

  return router;
}
