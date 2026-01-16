import { RequestHandler, Request, Response } from "express";
import { Member, NewsArticle, Project, Event, Donation, FAQ, MediaFile, EmailCampaign, Book, EmailSubscriber, CommitteeMember, Devotion } from "../../client/types/admin";
import { connectMongo, isValidObjectId } from "../lib/mongoose";
import {
  BookModel,
  CommitteeMemberModel,
  ContactSubmissionModel,
  DevotionModel,
  FAQModel,
  NewsArticleModel,
  ProjectModel,
} from "../models/core";

// In-memory storage (being migrated to MongoDB via Mongoose)
let members: Member[] = []; // TODO: Migrate to database
let events: Event[] = []; // TODO: Migrate to database
let donations: Donation[] = []; // TODO: Migrate to database
let media: MediaFile[] = []; // TODO: Migrate to database
let campaigns: EmailCampaign[] = []; // TODO: Migrate to database
let subscribers: EmailSubscriber[] = []; // TODO: Migrate to database
// Devotions, News, Projects, Books, Committee, Contact Submissions, FAQs are now in database

// Helper function to generate ID
const generateId = () => Date.now().toString();

function idOf(doc: any): string {
  return String(doc?._id ?? doc?.id ?? "");
}

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
