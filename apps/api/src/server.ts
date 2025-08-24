import { createApp } from "./app";
import { DatabaseConnection } from "@/infrastructure/database/connection";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await DatabaseConnection.connect();

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log("\n🚀 Server is running!");
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log("\n🛠️  Available endpoints:");
      console.log(`   • POST   /api/auth/register  - Create new user`);
      console.log(`   • POST   /api/auth/login     - User login`);
      console.log(`   • GET    /api/auth/profile   - Get user profile`);
      console.log(`   • GET    /api/products       - List products`);
      console.log(`   • POST   /api/products       - Create product (Admin)`);
      console.log(`   • GET    /api/products/:id   - Get product by ID`);
      console.log("\n💡 Ready to accept requests!");
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

      server.close(async (err) => {
        if (err) {
          console.error("❌ Error during server shutdown:", err);
          process.exit(1);
        }

        try {
          await DatabaseConnection.disconnect();
          console.log("✅ Server shutdown completed successfully");
          process.exit(0);
        } catch (error) {
          console.error("❌ Error during database disconnect:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    process.on("uncaughtException", (error) => {
      console.error("💥 Uncaught Exception:", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
