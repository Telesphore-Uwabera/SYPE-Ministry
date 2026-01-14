import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import * as adminRoutes from "./routes/admin";
import * as uploadRoutes from "./routes/upload";
import * as mediaUploadRoutes from "./routes/mediaUpload";
import * as youtubeRoutes from "./routes/youtube";

export function createServer() {
  const app = express();

  // Middleware - CORS Configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : process.env.NODE_ENV === "production"
    ? [] // In production, specify allowed origins
    : [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8082",
      ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // In development, allow localhost on any port
        if (process.env.NODE_ENV !== "production") {
          const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
          if (isLocalhost) {
            return callback(null, true);
          }
        }
        
        // Check against explicit allowed origins
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Serve static files from public directory
  app.use("/images", express.static(path.join(process.cwd(), "public", "images")));
  app.use("/media", express.static(path.join(process.cwd(), "public", "media")));
  app.use(express.static(path.join(process.cwd(), "public")));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Image Upload Routes
  app.post("/api/upload/image", uploadRoutes.uploadImage);
  app.post("/api/upload/images", uploadRoutes.uploadImages);

  // Media Upload Routes (Images, Videos, Documents)
  app.post("/api/upload/media", mediaUploadRoutes.uploadMedia);
  app.post("/api/upload/media/multiple", mediaUploadRoutes.uploadMultipleMedia);
  app.post("/api/upload/thumbnail", mediaUploadRoutes.uploadThumbnail);

  // Admin API Routes - Members
  app.get("/api/admin/members", adminRoutes.getMembers);
  app.get("/api/admin/members/:id", adminRoutes.getMember);
  app.post("/api/admin/members", adminRoutes.createMember);
  app.put("/api/admin/members/:id", adminRoutes.updateMember);
  app.delete("/api/admin/members/:id", adminRoutes.deleteMember);

  // Admin API Routes - News
  app.get("/api/admin/news", adminRoutes.getNews);
  app.get("/api/admin/news/:id", adminRoutes.getNewsArticle);
  app.post("/api/admin/news", adminRoutes.createNews);
  app.put("/api/admin/news/:id", adminRoutes.updateNews);
  app.delete("/api/admin/news/:id", adminRoutes.deleteNews);

  // Admin API Routes - Projects
  app.get("/api/admin/projects", adminRoutes.getProjects);
  app.get("/api/admin/projects/:id", adminRoutes.getProject);
  app.post("/api/admin/projects", adminRoutes.createProject);
  app.put("/api/admin/projects/:id", adminRoutes.updateProject);
  app.delete("/api/admin/projects/:id", adminRoutes.deleteProject);

  // Admin API Routes - Events
  app.get("/api/admin/events", adminRoutes.getEvents);
  app.get("/api/admin/events/:id", adminRoutes.getEvent);
  app.post("/api/admin/events", adminRoutes.createEvent);
  app.put("/api/admin/events/:id", adminRoutes.updateEvent);
  app.delete("/api/admin/events/:id", adminRoutes.deleteEvent);

  // Admin API Routes - Donations
  app.get("/api/admin/donations", adminRoutes.getDonations);
  app.get("/api/admin/donations/:id", adminRoutes.getDonation);
  app.post("/api/admin/donations", adminRoutes.createDonation);
  app.put("/api/admin/donations/:id", adminRoutes.updateDonation);
  app.delete("/api/admin/donations/:id", adminRoutes.deleteDonation);

  // Admin API Routes - FAQs
  app.get("/api/admin/faqs", adminRoutes.getFAQs);
  app.get("/api/admin/faqs/:id", adminRoutes.getFAQ);
  app.post("/api/admin/faqs", adminRoutes.createFAQ);
  app.put("/api/admin/faqs/:id", adminRoutes.updateFAQ);
  app.delete("/api/admin/faqs/:id", adminRoutes.deleteFAQ);

  // Admin API Routes - Media
  app.get("/api/admin/media", adminRoutes.getMedia);
  app.get("/api/admin/media/:id", adminRoutes.getMediaFile);
  app.post("/api/admin/media", adminRoutes.createMedia);
  app.put("/api/admin/media/:id", adminRoutes.updateMedia);
  app.delete("/api/admin/media/:id", adminRoutes.deleteMedia);

  // Admin API Routes - Books
  app.get("/api/admin/books", adminRoutes.getBooks);
  app.get("/api/admin/books/:id", adminRoutes.getBook);
  app.post("/api/admin/books", adminRoutes.createBook);
  app.put("/api/admin/books/:id", adminRoutes.updateBook);
  app.delete("/api/admin/books/:id", adminRoutes.deleteBook);
  app.post("/api/admin/books/:id/download", adminRoutes.trackBookDownload);

  // Email Subscription Routes (Public)
  app.post("/api/subscribe", adminRoutes.createSubscriber);
  app.post("/api/unsubscribe", adminRoutes.unsubscribe);

  // Admin API Routes - Email Subscribers
  app.get("/api/admin/subscribers", adminRoutes.getSubscribers);
  app.get("/api/admin/subscribers/:id", adminRoutes.getSubscriber);
  app.put("/api/admin/subscribers/:id", adminRoutes.updateSubscriber);
  app.delete("/api/admin/subscribers/:id", adminRoutes.deleteSubscriber);

  // Admin API Routes - Committee Members
  app.get("/api/admin/committee", adminRoutes.getCommitteeMembers);
  app.get("/api/admin/committee/:id", adminRoutes.getCommitteeMember);
  app.post("/api/admin/committee", adminRoutes.createCommitteeMember);
  app.put("/api/admin/committee/:id", adminRoutes.updateCommitteeMember);
  app.delete("/api/admin/committee/:id", adminRoutes.deleteCommitteeMember);

  // Public API Routes - Committee Members (for About page)
  app.get("/api/committee", adminRoutes.getCommitteeMembers);

  // Admin API Routes - Devotions
  app.get("/api/admin/devotions", adminRoutes.getDevotions);
  app.get("/api/admin/devotions/:id", adminRoutes.getDevotion);
  app.post("/api/admin/devotions", adminRoutes.createDevotion);
  app.put("/api/admin/devotions/:id", adminRoutes.updateDevotion);
  app.delete("/api/admin/devotions/:id", adminRoutes.deleteDevotion);

  // Public API Routes - Devotions (for Devotions page)
  app.get("/api/devotions", adminRoutes.getDevotions);

  // Admin API Routes - Analytics
  app.get("/api/admin/analytics", adminRoutes.getAnalytics);

  // Contact Submissions API (Public - for form submission)
  app.post("/api/contact", adminRoutes.createContactSubmission);

  // Admin API Routes - Contact Submissions
  app.get("/api/admin/contact", adminRoutes.getContactSubmissions);
  app.get("/api/admin/contact/:id", adminRoutes.getContactSubmission);
  app.put("/api/admin/contact/:id", adminRoutes.updateContactSubmission);
  app.delete("/api/admin/contact/:id", adminRoutes.deleteContactSubmission);

  // YouTube API Routes
  app.get("/api/youtube/latest", youtubeRoutes.getLatestVideos);
  app.get("/api/youtube/videos", youtubeRoutes.getLatestVideos);

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Error handling middleware
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    });
  });

  return app;
}
