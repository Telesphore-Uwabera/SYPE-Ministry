import { RequestHandler, Request, Response } from "express";
import { Readable } from "stream";
import { Member, NewsArticle, Project, Event, Donation, FAQ, MediaFile, EmailCampaign, Book, EmailSubscriber, CommitteeMember, Devotion } from "../../client/types/admin";
import { connectMongo, isValidObjectId } from "../lib/mongoose";
import { ApiError, asyncHandler } from "../lib/errorHandling";
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
  MetadataModel,
} from "../models/core";
import { sendMail } from "../lib/mailer";
import { sendMonthlyContributionReminder } from "../lib/reminders";

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
    const text = `Test email - ${siteName}\n\nIf you received this email, your mailing configuration is working.\nSent at: ${when}\nWebsite: ${siteUrl}\n\nContact Us:\nEmail: ${getAdminNotifyEmail()}\nPhone: 0782789883 / 0780430990\nWebsite: ${siteUrl}\n`;

    const { messageId } = await sendMail({ to, subject, html, text });
    res.json({ ok: true, messageId });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    res.status(500).json({ error: error?.message || "Failed to send test email" });
  }
};

// Members API
export const getMembers: RequestHandler = asyncHandler(async (req, res) => {
  await connectMongo();
  const result = await MemberModel.find().sort({ name: 1 }).exec();
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
      association: m.association || "",
      notes: m.notes || "",
    }))
  );
});

export const getMember: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const member = await MemberModel.findById(id).exec();
  if (!member) throw new ApiError(404, "Member not found");
  res.json({
    id: idOf(member),
    name: member.name,
    email: member.email,
    phone: member.phone || "",
    role: member.role,
    status: member.status,
    joinDate: member.joinDate ? new Date(member.joinDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    department: member.department || "",
    association: member.association || "",
    notes: member.notes || "",
  });
});

export const createMember: RequestHandler = asyncHandler(async (req, res) => {
  const { name, email, phone, role, status, joinDate, department, association, notes } = req.body ?? {};
  if (!name || !email || !role || !status) {
    throw new ApiError(400, "name, email, role, and status are required");
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
    association: association || "",
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
    association: created.association || "",
    notes: created.notes || "",
  });
});

export const updateMember: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  const { name, email, phone, role, status, joinDate, department, association, notes } = req.body ?? {};
  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (role !== undefined) updateData.role = role;
  if (status !== undefined) updateData.status = status;
  if (joinDate !== undefined) updateData.joinDate = new Date(joinDate);
  if (department !== undefined) updateData.department = department;
  if (association !== undefined) updateData.association = association;
  if (notes !== undefined) updateData.notes = notes;

  await connectMongo();
  try {
    const updated = await MemberModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
    if (!updated) throw new ApiError(404, "Member not found");
    res.json({
      id: idOf(updated),
      name: updated.name,
      email: updated.email,
      phone: updated.phone || "",
      role: updated.role,
      status: updated.status,
      joinDate: updated.joinDate ? new Date(updated.joinDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      department: updated.department || "",
      association: updated.association || "",
      notes: updated.notes || "",
    });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.email) {
      throw new ApiError(400, "Email address is already in use by another member");
    }
    throw error;
  }
});

export const deleteMember: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await MemberModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Member not found");
  res.status(204).send();
});

// News API
export const getNews: RequestHandler = asyncHandler(async (req, res) => {
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
});

export const getNewsArticle: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const article = await NewsArticleModel.findById(id).exec();

  if (!article) {
    throw new ApiError(404, "Article not found");
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
});

export const createNews: RequestHandler = asyncHandler(async (req, res) => {
  const { title, author, publishDate, excerpt, body, image, featured, category, tags } = req.body;

  if (!title || !author || !excerpt || !body) {
    throw new ApiError(400, "Title, author, excerpt, and body are required");
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
});

export const updateNews: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, author, publishDate, excerpt, body, image, featured, category, tags, views } = req.body;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
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
  if (!updatedArticle) throw new ApiError(404, "Article not found");

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
});

export const deleteNews: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await NewsArticleModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Article not found");
  res.status(204).send();
});

// Projects API
export const getProjects: RequestHandler = asyncHandler(async (req, res) => {
  console.log("Fetching projects from database");

  await connectMongo();
  console.log("Querying ProjectModel.find()...");
  const result = await ProjectModel.find().sort({ createdAt: -1 }).exec();
  console.log(`Found ${result.length} projects in database.`);
  if (result.length > 0) {
    console.log("First project name:", result[0].name);
  }

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
    featured: !!project.featured,
    createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString(),
  }));

  console.log(`Returning ${formattedResult.length} formatted projects`);
  res.json(formattedResult);
});

export const getProject: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const project = await ProjectModel.findById(id).exec();

  if (!project) {
    throw new ApiError(404, "Project not found");
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
    featured: !!project.featured,
    createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : new Date().toISOString(),
  });
});

export const createProject: RequestHandler = asyncHandler(async (req, res) => {
  const { name, category, topic, description, distribution, status, year, teamMembers, startDate, endDate, budget, featured } = req.body;

  if (!name || !category || !topic || !description || !distribution || !status || !year) {
    throw new ApiError(400, "Name, category, topic, description, distribution, status, and year are required");
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
    featured: !!featured,
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
    featured: !!newProject.featured,
    createdAt: newProject.createdAt ? new Date(newProject.createdAt).toISOString() : new Date().toISOString(),
  });
});

export const updateProject: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, topic, description, distribution, status, year, teamMembers, startDate, endDate, budget, featured } = req.body;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
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
  if (featured !== undefined) updateData.featured = !!featured;

  await connectMongo();
  const updatedProject = await ProjectModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  if (!updatedProject) throw new ApiError(404, "Project not found");

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
    featured: !!updatedProject.featured,
    createdAt: updatedProject.createdAt ? new Date(updatedProject.createdAt).toISOString() : new Date().toISOString(),
  });
});

export const deleteProject: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await ProjectModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Project not found");
  res.status(204).send();
});

// Events API
export const getEvents: RequestHandler = asyncHandler(async (req, res) => {
  await connectMongo();
  const status = (req.query.status as string | undefined) || undefined;
  const upcoming = req.query.upcoming === "true";
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

  const where: any = {};
  if (status) where.status = status;
  if (upcoming) {
    // Relaxed filter: either status is explicitly 'upcoming' OR the date is today or later
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    where.$or = [
      { status: "upcoming" },
      { date: { $gte: startOfToday } }
    ];
  }

  const events = await EventModel.find(where)
    .sort({ date: upcoming ? 1 : -1 })
    .limit(limit || 100)
    .exec();

  res.json(events.map((e: any) => ({
    id: idOf(e),
    title: e.title,
    description: e.description,
    date: e.date.toISOString().split("T")[0],
    time: e.time,
    location: e.location,
    category: e.category,
    status: e.status,
    image: e.image,
    registrationUrl: e.registrationUrl,
    createdAt: e.createdAt ? e.createdAt.toISOString() : new Date().toISOString(),
  })));
});

export const getEvent: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const event = await EventModel.findById(id).exec();
  if (!event) throw new ApiError(404, "Event not found");
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
    attendees: (event as any).attendees || [],
    status: event.status,
  });
});

export const createEvent: RequestHandler = asyncHandler(async (req, res) => {
  const { title, description, date, time, location, category, rsvpRequired, maxAttendees, status } = req.body ?? {};
  if (!title || !description || !date || !time || !location || !category || !status) {
    throw new ApiError(400, "title, description, date, time, location, category, and status are required");
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
});

export const updateEvent: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
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
  if (!updated) throw new ApiError(404, "Event not found");
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
    attendees: (updated as any).attendees || [],
    status: updated.status,
  });
});

export const deleteEvent: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await EventModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Event not found");
  res.status(204).send();
});

// Donations API
export const getDonations: RequestHandler = asyncHandler(async (req, res) => {
  await connectMongo();
  const result = await DonationModel.find().sort({ date: -1 }).exec();
  res.json(
    result.map((d: any) => ({
      id: idOf(d),
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      donorPhone: d.donorPhone || "",
      amount: d.amount,
      amountPaid: d.amountPaid || 0,
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
});

export const getDonation: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const donation = await DonationModel.findById(id).exec();
  if (!donation) throw new ApiError(404, "Donation not found");
  res.json({
    id: idOf(donation),
    donorName: donation.donorName,
    donorEmail: donation.donorEmail,
    donorPhone: donation.donorPhone || "",
    amount: donation.amount,
    amountPaid: donation.amountPaid || 0,
    currency: donation.currency || "RWF",
    date: donation.date ? new Date(donation.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    type: donation.type,
    paymentMethod: donation.paymentMethod || "",
    paymentStatus: donation.paymentStatus || "unpaid",
    receiptSent: !!donation.receiptSent,
    notes: donation.notes || "",
    projectId: donation.projectId || "",
  });
});

export const createDonation: RequestHandler = asyncHandler(async (req, res) => {
  const { donorName, donorEmail, donorPhone, amount, amountPaid, currency, date, type, paymentMethod, paymentStatus, projectId, notes, receiptSent, paymentDeadline } = req.body ?? {};
  if (!donorName || !donorEmail || amount === undefined || amount === null || !type || !paymentMethod) {
    throw new ApiError(400, "Donor name, email, amount, type, and payment method are required");
  }

  const baseAmount = Number(amount) || 0;
  const status = String(paymentStatus || "unpaid");
  let paid = Number(amountPaid || 0) || 0;
  if (status === "paid") paid = baseAmount;
  if (status === "unpaid") paid = 0;
  if (paid < 0 || paid > baseAmount) {
    throw new ApiError(400, "amountPaid must be between 0 and amount");
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
    paymentDeadline: paymentDeadline ? new Date(paymentDeadline) : undefined,
  });
  res.status(201).json({
    id: idOf(created),
    donorName: created.donorName,
    donorEmail: created.donorEmail,
    donorPhone: created.donorPhone || "",
    amount: created.amount,
    amountPaid: created.amountPaid || 0,
    currency: created.currency || "RWF",
    date: created.date ? new Date(created.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    type: created.type,
    paymentMethod: created.paymentMethod || "",
    paymentStatus: created.paymentStatus || "unpaid",
    projectId: created.projectId || "",
    receiptSent: !!created.receiptSent,
    notes: created.notes || "",
    paymentDeadline: created.paymentDeadline ? new Date(created.paymentDeadline).toISOString().split("T")[0] : undefined,
  });
});

// Public Donations API (used by the public donation form)
// Sends:
// - Acknowledgement email to the donor
// - Notification email to admins
export const createPublicDonation: RequestHandler = async (req, res) => {
  try {
    const { donorName, donorEmail, donorPhone, amount, amountPaid, currency, date, type, paymentMethod, paymentStatus, projectId, notes, paymentDeadline } = req.body ?? {};
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
      paymentDeadline: paymentDeadline ? new Date(paymentDeadline) : undefined,
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
          <p style="margin: 0 0 6px;"><strong>Status:</strong> ${escapeHtml(status)}</p>
          ${paymentDeadline ? `<p style="margin: 0;"><strong>Payment Deadline:</strong> ${escapeHtml(new Date(paymentDeadline).toLocaleDateString())}</p>` : ""}
        </div>
        <p style="margin: 16px 0 0;">
          <strong>Note:</strong> This is not an official receipt. An official receipt will be sent after payment is confirmed by our administrators.
        </p>
        <p style="margin: 16px 0 0;">
          <em>"Whatever you do, work at it with all your heart, as working for the Lord"</em> (Colossians 3:23). 
          We pray that God will bless you abundantly for your faithfulness and generosity.
        </p>
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 12px 0; font-weight: bold; color: #2c5282;">Contact Us:</p>
          <p style="margin: 4px 0; font-size: 14px;">📧 Email: <a href="mailto:${escapeHtml(contactEmail)}" style="color: #2c5282;">${escapeHtml(contactEmail)}</a></p>
          <p style="margin: 4px 0; font-size: 14px;">📱 Phone: <a href="tel:0782789883" style="color: #2c5282;">0782789883</a> / <a href="tel:0780430990" style="color: #2c5282;">0780430990</a></p>
          <p style="margin: 4px 0; font-size: 14px;">🌐 Website: <a href="${escapeHtml(siteUrl)}" style="color: #2c5282;">${escapeHtml(siteUrl)}</a></p>
        </div>
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
${paymentDeadline ? `Payment Deadline: ${new Date(paymentDeadline).toLocaleDateString()}` : ""}

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
          <p style="margin: 0 0 6px;"><strong>Project:</strong> ${escapeHtml(String(projectId || ""))}</p>
          ${paymentDeadline ? `<p style="margin: 0;"><strong>Deadline:</strong> ${escapeHtml(new Date(paymentDeadline).toLocaleDateString())}</p>` : ""}
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
${paymentDeadline ? `Deadline: ${new Date(paymentDeadline).toLocaleDateString()}` : ""}
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
      paymentDeadline: created.paymentDeadline ? new Date(created.paymentDeadline).toISOString().split("T")[0] : undefined,
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
    const { donorName, donorEmail, donorPhone, amount, amountPaid, currency, date, type, paymentMethod, paymentStatus, projectId, notes, receiptSent, paymentDeadline } = req.body ?? {};

    await connectMongo();

    const existing = await DonationModel.findById(id).exec();
    if (!existing) return res.status(404).json({ error: "Donation not found" });

    // Track if receipt was already sent before this update
    const wasReceiptSent = existing.receiptSent;

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
    if (paymentDeadline !== undefined) updateData.paymentDeadline = paymentDeadline ? new Date(paymentDeadline) : null;

    updateData.amountPaid = nextPaid;

    const updated = await DonationModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) return res.status(404).json({ error: "Donation not found" });

    // Auto-send updated receipt if receipt was already sent and donor has email
    const shouldSendUpdatedReceipt = wasReceiptSent && updated.donorEmail;

    if (shouldSendUpdatedReceipt) {
      // Send updated receipt in background (non-blocking)
      const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
      const siteUrl = (process.env.SITE_URL || "https://sypeministry.org").trim().replace(/\/+$/, "");
      const contactEmail = (process.env.CONTACT_EMAIL || "sypeministry@gmail.com").trim();
      const contactPhone = (process.env.CONTACT_PHONE || "").trim();

      const receiptNo = idOf(updated);
      const totalAmount = Number(updated.amount || 0);
      const received = nextStatus === "paid" ? totalAmount : nextStatus === "installment" ? nextPaid : 0;
      const remaining = Math.max(0, totalAmount - received);
      const currencyText = String(updated.currency || "RWF");

      const donationDate = updated.date ? new Date(updated.date) : new Date();
      const donationDateText = donationDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

      const deadlineDate = updated.paymentDeadline ? new Date(updated.paymentDeadline) : null;
      const deadlineText = deadlineDate ? deadlineDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "None";

      const donorNameText = String(updated.donorName || "Donor");
      const safeName = escapeHtml(donorNameText);

      // Generate receipt email (same template as sendDonationReceipt)
      const subject = `Updated Donation Receipt - ${siteName}`;

      const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Updated Donation Receipt - ${escapeHtml(siteName)}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            .receipt-card { box-shadow: none !important; border: 2px solid #000 !important; }
          }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .receipt-container {
            max-width: 700px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .receipt-card {
            border: 3px solid #2c5282;
            border-radius: 12px;
            padding: 40px;
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .letterhead {
            text-align: center;
            border-bottom: 3px double #2c5282;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .ministry-name {
            font-size: 28px;
            font-weight: bold;
            color: #2c5282;
            margin: 0 0 8px 0;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .ministry-tagline {
            font-size: 13px;
            color: #5a6c7d;
            font-style: italic;
            margin: 0;
          }
          .receipt-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .update-notice {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
            color: #856404;
          }
          .scripture-box {
            background-color: #eef2f7;
            border-left: 4px solid #2c5282;
            padding: 15px 20px;
            margin: 20px 0;
            font-style: italic;
            color: #2c5282;
          }
          .receipt-details {
            border: 2px solid #2c5282;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            background-color: #ffffff;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-label {
            font-weight: 600;
            color: #2d3748;
          }
          .detail-value {
            color: #1a1a1a;
            text-align: right;
          }
          .blessing {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            font-style: italic;
            color: #92400e;
          }
          .signature-section {
            margin-top: 40px;
            text-align: center;
          }
          .signature-line {
            border-top: 2px solid #2c5282;
            width: 300px;
            margin: 40px auto 10px;
          }
          .official-stamp {
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            border: 2px dashed #2c5282;
            border-radius: 8px;
            font-size: 12px;
            color: #2c5282;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-card">
            <div class="letterhead">
              <div class="ministry-name">${escapeHtml(siteName)}</div>
              <div class="ministry-tagline">Equipping Young Professionals for Evangelism</div>
              <div style="font-size: 12px; color: #5a6c7d; margin-top: 10px;">
                ${escapeHtml(contactEmail)} ${contactPhone ? `| ${escapeHtml(contactPhone)}` : ""}<br>
                ${escapeHtml(siteUrl)}
              </div>
            </div>

            <div class="receipt-title">Updated Official Donation Receipt</div>
            
            <div class="update-notice">
              UPDATED RECEIPT - This supersedes any previous receipt for this donation
            </div>
            
            <div class="official-stamp">
              FOR TAX AND RECORD-KEEPING PURPOSES
            </div>

            <div style="font-size: 16px; margin: 20px 0;">
              <strong>Dear ${safeName},</strong>
            </div>

            <p style="margin: 15px 0;">
              <strong>May God bless you abundantly!</strong> This is your updated receipt reflecting the latest information for your donation.
            </p>

            <div class="scripture-box">
              "Bring the whole tithe into the storehouse... and see if I will not throw open the floodgates 
              of heaven and pour out so much blessing that there will not be room enough to store it."
              <br><strong>- Malachi 3:10</strong>
            </div>

            <div class="receipt-details">
              <div class="detail-row">
                <span class="detail-label">Receipt Number:</span>
                <span class="detail-value">#${escapeHtml(receiptNo)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date of Donation:</span>
                <span class="detail-value">${escapeHtml(donationDateText)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Deadline:</span>
                <span class="detail-value" style="${deadlineDate && deadlineDate < new Date() ? 'color: #e53e3e; font-weight: bold;' : ''}">${escapeHtml(deadlineText)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Donor Name:</span>
                <span class="detail-value">${safeName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Donor Email:</span>
                <span class="detail-value">${escapeHtml(String(updated.donorEmail || ""))}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Donation Type:</span>
                <span class="detail-value">${escapeHtml(String(updated.type || ""))}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">${escapeHtml(String(updated.paymentMethod || ""))}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <span class="detail-value">${escapeHtml(String(updated.paymentStatus || ""))}</span>
              </div>
              <div class="detail-row" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #2c5282;">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value">${escapeHtml(totalAmount.toLocaleString())} ${escapeHtml(currencyText)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Amount Paid:</span>
                <span class="detail-value">${escapeHtml(received.toLocaleString())} ${escapeHtml(currencyText)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Remaining Balance:</span>
                <span class="detail-value">${escapeHtml(remaining.toLocaleString())} ${escapeHtml(currencyText)}</span>
              </div>
            </div>

            <div class="blessing">
              We pray that the Lord will multiply your seed for sowing and increase your harvest 
              of righteousness (2 Corinthians 9:10). May His grace and favor rest upon you and your family.
            </div>

            <p style="margin: 20px 0;">
              Your partnership in spreading the gospel and equipping young professionals for evangelism 
              is deeply appreciated. This receipt confirms your generous contribution to God's work.
            </p>

            <div class="signature-section">
              <div class="signature-line"></div>
              <div style="margin-top: 10px; font-weight: bold;">Authorized Signature</div>
              <div style="margin-top: 5px; font-size: 14px; color: #5a6c7d;">${escapeHtml(siteName)}</div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; font-size: 14px;">
              <div class="scripture-box" style="margin: 0; font-size: 14px;">
                "Freely you have received; freely give." - Matthew 10:8
              </div>
              
              <p style="font-size: 13px; text-align: center; margin-top: 20px; color: #5a6c7d;">
                This is an updated official receipt. Please retain for your records.<br>
                If you have any questions, contact us at ${escapeHtml(contactEmail)}${contactPhone ? ` or ${escapeHtml(contactPhone)}` : ""}.
              </p>

              <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #5a6c7d; font-style: italic;">
                In Christ's service,<br>
                <strong>${escapeHtml(siteName)}</strong><br>
                "Go therefore and make disciples of all nations" - Matthew 28:19
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
      `;

      // Send email in background (non-blocking)
      Promise.allSettled([
        sendMail({
          to: String(updated.donorEmail),
          subject,
          html,
          text: `Updated Donation Receipt - ${siteName}\nReceipt #: ${receiptNo}\nThis is your updated receipt.\n\nTotal: ${totalAmount.toLocaleString()} ${currencyText}\nReceived: ${received.toLocaleString()} ${currencyText}\nRemaining: ${remaining.toLocaleString()} ${currencyText}`,
          replyTo: contactEmail || undefined,
        })
      ]).catch(err => console.error("Error sending updated receipt:", err));
    }

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
      paymentDeadline: updated.paymentDeadline ? new Date(updated.paymentDeadline).toISOString().split("T")[0] : undefined,
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

export const sendDonationReceipt: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");

  await connectMongo();
  const donation = await DonationModel.findById(id).exec();
  if (!donation) throw new ApiError(404, "Donation not found");

  const donorEmail = String(donation.donorEmail || "").trim();
  const donorName = String(donation.donorName || "").trim();
  if (!donorEmail) throw new ApiError(400, "Donor email is missing");

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

  const deadlineDate = donation.paymentDeadline ? new Date(donation.paymentDeadline) : null;
  const deadlineText = deadlineDate ? deadlineDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "None";

  const subject = `Donation Receipt - ${siteName}`;
  const safeName = escapeHtml(donorName || "Donor");

  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-card">
            <!-- Letterhead -->
            <div class="letterhead">
              <div class="ministry-name">${escapeHtml(siteName)}</div>
              <div class="ministry-tagline">Equipping Young Professionals for Evangelism</div>
              <div class="contact-info" style="margin-top: 10px;">
                ${escapeHtml(contactEmail)} ${contactPhone ? `| ${escapeHtml(contactPhone)}` : ""}<br>
                ${escapeHtml(siteUrl)}
              </div>
            </div>

            <!-- Receipt Title -->
            <div class="receipt-title">Official Donation Receipt</div>
            
            <div class="official-stamp">
              FOR TAX AND RECORD-KEEPING PURPOSES
            </div>

            <!-- Greeting -->
            <div class="greeting">
              <strong>Dear ${safeName},</strong>
            </div>

            <p style="margin: 15px 0;">
              <strong>May God bless you abundantly!</strong> Thank you for your generous contribution to our ministry.
            </p>

            <!-- Scripture -->
            <div class="scripture-box">
              "Bring the whole tithe into the storehouse... and see if I will not throw open the floodgates 
              of heaven and pour out so much blessing that there will not be room enough to store it."
              <br><strong>- Malachi 3:10</strong>
            </div>

            <!-- Receipt Details -->
            <div class="receipt-details">
              <div class="detail-row">
                <span class="detail-label">Receipt Number:</span>
                <span class="detail-value">#${escapeHtml(receiptNo)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date of Donation:</span>
                <span class="detail-value">${escapeHtml(donationDateText)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Deadline:</span>
                <span class="detail-value" style="${deadlineDate && deadlineDate < new Date() ? 'color: #e53e3e; font-weight: bold;' : ''}">${escapeHtml(deadlineText)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Donor Name:</span>
                <span class="detail-value">${safeName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Donor Email:</span>
                <span class="detail-value">${escapeHtml(donorEmail)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Donation Type:</span>
                <span class="detail-value">${escapeHtml(String(donation.type || ""))}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">${escapeHtml(String(donation.paymentMethod || ""))}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <span class="detail-value">${escapeHtml(String(donation.paymentStatus || ""))}</span>
              </div>
              <div class="detail-row" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #2c5282;">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value">${escapeHtml(amount.toLocaleString())} ${escapeHtml(currency)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Amount Paid:</span>
                <span class="detail-value">${escapeHtml(received.toLocaleString())} ${escapeHtml(currency)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Remaining Balance:</span>
                <span class="detail-value">${escapeHtml(remaining.toLocaleString())} ${escapeHtml(currency)}</span>
              </div>
            </div>

            <!-- Blessing and Prayer -->
            <div class="blessing">
              We pray that the Lord will multiply your seed for sowing and increase your harvest 
              of righteousness (2 Corinthians 9:10). May His grace and favor rest upon you and your family.
            </div>

            <p style="margin: 20px 0;">
              Your partnership in spreading the gospel and equipping young professionals for evangelism 
              is deeply appreciated. This receipt confirms your generous contribution to God's work.
            </p>

            <!-- Signature Section -->
            <div class="signature-section">
              <div class="signature-line"></div>
              <div style="margin-top: 10px; font-weight: bold;">Authorized Signature</div>
              <div style="margin-top: 5px; font-size: 14px; color: #5a6c7d;">${escapeHtml(siteName)}</div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="scripture-box" style="margin: 0; font-size: 14px;">
                "Freely you have received; freely give." - Matthew 10:8
              </div>
              
              <p style="font-size: 13px; text-align: center; margin-top: 20px; color: #5a6c7d;">
                This is an official receipt. Please retain for your records.<br>
                If you have any questions, contact us at ${escapeHtml(contactEmail)}${contactPhone ? ` or ${escapeHtml(contactPhone)}` : ""}.
              </p>

              <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #5a6c7d; font-style: italic;">
                In Christ's service,<br>
                <strong>${escapeHtml(siteName)}</strong><br>
                "Go therefore and make disciples of all nations" - Matthew 28:19
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
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
});

// FAQs API
export const getFAQs: RequestHandler = asyncHandler(async (req, res) => {
  await connectMongo();
  const result = await FAQModel.find().sort({ category: 1, order: 1 }).exec();

  const formattedResult = result.map((faq) => ({
    id: idOf(faq),
    category: faq.category,
    question: faq.question,
    answer: faq.answer,
    order: faq.order,
    createdAt: (faq as any).createdAt ? new Date((faq as any).createdAt).toISOString() : new Date().toISOString(),
  }));

  res.json(formattedResult);
});

export const getFAQ: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const faq = await FAQModel.findById(id).exec();

  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  res.json({
    id: idOf(faq),
    category: faq.category,
    question: faq.question,
    answer: faq.answer,
    order: faq.order,
    createdAt: (faq as any).createdAt ? new Date((faq as any).createdAt).toISOString() : new Date().toISOString(),
  });
});

export const createFAQ: RequestHandler = asyncHandler(async (req, res) => {
  const { category, question, answer, order } = req.body;

  if (!category || !question || !answer) {
    throw new ApiError(400, "Category, question, and answer are required");
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
    createdAt: (newFAQ as any).createdAt ? new Date((newFAQ as any).createdAt).toISOString() : new Date().toISOString(),
  });
});

export const updateFAQ: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category, question, answer, order } = req.body;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  const updateData: any = {};
  if (category !== undefined) updateData.category = category;
  if (question !== undefined) updateData.question = question;
  if (answer !== undefined) updateData.answer = answer;
  if (order !== undefined) updateData.order = order;

  await connectMongo();
  const updatedFAQ = await FAQModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  if (!updatedFAQ) throw new ApiError(404, "FAQ not found");

  res.json({
    id: idOf(updatedFAQ),
    category: updatedFAQ.category,
    question: updatedFAQ.question,
    answer: updatedFAQ.answer,
    order: updatedFAQ.order,
    createdAt: (updatedFAQ as any).createdAt ? new Date((updatedFAQ as any).createdAt).toISOString() : new Date().toISOString(),
  });
});

export const deleteFAQ: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await FAQModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "FAQ not found");
  res.status(204).send();
});

// Media API
export const getMedia: RequestHandler = asyncHandler(async (req, res) => {
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
});

export const getMediaFile: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const file = await MediaFileModel.findById(id).exec();
  if (!file) throw new ApiError(404, "Media file not found");
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
});

export const createMedia: RequestHandler = asyncHandler(async (req, res) => {
  const { name, type, url, size, category, description, tags, thumbnail, youtubeUrl } = req.body ?? {};
  if (!name || !type || !url || size === undefined || size === null) {
    throw new ApiError(400, "Name, type, url, and size are required");
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
});

export const updateMedia: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
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
  if (!updated) throw new ApiError(404, "Media file not found");
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
});

export const deleteMedia: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await MediaFileModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Media file not found");
  res.status(204).send();
});

// Books API
export const getBooks: RequestHandler = asyncHandler(async (req, res) => {
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
});

export const getBook: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const book = await BookModel.findById(id).exec();

  if (!book) {
    throw new ApiError(404, "Book not found");
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
});

export const createBook: RequestHandler = asyncHandler(async (req, res) => {
  const { title, author, category, description, coverImage, fileUrl, isbn, publisher, publishDate, language, pages, tags, featured } = req.body;

  if (!title || !category) {
    throw new ApiError(400, "Title and category are required");
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
});

export const updateBook: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, author, category, description, coverImage, fileUrl, isbn, publisher, publishDate, language, pages, tags, featured } = req.body;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
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
  if (!updatedBook) throw new ApiError(404, "Book not found");

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
});

export const deleteBook: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await BookModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Book not found");
  res.status(204).send();
});

export const trackBookDownload: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const updatedBook = await BookModel.findByIdAndUpdate(
    id,
    { $inc: { downloads: 1 } },
    { new: true }
  ).exec();
  if (!updatedBook) throw new ApiError(404, "Book not found");
  res.json({ downloads: updatedBook.downloads });
});

function safePdfFilename(title: string | undefined) {
  const base = (title || "book")
    .toString()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${base || "book"}.pdf`;
}

export const downloadBookPdf: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");

  await connectMongo();
  const book = await BookModel.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true }).exec();
  if (!book) throw new ApiError(404, "Book not found");
  if (!book.fileUrl) throw new ApiError(400, "Book fileUrl is missing");

  const upstream = await fetch(book.fileUrl, { cache: "no-store" as any });
  if (!upstream.ok || !upstream.body) {
    throw new ApiError(502, "Failed to fetch PDF from storage");
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
});

export const viewBookPdf: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");

  await connectMongo();
  const book = await BookModel.findById(id).exec();
  if (!book) throw new ApiError(404, "Book not found");
  if (!book.fileUrl) throw new ApiError(400, "Book fileUrl is missing");

  const upstream = await fetch(book.fileUrl, { cache: "no-store" as any });
  if (!upstream.ok || !upstream.body) {
    throw new ApiError(502, "Failed to fetch PDF from storage");
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
});

// Email Subscribers API
export const getSubscribers: RequestHandler = asyncHandler(async (req, res) => {
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
});

export const getSubscriber: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const subscriber = await EmailSubscriberModel.findById(id).exec();
  if (!subscriber) throw new ApiError(404, "Subscriber not found");
  res.json({
    id: idOf(subscriber),
    email: subscriber.email,
    name: subscriber.name || undefined,
    subscribedAt: subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toISOString() : new Date().toISOString(),
    status: subscriber.status || "active",
    source: subscriber.source || "footer",
    tags: subscriber.tags || [],
  });
});

export const createSubscriber: RequestHandler = asyncHandler(async (req, res) => {
  const { email, name, source, status } = req.body ?? {};
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new ApiError(400, "Valid email is required");
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
      throw new ApiError(400, "Email is already subscribed");
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
    const welcomeText = `Welcome to ${siteName} - God bless you!\n\nDear ${subscriberName || "Friend in Christ"},\n\nGrace and peace be with you! Thank you for joining our community of young professionals committed to evangelism and serving God.\n\nYou will now receive updates, devotional resources, ministry news, and opportunities to be part of God's work through ${siteName}. "How beautiful are the feet of those who bring good news!" (Romans 10:15)\n\nVisit our website: ${siteUrl}\n\nMay the Lord bless you and keep you. May His face shine upon you and be gracious to you (Numbers 6:24-25).\n\nIn Christian fellowship,\n${siteName}\n\nIf you didn't subscribe, you can unsubscribe at: ${siteUrl}/unsubscribe\n`;
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
  res.status(201).json(payload);
});

export const updateSubscriber: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  const { email, name, status, source, tags } = req.body ?? {};
  const updateData: any = {};
  if (email !== undefined) updateData.email = String(email).toLowerCase();
  if (name !== undefined) updateData.name = name || undefined;
  if (status !== undefined) updateData.status = status;
  if (source !== undefined) updateData.source = source;
  if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];

  await connectMongo();
  const updated = await EmailSubscriberModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  if (!updated) throw new ApiError(404, "Subscriber not found");
  res.json({
    id: idOf(updated),
    email: updated.email,
    name: updated.name || undefined,
    subscribedAt: updated.subscribedAt ? new Date(updated.subscribedAt).toISOString() : new Date().toISOString(),
    status: updated.status || "active",
    source: updated.source || "footer",
    tags: updated.tags || [],
  });
});

export const deleteSubscriber: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await EmailSubscriberModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Subscriber not found");
  res.status(204).send();
});

export const unsubscribe: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.body ?? {};
  if (!email) throw new ApiError(400, "Email is required");
  const lowerEmail = String(email).toLowerCase();
  await connectMongo();
  const updated = await EmailSubscriberModel.findOneAndUpdate(
    { email: lowerEmail },
    { status: "unsubscribed" },
    { new: true }
  ).exec();
  if (!updated) throw new ApiError(404, "Email not found in our subscribers list");

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
});

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

export const getEmailCampaigns: RequestHandler = asyncHandler(async (_req, res) => {
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
});

export const getEmailCampaign: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const c = await EmailCampaignModel.findById(id).exec();
  if (!c) throw new ApiError(404, "Campaign not found");
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
});

export const createEmailCampaign: RequestHandler = asyncHandler(async (req, res) => {
  const { subject, body, status, scheduledDate, recipients } = req.body ?? {};
  if (!subject || !body) throw new ApiError(400, "subject and body are required");
  const nextStatus = String(status || "draft");
  if (!["draft", "scheduled", "sent"].includes(nextStatus)) {
    throw new ApiError(400, "Invalid status");
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
});

export const updateEmailCampaign: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  const { subject, body, status, scheduledDate, recipients } = req.body ?? {};
  const updateData: any = {};
  if (subject !== undefined) updateData.subject = String(subject);
  if (body !== undefined) updateData.body = String(body);
  if (status !== undefined) {
    const nextStatus = String(status || "draft");
    if (!["draft", "scheduled", "sent"].includes(nextStatus)) {
      throw new ApiError(400, "Invalid status");
    }
    updateData.status = nextStatus;
    if (nextStatus === "sent") updateData.sentDate = new Date();
  }
  if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : undefined;
  if (recipients !== undefined) updateData.recipients = Array.isArray(recipients) ? recipients.map(String).map((x) => x.trim()).filter(Boolean) : [];

  await connectMongo();
  const updated = await EmailCampaignModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  if (!updated) throw new ApiError(404, "Campaign not found");
  res.json({
    id: idOf(updated),
    subject: updated.subject,
    body: updated.body,
    recipients: updated.recipients || [],
    sentDate: updated.sentDate ? new Date(updated.sentDate).toISOString() : undefined,
    status: updated.status || "draft",
    scheduledDate: updated.scheduledDate ? new Date(updated.scheduledDate).toISOString() : undefined,
  });
});

export const deleteEmailCampaign: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await EmailCampaignModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Campaign not found");
  res.status(204).send();
});

export const sendEmailCampaign: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");

  await connectMongo();
  const campaign = await EmailCampaignModel.findById(id).exec();
  if (!campaign) throw new ApiError(404, "Campaign not found");
  if (String(campaign.status || "draft") === "sent") {
    throw new ApiError(400, "Campaign already sent");
  }

  // Determine recipients
  let recipients: string[] = Array.isArray(campaign.recipients) ? campaign.recipients.map(String) : [];
  recipients = recipients.map((x) => x.trim()).filter(Boolean);
  if (recipients.length === 0) {
    const [subs, members] = await Promise.all([
      EmailSubscriberModel.find({ status: "active" }).select({ email: 1 }).exec(),
      MemberModel.find({ status: "Active" }).select({ email: 1 }).exec(),
    ]);
    const subEmails = subs.map((s: any) => String(s.email || "").trim());
    const memberEmails = members.map((m: any) => String(m.email || "").trim());
    recipients = [...subEmails, ...memberEmails].filter(Boolean);
  }
  // de-dup
  recipients = Array.from(new Set(recipients)).filter((e) => e.includes("@"));
  if (recipients.length === 0) throw new ApiError(400, "No recipients found (need active subscribers)");

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

  // If everything failed, throw error so next() handles it via ApiError if we want,
  // but here the original code returned 500 with custom payload. 
  // We'll return 200 with partial success info instead of throwing if some succeeded.
  if (sent === 0) {
    throw new ApiError(500, errors[0]?.error || "Campaign failed to send");
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
});

// Committee Members API
export const getCommitteeMembers: RequestHandler = asyncHandler(async (req, res) => {
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
});

export const getCommitteeMember: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const member = await CommitteeMemberModel.findById(id).exec();

  if (!member) {
    throw new ApiError(404, "Committee member not found");
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
});

export const createCommitteeMember: RequestHandler = asyncHandler(async (req, res) => {
  const { position, name, church, phone, category, image, email, order, active } = req.body;

  if (!position || !name || !church || !phone || !category) {
    throw new ApiError(400, "Position, name, church, phone, and category are required");
  }

  // Validate category
  const validCategories = ["leadership", "team", "auditor", "asa_representatives", "board_counsellors"];
  if (!validCategories.includes(category)) {
    throw new ApiError(400, `Invalid category. Must be one of: ${validCategories.join(", ")}`);
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
});

export const updateCommitteeMember: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { position, name, church, phone, category, image, email, order, active } = req.body;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
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
  if (!updatedMember) throw new ApiError(404, "Committee member not found");

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
});

export const deleteCommitteeMember: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await CommitteeMemberModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Committee member not found");
  res.status(204).send();
});

// Devotions API
export const getDevotions: RequestHandler = asyncHandler(async (req, res) => {
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
});

export const getDevotion: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const devotion = await DevotionModel.findById(id).exec();

  if (!devotion) {
    throw new ApiError(404, "Devotion not found");
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
});

export const createDevotion: RequestHandler = asyncHandler(async (req, res) => {
  const { title, date, excerpt, content, image, featuredVideoUrl, featuredVideoThumbnail, featuredVideoTitle } = req.body;

  if (!title || !date || !excerpt) {
    throw new ApiError(400, "Title, date, and excerpt are required");
  }

  // Validate date format
  let devotionDate: Date;
  devotionDate = new Date(date);
  if (isNaN(devotionDate.getTime())) {
    throw new ApiError(400, "Invalid date format");
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
});

export const updateDevotion: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, excerpt, content, image, featuredVideoUrl, featuredVideoThumbnail, featuredVideoTitle } = req.body;

  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
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
  if (!updatedDevotion) throw new ApiError(404, "Devotion not found");

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
});

export const deleteDevotion: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await DevotionModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Devotion not found");
  res.status(204).send();
});

// Contact Submissions API
export const getContactSubmissions: RequestHandler = asyncHandler(async (req, res) => {
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
});

export const getContactSubmission: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const submission = await ContactSubmissionModel.findById(id).exec();

  if (!submission) {
    throw new ApiError(404, "Contact submission not found");
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
});

export const createContactSubmission: RequestHandler = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "Name, email, subject, and message are required");
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
});

export const updateContactSubmission: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  // Get current submission to check status transitions
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const current = await ContactSubmissionModel.findById(id).exec();

  if (!current) {
    throw new ApiError(404, "Contact submission not found");
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
  if (!updatedSubmission) throw new ApiError(404, "Contact submission not found");

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
});

export const deleteContactSubmission: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  await connectMongo();
  const deleted = await ContactSubmissionModel.findByIdAndDelete(id).exec();
  if (!deleted) throw new ApiError(404, "Contact submission not found");
  res.status(204).send();
});

// Administrative Actions
export const triggerMonthlyReminders: RequestHandler = asyncHandler(async (req, res) => {
  await connectMongo();

  const today = new Date();
  const currentMonthKey = `last_monthly_reminder_${today.getFullYear()}_${today.getMonth() + 1}`;

  console.log(`[Admin] Manually triggering monthly reminders for ${currentMonthKey}`);

  await sendMonthlyContributionReminder();

  await MetadataModel.findOneAndUpdate(
    { key: currentMonthKey },
    { key: currentMonthKey, value: { sentAt: new Date(), status: "success", triggeredBy: "admin" } },
    { upsert: true }
  );

  res.json({ ok: true, message: "Monthly reminders sending initiated." });
});

export const getAnalytics: RequestHandler = asyncHandler(async (req, res) => {
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
});
