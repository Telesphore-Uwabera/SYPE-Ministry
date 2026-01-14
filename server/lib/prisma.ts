// Prisma Client Singleton
// Load environment variables first
import "dotenv/config";
import { createRequire } from "module";
import dns from "dns";

// This project runs as ESM ("type": "module"). Prisma packages are loaded via CommonJS entrypoints,
// so we must use createRequire() instead of relying on `require` (which is undefined in ESM).
const require = createRequire(import.meta.url);

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

// Lazy-load Prisma to prevent Vite config issues, and to allow async IPv4 resolution on Render.
let prismaInstance: any = null;
let prismaInitPromise: Promise<any> | null = null;

async function initPrisma(): Promise<any> {
  if (prismaInstance) return prismaInstance;

  // Reuse singleton in dev to avoid exhausting connections on HMR
  if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
    return prismaInstance;
  }

  // Lazy import Prisma modules
  const { PrismaClient } = require("@prisma/client");
  const { Pool } = require("pg");
  const { PrismaPg } = require("@prisma/adapter-pg");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const url = new URL(databaseUrl);
  const host = url.hostname;
  const port = url.port ? Number(url.port) : 5432;
  const user = decodeURIComponent(url.username || "");
  const password = decodeURIComponent(url.password || "");
  const database = url.pathname.replace(/^\//, "") || "postgres";

  // Critical: force IPv4 resolution to avoid Render -> Supabase IPv6 ENETUNREACH
  const lookup = await dns.promises.lookup(host, { family: 4 });

  console.log("Initializing Prisma Client (Supabase host resolved to IPv4)");

  const pool = new Pool({
    host,
    // `hostaddr` bypasses DNS inside pg and forces the resolved IPv4 address.
    hostaddr: lookup.address,
    port,
    user,
    password,
    database,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });

  const adapter = new PrismaPg(pool);

  prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }

  return prismaInstance;
}

function ensurePrisma(): Promise<any> {
  if (prismaInstance) return Promise.resolve(prismaInstance);
  if (!prismaInitPromise) {
    prismaInitPromise = initPrisma().catch((err) => {
      // allow retry on next call if init failed
      prismaInitPromise = null;
      throw err;
    });
  }
  return prismaInitPromise;
}

// Deep lazy proxy:
// Allows calling prisma.newsArticle.findMany(...) while ensuring async init runs first.
function createLazyPrismaProxy(path: (string | symbol)[] = []): any {
  const dummy: any = () => undefined;

  return new Proxy(dummy, {
    get(_target, prop) {
      // Prevent Promise-like behavior
      if (prop === "then") return undefined;
      if (prop === Symbol.toStringTag) return "PrismaClient";
      return createLazyPrismaProxy([...path, prop]);
    },
    apply(_target, _thisArg, args) {
      return (async () => {
        const client = await ensurePrisma();
        if (path.length === 0) {
          throw new Error("Invalid Prisma call");
        }
        const parentPath = path.slice(0, -1);
        const fnName = path[path.length - 1];
        let parent: any = client;
        for (const p of parentPath) parent = parent[p as any];
        const fn = parent?.[fnName as any];
        if (typeof fn !== "function") {
          throw new Error(`Prisma path is not callable: ${String(fnName)}`);
        }
        return fn.apply(parent, args);
      })();
    },
  });
}

export const prisma = createLazyPrismaProxy();
