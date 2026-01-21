import { RequestHandler, Request, Response } from "express";
import { Readable } from "stream";
import { Member, NewsArticle, Project, Event, Donation, FAQ, MediaFile, EmailCampaign, Book, EmailSubscriber, CommitteeMember, Devotion } from "../../client/types/admin";
import { connectMongo, isValidObjectId } from "../lib/mongoose";
import {
  BookModel,
  CommitteeMemberModel,
  ContactSubmissionModel,
  DevotionModel,
  FAQModel,
  DonationModel,
  EmailCampaignModel,
  EmailSubscriberModel,
  EventModel,
  MediaFileModel,
  MemberModel,
  NewsArticleModel,
  ProjectModel,
} from "../models/core";
import { sendMail } from "../lib/mailer";

// All data is persisted in MongoDB via Mongoose models.

function idOf(doc: any): string {
  return String(doc?._id ?? doc?.id ?? "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getAdminNotifyEmail(): string {
  return String(process.env.ADMIN_NOTIFY_EMAIL || process.env.CONTACT_EMAIL || "sypeministry@gmail.com").trim();
}

function assertTestEmailAuth(req: Request, res: Response): boolean {
  const expected = String(process.env.ADMIN_TEST_TOKEN || "").trim();
  if (!expected) {
    res.status(500).json({ error: "ADMIN_TEST_TOKEN is not configured on the server" });
    return false;
  }
  const provided = String(req.header("x-admin-test-token") || "").trim();
  if (!provided || provided !== expected) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}

// Test Email (Admin) - sends a real email using configured mailer.
export const sendTestEmail: RequestHandler = async (req, res) => {
  try {
    if (!assertTestEmailAuth(req, res)) return;

    const to = String(req.body?.to || "").trim();
    if (!to || !to.includes("@")) return res.status(400).json({ error: "Valid 'to' email is required" });

    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://sypeministry.org").trim().replace(/\/+$/, "");
    const when = new Date().toISOString();

    const subject = `Test email - ${siteName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 8px;">${escapeHtml(siteName)} - Test Email</h2>
        <p style="margin: 0 0 16px;">If you received this email, your mailing configuration is working.</p>
        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #ffffff;">
          <p style="margin: 0 0 6px;"><strong>Sent at:</strong> ${escapeHtml(when)}</p>
          <p style="margin: 0;"><strong>Website:</strong> <a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a></p>
        </div>
      </div>
    `;
    const text = `Test email - ${siteName}\n\nIf you received this email, your mailing configuration is working.\nSent at: ${when}\nWebsite: ${siteUrl}\n`;

    const { messageId } = await sendMail({ to, subject, html, text });
    res.json({ ok: true, messageId });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    res.status(500).json({ error: error?.message || "Failed to send test email" });
  }
};

// Members API
export const getMembers: RequestHandler = async (req, res) => {
  try {
    await connectMongo();
    const result = await MemberModel.find().sort({ joinDate: -1 }).exec();
    res.json(
      result.map((m: any) => ({
        id: idOf(m),
        name: m.name,
        email: m.email,
        phone: m.phone || "",
        role: m.role,
        status: m.status,
        joinDate: m.joinDate ? new Date(m.joinDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        department: m.department || "",
        notes: m.notes || "",
      }))
    );
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

export const getMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const member = await MemberModel.findById(id).exec();
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json({
      id: idOf(member),
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      role: member.role,
      status: member.status,
      joinDate: member.joinDate ? new Date(member.joinDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      department: member.department || "",
      notes: member.notes || "",
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ error: "Failed to fetch member" });
  }
};

export const createMember: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, role, status, joinDate, department, notes } = req.body ?? {};
    if (!name || !email || !role || !status) {
      return res.status(400).json({ error: "name, email, role, and status are required" });
    }
    await connectMongo();
    const created = await MemberModel.create({
      name,
      email,
      phone: phone || "",
      role,
      status,
      joinDate: joinDate ? new Date(joinDate) : new Date(),
      department: department || "",
      notes: notes || "",
    });
    res.status(201).json({
      id: idOf(created),
      name: created.name,
      email: created.email,
      phone: created.phone || "",
      role: created.role,
      status: created.status,
      joinDate: created.joinDate ? new Date(created.joinDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      department: created.department || "",
      notes: created.notes || "",
    });
  } catch (error: any) {
    console.error("Error creating member:", error);
    if (error?.code === 11000) return res.status(400).json({ error: "Member with this email already exists" });
    res.status(500).json({ error: "Failed to create member" });
  }
};

export const updateMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const { name, email, phone, role, status, joinDate, department, notes } = req.body ?? {};
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (joinDate !== undefined) updateData.joinDate = new Date(joinDate);
    if (department !== undefined) updateData.department = department;
    if (notes !== undefined) updateData.notes = notes;

    await connectMongo();
    const updated = await MemberModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) return res.status(404).json({ error: "Member not found" });
    res.json({
      id: idOf(updated),
      name: updated.name,
      email: updated.email,
      phone: updated.phone || "",
      role: updated.role,
      status: updated.status,
      joinDate: updated.joinDate ? new Date(updated.joinDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      department: updated.department || "",
      notes: updated.notes || "",
    });
  } catch (error: any) {
    console.error("Error updating member:", error);
    if (error?.code === 11000) return res.status(400).json({ error: "Member with this email already exists" });
    res.status(500).json({ error: "Failed to update member" });
  }
};

export const deleteMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await MemberModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Member not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: "Failed to delete member" });
  }
};

// News API
export const getNews: RequestHandler = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    console.log("Fetching news articles, limit:", limit);

    await connectMongo();
    const query = NewsArticleModel.find().sort({ publishDate: -1 });
    if (limit) query.limit(limit);
    const result = await query.exec();

    console.log(`Found ${result.length} news articles in database`);

    // Convert DB format to API format
    const formattedResult = result.map((article) => ({
      id: idOf(article),
      title: article.title,
      author: article.author,
      publishDate: new Date(article.publishDate).toISOString(),
      excerpt: article.excerpt,
      body: article.body,
      image: article.image || undefined,
      featured: article.featured,
      category: article.category || undefined,
      tags: article.tags || [],
      views: article.views,
      createdAt: (article.createdAt ? new Date(article.createdAt) : new Date()).toISOString(),
    }));

    console.log(`Returning ${formattedResult.length} formatted news articles`);
    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching news:", error);
    console.error("Error details:", error.message, error.stack);
    res.status(500).json({
      error: "Failed to fetch news",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const getNewsArticle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const article = await NewsArticleModel.findById(id).exec();

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({
      id: idOf(article),
      title: article.title,
      author: article.author,
      publishDate: new Date(article.publishDate).toISOString(),
      excerpt: article.excerpt,
      body: article.body,
      image: article.image || undefined,
      featured: article.featured,
      category: article.category || undefined,
      tags: article.tags || [],
      views: article.views,
      createdAt: (article.createdAt ? new Date(article.createdAt) : new Date()).toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching news article:", error);
    res.status(500).json({ error: "Failed to fetch news article" });
  }
};

export const createNews: RequestHandler = async (req, res) => {
  try {
    const { title, author, publishDate, excerpt, body, image, featured, category, tags } = req.body;

    if (!title || !author || !excerpt || !body) {
      return res.status(400).json({ error: "Title, author, excerpt, and body are required" });
    }

    await connectMongo();
    const newArticle = await NewsArticleModel.create({
      title,
      author,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      excerpt,
      body,
      image: image || undefined,
      featured: !!featured,
      category: category || undefined,
      tags: tags || [],
      views: 0,
    });

    res.status(201).json({
      id: idOf(newArticle),
      title: newArticle.title,
      author: newArticle.author,
      publishDate: new Date(newArticle.publishDate).toISOString(),
      excerpt: newArticle.excerpt,
      body: newArticle.body,
      image: newArticle.image || undefined,
      featured: newArticle.featured,
      category: newArticle.category || undefined,
      tags: newArticle.tags || [],
      views: newArticle.views,
      createdAt: (newArticle.createdAt ? new Date(newArticle.createdAt) : new Date()).toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating news article:", error);
    if (error?.code === 11000) {
      return res.status(400).json({ error: "Duplicate news article" });
    }
    res.status(500).json({
      error: "Failed to create news article",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const updateNews: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publishDate, excerpt, body, image, featured, category, tags, views } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (publishDate !== undefined) updateData.publishDate = new Date(publishDate);
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (body !== undefined) updateData.body = body;
    if (image !== undefined) updateData.image = image || undefined;
    if (featured !== undefined) updateData.featured = featured;
    if (category !== undefined) updateData.category = category || undefined;
    if (tags !== undefined) updateData.tags = tags || [];
    if (views !== undefined) updateData.views = views;

    await connectMongo();
    const updatedArticle = await NewsArticleModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedArticle) return res.status(404).json({ error: "Article not found" });

    res.json({
      id: idOf(updatedArticle),
      title: updatedArticle.title,
      author: updatedArticle.author,
      publishDate: new Date(updatedArticle.publishDate).toISOString(),
      excerpt: updatedArticle.excerpt,
      body: updatedArticle.body,
      image: updatedArticle.image || undefined,
      featured: updatedArticle.featured,
      category: updatedArticle.category || undefined,
      tags: updatedArticle.tags || [],
      views: updatedArticle.views,
      createdAt: (updatedArticle.createdAt ? new Date(updatedArticle.createdAt) : new Date()).toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating news article:", error);
    res.status(500).json({ error: "Failed to update news article" });
  }
};

export const deleteNews: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await NewsArticleModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Article not found" });
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting news article:", error);
    res.status(500).json({ error: "Failed to delete news article" });
  }
};

// Projects API
export const getProjects: RequestHandler = async (req, res) => {
  try {
    console.log("Fetching projects from database");

    await connectMongo();
    const result = await ProjectModel.find().sort({ createdAt: -1 }).exec();

    console.log(`Found ${result.length} projects in database`);

    const formattedResult = result.map((project) => ({
      id: idOf(project),
      name: project.name,
      category: project.category,
      topic: project.topic,
      description: project.description,
      distribution: project.distribution,
      status: project.status,
      year: project.year,
      teamMembers: project.teamMembers || [],
      startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : undefined,
      endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : undefined,
      budget: project.budget || undefined,
      createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString(),
    }));

    console.log(`Returning ${formattedResult.length} formatted projects`);
    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    console.error("Error details:", error.message, error.stack);
    console.error("Error code:", error.code);
    res.status(500).json({
      error: "Failed to fetch projects",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const getProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const project = await ProjectModel.findById(id).exec();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({
      id: idOf(project),
      name: project.name,
      category: project.category,
      topic: project.topic,
      description: project.description,
      distribution: project.distribution,
      status: project.status,
      year: project.year,
      teamMembers: project.teamMembers || [],
      startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : undefined,
      endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : undefined,
      budget: project.budget || undefined,
      createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const createProject: RequestHandler = async (req, res) => {
  try {
    const { name, category, topic, description, distribution, status, year, teamMembers, startDate, endDate, budget } = req.body;

    if (!name || !category || !topic || !description || !distribution || !status || !year) {
      return res.status(400).json({ error: "Name, category, topic, description, distribution, status, and year are required" });
    }

    await connectMongo();
    const newProject = await ProjectModel.create({
      name,
      category,
      topic,
      description,
      distribution,
      status,
      year,
      teamMembers: teamMembers || [],
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      budget: budget ?? undefined,
    });

    res.status(201).json({
      id: idOf(newProject),
      name: newProject.name,
      category: newProject.category,
      topic: newProject.topic,
      description: newProject.description,
      distribution: newProject.distribution,
      status: newProject.status,
      year: newProject.year,
      teamMembers: newProject.teamMembers || [],
      startDate: newProject.startDate ? new Date(newProject.startDate).toISOString().split("T")[0] : undefined,
      endDate: newProject.endDate ? new Date(newProject.endDate).toISOString().split("T")[0] : undefined,
      budget: newProject.budget || undefined,
      createdAt: newProject.createdAt ? new Date(newProject.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating project:", error);
    if (error?.code === 11000) {
      return res.status(400).json({ error: "Duplicate project" });
    }
    res.status(500).json({
      error: "Failed to create project",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const updateProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, topic, description, distribution, status, year, teamMembers, startDate, endDate, budget } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (topic !== undefined) updateData.topic = topic;
    if (description !== undefined) updateData.description = description;
    if (distribution !== undefined) updateData.distribution = distribution;
    if (status !== undefined) updateData.status = status;
    if (year !== undefined) updateData.year = year;
    if (teamMembers !== undefined) updateData.teamMembers = teamMembers || [];
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : undefined;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : undefined;
    if (budget !== undefined) updateData.budget = budget ?? undefined;

    await connectMongo();
    const updatedProject = await ProjectModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedProject) return res.status(404).json({ error: "Project not found" });

    res.json({
      id: idOf(updatedProject),
      name: updatedProject.name,
      category: updatedProject.category,
      topic: updatedProject.topic,
      description: updatedProject.description,
      distribution: updatedProject.distribution,
      status: updatedProject.status,
      year: updatedProject.year,
      teamMembers: updatedProject.teamMembers || [],
      startDate: updatedProject.startDate ? new Date(updatedProject.startDate).toISOString().split("T")[0] : undefined,
      endDate: updatedProject.endDate ? new Date(updatedProject.endDate).toISOString().split("T")[0] : undefined,
      budget: updatedProject.budget || undefined,
      createdAt: updatedProject.createdAt ? new Date(updatedProject.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await ProjectModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Project not found" });
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// Events API
export const getEvents: RequestHandler = async (req, res) => {
  try {
    await connectMongo();
    const status = (req.query.status as string | undefined) || undefined;
    const upcoming = req.query.upcoming === "true";
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const where: any = {};
    if (status) where.status = status;
    if (upcoming) {
      where.status = "upcoming";
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      where.date = { $gte: startOfToday };
    }

    const sort =
      where.status === "upcoming"
        ? { date: 1 } // soonest first
        : { date: -1 }; // latest first

    const query = EventModel.find(where).sort(sort);
    if (limit && Number.isFinite(limit)) query.limit(limit);
    const result = await query.exec();
    res.json(
      result.map((e: any) => ({
        id: idOf(e),
        title: e.title,
        description: e.description,
        date: e.date ? new Date(e.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        time: e.time,
        location: e.location,
        category: e.category,
        rsvpRequired: !!e.rsvpRequired,
        rsvpCount: e.rsvpCount || 0,
        maxAttendees: e.maxAttendees,
        attendees: e.attendees || [],
        status: e.status,
      }))
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const getEvent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const event = await EventModel.findById(id).exec();
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({
      id: idOf(event),
      title: event.title,
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      category: event.category,
      rsvpRequired: !!event.rsvpRequired,
      rsvpCount: event.rsvpCount || 0,
      maxAttendees: event.maxAttendees,
      attendees: event.attendees || [],
      status: event.status,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

export const createEvent: RequestHandler = async (req, res) => {
  try {
    const { title, description, date, time, location, category, rsvpRequired, maxAttendees, status } = req.body ?? {};
    if (!title || !description || !date || !time || !location || !category || !status) {
      return res.status(400).json({ error: "title, description, date, time, location, category, and status are required" });
    }
    await connectMongo();
    const created = await EventModel.create({
      title,
      description,
      date: new Date(date),
      time,
      location,
      category,
      rsvpRequired: !!rsvpRequired,
      maxAttendees: maxAttendees ?? undefined,
      status,
      rsvpCount: 0,
      attendees: [],
    });
    res.status(201).json({
      id: idOf(created),
      title: created.title,
      description: created.description,
      date: new Date(created.date).toISOString().split("T")[0],
      time: created.time,
      location: created.location,
      category: created.category,
      rsvpRequired: !!created.rsvpRequired,
      rsvpCount: created.rsvpCount || 0,
      maxAttendees: created.maxAttendees,
      attendees: created.attendees || [],
      status: created.status,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const updateEvent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const { title, description, date, time, location, category, rsvpRequired, maxAttendees, status, attendees, rsvpCount } = req.body ?? {};
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (category !== undefined) updateData.category = category;
    if (rsvpRequired !== undefined) updateData.rsvpRequired = !!rsvpRequired;
    if (maxAttendees !== undefined) updateData.maxAttendees = maxAttendees;
    if (status !== undefined) updateData.status = status;
    if (attendees !== undefined) updateData.attendees = attendees || [];
    if (rsvpCount !== undefined) updateData.rsvpCount = rsvpCount;

    await connectMongo();
    const updated = await EventModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json({
      id: idOf(updated),
      title: updated.title,
      description: updated.description,
      date: updated.date ? new Date(updated.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      time: updated.time,
      location: updated.location,
      category: updated.category,
      rsvpRequired: !!updated.rsvpRequired,
      rsvpCount: updated.rsvpCount || 0,
      maxAttendees: updated.maxAttendees,
      attendees: updated.attendees || [],
      status: updated.status,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await EventModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// Donations API
export const getDonations: RequestHandler = async (req, res) => {
  try {
    await connectMongo();
    const result = await DonationModel.find().sort({ date: -1 }).exec();
    res.json(
      result.map((d: any) => ({
        id: idOf(d),
        donorName: d.donorName,
        donorEmail: d.donorEmail,
        donorPhone: d.donorPhone || "",
        amount: d.amount,
        amountPaid: Number(d.amountPaid || 0),
        currency: d.currency || "RWF",
        date: d.date ? new Date(d.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        type: d.type,
        paymentMethod: d.paymentMethod || "",
        paymentStatus: d.paymentStatus || "unpaid",
        receiptSent: !!d.receiptSent,
        notes: d.notes || "",
        projectId: d.projectId || "",
      }))
    );
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

export const getDonation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const donation = await DonationModel.findById(id).exec();
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    res.json({
      id: idOf(donation),
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      donorPhone: donation.donorPhone || "",
      amount: donation.amount,
      amountPaid: Number(donation.amountPaid || 0),
      currency: donation.currency || "RWF",
      date: donation.date ? new Date(donation.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      type: donation.type,
      paymentMethod: donation.paymentMethod || "",
      paymentStatus: donation.paymentStatus || "unpaid",
      receiptSent: !!donation.receiptSent,
      notes: donation.notes || "",
      projectId: donation.projectId || "",
    });
  } catch (error) {
    console.error("Error fetching donation:", error);
    res.status(500).json({ error: "Failed to fetch donation" });
  }
};

export const createDonation: RequestHandler = async (req, res) => {
  try {
    const { donorName, donorEmail, donorPhone, amount, amountPaid, currency, date, type, paymentMethod, paymentStatus, projectId, notes, receiptSent } = req.body ?? {};
    if (!donorName || !donorEmail || amount === undefined || amount === null || !type || !paymentMethod) {
      return res.status(400).json({ error: "Donor name, email, amount, type, and payment method are required" });
    }

    const baseAmount = Number(amount) || 0;
    const status = String(paymentStatus || "unpaid");
    let paid = Number(amountPaid || 0) || 0;
    if (status === "paid") paid = baseAmount;
    if (status === "unpaid") paid = 0;
    if (paid < 0 || paid > baseAmount) {
      return res.status(400).json({ error: "amountPaid must be between 0 and amount" });
    }

    await connectMongo();
    const created = await DonationModel.create({
      donorName,
      donorEmail,
      donorPhone: donorPhone || "",
      amount: baseAmount,
      amountPaid: paid,
      currency: currency || "RWF",
      date: date ? new Date(date) : new Date(),
      type,
      paymentMethod: String(paymentMethod),
      paymentStatus: status,
      projectId: projectId || "",
      receiptSent: !!receiptSent,
      notes: notes || "",
    });
    res.status(201).json({
      id: idOf(created),
      donorName: created.donorName,
      donorEmail: created.donorEmail,
      donorPhone: created.donorPhone || "",
      amount: created.amount,
      amountPaid: Number(created.amountPaid || 0),
      currency: created.currency || "RWF",
      date: created.date ? new Date(created.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      type: created.type,
      paymentMethod: created.paymentMethod || "",
      paymentStatus: created.paymentStatus || "unpaid",
      projectId: created.projectId || "",
      receiptSent: !!created.receiptSent,
      notes: created.notes || "",
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Failed to create donation" });
  }
};

// Public Donations API (used by the public donation form)
// Sends:
// - Acknowledgement email to the donor
// - Notification email to admins
export const createPublicDonation: RequestHandler = async (req, res) => {
  try {
    const { donorName, donorEmail, donorPhone, amount, amountPaid, currency, date, type, paymentMethod, paymentStatus, projectId, notes } = req.body ?? {};
    if (!donorName || !donorEmail || amount === undefined || amount === null || !type || !paymentMethod) {
      return res.status(400).json({ error: "Donor name, email, amount, type, and payment method are required" });
    }

    const baseAmount = Number(amount) || 0;
    const status = String(paymentStatus || "unpaid");
    let paid = Number(amountPaid || 0) || 0;
    if (status === "paid") paid = baseAmount;
    if (status === "unpaid") paid = 0;
    if (paid < 0 || paid > baseAmount) {
      return res.status(400).json({ error: "amountPaid must be between 0 and amount" });
    }

    await connectMongo();
    const created = await DonationModel.create({
      donorName,
      donorEmail,
      donorPhone: donorPhone || "",
      amount: baseAmount,
      amountPaid: paid,
      currency: currency || "RWF",
      date: date ? new Date(date) : new Date(),
      type,
      paymentMethod: String(paymentMethod),
      paymentStatus: status,
      projectId: projectId || "",
      receiptSent: false,
      notes: notes || "",
    });

    // Fire-and-forget emails (do not fail donation creation if email fails)
    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://sypeministry.org").trim().replace(/\/+$/, "");
    const contactEmail = (process.env.CONTACT_EMAIL || "sypeministry@gmail.com").trim();
    const contactPhone = (process.env.CONTACT_PHONE || "").trim();
    const adminNotifyEmail = getAdminNotifyEmail();

    const donationId = idOf(created);
    const donorEmailTrim = String(donorEmail || "").trim();
    const donorNameTrim = String(donorName || "").trim();
    const currencyText = String(created.currency || "RWF");

    const donorSubject = `Thank you for your donation - ${siteName}`;
    const donorHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 8px;">${escapeHtml(siteName)} - Donation Received</h2>
        <p style="margin: 0 0 16px;">Dear ${escapeHtml(donorNameTrim || "Friend in Christ")},</p>
        <p style="margin: 0 0 16px;">
          <strong>Grace and peace to you!</strong> Thank you for partnering with us in God's work through your generous donation. 
          <em>"God loves a cheerful giver"</em> (2 Corinthians 9:7), and we are blessed by your support of our ministry.
        </p>
        <p style="margin: 0 0 16px;">
          We have received your donation submission and will confirm payment shortly. Your contribution will help us continue 
          equipping young professionals for evangelism and spreading the gospel message.
        </p>
        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #f9fafb;">
          <p style="margin: 0 0 6px;"><strong>Reference #:</strong> ${escapeHtml(donationId)}</p>
          <p style="margin: 0 0 6px;"><strong>Amount:</strong> ${escapeHtml(baseAmount.toLocaleString())} ${escapeHtml(currencyText)}</p>
          <p style="margin: 0 0 6px;"><strong>Payment method:</strong> ${escapeHtml(String(paymentMethod))}</p>
          <p style="margin: 0;"><strong>Status:</strong> ${escapeHtml(status)}</p>
        </div>
        <p style="margin: 16px 0 0;">
          <strong>Note:</strong> This is not an official receipt. An official receipt will be sent after payment is confirmed by our administrators.
        </p>
        <p style="margin: 16px 0 0;">
          <em>"Whatever you do, work at it with all your heart, as working for the Lord"</em> (Colossians 3:23). 
          We pray that God will bless you abundantly for your faithfulness and generosity.
        </p>
        <p style="margin: 16px 0 0;">
          If you have any questions, please reach out to us at
          <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a>
          ${contactPhone ? ` or ${escapeHtml(contactPhone)}` : ""}.
        </p>
        <p style="margin: 8px 0 0;">
          Visit us: <a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a>
        </p>
        <p style="margin: 24px 0 0;">
          May God's grace be with you,<br />
          <strong>${escapeHtml(siteName)}</strong><br />
          <em>"Go therefore and make disciples of all nations"</em> - Matthew 28:19
        </p>
      </div>
    `;
    const donorText = `Donation submission received - ${siteName}
Reference #: ${donationId}
Amount: ${baseAmount.toLocaleString()} ${currencyText}
Payment method: ${String(paymentMethod)}
Status: ${status}

Note: This is not an official receipt. An official receipt will be sent after payment is confirmed.

Questions? Contact: ${contactEmail}${contactPhone ? `, ${contactPhone}` : ""}
Website: ${siteUrl}
`;

    const adminSubject = `New donation submission - ${siteName}`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 8px;">New Donation Submission</h2>
        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #ffffff;">
          <p style="margin: 0 0 6px;"><strong>Reference #:</strong> ${escapeHtml(donationId)}</p>
          <p style="margin: 0 0 6px;"><strong>Donor:</strong> ${escapeHtml(donorNameTrim)} (${escapeHtml(donorEmailTrim)})</p>
          <p style="margin: 0 0 6px;"><strong>Phone:</strong> ${escapeHtml(String(donorPhone || ""))}</p>
          <p style="margin: 0 0 6px;"><strong>Amount:</strong> ${escapeHtml(baseAmount.toLocaleString())} ${escapeHtml(currencyText)}</p>
          <p style="margin: 0 0 6px;"><strong>Type:</strong> ${escapeHtml(String(type))}</p>
          <p style="margin: 0 0 6px;"><strong>Payment method:</strong> ${escapeHtml(String(paymentMethod))}</p>
          <p style="margin: 0 0 6px;"><strong>Status:</strong> ${escapeHtml(status)}</p>
          <p style="margin: 0;"><strong>Project:</strong> ${escapeHtml(String(projectId || ""))}</p>
        </div>
        ${notes ? `<p style="margin: 16px 0 0;"><strong>Notes:</strong><br />${escapeHtml(String(notes))}</p>` : ""}
      </div>
    `;
    const adminText = `New donation submission - ${siteName}
Reference #: ${donationId}
Donor: ${donorNameTrim} (${donorEmailTrim})
Phone: ${String(donorPhone || "")}
Amount: ${baseAmount.toLocaleString()} ${currencyText}
Type: ${String(type)}
Payment method: ${String(paymentMethod)}
Status: ${status}
Project: ${String(projectId || "")}
${notes ? `Notes: ${String(notes)}` : ""}
`;

    const mailPromises: Promise<any>[] = [];
    if (adminNotifyEmail) {
      mailPromises.push(
        sendMail({
          to: adminNotifyEmail,
          subject: adminSubject,
          html: adminHtml,
          text: adminText,
          replyTo: donorEmailTrim || undefined,
        })
      );
    }
    if (donorEmailTrim) {
      mailPromises.push(
        sendMail({
          to: donorEmailTrim,
          subject: donorSubject,
          html: donorHtml,
          text: donorText,
          replyTo: contactEmail || undefined,
        })
      );
    }
    if (mailPromises.length) {
      await Promise.allSettled(mailPromises);
    }

    res.status(201).json({
      id: idOf(created),
      donorName: created.donorName,
      donorEmail: created.donorEmail,
      donorPhone: created.donorPhone || "",
      amount: created.amount,
      amountPaid: Number(created.amountPaid || 0),
      currency: created.currency || "RWF",
      date: created.date ? new Date(created.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      type: created.type,
      paymentMethod: created.paymentMethod || "",
      paymentStatus: created.paymentStatus || "unpaid",
      projectId: created.projectId || "",
      receiptSent: !!created.receiptSent,
      notes: created.notes || "",
    });
  } catch (error) {
    console.error("Error creating public donation:", error);
    res.status(500).json({ error: "Failed to create donation" });
  }
};

export const updateDonation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const { donorName, donorEmail, donorPhone, amount, amountPaid, currency, date, type, paymentMethod, paymentStatus, projectId, notes, receiptSent } = req.body ?? {};

    await connectMongo();

    const existing = await DonationModel.findById(id).exec();
    if (!existing) return res.status(404).json({ error: "Donation not found" });

    const baseAmount = amount !== undefined ? Number(amount) || 0 : Number(existing.amount || 0);
    const nextStatus = paymentStatus !== undefined ? String(paymentStatus) : String(existing.paymentStatus || "unpaid");

    let nextPaid = amountPaid !== undefined ? Number(amountPaid) || 0 : Number(existing.amountPaid || 0);
    if (nextStatus === "paid") nextPaid = baseAmount;
    if (nextStatus === "unpaid") nextPaid = 0;
    if (nextPaid < 0 || nextPaid > baseAmount) {
      return res.status(400).json({ error: "amountPaid must be between 0 and amount" });
    }

    const updateData: any = {};
    if (donorName !== undefined) updateData.donorName = donorName;
    if (donorEmail !== undefined) updateData.donorEmail = donorEmail;
    if (donorPhone !== undefined) updateData.donorPhone = donorPhone || "";
    if (amount !== undefined) updateData.amount = baseAmount;
    if (currency !== undefined) updateData.currency = currency;
    if (date !== undefined) updateData.date = new Date(date);
    if (type !== undefined) updateData.type = type;
    if (paymentMethod !== undefined) {
      if (!paymentMethod) return res.status(400).json({ error: "paymentMethod is required" });
      updateData.paymentMethod = String(paymentMethod);
    }
    if (paymentStatus !== undefined) updateData.paymentStatus = String(paymentStatus);
    if (projectId !== undefined) updateData.projectId = projectId;
    if (notes !== undefined) updateData.notes = notes;
    if (receiptSent !== undefined) updateData.receiptSent = !!receiptSent;

    updateData.amountPaid = nextPaid;

    const updated = await DonationModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) return res.status(404).json({ error: "Donation not found" });
    res.json({
      id: idOf(updated),
      donorName: updated.donorName,
      donorEmail: updated.donorEmail,
      donorPhone: updated.donorPhone || "",
      amount: updated.amount,
      amountPaid: Number(updated.amountPaid || 0),
      currency: updated.currency || "RWF",
      date: updated.date ? new Date(updated.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      type: updated.type,
      paymentMethod: updated.paymentMethod || "",
      paymentStatus: updated.paymentStatus || "unpaid",
      projectId: updated.projectId || "",
      receiptSent: !!updated.receiptSent,
      notes: updated.notes || "",
    });
  } catch (error) {
    console.error("Error updating donation:", error);
    res.status(500).json({ error: "Failed to update donation" });
  }
};

export const deleteDonation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await DonationModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Donation not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ error: "Failed to delete donation" });
  }
};

export const sendDonationReceipt: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    await connectMongo();
    const donation = await DonationModel.findById(id).exec();
    if (!donation) return res.status(404).json({ error: "Donation not found" });

    const donorEmail = String(donation.donorEmail || "").trim();
    const donorName = String(donation.donorName || "").trim();
    if (!donorEmail) return res.status(400).json({ error: "Donor email is missing" });

    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://sypeministry.org").trim().replace(/\/+$/, "");
    const contactEmail = (process.env.CONTACT_EMAIL || "sypeministry@gmail.com").trim();
    const contactPhone = (process.env.CONTACT_PHONE || "").trim();

    const receiptNo = idOf(donation);
    const amount = Number(donation.amount || 0);
    const amountPaid = Number(donation.amountPaid || 0);
    const currency = String(donation.currency || "RWF");
    const donationDate = donation.date ? new Date(donation.date) : new Date();
    const donationDateText = donationDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const status = String(donation.paymentStatus || "unpaid");
    const received = status === "paid" ? amount : status === "installment" ? amountPaid : 0;
    const remaining = Math.max(0, amount - received);

    const subject = `Donation Receipt - ${siteName}`;
    const safeName = escapeHtml(donorName || "Donor");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 8px;">${escapeHtml(siteName)} - Official Donation Receipt</h2>
        <p style="margin: 0 0 16px;">Dear ${safeName},</p>
        <p style="margin: 0 0 16px;">
          <strong>May God bless you abundantly!</strong> Thank you for your generous contribution to our ministry. 
          <em>"Bring the whole tithe into the storehouse... and see if I will not throw open the floodgates of heaven 
          and pour out so much blessing"</em> (Malachi 3:10).
        </p>
        <p style="margin: 0 0 16px;">
          Your partnership in spreading the gospel and equipping young professionals for evangelism is deeply appreciated. 
          This is your official receipt for tax and record-keeping purposes.
        </p>

        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #f9fafb;">
          <p style="margin: 0 0 6px;"><strong>Receipt #:</strong> ${escapeHtml(receiptNo)}</p>
          <p style="margin: 0 0 6px;"><strong>Date:</strong> ${escapeHtml(donationDateText)}</p>
          <p style="margin: 0 0 6px;"><strong>Amount:</strong> ${escapeHtml(amount.toLocaleString())} ${escapeHtml(currency)}</p>
          <p style="margin: 0 0 6px;"><strong>Received:</strong> ${escapeHtml(received.toLocaleString())} ${escapeHtml(currency)}</p>
          <p style="margin: 0 0 6px;"><strong>Remaining:</strong> ${escapeHtml(remaining.toLocaleString())} ${escapeHtml(currency)}</p>
          <p style="margin: 0 0 6px;"><strong>Donation type:</strong> ${escapeHtml(String(donation.type || ""))}</p>
          <p style="margin: 0;"><strong>Payment status:</strong> ${escapeHtml(String(donation.paymentStatus || ""))}</p>
        </div>

        <p style="margin: 16px 0 0;">
          We pray that the Lord will multiply your seed for sowing and increase your harvest of righteousness (2 Corinthians 9:10). 
          May His grace and favor rest upon you and your family.
        </p>
        <p style="margin: 16px 0 0;">
          If you have any questions, please contact us at
          <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a>
          ${contactPhone ? ` or ${escapeHtml(contactPhone)}` : ""}.
        </p>
        <p style="margin: 8px 0 0;">
          Visit us: <a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a>
        </p>
        <p style="margin: 24px 0 0;">
          In Christ's service,<br />
          <strong>${escapeHtml(siteName)}</strong><br />
          <em>"Freely you have received; freely give"</em> - Matthew 10:8
        </p>
      </div>
    `;

    const text = `Donation Receipt - ${siteName}
Receipt #: ${receiptNo}
Date: ${donationDateText}
Amount: ${amount.toLocaleString()} ${currency}
Received: ${received.toLocaleString()} ${currency}
Remaining: ${remaining.toLocaleString()} ${currency}
Donation type: ${String(donation.type || "")}
Payment status: ${String(donation.paymentStatus || "")}

Questions? Contact: ${contactEmail}${contactPhone ? `, ${contactPhone}` : ""}
Website: ${siteUrl}
`;

    const { messageId } = await sendMail({
      to: donorEmail,
      subject,
      html,
      text,
      replyTo: contactEmail || undefined,
    });

    // Mark as sent only after successful email send
    donation.receiptSent = true;
    await donation.save();

    res.json({ ok: true, messageId });
  } catch (error: any) {
    console.error("Error sending donation receipt:", error);
    res.status(500).json({
      error: error?.message || "Failed to send receipt",
      code: error?.code,
      responseCode: error?.responseCode,
    });
  }
};

// FAQs API
export const getFAQs: RequestHandler = async (req, res) => {
  try {
    await connectMongo();
    const result = await FAQModel.find().sort({ category: 1, order: 1 }).exec();

    const formattedResult = result.map((faq) => ({
      id: idOf(faq),
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      createdAt: faq.createdAt ? new Date(faq.createdAt).toISOString() : new Date().toISOString(),
    }));

    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

export const getFAQ: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const faq = await FAQModel.findById(id).exec();

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.json({
      id: idOf(faq),
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      createdAt: faq.createdAt ? new Date(faq.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching FAQ:", error);
    res.status(500).json({ error: "Failed to fetch FAQ" });
  }
};

export const createFAQ: RequestHandler = async (req, res) => {
  try {
    const { category, question, answer, order } = req.body;

    if (!category || !question || !answer) {
      return res.status(400).json({ error: "Category, question, and answer are required" });
    }

    await connectMongo();
    const newFAQ = await FAQModel.create({
      category,
      question,
      answer,
      order: order || 0,
    });

    res.status(201).json({
      id: idOf(newFAQ),
      category: newFAQ.category,
      question: newFAQ.question,
      answer: newFAQ.answer,
      order: newFAQ.order,
      createdAt: newFAQ.createdAt ? new Date(newFAQ.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    if (error?.code === 11000) {
      return res.status(400).json({ error: "Duplicate FAQ" });
    }
    res.status(500).json({
      error: "Failed to create FAQ",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const updateFAQ: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer, order } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const updateData: any = {};
    if (category !== undefined) updateData.category = category;
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (order !== undefined) updateData.order = order;

    await connectMongo();
    const updatedFAQ = await FAQModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedFAQ) return res.status(404).json({ error: "FAQ not found" });

    res.json({
      id: idOf(updatedFAQ),
      category: updatedFAQ.category,
      question: updatedFAQ.question,
      answer: updatedFAQ.answer,
      order: updatedFAQ.order,
      createdAt: updatedFAQ.createdAt ? new Date(updatedFAQ.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
};

export const deleteFAQ: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await FAQModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "FAQ not found" });
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
};

// Media API
export const getMedia: RequestHandler = async (req, res) => {
  try {
    await connectMongo();
    const category = req.query.category as string | undefined;
    const type = req.query.type as string | undefined;

    const where: any = {};
    if (type && type !== "all") where.type = type;
    if (category && category !== "all") {
      const categories = category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      // match any of the categories loosely (exact or contains) - case-insensitive
      where.$or = categories.map((c) => ({
        category: { $regex: c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" },
      }));
    }

    const result = await MediaFileModel.find(where).sort({ uploadDate: -1, createdAt: -1 }).exec();
    res.json(
      result.map((m: any) => ({
        id: idOf(m),
        name: m.name,
        type: m.type,
        url: m.url,
        size: m.size,
        uploadDate: m.uploadDate ? new Date(m.uploadDate).toISOString() : new Date().toISOString(),
        category: m.category || undefined,
        description: m.description || undefined,
        tags: m.tags || [],
        thumbnail: m.thumbnail || undefined,
        youtubeUrl: m.youtubeUrl || undefined,
      }))
    );
  } catch (error) {
    console.error("Error fetching media files:", error);
    res.status(500).json({ error: "Failed to fetch media files" });
  }
};

export const getMediaFile: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const file = await MediaFileModel.findById(id).exec();
    if (!file) return res.status(404).json({ error: "Media file not found" });
    res.json({
      id: idOf(file),
      name: file.name,
      type: file.type,
      url: file.url,
      size: file.size,
      uploadDate: file.uploadDate ? new Date(file.uploadDate).toISOString() : new Date().toISOString(),
      category: file.category || undefined,
      description: file.description || undefined,
      tags: file.tags || [],
      thumbnail: file.thumbnail || undefined,
      youtubeUrl: file.youtubeUrl || undefined,
    });
  } catch (error) {
    console.error("Error fetching media file:", error);
    res.status(500).json({ error: "Failed to fetch media file" });
  }
};

export const createMedia: RequestHandler = async (req, res) => {
  try {
    const { name, type, url, size, category, description, tags, thumbnail, youtubeUrl } = req.body ?? {};
    if (!name || !type || !url || size === undefined || size === null) {
      return res.status(400).json({ error: "Name, type, url, and size are required" });
    }
    await connectMongo();
    const created = await MediaFileModel.create({
      name,
      type,
      url,
      size: Number(size) || 0,
      uploadDate: new Date(),
      category: category || undefined,
      description: description || undefined,
      tags: Array.isArray(tags) ? tags : [],
      thumbnail: thumbnail || undefined,
      youtubeUrl: youtubeUrl || undefined,
    });
    res.status(201).json({
      id: idOf(created),
      name: created.name,
      type: created.type,
      url: created.url,
      size: created.size,
      uploadDate: created.uploadDate ? new Date(created.uploadDate).toISOString() : new Date().toISOString(),
      category: created.category || undefined,
      description: created.description || undefined,
      tags: created.tags || [],
      thumbnail: created.thumbnail || undefined,
      youtubeUrl: created.youtubeUrl || undefined,
    });
  } catch (error) {
    console.error("Error creating media file:", error);
    res.status(500).json({ error: "Failed to create media file" });
  }
};

export const updateMedia: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const { name, category, description, tags, thumbnail, youtubeUrl } = req.body ?? {};
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail || undefined;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl || undefined;

    await connectMongo();
    const updated = await MediaFileModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) return res.status(404).json({ error: "Media file not found" });
    res.json({
      id: idOf(updated),
      name: updated.name,
      type: updated.type,
      url: updated.url,
      size: updated.size,
      uploadDate: updated.uploadDate ? new Date(updated.uploadDate).toISOString() : new Date().toISOString(),
      category: updated.category || undefined,
      description: updated.description || undefined,
      tags: updated.tags || [],
      thumbnail: updated.thumbnail || undefined,
      youtubeUrl: updated.youtubeUrl || undefined,
    });
  } catch (error) {
    console.error("Error updating media file:", error);
    res.status(500).json({ error: "Failed to update media file" });
  }
};

export const deleteMedia: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await MediaFileModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Media file not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting media file:", error);
    res.status(500).json({ error: "Failed to delete media file" });
  }
};

// Books API
export const getBooks: RequestHandler = async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    console.log("Fetching books, category filter:", category);

    const where: any = {};
    if (category && category !== "All") where.category = category;

    await connectMongo();
    const result = await BookModel.find(where).sort({ uploadDate: -1 }).exec();

    console.log(`Found ${result.length} books in database`);

    const formattedResult = result.map((book) => ({
      id: idOf(book),
      title: book.title,
      author: book.author || undefined,
      category: book.category,
      description: book.description || undefined,
      coverImage: book.coverImage || undefined,
      fileUrl: book.fileUrl || undefined,
      isbn: book.isbn || undefined,
      publisher: book.publisher || undefined,
      publishDate: book.publishDate ? new Date(book.publishDate).toISOString().split("T")[0] : undefined,
      language: book.language || undefined,
      pages: book.pages || undefined,
      tags: book.tags || [],
      featured: book.featured,
      downloads: book.downloads,
      uploadDate: book.uploadDate ? new Date(book.uploadDate).toISOString() : new Date().toISOString(),
    }));

    console.log(`Returning ${formattedResult.length} formatted books`);
    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching books:", error);
    console.error("Error details:", error.message, error.stack);
    console.error("Error code:", error.code);
    res.status(500).json({
      error: "Failed to fetch books",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const getBook: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const book = await BookModel.findById(id).exec();

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({
      id: idOf(book),
      title: book.title,
      author: book.author || undefined,
      category: book.category,
      description: book.description || undefined,
      coverImage: book.coverImage || undefined,
      fileUrl: book.fileUrl || undefined,
      isbn: book.isbn || undefined,
      publisher: book.publisher || undefined,
      publishDate: book.publishDate ? new Date(book.publishDate).toISOString().split("T")[0] : undefined,
      language: book.language || undefined,
      pages: book.pages || undefined,
      tags: book.tags || [],
      featured: book.featured,
      downloads: book.downloads,
      uploadDate: book.uploadDate ? new Date(book.uploadDate).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

export const createBook: RequestHandler = async (req, res) => {
  try {
    const { title, author, category, description, coverImage, fileUrl, isbn, publisher, publishDate, language, pages, tags, featured } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: "Title and category are required" });
    }

    await connectMongo();
    const newBook = await BookModel.create({
      title,
      author: author || undefined,
      category,
      description: description || undefined,
      coverImage: coverImage || undefined,
      fileUrl: fileUrl || undefined,
      isbn: isbn || undefined,
      publisher: publisher || undefined,
      publishDate: publishDate ? new Date(publishDate) : undefined,
      language: language || undefined,
      pages: pages || undefined,
      tags: tags || [],
      featured: !!featured,
      downloads: 0,
      uploadDate: new Date(),
    });

    res.status(201).json({
      id: idOf(newBook),
      title: newBook.title,
      author: newBook.author || undefined,
      category: newBook.category,
      description: newBook.description || undefined,
      coverImage: newBook.coverImage || undefined,
      fileUrl: newBook.fileUrl || undefined,
      isbn: newBook.isbn || undefined,
      publisher: newBook.publisher || undefined,
      publishDate: newBook.publishDate ? new Date(newBook.publishDate).toISOString().split("T")[0] : undefined,
      language: newBook.language || undefined,
      pages: newBook.pages || undefined,
      tags: newBook.tags || [],
      featured: newBook.featured,
      downloads: newBook.downloads,
      uploadDate: newBook.uploadDate ? new Date(newBook.uploadDate).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating book:", error);
    if (error?.code === 11000) {
      return res.status(400).json({ error: "Duplicate book" });
    }
    res.status(500).json({
      error: "Failed to create book",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const updateBook: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, description, coverImage, fileUrl, isbn, publisher, publishDate, language, pages, tags, featured } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author || undefined;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description || undefined;
    if (coverImage !== undefined) updateData.coverImage = coverImage || undefined;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl || undefined;
    if (isbn !== undefined) updateData.isbn = isbn || undefined;
    if (publisher !== undefined) updateData.publisher = publisher || undefined;
    if (publishDate !== undefined) updateData.publishDate = publishDate ? new Date(publishDate) : undefined;
    if (language !== undefined) updateData.language = language || undefined;
    if (pages !== undefined) updateData.pages = pages || undefined;
    if (tags !== undefined) updateData.tags = tags || [];
    if (featured !== undefined) updateData.featured = featured;

    await connectMongo();
    const updatedBook = await BookModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });

    res.json({
      id: idOf(updatedBook),
      title: updatedBook.title,
      author: updatedBook.author || undefined,
      category: updatedBook.category,
      description: updatedBook.description || undefined,
      coverImage: updatedBook.coverImage || undefined,
      fileUrl: updatedBook.fileUrl || undefined,
      isbn: updatedBook.isbn || undefined,
      publisher: updatedBook.publisher || undefined,
      publishDate: updatedBook.publishDate ? new Date(updatedBook.publishDate).toISOString().split("T")[0] : undefined,
      language: updatedBook.language || undefined,
      pages: updatedBook.pages || undefined,
      tags: updatedBook.tags || [],
      featured: updatedBook.featured,
      downloads: updatedBook.downloads,
      uploadDate: updatedBook.uploadDate ? new Date(updatedBook.uploadDate).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
};

export const deleteBook: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await BookModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Book not found" });
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

export const trackBookDownload: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const updatedBook = await BookModel.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    ).exec();
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ downloads: updatedBook.downloads });
  } catch (error: any) {
    console.error("Error tracking book download:", error);
    res.status(500).json({ error: "Failed to track book download" });
  }
};

function safePdfFilename(title: string | undefined) {
  const base = (title || "book")
    .toString()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${base || "book"}.pdf`;
}

export const downloadBookPdf: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    await connectMongo();
    const book = await BookModel.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true }).exec();
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!book.fileUrl) return res.status(400).json({ error: "Book fileUrl is missing" });

    const upstream = await fetch(book.fileUrl, { cache: "no-store" as any });
    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ error: "Failed to fetch PDF from storage" });
    }

    const filename = safePdfFilename(book.title);
    const contentType =
      upstream.headers.get("content-type") ||
      "application/pdf";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
    res.setHeader("Cache-Control", "no-store");

    // Stream response
    const nodeStream = Readable.fromWeb(upstream.body as any);
    nodeStream.on("error", (e) => {
      console.error("PDF stream error:", e);
      try {
        res.end();
      } catch { }
    });
    nodeStream.pipe(res);
  } catch (error) {
    console.error("Error downloading book PDF:", error);
    res.status(500).json({ error: "Failed to download PDF" });
  }
};

export const viewBookPdf: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    await connectMongo();
    const book = await BookModel.findById(id).exec();
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!book.fileUrl) return res.status(400).json({ error: "Book fileUrl is missing" });

    const upstream = await fetch(book.fileUrl, { cache: "no-store" as any });
    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ error: "Failed to fetch PDF from storage" });
    }

    const filename = safePdfFilename(book.title);
    const contentType = upstream.headers.get("content-type") || "application/pdf";

    res.setHeader("Content-Type", contentType);
    // Inline disposition lets browsers render PDFs without downloading
    res.setHeader("Content-Disposition", `inline; filename=\"${filename}\"`);
    res.setHeader("Cache-Control", "no-store");

    const nodeStream = Readable.fromWeb(upstream.body as any);
    nodeStream.on("error", (e) => {
      console.error("PDF stream error:", e);
      try {
        res.end();
      } catch { }
    });
    nodeStream.pipe(res);
  } catch (error) {
    console.error("Error viewing book PDF:", error);
    res.status(500).json({ error: "Failed to view PDF" });
  }
};

// Email Subscribers API
export const getSubscribers: RequestHandler = async (req, res) => {
  try {
    await connectMongo();
    const status = req.query.status as string | undefined;
    const where: any = {};
    if (status) where.status = status;
    const result = await EmailSubscriberModel.find(where).sort({ subscribedAt: -1 }).exec();
    res.json(
      result.map((s: any) => ({
        id: idOf(s),
        email: s.email,
        name: s.name || undefined,
        subscribedAt: s.subscribedAt ? new Date(s.subscribedAt).toISOString() : new Date().toISOString(),
        status: s.status || "active",
        source: s.source || "footer",
        tags: s.tags || [],
      }))
    );
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
};

export const getSubscriber: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const subscriber = await EmailSubscriberModel.findById(id).exec();
    if (!subscriber) return res.status(404).json({ error: "Subscriber not found" });
    res.json({
      id: idOf(subscriber),
      email: subscriber.email,
      name: subscriber.name || undefined,
      subscribedAt: subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toISOString() : new Date().toISOString(),
      status: subscriber.status || "active",
      source: subscriber.source || "footer",
      tags: subscriber.tags || [],
    });
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    res.status(500).json({ error: "Failed to fetch subscriber" });
  }
};

export const createSubscriber: RequestHandler = async (req, res) => {
  try {
    const { email, name, source, status } = req.body ?? {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    await connectMongo();
    const lowerEmail = email.toLowerCase();

    const existing = await EmailSubscriberModel.findOne({ email: lowerEmail }).exec();
    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://sypeministry.org").trim().replace(/\/+$/, "");
    const contactEmail = (process.env.CONTACT_EMAIL || "sypeministry@gmail.com").trim();
    const adminNotifyEmail = getAdminNotifyEmail();

    if (existing) {
      if (existing.status === "active") {
        return res.status(400).json({ error: "Email is already subscribed" });
      }
      existing.status = "active";
      existing.subscribedAt = new Date();
      if (name) existing.name = name;
      if (source) existing.source = source;
      await existing.save();
      const payload = {
        id: idOf(existing),
        email: existing.email,
        name: existing.name || undefined,
        subscribedAt: existing.subscribedAt ? new Date(existing.subscribedAt).toISOString() : new Date().toISOString(),
        status: existing.status || "active",
        source: existing.source || "footer",
        tags: existing.tags || [],
      };

      // Emails (non-blocking)
      const subscriberName = String(existing.name || "").trim();
      const welcomeSubject = `Welcome to ${siteName} - God bless you!`;
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin: 0 0 8px;">Welcome to ${escapeHtml(siteName)}</h2>
          <p style="margin: 0 0 16px;">Dear ${escapeHtml(subscriberName || "Friend in Christ")},</p>
          <p style="margin: 0 0 16px;">
            <strong>Grace and peace be with you!</strong> Thank you for joining our community of young professionals 
            committed to evangelism and serving God.
          </p>
          <p style="margin: 0 0 16px;">
            You will now receive updates, devotional resources, ministry news, and opportunities to be part of God's work 
            through ${escapeHtml(siteName)}. <em>"How beautiful are the feet of those who bring good news!"</em> (Romans 10:15)
          </p>
          <p style="margin: 0 0 16px;">
            Visit our website: <a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a>
          </p>
          <p style="margin: 16px 0 0;">
            May the Lord bless you and keep you. May His face shine upon you and be gracious to you (Numbers 6:24-25).
          </p>
          <p style="margin: 16px 0 0;">
            In Christian fellowship,<br />
            <strong>${escapeHtml(siteName)}</strong>
          </p>
          <p style="margin: 8px 0 0; font-size: 0.875rem; color: #6b7280;">
            If you didn't subscribe, you can <a href="${escapeHtml(siteUrl)}/unsubscribe">unsubscribe here</a>.
          </p>
        </div>
      `;
      const welcomeText = `Welcome to ${siteName} - God bless you!

Dear ${subscriberName || "Friend in Christ"},

Grace and peace be with you! Thank you for joining our community of young professionals committed to evangelism and serving God.

You will now receive updates, devotional resources, ministry news, and opportunities to be part of God's work through ${siteName}. "How beautiful are the feet of those who bring good news!" (Romans 10:15)

Visit our website: ${siteUrl}

May the Lord bless you and keep you. May His face shine upon you and be gracious to you (Numbers 6:24-25).

In Christian fellowship,
${siteName}

If you didn't subscribe, you can unsubscribe at: ${siteUrl}/unsubscribe
`;
      const mails: Promise<any>[] = [
        sendMail({ to: existing.email, subject: welcomeSubject, html: welcomeHtml, text: welcomeText, replyTo: contactEmail || undefined }),
      ];
      if (adminNotifyEmail) {
        mails.push(
          sendMail({
            to: adminNotifyEmail,
            subject: `New subscriber - ${siteName}`,
            html: `<p><strong>New subscriber:</strong> ${escapeHtml(existing.email)}${subscriberName ? ` (${escapeHtml(subscriberName)})` : ""}</p>`,
            text: `New subscriber: ${existing.email}${subscriberName ? ` (${subscriberName})` : ""}`,
            replyTo: existing.email,
          })
        );
      }
      await Promise.allSettled(mails);

      return res.json(payload);
    }

    const created = await EmailSubscriberModel.create({
      email: lowerEmail,
      name: name || undefined,
      subscribedAt: new Date(),
      status: status || "active",
      source: source || "footer",
      tags: [],
    });
    const payload = {
      id: idOf(created),
      email: created.email,
      name: created.name || undefined,
      subscribedAt: created.subscribedAt ? new Date(created.subscribedAt).toISOString() : new Date().toISOString(),
      status: created.status || "active",
      source: created.source || "footer",
      tags: created.tags || [],
    };

    // Emails (non-blocking)
    const subscriberName = String(created.name || "").trim();
    const welcomeSubject = `Welcome to ${siteName} - God bless you!`;
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 8px;">Welcome to ${escapeHtml(siteName)}</h2>
        <p style="margin: 0 0 16px;">Dear ${escapeHtml(subscriberName || "Friend in Christ")},</p>
        <p style="margin: 0 0 16px;">
          <strong>Grace and peace be with you!</strong> Thank you for joining our community of young professionals 
          committed to evangelism and serving God.
        </p>
        <p style="margin: 0 0 16px;">
          You will now receive updates, devotional resources, ministry news, and opportunities to be part of God's work 
          through ${escapeHtml(siteName)}. <em>"How beautiful are the feet of those who bring good news!"</em> (Romans 10:15)
        </p>
        <p style="margin: 0 0 16px;">
          Visit our website: <a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a>
        </p>
        <p style="margin: 16px 0 0;">
          May the Lord bless you and keep you. May His face shine upon you and be gracious to you (Numbers 6:24-25).
        </p>
        <p style="margin: 16px 0 0;">
          In Christian fellowship,<br />
          <strong>${escapeHtml(siteName)}</strong>
        </p>
        <p style="margin: 8px 0 0; font-size: 0.875rem; color: #6b7280;">
          If you didn't subscribe, you can <a href="${escapeHtml(siteUrl)}/unsubscribe">unsubscribe here</a>.
        </p>
      </div>
    `;
    const welcomeText = `Welcome to ${siteName} - God bless you!

Dear ${subscriberName || "Friend in Christ"},

Grace and peace be with you! Thank you for joining our community of young professionals committed to evangelism and serving God.

You will now receive updates, devotional resources, ministry news, and opportunities to be part of God's work through ${siteName}. "How beautiful are the feet of those who bring good news!" (Romans 10:15)

Visit our website: ${siteUrl}

May the Lord bless you and keep you. May His face shine upon you and be gracious to you (Numbers 6:24-25).

In Christian fellowship,
${siteName}

If you didn't subscribe, you can unsubscribe at: ${siteUrl}/unsubscribe
`;
    const mails: Promise<any>[] = [
      sendMail({ to: created.email, subject: welcomeSubject, html: welcomeHtml, text: welcomeText, replyTo: contactEmail || undefined }),
    ];
    if (adminNotifyEmail) {
      mails.push(
        sendMail({
          to: adminNotifyEmail,
          subject: `New subscriber - ${siteName}`,
          html: `<p><strong>New subscriber:</strong> ${escapeHtml(created.email)}${subscriberName ? ` (${escapeHtml(subscriberName)})` : ""}</p>`,
          text: `New subscriber: ${created.email}${subscriberName ? ` (${subscriberName})` : ""}`,
          replyTo: created.email,
        })
      );
    }
    await Promise.allSettled(mails);

    res.status(201).json(payload);
  } catch (error: any) {
    console.error("Error creating subscriber:", error);
    if (error?.code === 11000) return res.status(400).json({ error: "Email is already subscribed" });
    res.status(500).json({ error: "Failed to create subscriber" });
  }
};

export const updateSubscriber: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const { email, name, status, source, tags } = req.body ?? {};
    const updateData: any = {};
    if (email !== undefined) updateData.email = String(email).toLowerCase();
    if (name !== undefined) updateData.name = name || undefined;
    if (status !== undefined) updateData.status = status;
    if (source !== undefined) updateData.source = source;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];

    await connectMongo();
    const updated = await EmailSubscriberModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) return res.status(404).json({ error: "Subscriber not found" });
    res.json({
      id: idOf(updated),
      email: updated.email,
      name: updated.name || undefined,
      subscribedAt: updated.subscribedAt ? new Date(updated.subscribedAt).toISOString() : new Date().toISOString(),
      status: updated.status || "active",
      source: updated.source || "footer",
      tags: updated.tags || [],
    });
  } catch (error: any) {
    console.error("Error updating subscriber:", error);
    if (error?.code === 11000) return res.status(400).json({ error: "Email is already subscribed" });
    res.status(500).json({ error: "Failed to update subscriber" });
  }
};

export const deleteSubscriber: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await EmailSubscriberModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Subscriber not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    res.status(500).json({ error: "Failed to delete subscriber" });
  }
};

export const unsubscribe: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body ?? {};
    if (!email) return res.status(400).json({ error: "Email is required" });
    const lowerEmail = String(email).toLowerCase();
    await connectMongo();
    const updated = await EmailSubscriberModel.findOneAndUpdate(
      { email: lowerEmail },
      { status: "unsubscribed" },
      { new: true }
    ).exec();
    if (!updated) return res.status(404).json({ error: "Email not found in our subscribers list" });

    // Confirmation email (non-blocking)
    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://sypeministry.org").trim().replace(/\/+$/, "");
    const contactEmail = (process.env.CONTACT_EMAIL || "sypeministry@gmail.com").trim();
    await Promise.allSettled([
      sendMail({
        to: updated.email,
        subject: `You’ve been unsubscribed - ${siteName}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin: 0 0 8px;">Unsubscribed</h2>
            <p style="margin: 0 0 16px;">You will no longer receive newsletter emails from ${escapeHtml(siteName)}.</p>
            <p style="margin: 0 0 16px;">Website: <a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a></p>
            <p style="margin: 0;">If this was a mistake, you can subscribe again on our website.</p>
          </div>
        `,
        text: `You’ve been unsubscribed - ${siteName}\nYou will no longer receive newsletter emails.\nWebsite: ${siteUrl}\nIf this was a mistake, you can subscribe again on our website.\n`,
        replyTo: contactEmail || undefined,
      }),
    ]);

    res.json({
      message: "Successfully unsubscribed",
      subscriber: {
        id: idOf(updated),
        email: updated.email,
        name: updated.name || undefined,
        subscribedAt: updated.subscribedAt ? new Date(updated.subscribedAt).toISOString() : new Date().toISOString(),
        status: updated.status || "unsubscribed",
        source: updated.source || "footer",
        tags: updated.tags || [],
      },
    });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
};

// Email Campaigns API
function stripHtmlToText(html: string): string {
  const v = String(html || "");
  // Very small best-effort conversion.
  return v
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#0?39;/g, "'")
    .trim();
}

export const getEmailCampaigns: RequestHandler = async (_req, res) => {
  try {
    await connectMongo();
    const result = await EmailCampaignModel.find().sort({ createdAt: -1 }).exec();
    res.json(
      result.map((c: any) => ({
        id: idOf(c),
        subject: c.subject,
        body: c.body,
        recipients: c.recipients || [],
        sentDate: c.sentDate ? new Date(c.sentDate).toISOString() : undefined,
        status: c.status || "draft",
        scheduledDate: c.scheduledDate ? new Date(c.scheduledDate).toISOString() : undefined,
        openRate: c.openRate ?? undefined,
        clickRate: c.clickRate ?? undefined,
      }))
    );
  } catch (error) {
    console.error("Error fetching email campaigns:", error);
    res.status(500).json({ error: "Failed to fetch email campaigns" });
  }
};

export const getEmailCampaign: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const c = await EmailCampaignModel.findById(id).exec();
    if (!c) return res.status(404).json({ error: "Campaign not found" });
    res.json({
      id: idOf(c),
      subject: c.subject,
      body: c.body,
      recipients: c.recipients || [],
      sentDate: c.sentDate ? new Date(c.sentDate).toISOString() : undefined,
      status: c.status || "draft",
      scheduledDate: c.scheduledDate ? new Date(c.scheduledDate).toISOString() : undefined,
      openRate: c.openRate ?? undefined,
      clickRate: c.clickRate ?? undefined,
    });
  } catch (error) {
    console.error("Error fetching email campaign:", error);
    res.status(500).json({ error: "Failed to fetch email campaign" });
  }
};

export const createEmailCampaign: RequestHandler = async (req, res) => {
  try {
    const { subject, body, status, scheduledDate, recipients } = req.body ?? {};
    if (!subject || !body) return res.status(400).json({ error: "subject and body are required" });
    const nextStatus = String(status || "draft");
    if (!["draft", "scheduled", "sent"].includes(nextStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const recips = Array.isArray(recipients) ? recipients.map(String).map((x) => x.trim()).filter(Boolean) : [];
    await connectMongo();
    const created = await EmailCampaignModel.create({
      subject: String(subject),
      body: String(body),
      recipients: recips,
      status: nextStatus,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      sentDate: nextStatus === "sent" ? new Date() : undefined,
    });
    res.status(201).json({
      id: idOf(created),
      subject: created.subject,
      body: created.body,
      recipients: created.recipients || [],
      sentDate: created.sentDate ? new Date(created.sentDate).toISOString() : undefined,
      status: created.status || "draft",
      scheduledDate: created.scheduledDate ? new Date(created.scheduledDate).toISOString() : undefined,
    });
  } catch (error) {
    console.error("Error creating email campaign:", error);
    res.status(500).json({ error: "Failed to create email campaign" });
  }
};

export const updateEmailCampaign: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const { subject, body, status, scheduledDate, recipients } = req.body ?? {};
    const updateData: any = {};
    if (subject !== undefined) updateData.subject = String(subject);
    if (body !== undefined) updateData.body = String(body);
    if (status !== undefined) {
      const nextStatus = String(status || "draft");
      if (!["draft", "scheduled", "sent"].includes(nextStatus)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      updateData.status = nextStatus;
      if (nextStatus === "sent") updateData.sentDate = new Date();
    }
    if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : undefined;
    if (recipients !== undefined) updateData.recipients = Array.isArray(recipients) ? recipients.map(String).map((x) => x.trim()).filter(Boolean) : [];

    await connectMongo();
    const updated = await EmailCampaignModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) return res.status(404).json({ error: "Campaign not found" });
    res.json({
      id: idOf(updated),
      subject: updated.subject,
      body: updated.body,
      recipients: updated.recipients || [],
      sentDate: updated.sentDate ? new Date(updated.sentDate).toISOString() : undefined,
      status: updated.status || "draft",
      scheduledDate: updated.scheduledDate ? new Date(updated.scheduledDate).toISOString() : undefined,
    });
  } catch (error) {
    console.error("Error updating email campaign:", error);
    res.status(500).json({ error: "Failed to update email campaign" });
  }
};

export const deleteEmailCampaign: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await EmailCampaignModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Campaign not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting email campaign:", error);
    res.status(500).json({ error: "Failed to delete email campaign" });
  }
};

export const sendEmailCampaign: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    await connectMongo();
    const campaign = await EmailCampaignModel.findById(id).exec();
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    if (String(campaign.status || "draft") === "sent") {
      return res.status(400).json({ error: "Campaign already sent" });
    }

    // Determine recipients
    let recipients: string[] = Array.isArray(campaign.recipients) ? campaign.recipients.map(String) : [];
    recipients = recipients.map((x) => x.trim()).filter(Boolean);
    if (recipients.length === 0) {
      const subs = await EmailSubscriberModel.find({ status: "active" }).select({ email: 1 }).exec();
      recipients = subs.map((s: any) => String(s.email || "").trim()).filter(Boolean);
    }
    // de-dup
    recipients = Array.from(new Set(recipients)).filter((e) => e.includes("@"));
    if (recipients.length === 0) return res.status(400).json({ error: "No recipients found (need active subscribers)" });

    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const contactEmail = (process.env.CONTACT_EMAIL || "sypeministry@gmail.com").trim();
    const subject = String(campaign.subject || "").trim() || `Newsletter - ${siteName}`;
    const body = String(campaign.body || "");

    // If admin pasted plain text, wrap it as HTML.
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(body);
    const html = isHtml
      ? body
      : `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; white-space: pre-wrap;">${escapeHtml(body)}</div>`;
    const text = isHtml ? stripHtmlToText(body) : String(body || "");

    // Send (rate-friendly batching) + collect failure reasons
    let sent = 0;
    let failed = 0;
    const errors: Array<{ to: string; error: string }> = [];

    const batchSize = 5;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((to) =>
          sendMail({
            to,
            subject,
            html,
            text,
            replyTo: contactEmail || undefined,
          })
        )
      );

      results.forEach((r, idx) => {
        if (r.status === "fulfilled") {
          sent += 1;
          return;
        }
        failed += 1;
        const reason: any = r.reason;
        const msg = String(reason?.message || reason?.error || reason || "Failed to send");
        if (errors.length < 5) {
          errors.push({ to: batch[idx], error: msg });
        }
      });
    }

    // Only mark as sent if all recipients succeeded.
    if (failed === 0) {
      campaign.status = "sent";
      campaign.sentDate = new Date();
      campaign.recipients = recipients;
      await campaign.save();
      return res.json({ ok: true, recipients: recipients.length, sent, failed, errors: [] });
    }

    // If everything failed, return 500 so the UI shows an error toast.
    if (sent === 0) {
      return res.status(500).json({
        ok: false,
        error: errors[0]?.error || "Campaign failed to send",
        recipients: recipients.length,
        sent,
        failed,
        errors,
      });
    }

    // Partial success: keep as draft so admin can retry if needed.
    return res.json({
      ok: false,
      error: errors[0]?.error || "Some emails failed to send",
      recipients: recipients.length,
      sent,
      failed,
      errors,
    });
  } catch (error: any) {
    console.error("Error sending email campaign:", error);
    res.status(500).json({ error: error?.message || "Failed to send campaign" });
  }
};

// Committee Members API
export const getCommitteeMembers: RequestHandler = async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const active = req.query.active !== "false";

    let where: any = {};
    if (category) {
      where.category = category;
    }
    if (active) {
      where.active = true;
    }

    await connectMongo();
    const result = await CommitteeMemberModel.find(where).sort({ category: 1, order: 1 }).exec();

    const formattedResult = result.map((member) => ({
      id: idOf(member),
      position: member.position,
      name: member.name,
      church: member.church,
      phone: member.phone,
      category: member.category,
      image: member.image || undefined,
      email: member.email || undefined,
      order: member.order,
      active: member.active,
    }));

    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching committee members:", error);
    res.status(500).json({ error: "Failed to fetch committee members" });
  }
};

export const getCommitteeMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const member = await CommitteeMemberModel.findById(id).exec();

    if (!member) {
      return res.status(404).json({ error: "Committee member not found" });
    }

    res.json({
      id: idOf(member),
      position: member.position,
      name: member.name,
      church: member.church,
      phone: member.phone,
      category: member.category,
      image: member.image || undefined,
      email: member.email || undefined,
      order: member.order,
      active: member.active,
    });
  } catch (error: any) {
    console.error("Error fetching committee member:", error);
    res.status(500).json({ error: "Failed to fetch committee member" });
  }
};

export const createCommitteeMember: RequestHandler = async (req, res) => {
  try {
    const { position, name, church, phone, category, image, email, order, active } = req.body;

    if (!position || !name || !church || !phone || !category) {
      return res.status(400).json({ error: "Position, name, church, phone, and category are required" });
    }

    // Validate category
    const validCategories = ["leadership", "team", "auditor", "asa_representatives", "board_chancellors"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${validCategories.join(", ")}`
      });
    }

    // Get count for order if not provided
    let memberOrder = order;
    if (memberOrder === undefined || memberOrder === null) {
      await connectMongo();
      const count = await CommitteeMemberModel.countDocuments({ category }).exec();
      memberOrder = count + 1;
    }

    await connectMongo();
    const newMember = await CommitteeMemberModel.create({
      position: position.trim(),
      name: name.trim(),
      church: church.trim(),
      phone: phone.trim(),
      category,
      image: image?.trim() || undefined,
      email: email?.trim() || undefined,
      order: memberOrder,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      id: idOf(newMember),
      position: newMember.position,
      name: newMember.name,
      church: newMember.church,
      phone: newMember.phone,
      category: newMember.category,
      image: newMember.image || undefined,
      email: newMember.email || undefined,
      order: newMember.order,
      active: newMember.active,
    });
  } catch (error: any) {
    console.error("Error creating committee member:", error);
    if (error?.code === 11000) {
      return res.status(400).json({ error: "Duplicate committee member" });
    }
    res.status(500).json({
      error: "Failed to create committee member",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const updateCommitteeMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, name, church, phone, category, image, email, order, active } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const updateData: any = {};
    if (position !== undefined) updateData.position = position;
    if (name !== undefined) updateData.name = name;
    if (church !== undefined) updateData.church = church;
    if (phone !== undefined) updateData.phone = phone;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image || undefined;
    if (email !== undefined) updateData.email = email || undefined;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    await connectMongo();
    const updatedMember = await CommitteeMemberModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedMember) return res.status(404).json({ error: "Committee member not found" });

    res.json({
      id: idOf(updatedMember),
      position: updatedMember.position,
      name: updatedMember.name,
      church: updatedMember.church,
      phone: updatedMember.phone,
      category: updatedMember.category,
      image: updatedMember.image || undefined,
      email: updatedMember.email || undefined,
      order: updatedMember.order,
      active: updatedMember.active,
    });
  } catch (error: any) {
    console.error("Error updating committee member:", error);
    res.status(500).json({ error: "Failed to update committee member" });
  }
};

export const deleteCommitteeMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await CommitteeMemberModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Committee member not found" });
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting committee member:", error);
    res.status(500).json({ error: "Failed to delete committee member" });
  }
};

// Devotions API
export const getDevotions: RequestHandler = async (req, res) => {
  try {
    console.log("Fetching devotions, query params:", req.query);

    // Build where clause for date filtering
    let where: any = {};

    const dateFilter = req.query.dateFilter as string | undefined;
    const days = req.query.days ? parseInt(req.query.days as string) : undefined;

    if (dateFilter === "last7days" || days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (days || 7));
      cutoffDate.setHours(0, 0, 0, 0);
      where.date = { $gte: cutoffDate };
      console.log("Date filter applied, cutoff date:", cutoffDate.toISOString());
    }

    // Fetch from database
    console.log("Querying devotions with where clause:", JSON.stringify(where));
    await connectMongo();
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const q = DevotionModel.find(where).sort({ date: -1 });
    if (limit) q.limit(limit);
    const result = await q.exec();

    console.log(`Found ${result.length} devotions in database`);

    // Convert DB format to API format
    const formattedResult = result.map((d) => ({
      id: idOf(d),
      title: d.title,
      date: new Date(d.date).toISOString().split("T")[0],
      excerpt: d.excerpt,
      content: d.content || undefined,
      image: d.image || undefined,
      featuredVideoUrl: d.featuredVideoUrl || undefined,
      featuredVideoThumbnail: d.featuredVideoThumbnail || undefined,
      featuredVideoTitle: d.featuredVideoTitle || undefined,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
    }));

    console.log(`Returning ${formattedResult.length} formatted devotions`);
    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching devotions:", error);
    console.error("Error details:", error.message, error.stack);
    console.error("Error code:", error.code);
    res.status(500).json({
      error: "Failed to fetch devotions",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const getDevotion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const devotion = await DevotionModel.findById(id).exec();

    if (!devotion) {
      return res.status(404).json({ error: "Devotion not found" });
    }

    // Convert DB format to API format
    res.json({
      id: idOf(devotion),
      title: devotion.title,
      date: new Date(devotion.date).toISOString().split("T")[0],
      excerpt: devotion.excerpt,
      content: devotion.content || undefined,
      image: devotion.image || undefined,
      featuredVideoUrl: devotion.featuredVideoUrl || undefined,
      featuredVideoThumbnail: devotion.featuredVideoThumbnail || undefined,
      featuredVideoTitle: devotion.featuredVideoTitle || undefined,
      createdAt: devotion.createdAt ? new Date(devotion.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching devotion:", error);
    res.status(500).json({ error: "Failed to fetch devotion" });
  }
};

export const createDevotion: RequestHandler = async (req, res) => {
  try {
    const { title, date, excerpt, content, image, featuredVideoUrl, featuredVideoThumbnail, featuredVideoTitle } = req.body;

    if (!title || !date || !excerpt) {
      return res.status(400).json({ error: "Title, date, and excerpt are required" });
    }

    // Validate date format
    let devotionDate: Date;
    try {
      devotionDate = new Date(date);
      if (isNaN(devotionDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }
    } catch (e) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    await connectMongo();
    const newDevotion = await DevotionModel.create({
      title: title.trim(),
      date: devotionDate,
      excerpt: excerpt.trim(),
      content: content?.trim() || undefined,
      image: image?.trim() || undefined,
      featuredVideoUrl: featuredVideoUrl?.trim() || undefined,
      featuredVideoThumbnail: featuredVideoThumbnail?.trim() || undefined,
      featuredVideoTitle: featuredVideoTitle?.trim() || undefined,
    });

    // Convert DB format to API format
    res.status(201).json({
      id: idOf(newDevotion),
      title: newDevotion.title,
      date: new Date(newDevotion.date).toISOString().split("T")[0],
      excerpt: newDevotion.excerpt,
      content: newDevotion.content || undefined,
      image: newDevotion.image || undefined,
      featuredVideoUrl: newDevotion.featuredVideoUrl || undefined,
      featuredVideoThumbnail: newDevotion.featuredVideoThumbnail || undefined,
      featuredVideoTitle: newDevotion.featuredVideoTitle || undefined,
      createdAt: newDevotion.createdAt ? new Date(newDevotion.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating devotion:", error);
    if (error?.code === 11000) {
      return res.status(400).json({ error: "Duplicate devotion" });
    }
    res.status(500).json({
      error: "Failed to create devotion",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const updateDevotion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, excerpt, content, image, featuredVideoUrl, featuredVideoThumbnail, featuredVideoTitle } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = new Date(date);
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content || undefined;
    if (image !== undefined) updateData.image = image || undefined;
    if (featuredVideoUrl !== undefined) updateData.featuredVideoUrl = featuredVideoUrl || undefined;
    if (featuredVideoThumbnail !== undefined) updateData.featuredVideoThumbnail = featuredVideoThumbnail || undefined;
    if (featuredVideoTitle !== undefined) updateData.featuredVideoTitle = featuredVideoTitle || undefined;

    await connectMongo();
    const updatedDevotion = await DevotionModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedDevotion) return res.status(404).json({ error: "Devotion not found" });

    // Convert DB format to API format
    res.json({
      id: idOf(updatedDevotion),
      title: updatedDevotion.title,
      date: new Date(updatedDevotion.date).toISOString().split("T")[0],
      excerpt: updatedDevotion.excerpt,
      content: updatedDevotion.content || undefined,
      image: updatedDevotion.image || undefined,
      featuredVideoUrl: updatedDevotion.featuredVideoUrl || undefined,
      featuredVideoThumbnail: updatedDevotion.featuredVideoThumbnail || undefined,
      featuredVideoTitle: updatedDevotion.featuredVideoTitle || undefined,
      createdAt: updatedDevotion.createdAt ? new Date(updatedDevotion.createdAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating devotion:", error);
    res.status(500).json({ error: "Failed to update devotion" });
  }
};

export const deleteDevotion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await DevotionModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Devotion not found" });
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting devotion:", error);
    res.status(500).json({ error: "Failed to delete devotion" });
  }
};

// Contact Submissions API
export const getContactSubmissions: RequestHandler = async (req, res) => {
  try {
    const status = req.query.status as string | undefined;

    let where: any = {};
    if (status) {
      where.status = status;
    }

    await connectMongo();
    const result = await ContactSubmissionModel.find(where).sort({ createdAt: -1 }).exec();

    const formattedResult = result.map((submission) => ({
      id: idOf(submission),
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      message: submission.message,
      status: submission.status,
      readAt: submission.readAt ? new Date(submission.readAt).toISOString() : undefined,
      repliedAt: submission.repliedAt ? new Date(submission.repliedAt).toISOString() : undefined,
      notes: submission.notes || undefined,
      createdAt: submission.createdAt ? new Date(submission.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: submission.updatedAt ? new Date(submission.updatedAt).toISOString() : new Date().toISOString(),
    }));

    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ error: "Failed to fetch contact submissions" });
  }
};

export const getContactSubmission: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const submission = await ContactSubmissionModel.findById(id).exec();

    if (!submission) {
      return res.status(404).json({ error: "Contact submission not found" });
    }

    res.json({
      id: idOf(submission),
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      message: submission.message,
      status: submission.status,
      readAt: submission.readAt ? new Date(submission.readAt).toISOString() : undefined,
      repliedAt: submission.repliedAt ? new Date(submission.repliedAt).toISOString() : undefined,
      notes: submission.notes || undefined,
      createdAt: submission.createdAt ? new Date(submission.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: submission.updatedAt ? new Date(submission.updatedAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching contact submission:", error);
    res.status(500).json({ error: "Failed to fetch contact submission" });
  }
};

export const createContactSubmission: RequestHandler = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Name, email, subject, and message are required" });
    }

    await connectMongo();
    const newSubmission = await ContactSubmissionModel.create({
      name,
      email,
      subject,
      message,
      status: "new",
    });

    // Emails (non-blocking)
    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://sypeministry.org").trim().replace(/\/+$/, "");
    const contactEmail = (process.env.CONTACT_EMAIL || "sypeministry@gmail.com").trim();
    const contactPhone = (process.env.CONTACT_PHONE || "").trim();
    const adminNotifyEmail = getAdminNotifyEmail();

    const submissionId = idOf(newSubmission);
    const safeName = escapeHtml(String(name || "").trim() || "Friend");
    const safeEmail = String(email || "").trim();
    const safeSubject = escapeHtml(String(subject || "").trim());
    const safeMessage = escapeHtml(String(message || "").trim());

    const adminSubject = `New contact submission - ${siteName}`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 8px;">New Contact Submission</h2>
        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #ffffff;">
          <p style="margin: 0 0 6px;"><strong>Reference #:</strong> ${escapeHtml(submissionId)}</p>
          <p style="margin: 0 0 6px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 6px;"><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p style="margin: 0 0 6px;"><strong>Subject:</strong> ${safeSubject}</p>
          <p style="margin: 0;"><strong>Message:</strong><br />${safeMessage.replace(/\n/g, "<br />")}</p>
        </div>
      </div>
    `;
    const adminText = `New contact submission - ${siteName}
Reference #: ${submissionId}
Name: ${String(name || "")}
Email: ${safeEmail}
Subject: ${String(subject || "")}
Message:
${String(message || "")}
`;

    const donorSubject = `We received your message - ${siteName}`;
    const donorHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 8px;">${escapeHtml(siteName)} - Message Received</h2>
        <p style="margin: 0 0 16px;">Dear ${safeName},</p>
        <p style="margin: 0 0 16px;">
          <strong>Grace and peace to you!</strong> Thank you for reaching out to us. We have received your message 
          and will respond as soon as possible.
        </p>
        <p style="margin: 0 0 16px;">
          <em>"The Lord is close to all who call on him"</em> (Psalm 145:18). We appreciate your interest in our ministry 
          and look forward to connecting with you.
        </p>
        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; background: #f9fafb;">
          <p style="margin: 0 0 6px;"><strong>Your reference #:</strong> ${escapeHtml(submissionId)}</p>
          <p style="margin: 0 0 6px;"><strong>Subject:</strong> ${safeSubject}</p>
          <p style="margin: 0;"><strong>Message:</strong><br />${safeMessage.replace(/\n/g, "<br />")}</p>
        </div>
        <p style="margin: 16px 0 0;">
          If you need to add more information, please reply to this email.
          You can also reach us at <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a>
          ${contactPhone ? ` or ${escapeHtml(contactPhone)}` : ""}.
        </p>
        <p style="margin: 8px 0 0;">
          Visit us: <a href="${escapeHtml(siteUrl)}">${escapeHtml(siteUrl)}</a>
        </p>
        <p style="margin: 24px 0 0;">
          May God bless you,<br />
          <strong>${escapeHtml(siteName)}</strong><br />
          <em>"Go and make disciples of all nations"</em> - Matthew 28:19
        </p>
      </div>
    `;
    const donorText = `We received your message - ${siteName}
Reference #: ${submissionId}
Subject: ${String(subject || "")}
Message:
${String(message || "")}

If you need to add more information, reply to this email.
Contact: ${contactEmail}${contactPhone ? `, ${contactPhone}` : ""}
Website: ${siteUrl}
`;

    const mails: Promise<any>[] = [];
    if (adminNotifyEmail) {
      mails.push(
        sendMail({
          to: adminNotifyEmail,
          subject: adminSubject,
          html: adminHtml,
          text: adminText,
          replyTo: safeEmail || undefined,
        })
      );
    }
    if (safeEmail) {
      mails.push(
        sendMail({
          to: safeEmail,
          subject: donorSubject,
          html: donorHtml,
          text: donorText,
          replyTo: contactEmail || undefined,
        })
      );
    }
    if (mails.length) await Promise.allSettled(mails);

    res.status(201).json({
      id: idOf(newSubmission),
      name: newSubmission.name,
      email: newSubmission.email,
      subject: newSubmission.subject,
      message: newSubmission.message,
      status: newSubmission.status,
      readAt: newSubmission.readAt ? new Date(newSubmission.readAt).toISOString() : undefined,
      repliedAt: newSubmission.repliedAt ? new Date(newSubmission.repliedAt).toISOString() : undefined,
      notes: newSubmission.notes || undefined,
      createdAt: newSubmission.createdAt ? new Date(newSubmission.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: newSubmission.updatedAt ? new Date(newSubmission.updatedAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating contact submission:", error);
    res.status(500).json({ error: "Failed to create contact submission" });
  }
};

export const updateContactSubmission: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Get current submission to check status transitions
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const current = await ContactSubmissionModel.findById(id).exec();

    if (!current) {
      return res.status(404).json({ error: "Contact submission not found" });
    }

    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === "read" && !current.readAt) {
        updateData.readAt = new Date();
      }
      if (status === "replied" && !current.repliedAt) {
        updateData.repliedAt = new Date();
      }
    }
    if (notes !== undefined) updateData.notes = notes || undefined;

    const updatedSubmission = await ContactSubmissionModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedSubmission) return res.status(404).json({ error: "Contact submission not found" });

    res.json({
      id: idOf(updatedSubmission),
      name: updatedSubmission.name,
      email: updatedSubmission.email,
      subject: updatedSubmission.subject,
      message: updatedSubmission.message,
      status: updatedSubmission.status,
      readAt: updatedSubmission.readAt ? new Date(updatedSubmission.readAt).toISOString() : undefined,
      repliedAt: updatedSubmission.repliedAt ? new Date(updatedSubmission.repliedAt).toISOString() : undefined,
      notes: updatedSubmission.notes || undefined,
      createdAt: updatedSubmission.createdAt ? new Date(updatedSubmission.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: updatedSubmission.updatedAt ? new Date(updatedSubmission.updatedAt).toISOString() : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating contact submission:", error);
    res.status(500).json({ error: "Failed to update contact submission" });
  }
};

export const deleteContactSubmission: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    await connectMongo();
    const deleted = await ContactSubmissionModel.findByIdAndDelete(id).exec();
    if (!deleted) return res.status(404).json({ error: "Contact submission not found" });
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting contact submission:", error);
    res.status(500).json({ error: "Failed to delete contact submission" });
  }
};

// Analytics API
export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    // Get counts from database (Mongo) for migrated models with error handling
    let totalProjects = 0;
    let activeProjects = 0;
    let totalNewsArticles = 0;
    let totalBooks = 0;
    let totalCommitteeMembers = 0;
    let activeCommitteeMembers = 0;
    let totalDevotions = 0;
    let totalContactSubmissions = 0;
    let newContactSubmissions = 0;

    try {
      await connectMongo();
      const [
        projectsCount,
        activeProjectsCount,
        newsCount,
        booksCount,
        committeeCount,
        activeCommitteeCount,
        devotionsCount,
        contactCount,
        newContactCount,
      ] = await Promise.all([
        ProjectModel.countDocuments({}).exec().catch((e) => { console.error("Error counting projects:", e); return 0; }),
        ProjectModel.countDocuments({ status: "ongoing" }).exec().catch((e) => { console.error("Error counting active projects:", e); return 0; }),
        NewsArticleModel.countDocuments({}).exec().catch((e) => { console.error("Error counting news articles:", e); return 0; }),
        BookModel.countDocuments({}).exec().catch((e) => { console.error("Error counting books:", e); return 0; }),
        CommitteeMemberModel.countDocuments({}).exec().catch((e) => { console.error("Error counting committee members:", e); return 0; }),
        CommitteeMemberModel.countDocuments({ active: true }).exec().catch((e) => { console.error("Error counting active committee members:", e); return 0; }),
        DevotionModel.countDocuments({}).exec().catch((e) => { console.error("Error counting devotions:", e); return 0; }),
        ContactSubmissionModel.countDocuments({}).exec().catch((e) => { console.error("Error counting contact submissions:", e); return 0; }),
        ContactSubmissionModel.countDocuments({ status: "new" }).exec().catch((e) => { console.error("Error counting new contact submissions:", e); return 0; }),
      ]);

      console.log("Analytics counts:", {
        projects: projectsCount,
        activeProjects: activeProjectsCount,
        news: newsCount,
        books: booksCount,
        committee: committeeCount,
        activeCommittee: activeCommitteeCount,
        devotions: devotionsCount,
        contacts: contactCount,
        newContacts: newContactCount,
      });

      totalProjects = projectsCount;
      activeProjects = activeProjectsCount;
      totalNewsArticles = newsCount;
      totalBooks = booksCount;
      totalCommitteeMembers = committeeCount;
      activeCommitteeMembers = activeCommitteeCount;
      totalDevotions = devotionsCount;
      totalContactSubmissions = contactCount;
      newContactSubmissions = newContactCount;
    } catch (dbError: any) {
      console.error("Database query error in analytics:", dbError);
      console.error("Error details:", dbError.message, dbError.stack);
      // Continue with default values (0) if database queries fail
    }

    // Get counts from database for migrated models
    let totalMembers = 0;
    let activeMembers = 0;
    let totalDonations = 0;
    let totalDonationAmount = 0;
    let totalEvents = 0;
    let upcomingEvents = 0;
    let totalSubscribers = 0;
    let activeSubscribers = 0;

    try {
      const [
        membersCount,
        activeMembersCount,
        donationsCount,
        donationsSum,
        eventsCount,
        upcomingEventsCount,
        subscribersCount,
        activeSubscribersCount,
      ] = await Promise.all([
        MemberModel.countDocuments({}).exec().catch(() => 0),
        MemberModel.countDocuments({ status: "Active" }).exec().catch(() => 0),
        DonationModel.countDocuments({}).exec().catch(() => 0),
        DonationModel.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]).catch(() => []),
        EventModel.countDocuments({}).exec().catch(() => 0),
        EventModel.countDocuments({ status: "upcoming" }).exec().catch(() => 0),
        EmailSubscriberModel.countDocuments({}).exec().catch(() => 0),
        EmailSubscriberModel.countDocuments({ status: "active" }).exec().catch(() => 0),
      ]);

      totalMembers = membersCount;
      activeMembers = activeMembersCount;
      totalDonations = donationsCount;
      totalDonationAmount = Array.isArray(donationsSum) && donationsSum[0]?.total ? Number(donationsSum[0].total) : 0;
      totalEvents = eventsCount;
      upcomingEvents = upcomingEventsCount;
      totalSubscribers = subscribersCount;
      activeSubscribers = activeSubscribersCount;
    } catch (e) {
      console.error("Error counting migrated models for analytics:", e);
    }

    const analytics = {
      totalMembers,
      activeMembers,
      totalProjects,
      activeProjects,
      totalDonations,
      totalDonationAmount,
      totalEvents,
      upcomingEvents,
      totalNewsArticles,
      totalBooks,
      totalSubscribers,
      activeSubscribers,
      totalCommitteeMembers,
      activeCommitteeMembers,
      totalDevotions,
      totalContactSubmissions,
      newContactSubmissions,
    };

    res.json(analytics);
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    // Return default values instead of error to prevent frontend crashes
    res.json({
      totalMembers: 0,
      activeMembers: 0,
      totalProjects: 0,
      activeProjects: 0,
      totalDonations: 0,
      totalDonationAmount: 0,
      totalEvents: 0,
      upcomingEvents: 0,
      totalNewsArticles: 0,
      totalBooks: 0,
      totalSubscribers: 0,
      activeSubscribers: 0,
      totalCommitteeMembers: 0,
      activeCommitteeMembers: 0,
      totalDevotions: 0,
      totalContactSubmissions: 0,
      newContactSubmissions: 0,
    });
  }
};
