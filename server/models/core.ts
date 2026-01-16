import mongoose, { Schema } from "mongoose";

const strArr = { type: [String], default: [] as string[] };

export const NewsArticleModel =
  mongoose.models.NewsArticle ??
  mongoose.model(
    "NewsArticle",
    new Schema(
      {
        title: { type: String, required: true },
        author: { type: String, required: true },
        publishDate: { type: Date, default: () => new Date() },
        excerpt: { type: String, required: true },
        body: { type: String, required: true },
        image: { type: String },
        featured: { type: Boolean, default: false },
        category: { type: String },
        tags: strArr,
        views: { type: Number, default: 0 },
      },
      { timestamps: true, collection: "news_articles" }
    )
  );

export const ProjectModel =
  mongoose.models.Project ??
  mongoose.model(
    "Project",
    new Schema(
      {
        name: { type: String, required: true },
        category: { type: String, required: true },
        topic: { type: String, required: true },
        description: { type: String, required: true },
        distribution: { type: String, required: true },
        status: { type: String, required: true },
        year: { type: String, required: true },
        teamMembers: strArr,
        startDate: { type: Date },
        endDate: { type: Date },
        budget: { type: Number },
      },
      { timestamps: true, collection: "projects" }
    )
  );

export const BookModel =
  mongoose.models.Book ??
  mongoose.model(
    "Book",
    new Schema(
      {
        title: { type: String, required: true },
        author: { type: String },
        category: { type: String, required: true },
        description: { type: String },
        coverImage: { type: String },
        fileUrl: { type: String },
        isbn: { type: String },
        publisher: { type: String },
        publishDate: { type: Date },
        language: { type: String },
        pages: { type: Number },
        tags: strArr,
        featured: { type: Boolean, default: false },
        downloads: { type: Number, default: 0 },
        uploadDate: { type: Date, default: () => new Date() },
      },
      { timestamps: true, collection: "books" }
    )
  );

export const CommitteeMemberModel =
  mongoose.models.CommitteeMember ??
  mongoose.model(
    "CommitteeMember",
    new Schema(
      {
        position: { type: String, required: true },
        name: { type: String, required: true },
        church: { type: String, required: true },
        phone: { type: String, required: true },
        category: { type: String, required: true },
        image: { type: String },
        email: { type: String },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
      },
      { timestamps: true, collection: "committee_members" }
    )
  );

export const DevotionModel =
  mongoose.models.Devotion ??
  mongoose.model(
    "Devotion",
    new Schema(
      {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        excerpt: { type: String, required: true },
        content: { type: String },
        image: { type: String },
        featuredVideoUrl: { type: String },
        featuredVideoThumbnail: { type: String },
        featuredVideoTitle: { type: String },
      },
      { timestamps: true, collection: "devotions" }
    )
  );

export const FAQModel =
  mongoose.models.FAQ ??
  mongoose.model(
    "FAQ",
    new Schema(
      {
        category: { type: String, required: true },
        question: { type: String, required: true },
        answer: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
      { timestamps: true, collection: "faqs" }
    )
  );

export const ContactSubmissionModel =
  mongoose.models.ContactSubmission ??
  mongoose.model(
    "ContactSubmission",
    new Schema(
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, default: "new" },
        readAt: { type: Date },
        repliedAt: { type: Date },
        notes: { type: String },
      },
      { timestamps: true, collection: "contact_submissions" }
    )
  );

