import { PrismaClient } from "@prisma/client";

class DatabaseConnection {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
        errorFormat: "pretty",
      });

      process.on("beforeExit", async () => {
        await DatabaseConnection.instance.$disconnect();
      });
    }

    return DatabaseConnection.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const client = DatabaseConnection.getInstance();
      await client.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Failed to connect to database:", error);
      process.exit(1);
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      if (DatabaseConnection.instance) {
        await DatabaseConnection.instance.$disconnect();
        console.log("✅ Database disconnected successfully");
      }
    } catch (error) {
      console.error("❌ Error disconnecting from database:", error);
    }
  }
}

export { DatabaseConnection };
export const prisma = DatabaseConnection.getInstance();
