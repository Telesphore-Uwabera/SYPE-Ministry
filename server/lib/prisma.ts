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

  // Critical: force IPv4 resolution to avoid Render -> Supabase IPv6 ENETUNREACH.
  // Note: Node `pg` does not reliably honor a `hostaddr` option, so we connect to the IPv4
  // address as the host (bypasses DNS entirely) while keeping TLS SNI via `ssl.servername`.
  let ipv4Address: string | null = null;
  try {
    const lookup = await dns.promises.lookup(host, { family: 4 });
    ipv4Address = lookup.address;
  } catch (err) {
    console.warn("IPv4 DNS lookup failed; falling back to hostname for Postgres:", err);
  }

  console.log(
    `Initializing Prisma Client (Postgres host: ${host}${
      ipv4Address ? ` -> IPv4 ${ipv4Address}` : ""
    })`
  );

  const pool = new Pool({
    host: ipv4Address ?? host,
    port,
    user,
    password,
    database,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false, servername: host }
        : undefined,
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
