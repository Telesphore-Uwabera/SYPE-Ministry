import { RequestHandler, Request, Response } from "express";
import { Member, NewsArticle, Project, Event, Donation, FAQ, MediaFile, EmailCampaign, Book, EmailSubscriber, CommitteeMember, Devotion } from "../../client/types/admin";
import { prisma } from "../lib/prisma";

// In-memory storage (replace with database in production)
let members: Member[] = [];
let news: NewsArticle[] = [];
let projects: Project[] = [];
let events: Event[] = [];
let donations: Donation[] = [];
let faqs: FAQ[] = [];
let media: MediaFile[] = [];
let campaigns: EmailCampaign[] = [];
let books: Book[] = [];
let subscribers: EmailSubscriber[] = [];
let committeeMembers: CommitteeMember[] = [];
// Devotions are now stored in database via Prisma
let contactSubmissions: Array<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  readAt?: string;
  repliedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}> = [];

// Helper function to generate ID
const generateId = () => Date.now().toString();

// Members API
export const getMembers: RequestHandler = (req, res) => {
  res.json(members);
};

export const getMember: RequestHandler = (req, res) => {
  const { id } = req.params;
  const member = members.find((m) => m.id === id);
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }
  res.json(member);
};

export const createMember: RequestHandler = (req, res) => {
  const newMember: Member = {
    id: generateId(),
    ...req.body,
  };
  members.push(newMember);
  res.status(201).json(newMember);
};

export const updateMember: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Member not found" });
  }
  members[index] = { ...members[index], ...req.body };
  res.json(members[index]);
};

export const deleteMember: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Member not found" });
  }
  members.splice(index, 1);
  res.status(204).send();
};

// News API
export const getNews: RequestHandler = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
  let result = [...news].sort((a, b) => {
    const dateA = new Date(a.publishDate || 0).getTime();
    const dateB = new Date(b.publishDate || 0).getTime();
    return dateB - dateA; // Sort by newest first
  });
  if (limit && limit > 0) {
    result = result.slice(0, limit);
  }
  res.json(result);
};

export const getNewsArticle: RequestHandler = (req, res) => {
  const { id } = req.params;
  const article = news.find((n) => n.id === id);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  res.json(article);
};

export const createNews: RequestHandler = (req, res) => {
  const newArticle: NewsArticle = {
    id: generateId(),
    views: 0,
    publishDate: req.body.publishDate || new Date().toISOString(),
    ...req.body,
  };
  news.push(newArticle);
  res.status(201).json(newArticle);
};

export const updateNews: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = news.findIndex((n) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Article not found" });
  }
  news[index] = { ...news[index], ...req.body };
  res.json(news[index]);
};

export const deleteNews: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = news.findIndex((n) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Article not found" });
  }
  news.splice(index, 1);
  res.status(204).send();
};

// Projects API
export const getProjects: RequestHandler = (req, res) => {
  res.json(projects);
};

export const getProject: RequestHandler = (req, res) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
};

export const createProject: RequestHandler = (req, res) => {
  const newProject: Project = {
    id: generateId(),
    ...req.body,
  };
  projects.push(newProject);
  res.status(201).json(newProject);
};

export const updateProject: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  projects[index] = { ...projects[index], ...req.body };
  res.json(projects[index]);
};

export const deleteProject: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  projects.splice(index, 1);
  res.status(204).send();
};

// Events API
export const getEvents: RequestHandler = (req, res) => {
  res.json(events);
};

export const getEvent: RequestHandler = (req, res) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json(event);
};

export const createEvent: RequestHandler = (req, res) => {
  const newEvent: Event = {
    id: generateId(),
    rsvpCount: 0,
    attendees: [],
    ...req.body,
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
};

export const updateEvent: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found" });
  }
  events[index] = { ...events[index], ...req.body };
  res.json(events[index]);
};

export const deleteEvent: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found" });
  }
  events.splice(index, 1);
  res.status(204).send();
};

// Donations API
export const getDonations: RequestHandler = (req, res) => {
  res.json(donations);
};

export const getDonation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const donation = donations.find((d) => d.id === id);
  if (!donation) {
    return res.status(404).json({ error: "Donation not found" });
  }
  res.json(donation);
};

export const createDonation: RequestHandler = (req, res) => {
  const { donorName, donorEmail, amount, currency, date, type, paymentMethod, paymentStatus, projectId, notes, receiptSent } = req.body;
  
  if (!donorName || !donorEmail || !amount || !type) {
    return res.status(400).json({ error: "Donor name, email, amount, and type are required" });
  }
  
  const newDonation: Donation = {
    id: generateId(),
    donorName,
    donorEmail,
    amount: parseFloat(amount) || 0,
    currency: currency || "RWF",
    date: date ? (new Date(date).toISOString()) : new Date().toISOString(),
    type: type as "one-time" | "monthly" | "project-based",
    paymentMethod: paymentMethod || undefined,
    paymentStatus: paymentStatus || "unpaid",
    projectId: projectId || undefined,
    receiptSent: receiptSent || false,
    notes: notes || undefined,
  };
  
  donations.push(newDonation);
  res.status(201).json(newDonation);
};

export const updateDonation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = donations.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Donation not found" });
  }
  // Update donation with new data, preserving paymentStatus
  donations[index] = { ...donations[index], ...req.body, paymentStatus: req.body.paymentStatus || donations[index].paymentStatus || "unpaid" };
  res.json(donations[index]);
};

export const deleteDonation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = donations.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Donation not found" });
  }
  donations.splice(index, 1);
  res.status(204).send();
};

// FAQs API
export const getFAQs: RequestHandler = (req, res) => {
  res.json(faqs);
};

export const getFAQ: RequestHandler = (req, res) => {
  const { id } = req.params;
  const faq = faqs.find((f) => f.id === id);
  if (!faq) {
    return res.status(404).json({ error: "FAQ not found" });
  }
  res.json(faq);
};

export const createFAQ: RequestHandler = (req, res) => {
  const newFAQ: FAQ = {
    id: generateId(),
    ...req.body,
  };
  faqs.push(newFAQ);
  res.status(201).json(newFAQ);
};

export const updateFAQ: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = faqs.findIndex((f) => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "FAQ not found" });
  }
  faqs[index] = { ...faqs[index], ...req.body };
  res.json(faqs[index]);
};

export const deleteFAQ: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = faqs.findIndex((f) => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "FAQ not found" });
  }
  faqs.splice(index, 1);
  res.status(204).send();
};

// Media API
export const getMedia: RequestHandler = (req, res) => {
  let result = [...media];
  
  // Filter by category if provided
  const category = req.query.category as string | undefined;
  if (category && category !== "all") {
    const categories = category.split(',').map(c => c.trim().toLowerCase());
    result = result.filter((m) => {
      const fileCategory = m.category?.toLowerCase() || "";
      return categories.some(cat => fileCategory === cat || fileCategory.includes(cat));
    });
  }
  
  // Filter by type if provided
  const type = req.query.type as string | undefined;
  if (type && type !== "all") {
    result = result.filter((m) => m.type === type);
  }
  
  // Sort by upload date (newest first)
  result.sort((a, b) => {
    const dateA = new Date(a.uploadDate || 0).getTime();
    const dateB = new Date(b.uploadDate || 0).getTime();
    return dateB - dateA;
  });
  
  res.json(result);
};

export const getMediaFile: RequestHandler = (req, res) => {
  const { id } = req.params;
  const file = media.find((m) => m.id === id);
  if (!file) {
    return res.status(404).json({ error: "Media file not found" });
  }
  res.json(file);
};

export const createMedia: RequestHandler = (req, res) => {
  const { name, type, url, size, category, description, tags, thumbnail, youtubeUrl } = req.body;
  
  if (!name || !type || !url || !size) {
    return res.status(400).json({ error: "Name, type, url, and size are required" });
  }
  
  const newFile: MediaFile = {
    id: generateId(),
    name,
    type: type as "image" | "video" | "document",
    url,
    size: parseInt(size) || 0,
    uploadDate: new Date().toISOString(),
    category: category || undefined,
    description: description || undefined,
    tags: tags || [],
    thumbnail: thumbnail || undefined,
    youtubeUrl: youtubeUrl || undefined,
  };
  
  media.push(newFile);
  res.status(201).json(newFile);
};

export const updateMedia: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = media.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Media file not found" });
  }
  media[index] = { ...media[index], ...req.body };
  res.json(media[index]);
};

export const deleteMedia: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = media.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Media file not found" });
  }
  media.splice(index, 1);
  res.status(204).send();
};

// Books API
export const getBooks: RequestHandler = (req, res) => {
  let result = [...books];
  
  // Filter by category if provided
  const category = req.query.category as string | undefined;
  if (category && category !== "All") {
    result = result.filter((b) => b.category === category);
  }
  
  // Sort by upload date (newest first)
  result.sort((a, b) => {
    const dateA = new Date(a.uploadDate || 0).getTime();
    const dateB = new Date(b.uploadDate || 0).getTime();
    return dateB - dateA;
  });
  
  res.json(result);
};

export const getBook: RequestHandler = (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
};

export const createBook: RequestHandler = (req, res) => {
  const newBook: Book = {
    id: generateId(),
    uploadDate: new Date().toISOString(),
    downloads: 0,
    featured: false,
    ...req.body,
  };
  books.push(newBook);
  res.status(201).json(newBook);
};

export const updateBook: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
};

export const deleteBook: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books.splice(index, 1);
  res.status(204).send();
};

export const trackBookDownload: RequestHandler = (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  book.downloads = (book.downloads || 0) + 1;
  res.json({ downloads: book.downloads });
};

// Email Subscribers API
export const getSubscribers: RequestHandler = (req, res) => {
  let result = [...subscribers];
  
  // Filter by status if provided
  const status = req.query.status as string | undefined;
  if (status) {
    result = result.filter((s) => s.status === status);
  }
  
  // Sort by subscribed date (newest first)
  result.sort((a, b) => {
    const dateA = new Date(a.subscribedAt || 0).getTime();
    const dateB = new Date(b.subscribedAt || 0).getTime();
    return dateB - dateA;
  });
  
  res.json(result);
};

export const getSubscriber: RequestHandler = (req, res) => {
  const { id } = req.params;
  const subscriber = subscribers.find((s) => s.id === id);
  if (!subscriber) {
    return res.status(404).json({ error: "Subscriber not found" });
  }
  res.json(subscriber);
};

export const createSubscriber: RequestHandler = (req, res) => {
  const { email, name, source } = req.body;
  
  // Validate email
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  
  // Check if email already exists
  const existing = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    if (existing.status === "active") {
      return res.status(400).json({ error: "Email is already subscribed" });
    } else {
      // Reactivate unsubscribed user
      existing.status = "active";
      existing.subscribedAt = new Date().toISOString();
      if (name) existing.name = name;
      if (source) existing.source = source;
      return res.json(existing);
    }
  }
  
  const newSubscriber: EmailSubscriber = {
    id: generateId(),
    email: email.toLowerCase(),
    name: name || undefined,
    subscribedAt: new Date().toISOString(),
    status: "active",
    source: source || "footer",
    tags: [],
  };
  
  subscribers.push(newSubscriber);
  res.status(201).json(newSubscriber);
};

export const updateSubscriber: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = subscribers.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Subscriber not found" });
  }
  subscribers[index] = { ...subscribers[index], ...req.body };
  res.json(subscribers[index]);
};

export const deleteSubscriber: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = subscribers.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Subscriber not found" });
  }
  subscribers.splice(index, 1);
  res.status(204).send();
};

export const unsubscribe: RequestHandler = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  const subscriber = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (!subscriber) {
    return res.status(404).json({ error: "Email not found in our subscribers list" });
  }
  
  subscriber.status = "unsubscribed";
  res.json({ message: "Successfully unsubscribed", subscriber });
};

// Committee Members API
export const getCommitteeMembers: RequestHandler = (req, res) => {
  let result = [...committeeMembers];
  
  // Filter by category if provided
  const category = req.query.category as string | undefined;
  if (category) {
    result = result.filter((m) => m.category === category);
  }
  
  // Filter by active status if provided (default: show only active)
  const active = req.query.active !== "false";
  if (active) {
    result = result.filter((m) => m.active !== false);
  }
  
  // Sort by category, then by order
  result.sort((a, b) => {
    const categoryOrder = { leadership: 1, team: 2, auditor: 3, asa_representatives: 4, board_chancellors: 5 };
    const categoryDiff = (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
    if (categoryDiff !== 0) return categoryDiff;
    return a.order - b.order;
  });
  
  res.json(result);
};

export const getCommitteeMember: RequestHandler = (req, res) => {
  const { id } = req.params;
  const member = committeeMembers.find((m) => m.id === id);
  if (!member) {
    return res.status(404).json({ error: "Committee member not found" });
  }
  res.json(member);
};

export const createCommitteeMember: RequestHandler = (req, res) => {
  const { position, name, church, phone, category, image, email, order, active } = req.body;
  
  if (!position || !name || !church || !phone || !category) {
    return res.status(400).json({ error: "Position, name, church, phone, and category are required" });
  }
  
  const newMember: CommitteeMember = {
    id: generateId(),
    position,
    name,
    church,
    phone,
    category: category as "leadership" | "team" | "auditor" | "asa_representatives" | "board_chancellors",
    image: image || undefined,
    email: email || undefined,
    order: order ?? (committeeMembers.filter(m => m.category === category).length + 1),
    active: active !== undefined ? active : true,
  };
  
  committeeMembers.push(newMember);
  res.status(201).json(newMember);
};

export const updateCommitteeMember: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = committeeMembers.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Committee member not found" });
  }
  committeeMembers[index] = { ...committeeMembers[index], ...req.body };
  res.json(committeeMembers[index]);
};

export const deleteCommitteeMember: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = committeeMembers.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Committee member not found" });
  }
  committeeMembers.splice(index, 1);
  res.status(204).send();
};

// Devotions API
export const getDevotions: RequestHandler = async (req, res) => {
  try {
    // Build where clause for date filtering
    let where: any = {};
    
    const dateFilter = req.query.dateFilter as string | undefined;
    const days = req.query.days ? parseInt(req.query.days as string) : undefined;
    
    if (dateFilter === "last7days" || days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (days || 7));
      cutoffDate.setHours(0, 0, 0, 0);
      where.date = { gte: cutoffDate };
    }
    
    // Fetch from database
    let result = await prisma.devotion.findMany({
      where,
      orderBy: { date: "desc" },
      take: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    
    // Convert Prisma format to API format
    const formattedResult = result.map((d) => ({
      id: d.id,
      title: d.title,
      date: d.date.toISOString().split("T")[0],
      excerpt: d.excerpt,
      content: d.content || undefined,
      image: d.image || undefined,
      featuredVideoUrl: d.featuredVideoUrl || undefined,
      featuredVideoThumbnail: d.featuredVideoThumbnail || undefined,
      featuredVideoTitle: d.featuredVideoTitle || undefined,
      createdAt: d.createdAt.toISOString(),
    }));
    
    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching devotions:", error);
    res.status(500).json({ error: "Failed to fetch devotions" });
  }
};

export const getDevotion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const devotion = await prisma.devotion.findUnique({
      where: { id },
    });
    
    if (!devotion) {
      return res.status(404).json({ error: "Devotion not found" });
    }
    
    // Convert Prisma format to API format
    res.json({
      id: devotion.id,
      title: devotion.title,
      date: devotion.date.toISOString().split("T")[0],
      excerpt: devotion.excerpt,
      content: devotion.content || undefined,
      image: devotion.image || undefined,
      featuredVideoUrl: devotion.featuredVideoUrl || undefined,
      featuredVideoThumbnail: devotion.featuredVideoThumbnail || undefined,
      featuredVideoTitle: devotion.featuredVideoTitle || undefined,
      createdAt: devotion.createdAt.toISOString(),
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
    
    // Create in database
    const newDevotion = await prisma.devotion.create({
      data: {
        title,
        date: new Date(date),
        excerpt,
        content: content || null,
        image: image || null,
        featuredVideoUrl: featuredVideoUrl || null,
        featuredVideoThumbnail: featuredVideoThumbnail || null,
        featuredVideoTitle: featuredVideoTitle || null,
      },
    });
    
    // Convert Prisma format to API format
    res.status(201).json({
      id: newDevotion.id,
      title: newDevotion.title,
      date: newDevotion.date.toISOString().split("T")[0],
      excerpt: newDevotion.excerpt,
      content: newDevotion.content || undefined,
      image: newDevotion.image || undefined,
      featuredVideoUrl: newDevotion.featuredVideoUrl || undefined,
      featuredVideoThumbnail: newDevotion.featuredVideoThumbnail || undefined,
      featuredVideoTitle: newDevotion.featuredVideoTitle || undefined,
      createdAt: newDevotion.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating devotion:", error);
    res.status(500).json({ error: "Failed to create devotion" });
  }
};

export const updateDevotion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, excerpt, content, image, featuredVideoUrl, featuredVideoThumbnail, featuredVideoTitle } = req.body;
    
    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = new Date(date);
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content || null;
    if (image !== undefined) updateData.image = image || null;
    if (featuredVideoUrl !== undefined) updateData.featuredVideoUrl = featuredVideoUrl || null;
    if (featuredVideoThumbnail !== undefined) updateData.featuredVideoThumbnail = featuredVideoThumbnail || null;
    if (featuredVideoTitle !== undefined) updateData.featuredVideoTitle = featuredVideoTitle || null;
    
    const updatedDevotion = await prisma.devotion.update({
      where: { id },
      data: updateData,
    });
    
    // Convert Prisma format to API format
    res.json({
      id: updatedDevotion.id,
      title: updatedDevotion.title,
      date: updatedDevotion.date.toISOString().split("T")[0],
      excerpt: updatedDevotion.excerpt,
      content: updatedDevotion.content || undefined,
      image: updatedDevotion.image || undefined,
      featuredVideoUrl: updatedDevotion.featuredVideoUrl || undefined,
      featuredVideoThumbnail: updatedDevotion.featuredVideoThumbnail || undefined,
      featuredVideoTitle: updatedDevotion.featuredVideoTitle || undefined,
      createdAt: updatedDevotion.createdAt.toISOString(),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Devotion not found" });
    }
    console.error("Error updating devotion:", error);
    res.status(500).json({ error: "Failed to update devotion" });
  }
};

export const deleteDevotion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.devotion.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Devotion not found" });
    }
    console.error("Error deleting devotion:", error);
    res.status(500).json({ error: "Failed to delete devotion" });
  }
};

// Contact Submissions API
export const getContactSubmissions: RequestHandler = (req, res) => {
  res.json(contactSubmissions);
};

export const getContactSubmission: RequestHandler = (req, res) => {
  const { id } = req.params;
  const submission = contactSubmissions.find((c) => c.id === id);
  if (!submission) {
    return res.status(404).json({ error: "Contact submission not found" });
  }
  res.json(submission);
};

export const createContactSubmission: RequestHandler = (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Name, email, subject, and message are required" });
  }
  
  const newSubmission = {
    id: generateId(),
    name,
    email,
    subject,
    message,
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  contactSubmissions.push(newSubmission);
  res.status(201).json(newSubmission);
};

export const updateContactSubmission: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = contactSubmissions.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Contact submission not found" });
  }
  
  const updates = req.body;
  if (updates.status === "read" && !contactSubmissions[index].readAt) {
    updates.readAt = new Date().toISOString();
  }
  if (updates.status === "replied" && !contactSubmissions[index].repliedAt) {
    updates.repliedAt = new Date().toISOString();
  }
  
  contactSubmissions[index] = { ...contactSubmissions[index], ...updates, updatedAt: new Date().toISOString() };
  res.json(contactSubmissions[index]);
};

export const deleteContactSubmission: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = contactSubmissions.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Contact submission not found" });
  }
  contactSubmissions.splice(index, 1);
  res.status(204).send();
};

// Analytics API
export const getAnalytics: RequestHandler = (req, res) => {
  const analytics = {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.status === "Active").length,
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "ongoing").length,
    totalDonations: donations.length,
    totalDonationAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => e.status === "upcoming").length,
    totalNewsArticles: news.length,
    totalBooks: books.length,
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter((s) => s.status === "active").length,
    totalCommitteeMembers: committeeMembers.length,
    activeCommitteeMembers: committeeMembers.filter((m) => m.active !== false).length,
    totalDevotions: devotions.length,
    totalContactSubmissions: contactSubmissions.length,
    newContactSubmissions: contactSubmissions.filter((c) => c.status === "new").length,
  };
  res.json(analytics);
};
