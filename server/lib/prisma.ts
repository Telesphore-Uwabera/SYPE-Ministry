// Prisma Client Singleton
// Load environment variables first
import "dotenv/config";

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

// Lazy-load Prisma to prevent issues during Vite config loading
let prismaInstance: any = null;

function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  // Lazy import Prisma modules
  const { PrismaClient } = require("@prisma/client");
  const { Pool } = require("pg");
  const { PrismaPg } = require("@prisma/adapter-pg");

  // Ensure DATABASE_URL is available
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL is not set. Prisma Client cannot be initialized.");
    throw new Error("DATABASE_URL environment variable is required");
  }

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

  return prismaInstance;
}

// Export a getter function that lazy-loads Prisma
export const prisma = new Proxy({} as any, {
  get(_target, prop) {
    const prisma = getPrisma();
    const value = prisma[prop];
    if (typeof value === "function") {
      return value.bind(prisma);
    }
    return value;
  },
});
