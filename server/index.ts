import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as adminRoutes from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

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

  // Admin API Routes - Analytics
  app.get("/api/admin/analytics", adminRoutes.getAnalytics);

  return app;
}
