// Prisma Client Singleton
// Load environment variables first
import "dotenv/config";

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

// Lazy-load Prisma to prevent issues during Vite config loading
let prismaInstance: any = null;
let initializationError: Error | null = null;

function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  if (initializationError) {
    throw initializationError;
  }

  try {
    // Lazy import Prisma modules
    const { PrismaClient } = require("@prisma/client");
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");

    // Ensure DATABASE_URL is available
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      const error = new Error("DATABASE_URL environment variable is required");
      console.error("Error: DATABASE_URL is not set. Prisma Client cannot be initialized.");
      initializationError = error;
      throw error;
    }

    console.log("Initializing Prisma Client with adapter...");
    
    // Create PostgreSQL connection pool
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);

    prismaInstance =
      globalForPrisma.prisma ??
      new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });

    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaInstance;

    console.log("Prisma Client initialized successfully");
    return prismaInstance;
  } catch (error: any) {
    console.error("Failed to initialize Prisma Client:", error);
    initializationError = error;
    throw error;
  }
}

// Export a getter function that lazy-loads Prisma
// Use a more robust Proxy that handles async operations correctly
export const prisma = new Proxy({} as any, {
  get(_target, prop) {
    try {
      const prismaClient = getPrisma();
      const value = prismaClient[prop];
      if (typeof value === "function") {
        // Return a bound function that handles errors
        return function(...args: any[]) {
          try {
            return value.apply(prismaClient, args);
          } catch (error: any) {
            console.error(`Prisma error calling ${String(prop)}:`, error);
            throw error;
          }
        };
      }
      return value;
    } catch (error: any) {
      console.error(`Error accessing Prisma property ${String(prop)}:`, error);
      throw error;
    }
  },
});
