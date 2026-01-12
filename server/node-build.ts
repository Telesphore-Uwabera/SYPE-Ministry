import path from "path";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built client files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../client");

// Serve static files (for uploaded images/media)
app.use("/images", express.static(path.join(process.cwd(), "public", "images")));
app.use("/media", express.static(path.join(process.cwd(), "public", "media")));

// Note: Frontend is served separately on Netlify, so we don't need catch-all route

const server = app.listen(port, () => {
  console.log(`🚀 SYPE Ministry server running on port ${port}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`❤️  Health: http://localhost:${port}/health`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully`);
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error("⚠️ Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  shutdown("uncaughtException");
});
