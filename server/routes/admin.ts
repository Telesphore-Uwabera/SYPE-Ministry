import { RequestHandler, Request, Response } from "express";
import { Member, NewsArticle, Project, Event, Donation, FAQ, MediaFile, EmailCampaign } from "../../client/types/admin";

// In-memory storage (replace with database in production)
let members: Member[] = [];
let news: NewsArticle[] = [];
let projects: Project[] = [];
let events: Event[] = [];
let donations: Donation[] = [];
let faqs: FAQ[] = [];
let media: MediaFile[] = [];
let campaigns: EmailCampaign[] = [];

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
  res.json(news);
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
  const newDonation: Donation = {
    id: generateId(),
    ...req.body,
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
  donations[index] = { ...donations[index], ...req.body };
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
  };
  res.json(analytics);
};
