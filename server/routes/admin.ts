import { RequestHandler, Request, Response } from "express";
import { Member, NewsArticle, Project, Event, Donation, FAQ, MediaFile, EmailCampaign, Book, EmailSubscriber, CommitteeMember, Devotion } from "../../client/types/admin";

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
let devotions: Devotion[] = [];

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
export const getDevotions: RequestHandler = (req, res) => {
  let result = [...devotions];
  
  // Filter by date if provided
  const dateFilter = req.query.dateFilter as string | undefined;
  if (dateFilter === "last7days") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Normalize to start of day
    result = result.filter((d) => {
      const devotionDate = new Date(d.date);
      devotionDate.setHours(0, 0, 0, 0);
      return devotionDate >= sevenDaysAgo;
    });
  }
  
  // Also support days parameter for backward compatibility
  const days = req.query.days ? parseInt(req.query.days as string) : undefined;
  if (days && !dateFilter) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);
    result = result.filter((d) => {
      const devotionDate = new Date(d.date);
      devotionDate.setHours(0, 0, 0, 0);
      return devotionDate >= cutoffDate;
    });
  }
  
  // Sort by date (newest first)
  result.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });
  
  // Limit results if provided
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  if (limit && limit > 0) {
    result = result.slice(0, limit);
  }
  
  res.json(result);
};

export const getDevotion: RequestHandler = (req, res) => {
  const { id } = req.params;
  const devotion = devotions.find((d) => d.id === id);
  if (!devotion) {
    return res.status(404).json({ error: "Devotion not found" });
  }
  res.json(devotion);
};

export const createDevotion: RequestHandler = (req, res) => {
  const { title, date, excerpt, content, image, featuredVideoUrl, featuredVideoThumbnail, featuredVideoTitle } = req.body;
  
  if (!title || !date || !excerpt) {
    return res.status(400).json({ error: "Title, date, and excerpt are required" });
  }
  
  const newDevotion: Devotion = {
    id: generateId(),
    title,
    date: date ? (new Date(date).toISOString().split("T")[0]) : new Date().toISOString().split("T")[0],
    excerpt,
    content: content || undefined,
    image: image || undefined,
    featuredVideoUrl: featuredVideoUrl || undefined,
    featuredVideoThumbnail: featuredVideoThumbnail || undefined,
    featuredVideoTitle: featuredVideoTitle || undefined,
    createdAt: new Date().toISOString(),
  };
  
  devotions.push(newDevotion);
  res.status(201).json(newDevotion);
};

export const updateDevotion: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = devotions.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Devotion not found" });
  }
  devotions[index] = { ...devotions[index], ...req.body };
  res.json(devotions[index]);
};

export const deleteDevotion: RequestHandler = (req, res) => {
  const { id } = req.params;
  const index = devotions.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Devotion not found" });
  }
  devotions.splice(index, 1);
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
  };
  res.json(analytics);
};
