import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { config } from "dotenv";

config();

import { createMainRoutes } from "@/presentation/routes";
import {
  errorHandler,
  notFound,
} from "@/presentation/middlewares/errorMiddleware";
import { container } from "@/shared/container";

export function createApp(): Express {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(compression());

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use(
    "/api",
    createMainRoutes({
      authController: container.authController,
      productController: container.productController,
      authMiddleware: container.authMiddleware,
    })
  );

  app.get("/", (req, res) => {
    res.json({
      message: "🌱 Welcome to Paisagismo E-commerce API!",
      version: "1.0.0",
      status: "running",
      endpoints: {
        api: "/api",
        health: "/api/health",
        auth: "/api/auth",
        products: "/api/products",
      },
    });
  });

  app.use(notFound);

  app.use(errorHandler);

  return app;
}
