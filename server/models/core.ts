import mongoose, { Schema } from "mongoose";

const strArr = { type: [String], default: [] as string[] };

export const NewsArticleModel: any =
  (mongoose.models.NewsArticle as any) ??
  (mongoose.model(
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
  ) as any);

export const ProjectModel: any =
  (mongoose.models.Project as any) ??
  (mongoose.model(
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
        featured: { type: Boolean, default: false },
      },
      { timestamps: true, collection: "projects" }
    )
  ) as any);

export const BookModel: any =
  (mongoose.models.Book as any) ??
  (mongoose.model(
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
  ) as any);

export const CommitteeMemberModel: any =
  (mongoose.models.CommitteeMember as any) ??
  (mongoose.model(
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
  ) as any);

export const DevotionModel: any =
  (mongoose.models.Devotion as any) ??
  (mongoose.model(
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
  ) as any);

export const FAQModel: any =
  (mongoose.models.FAQ as any) ??
  (mongoose.model(
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
  ) as any);

export const ContactSubmissionModel: any =
  (mongoose.models.ContactSubmission as any) ??
  (mongoose.model(
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
  ) as any);

export const MemberModel: any =
  (mongoose.models.Member as any) ??
  (mongoose.model(
    "Member",
    new Schema(
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        role: { type: String, required: true }, // Student | Alumni | Admin
        status: { type: String, required: true }, // Active | Inactive | Pending
        joinDate: { type: Date, default: () => new Date() },
        department: { type: String },
        association: { type: String },
        notes: { type: String },
      },
      { timestamps: true, collection: "members" }
    )
  ) as any);

export const EventModel: any =
  (mongoose.models.Event as any) ??
  (mongoose.model(
    "Event",
    new Schema(
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        location: { type: String, required: true },
        category: { type: String, required: true },
        rsvpRequired: { type: Boolean, default: false },
        rsvpCount: { type: Number, default: 0 },
        maxAttendees: { type: Number },
        attendees: strArr,
        status: { type: String, required: true },
      },
      { timestamps: true, collection: "events" }
    )
  ) as any);

export const DonationModel: any =
  (mongoose.models.Donation as any) ??
  (mongoose.model(
    "Donation",
    new Schema(
      {
        donorName: { type: String, required: true },
        donorEmail: { type: String, required: true },
        donorPhone: { type: String },
        amount: { type: Number, required: true },
        amountPaid: { type: Number, default: 0 },
        currency: { type: String, default: "RWF" },
        date: { type: Date, default: () => new Date() },
        type: { type: String, required: true }, // one-time|monthly|project-based
        projectId: { type: String },
        paymentMethod: { type: String },
        paymentStatus: { type: String, default: "unpaid" }, // paid|unpaid|installment
        paymentDeadline: { type: Date },
        receiptSent: { type: Boolean, default: false },
        notes: { type: String },
      },
      { timestamps: true, collection: "donations" }
    )
  ) as any);

export const MediaFileModel: any =
  (mongoose.models.MediaFile as any) ??
  (mongoose.model(
    "MediaFile",
    new Schema(
      {
        name: { type: String, required: true },
        type: { type: String, required: true }, // image|video|document
        url: { type: String, required: true },
        thumbnail: { type: String },
        youtubeUrl: { type: String },
        size: { type: Number, required: true },
        uploadDate: { type: Date, default: () => new Date() },
        category: { type: String },
        tags: strArr,
        description: { type: String },
      },
      { timestamps: true, collection: "media_files" }
    )
  ) as any);

export const EmailSubscriberModel: any =
  (mongoose.models.EmailSubscriber as any) ??
  (mongoose.model(
    "EmailSubscriber",
    new Schema(
      {
        email: { type: String, required: true, unique: true },
        name: { type: String },
        subscribedAt: { type: Date, default: () => new Date() },
        status: { type: String, default: "active" }, // active|unsubscribed
        source: { type: String },
        tags: strArr,
      },
      { timestamps: true, collection: "email_subscribers" }
    )
  ) as any);

export const EmailCampaignModel: any =
  (mongoose.models.EmailCampaign as any) ??
  (mongoose.model(
    "EmailCampaign",
    new Schema(
      {
        subject: { type: String, required: true },
        body: { type: String, required: true },
        recipients: strArr,
        sentDate: { type: Date },
        status: { type: String, required: true }, // draft|scheduled|sent
        scheduledDate: { type: Date },
      },
      { timestamps: true, collection: "email_campaigns" }
    )
  ) as any);


export const YouTubeSyncModel: any =
  (mongoose.models.YouTubeSync as any) ??
  (mongoose.model(
    "YouTubeSync",
    new Schema(
      {
        videoId: { type: String, required: true, unique: true },
        notifiedAt: { type: Date, default: () => new Date() },
        title: { type: String },
        publishedAt: { type: Date },
      },
      { timestamps: true, collection: "youtube_sync" }
    )
  ) as any);

export const MetadataModel: any =
  (mongoose.models.Metadata as any) ??
  (mongoose.model(
    "Metadata",
    new Schema(
      {
        key: { type: String, required: true, unique: true },
        value: { type: Schema.Types.Mixed, required: true },
      },
      { timestamps: true, collection: "metadata" }
    )
  ) as any);
