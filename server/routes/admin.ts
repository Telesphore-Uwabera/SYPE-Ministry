import { RequestHandler, Request, Response } from "express";
import { Member, NewsArticle, Project, Event, Donation, FAQ, MediaFile, EmailCampaign, Book, EmailSubscriber, CommitteeMember, Devotion } from "../../client/types/admin";
import { prisma } from "../lib/prisma";

// In-memory storage (being migrated to database)
// All data is now stored in database via Prisma for persistence
let members: Member[] = []; // TODO: Migrate to database
let events: Event[] = []; // TODO: Migrate to database
let donations: Donation[] = []; // TODO: Migrate to database
let media: MediaFile[] = []; // TODO: Migrate to database
let campaigns: EmailCampaign[] = []; // TODO: Migrate to database
let subscribers: EmailSubscriber[] = []; // TODO: Migrate to database
// Devotions, News, Projects, Books, Committee, Contact Submissions, FAQs are now in database

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
export const getNews: RequestHandler = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const result = await prisma.newsArticle.findMany({
      orderBy: { publishDate: "desc" },
      take: limit,
    });
    
    // Convert Prisma format to API format
    const formattedResult = result.map((article) => ({
      id: article.id,
      title: article.title,
      author: article.author,
      publishDate: article.publishDate.toISOString(),
      excerpt: article.excerpt,
      body: article.body,
      image: article.image || undefined,
      featured: article.featured,
      category: article.category || undefined,
      tags: article.tags || [],
      views: article.views,
      createdAt: article.createdAt.toISOString(),
    }));
    
    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

export const getNewsArticle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.newsArticle.findUnique({
      where: { id },
    });
    
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    
    res.json({
      id: article.id,
      title: article.title,
      author: article.author,
      publishDate: article.publishDate.toISOString(),
      excerpt: article.excerpt,
      body: article.body,
      image: article.image || undefined,
      featured: article.featured,
      category: article.category || undefined,
      tags: article.tags || [],
      views: article.views,
      createdAt: article.createdAt.toISOString(),
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
    
    const newArticle = await prisma.newsArticle.create({
      data: {
        title,
        author,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        excerpt,
        body,
        image: image || null,
        featured: featured || false,
        category: category || null,
        tags: tags || [],
        views: 0,
      },
    });
    
    res.status(201).json({
      id: newArticle.id,
      title: newArticle.title,
      author: newArticle.author,
      publishDate: newArticle.publishDate.toISOString(),
      excerpt: newArticle.excerpt,
      body: newArticle.body,
      image: newArticle.image || undefined,
      featured: newArticle.featured,
      category: newArticle.category || undefined,
      tags: newArticle.tags || [],
      views: newArticle.views,
      createdAt: newArticle.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating news article:", error);
    res.status(500).json({ error: "Failed to create news article" });
  }
};

export const updateNews: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publishDate, excerpt, body, image, featured, category, tags, views } = req.body;
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (publishDate !== undefined) updateData.publishDate = new Date(publishDate);
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (body !== undefined) updateData.body = body;
    if (image !== undefined) updateData.image = image || null;
    if (featured !== undefined) updateData.featured = featured;
    if (category !== undefined) updateData.category = category || null;
    if (tags !== undefined) updateData.tags = tags || [];
    if (views !== undefined) updateData.views = views;
    
    const updatedArticle = await prisma.newsArticle.update({
      where: { id },
      data: updateData,
    });
    
    res.json({
      id: updatedArticle.id,
      title: updatedArticle.title,
      author: updatedArticle.author,
      publishDate: updatedArticle.publishDate.toISOString(),
      excerpt: updatedArticle.excerpt,
      body: updatedArticle.body,
      image: updatedArticle.image || undefined,
      featured: updatedArticle.featured,
      category: updatedArticle.category || undefined,
      tags: updatedArticle.tags || [],
      views: updatedArticle.views,
      createdAt: updatedArticle.createdAt.toISOString(),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Article not found" });
    }
    console.error("Error updating news article:", error);
    res.status(500).json({ error: "Failed to update news article" });
  }
};

export const deleteNews: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.newsArticle.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Article not found" });
    }
    console.error("Error deleting news article:", error);
    res.status(500).json({ error: "Failed to delete news article" });
  }
};

// Projects API
export const getProjects: RequestHandler = async (req, res) => {
  try {
    const result = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    const formattedResult = result.map((project) => ({
      id: project.id,
      name: project.name,
      category: project.category,
      topic: project.topic,
      description: project.description,
      distribution: project.distribution,
      status: project.status,
      year: project.year,
      teamMembers: project.teamMembers || [],
      startDate: project.startDate?.toISOString().split("T")[0] || undefined,
      endDate: project.endDate?.toISOString().split("T")[0] || undefined,
      budget: project.budget || undefined,
      createdAt: project.createdAt.toISOString(),
    }));
    
    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
    });
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    res.json({
      id: project.id,
      name: project.name,
      category: project.category,
      topic: project.topic,
      description: project.description,
      distribution: project.distribution,
      status: project.status,
      year: project.year,
      teamMembers: project.teamMembers || [],
      startDate: project.startDate?.toISOString().split("T")[0] || undefined,
      endDate: project.endDate?.toISOString().split("T")[0] || undefined,
      budget: project.budget || undefined,
      createdAt: project.createdAt.toISOString(),
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
    
    const newProject = await prisma.project.create({
      data: {
        name,
        category,
        topic,
        description,
        distribution,
        status,
        year,
        teamMembers: teamMembers || [],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget || null,
      },
    });
    
    res.status(201).json({
      id: newProject.id,
      name: newProject.name,
      category: newProject.category,
      topic: newProject.topic,
      description: newProject.description,
      distribution: newProject.distribution,
      status: newProject.status,
      year: newProject.year,
      teamMembers: newProject.teamMembers || [],
      startDate: newProject.startDate?.toISOString().split("T")[0] || undefined,
      endDate: newProject.endDate?.toISOString().split("T")[0] || undefined,
      budget: newProject.budget || undefined,
      createdAt: newProject.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const updateProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, topic, description, distribution, status, year, teamMembers, startDate, endDate, budget } = req.body;
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (topic !== undefined) updateData.topic = topic;
    if (description !== undefined) updateData.description = description;
    if (distribution !== undefined) updateData.distribution = distribution;
    if (status !== undefined) updateData.status = status;
    if (year !== undefined) updateData.year = year;
    if (teamMembers !== undefined) updateData.teamMembers = teamMembers || [];
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (budget !== undefined) updateData.budget = budget || null;
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    
    res.json({
      id: updatedProject.id,
      name: updatedProject.name,
      category: updatedProject.category,
      topic: updatedProject.topic,
      description: updatedProject.description,
      distribution: updatedProject.distribution,
      status: updatedProject.status,
      year: updatedProject.year,
      teamMembers: updatedProject.teamMembers || [],
      startDate: updatedProject.startDate?.toISOString().split("T")[0] || undefined,
      endDate: updatedProject.endDate?.toISOString().split("T")[0] || undefined,
      budget: updatedProject.budget || undefined,
      createdAt: updatedProject.createdAt.toISOString(),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
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
export const getFAQs: RequestHandler = async (req, res) => {
  try {
    const result = await prisma.fAQ.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    
    const formattedResult = result.map((faq) => ({
      id: faq.id,
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      createdAt: faq.createdAt.toISOString(),
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
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });
    
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    
    res.json({
      id: faq.id,
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      createdAt: faq.createdAt.toISOString(),
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
    
    const newFAQ = await prisma.fAQ.create({
      data: {
        category,
        question,
        answer,
        order: order || 0,
      },
    });
    
    res.status(201).json({
      id: newFAQ.id,
      category: newFAQ.category,
      question: newFAQ.question,
      answer: newFAQ.answer,
      order: newFAQ.order,
      createdAt: newFAQ.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ error: "Failed to create FAQ" });
  }
};

export const updateFAQ: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer, order } = req.body;
    
    const updateData: any = {};
    if (category !== undefined) updateData.category = category;
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (order !== undefined) updateData.order = order;
    
    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: updateData,
    });
    
    res.json({
      id: updatedFAQ.id,
      category: updatedFAQ.category,
      question: updatedFAQ.question,
      answer: updatedFAQ.answer,
      order: updatedFAQ.order,
      createdAt: updatedFAQ.createdAt.toISOString(),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "FAQ not found" });
    }
    console.error("Error updating FAQ:", error);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
};

export const deleteFAQ: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.fAQ.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "FAQ not found" });
    }
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
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
export const getBooks: RequestHandler = async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    
    let where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    
    const result = await prisma.book.findMany({
      where,
      orderBy: { uploadDate: "desc" },
    });
    
    const formattedResult = result.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author || undefined,
      category: book.category,
      description: book.description || undefined,
      coverImage: book.coverImage || undefined,
      fileUrl: book.fileUrl || undefined,
      isbn: book.isbn || undefined,
      publisher: book.publisher || undefined,
      publishDate: book.publishDate?.toISOString().split("T")[0] || undefined,
      language: book.language || undefined,
      pages: book.pages || undefined,
      tags: book.tags || [],
      featured: book.featured,
      downloads: book.downloads,
      uploadDate: book.uploadDate.toISOString(),
    }));
    
    res.json(formattedResult);
  } catch (error: any) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

export const getBook: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id },
    });
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    res.json({
      id: book.id,
      title: book.title,
      author: book.author || undefined,
      category: book.category,
      description: book.description || undefined,
      coverImage: book.coverImage || undefined,
      fileUrl: book.fileUrl || undefined,
      isbn: book.isbn || undefined,
      publisher: book.publisher || undefined,
      publishDate: book.publishDate?.toISOString().split("T")[0] || undefined,
      language: book.language || undefined,
      pages: book.pages || undefined,
      tags: book.tags || [],
      featured: book.featured,
      downloads: book.downloads,
      uploadDate: book.uploadDate.toISOString(),
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
    
    const newBook = await prisma.book.create({
      data: {
        title,
        author: author || null,
        category,
        description: description || null,
        coverImage: coverImage || null,
        fileUrl: fileUrl || null,
        isbn: isbn || null,
        publisher: publisher || null,
        publishDate: publishDate ? new Date(publishDate) : null,
        language: language || null,
        pages: pages || null,
        tags: tags || [],
        featured: featured || false,
        downloads: 0,
      },
    });
    
    res.status(201).json({
      id: newBook.id,
      title: newBook.title,
      author: newBook.author || undefined,
      category: newBook.category,
      description: newBook.description || undefined,
      coverImage: newBook.coverImage || undefined,
      fileUrl: newBook.fileUrl || undefined,
      isbn: newBook.isbn || undefined,
      publisher: newBook.publisher || undefined,
      publishDate: newBook.publishDate?.toISOString().split("T")[0] || undefined,
      language: newBook.language || undefined,
      pages: newBook.pages || undefined,
      tags: newBook.tags || [],
      featured: newBook.featured,
      downloads: newBook.downloads,
      uploadDate: newBook.uploadDate.toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
};

export const updateBook: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, description, coverImage, fileUrl, isbn, publisher, publishDate, language, pages, tags, featured } = req.body;
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author || null;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description || null;
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl || null;
    if (isbn !== undefined) updateData.isbn = isbn || null;
    if (publisher !== undefined) updateData.publisher = publisher || null;
    if (publishDate !== undefined) updateData.publishDate = publishDate ? new Date(publishDate) : null;
    if (language !== undefined) updateData.language = language || null;
    if (pages !== undefined) updateData.pages = pages || null;
    if (tags !== undefined) updateData.tags = tags || [];
    if (featured !== undefined) updateData.featured = featured;
    
    const updatedBook = await prisma.book.update({
      where: { id },
      data: updateData,
    });
    
    res.json({
      id: updatedBook.id,
      title: updatedBook.title,
      author: updatedBook.author || undefined,
      category: updatedBook.category,
      description: updatedBook.description || undefined,
      coverImage: updatedBook.coverImage || undefined,
      fileUrl: updatedBook.fileUrl || undefined,
      isbn: updatedBook.isbn || undefined,
      publisher: updatedBook.publisher || undefined,
      publishDate: updatedBook.publishDate?.toISOString().split("T")[0] || undefined,
      language: updatedBook.language || undefined,
      pages: updatedBook.pages || undefined,
      tags: updatedBook.tags || [],
      featured: updatedBook.featured,
      downloads: updatedBook.downloads,
      uploadDate: updatedBook.uploadDate.toISOString(),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Book not found" });
    }
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
};

export const deleteBook: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.book.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Book not found" });
    }
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

export const trackBookDownload: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id },
    });
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    const updatedBook = await prisma.book.update({
      where: { id },
      data: { downloads: book.downloads + 1 },
    });
    
    res.json({ downloads: updatedBook.downloads });
  } catch (error: any) {
    console.error("Error tracking book download:", error);
    res.status(500).json({ error: "Failed to track book download" });
  }
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
    
    const result = await prisma.committeeMember.findMany({
      where,
      orderBy: [
        { category: "asc" },
        { order: "asc" },
      ],
    });
    
    const formattedResult = result.map((member) => ({
      id: member.id,
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
    const member = await prisma.committeeMember.findUnique({
      where: { id },
    });
    
    if (!member) {
      return res.status(404).json({ error: "Committee member not found" });
    }
    
    res.json({
      id: member.id,
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
    
    // Get count for order if not provided
    let memberOrder = order;
    if (memberOrder === undefined) {
      const count = await prisma.committeeMember.count({
        where: { category },
      });
      memberOrder = count + 1;
    }
    
    const newMember = await prisma.committeeMember.create({
      data: {
        position,
        name,
        church,
        phone,
        category: category as "leadership" | "team" | "auditor" | "asa_representatives" | "board_chancellors",
        image: image || null,
        email: email || null,
        order: memberOrder,
        active: active !== undefined ? active : true,
      },
    });
    
    res.status(201).json({
      id: newMember.id,
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
    res.status(500).json({ error: "Failed to create committee member" });
  }
};

export const updateCommitteeMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, name, church, phone, category, image, email, order, active } = req.body;
    
    const updateData: any = {};
    if (position !== undefined) updateData.position = position;
    if (name !== undefined) updateData.name = name;
    if (church !== undefined) updateData.church = church;
    if (phone !== undefined) updateData.phone = phone;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image || null;
    if (email !== undefined) updateData.email = email || null;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;
    
    const updatedMember = await prisma.committeeMember.update({
      where: { id },
      data: updateData,
    });
    
    res.json({
      id: updatedMember.id,
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
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Committee member not found" });
    }
    console.error("Error updating committee member:", error);
    res.status(500).json({ error: "Failed to update committee member" });
  }
};

export const deleteCommitteeMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.committeeMember.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Committee member not found" });
    }
    console.error("Error deleting committee member:", error);
    res.status(500).json({ error: "Failed to delete committee member" });
  }
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
export const getContactSubmissions: RequestHandler = async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    
    let where: any = {};
    if (status) {
      where.status = status;
    }
    
    const result = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    
    const formattedResult = result.map((submission) => ({
      id: submission.id,
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      message: submission.message,
      status: submission.status,
      readAt: submission.readAt?.toISOString() || undefined,
      repliedAt: submission.repliedAt?.toISOString() || undefined,
      notes: submission.notes || undefined,
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString(),
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
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });
    
    if (!submission) {
      return res.status(404).json({ error: "Contact submission not found" });
    }
    
    res.json({
      id: submission.id,
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      message: submission.message,
      status: submission.status,
      readAt: submission.readAt?.toISOString() || undefined,
      repliedAt: submission.repliedAt?.toISOString() || undefined,
      notes: submission.notes || undefined,
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString(),
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
    
    const newSubmission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "new",
      },
    });
    
    res.status(201).json({
      id: newSubmission.id,
      name: newSubmission.name,
      email: newSubmission.email,
      subject: newSubmission.subject,
      message: newSubmission.message,
      status: newSubmission.status,
      readAt: newSubmission.readAt?.toISOString() || undefined,
      repliedAt: newSubmission.repliedAt?.toISOString() || undefined,
      notes: newSubmission.notes || undefined,
      createdAt: newSubmission.createdAt.toISOString(),
      updatedAt: newSubmission.updatedAt.toISOString(),
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
    const current = await prisma.contactSubmission.findUnique({
      where: { id },
    });
    
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
    if (notes !== undefined) updateData.notes = notes || null;
    
    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id },
      data: updateData,
    });
    
    res.json({
      id: updatedSubmission.id,
      name: updatedSubmission.name,
      email: updatedSubmission.email,
      subject: updatedSubmission.subject,
      message: updatedSubmission.message,
      status: updatedSubmission.status,
      readAt: updatedSubmission.readAt?.toISOString() || undefined,
      repliedAt: updatedSubmission.repliedAt?.toISOString() || undefined,
      notes: updatedSubmission.notes || undefined,
      createdAt: updatedSubmission.createdAt.toISOString(),
      updatedAt: updatedSubmission.updatedAt.toISOString(),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Contact submission not found" });
    }
    console.error("Error updating contact submission:", error);
    res.status(500).json({ error: "Failed to update contact submission" });
  }
};

export const deleteContactSubmission: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contactSubmission.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Contact submission not found" });
    }
    console.error("Error deleting contact submission:", error);
    res.status(500).json({ error: "Failed to delete contact submission" });
  }
};

// Analytics API
export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    // Get counts from database for migrated models with error handling
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
        prisma.project.count().catch(() => 0),
        prisma.project.count({ where: { status: "ongoing" } }).catch(() => 0),
        prisma.newsArticle.count().catch(() => 0),
        prisma.book.count().catch(() => 0),
        prisma.committeeMember.count().catch(() => 0),
        prisma.committeeMember.count({ where: { active: true } }).catch(() => 0),
        prisma.devotion.count().catch(() => 0),
        prisma.contactSubmission.count().catch(() => 0),
        prisma.contactSubmission.count({ where: { status: "new" } }).catch(() => 0),
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
      // Continue with default values (0) if database queries fail
    }
    
    // Get counts from in-memory arrays for models not yet migrated
    const totalMembers = members?.length || 0;
    const activeMembers = members?.filter((m) => m.status === "Active").length || 0;
    const totalDonations = donations?.length || 0;
    const totalDonationAmount = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
    const totalEvents = events?.length || 0;
    const upcomingEvents = events?.filter((e) => e.status === "upcoming").length || 0;
    const totalSubscribers = subscribers?.length || 0;
    const activeSubscribers = subscribers?.filter((s) => s.status === "active").length || 0;
    
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
