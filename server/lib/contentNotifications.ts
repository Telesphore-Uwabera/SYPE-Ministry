import {
  BookModel,
  DevotionModel,
  EmailSubscriberModel,
  EventModel,
  MemberModel,
  MetadataModel,
  NewsArticleModel,
  ProjectModel,
} from "../models/core";
import { sendMail } from "./mailer";
import { connectMongo } from "./mongoose";

// ─── Configuration ──────────────────────────────────────────────────────────
// How many hours after content is created before we send the email.
// Default 1 hour. Set CONTENT_NOTIFY_AFTER_HOURS=0 to send immediately.
const notifyAfterHoursRaw = Number.parseInt(process.env.CONTENT_NOTIFY_AFTER_HOURS || "1", 10);
const NOTIFY_AFTER_HOURS =
  Number.isFinite(notifyAfterHoursRaw) && notifyAfterHoursRaw >= 0 ? notifyAfterHoursRaw : 1;
const NOTIFY_AFTER_MS = NOTIFY_AFTER_HOURS * 60 * 60 * 1000;

// Cursor keys in MetadataModel – track which createdAt we've already notified for
const CURSOR = {
  news:      "content_notifications_news_cursor_iso",
  events:    "content_notifications_events_cursor_iso",
  books:     "content_notifications_books_cursor_iso",
  projects:  "content_notifications_projects_cursor_iso",
  devotions: "content_notifications_devotions_cursor_iso",
};

/** Max items processed per poll cycle per content type */
const BATCH_LIMIT = 20;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function escapeHtml(value: string): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toIsoDate(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value || ""));
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function idOf(doc: any): string {
  return String(doc?._id || doc?.id || "");
}

/** Returns deduplicated list of active members + active subscribers */
async function getRecipients(): Promise<Array<{ email: string; name: string }>> {
  const [members, subscribers] = await Promise.all([
    MemberModel.find({ status: "Active" }).select("email name").exec(),
    EmailSubscriberModel.find({ status: "active" }).select("email name").exec(),
  ]);

  const map = new Map<string, string>();
  for (const m of members) {
    const email = String(m?.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) continue;
    if (!map.has(email)) map.set(email, String(m?.name || "").trim());
  }
  for (const s of subscribers) {
    const email = String(s?.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) continue;
    if (!map.has(email)) map.set(email, String(s?.name || "").trim());
  }

  return Array.from(map.entries()).map(([email, name]) => ({ email, name }));
}

/** Shared professional email template */
function buildEmail(options: {
  recipientName?: string;
  siteName: string;
  siteUrl: string;
  contentTypeLabel: string;
  emoji: string;
  title: string;
  details: string[];
  ctaLabel: string;
  ctaUrl: string;
}) {
  const { siteName, siteUrl, contentTypeLabel, emoji, title, details, ctaLabel, ctaUrl } = options;
  const greeting = options.recipientName
    ? `Dear ${escapeHtml(options.recipientName)},`
    : "Dear Member,";

  const detailsHtml = details
    .filter(Boolean)
    .map((d) => `<li style="margin:0 0 5px 0;">${escapeHtml(d)}</li>`)
    .join("");

  const html = `
<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
  <div style="background-color:#186d84;color:white;padding:24px;text-align:center;">
    <p style="margin:0 0 4px 0;font-size:28px;">${emoji}</p>
    <h2 style="margin:0;font-size:20px;">${escapeHtml(contentTypeLabel)} Update — ${escapeHtml(siteName)}</h2>
  </div>
  <div style="padding:28px;background-color:#ffffff;">
    <p style="margin-top:0;">${greeting}</p>
    <p>We are pleased to share a new <strong>${escapeHtml(contentTypeLabel.toLowerCase())}</strong> from <strong>${escapeHtml(siteName)}</strong>.</p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;margin:20px 0;">
      <p style="margin:0 0 8px 0;font-size:12px;color:#64748b;letter-spacing:.04em;text-transform:uppercase;">Title</p>
      <h3 style="margin:0 0 10px 0;color:#0f172a;">${escapeHtml(title)}</h3>
      ${detailsHtml ? `<ul style="margin:0;padding-left:18px;color:#334155;">${detailsHtml}</ul>` : ""}
    </div>

    <div style="text-align:center;margin:28px 0;">
      <a href="${escapeHtml(ctaUrl)}"
         style="display:inline-block;background-color:#186d84;color:#ffffff;text-decoration:none;border-radius:8px;padding:13px 28px;font-weight:bold;font-size:15px;">
        ${escapeHtml(ctaLabel)}
      </a>
    </div>

    <p style="margin-bottom:0;">Thank you for being part of our ministry community. God bless you!</p>

    <div style="margin-top:26px;padding-top:18px;border-top:1px solid #e5e7eb;font-size:13px;color:#64748b;text-align:center;">
      In Christian fellowship,<br/>
      <strong>${escapeHtml(siteName)} Team</strong><br/>
      <a href="${escapeHtml(siteUrl)}" style="color:#186d84;">${escapeHtml(siteUrl)}</a>
    </div>
  </div>
</div>`;

  const text = [
    `${emoji} ${contentTypeLabel} Update — ${siteName}`,
    "",
    greeting.replace(/<[^>]+>/g, ""),
    "",
    `New ${contentTypeLabel.toLowerCase()}: ${title}`,
    ...details.filter(Boolean),
    "",
    `${ctaLabel}: ${ctaUrl}`,
    "",
    siteName,
    siteUrl,
  ].join("\n");

  return { html, text };
}

// ─── Cursor helpers ───────────────────────────────────────────────────────────
async function getCursor(key: string): Promise<Date | null> {
  const record = await MetadataModel.findOne({ key }).exec();
  if (!record?.value?.iso) return null;
  const parsed = new Date(String(record.value.iso));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function setCursor(key: string, date: Date): Promise<void> {
  await MetadataModel.findOneAndUpdate(
    { key },
    { key, value: { iso: date.toISOString() } },
    { upsert: true }
  );
}

// ─── Content-type notifiers ───────────────────────────────────────────────────

/**
 * cutoff = now - NOTIFY_AFTER_HOURS.
 * We only notify items whose createdAt is OLDER than the cutoff (i.e. at least 1 hour old)
 * but NEWER than the last cursor (i.e. not yet notified).
 */
function eligibilityCutoff(): Date {
  return new Date(Date.now() - NOTIFY_AFTER_MS);
}

async function notifyContentType(options: {
  cursorKey: string;
  model: any;
  sortField?: string;
  buildSubjectAndDetails: (doc: any, siteName: string, siteUrl: string) => {
    subject: string;
    title: string;
    details: string[];
    ctaUrl: string;
    ctaLabel: string;
    contentTypeLabel: string;
    emoji: string;
  };
  siteName: string;
  siteUrl: string;
  label: string;
}) {
  const { cursorKey, model, buildSubjectAndDetails, siteName, siteUrl, label } = options;
  const cutoff = eligibilityCutoff();

  const cursor = await getCursor(cursorKey);
  const latest = await model.findOne({}).sort({ createdAt: -1 }).exec();
  if (!latest?.createdAt) return;

  // First-ever run: bootstrap the cursor to now so we don't spam all history.
  if (!cursor) {
    await setCursor(cursorKey, new Date());
    console.log(`[ContentNotify] Bootstrapped ${label} cursor to now.`);
    return;
  }

  // Items created after cursor AND at least NOTIFY_AFTER_HOURS old
  const newDocs = await model
    .find({
      createdAt: { $gt: cursor, $lte: cutoff },
    })
    .sort({ createdAt: 1 })
    .limit(BATCH_LIMIT)
    .exec();

  if (newDocs.length === 0) return;

  const recipients = await getRecipients();
  if (recipients.length === 0) {
    console.warn(`[ContentNotify] No active recipients found for ${label} notification.`);
    return;
  }

  let newestSeen = cursor;

  for (const doc of newDocs) {
    const built = buildSubjectAndDetails(doc, siteName, siteUrl);

    let sent = 0;
    for (const recipient of recipients) {
      const { html, text } = buildEmail({
        recipientName: recipient.name,
        siteName,
        siteUrl,
        contentTypeLabel: built.contentTypeLabel,
        emoji: built.emoji,
        title: built.title,
        details: built.details,
        ctaLabel: built.ctaLabel,
        ctaUrl: built.ctaUrl,
      });

      await sendMail({ to: recipient.email, subject: built.subject, html, text }).catch((err) =>
        console.error(`[ContentNotify] Failed ${label} email to ${recipient.email}:`, err?.message || err)
      );
      sent++;
    }

    console.log(`[ContentNotify] Sent ${label} notification "${built.title}" to ${sent} recipient(s).`);

    const createdAt = new Date(toIsoDate(doc.createdAt));
    if (createdAt.getTime() > newestSeen.getTime()) newestSeen = createdAt;
  }

  await setCursor(cursorKey, newestSeen);
  console.log(`[ContentNotify] Processed ${newDocs.length} new ${label}(s). Cursor advanced to ${newestSeen.toISOString()}.`);
}

// ─── Per-content-type configs ─────────────────────────────────────────────────

async function notifyNews(siteName: string, siteUrl: string) {
  await notifyContentType({
    cursorKey: CURSOR.news,
    model: NewsArticleModel,
    siteName,
    siteUrl,
    label: "news",
    buildSubjectAndDetails: (doc, sn) => ({
      contentTypeLabel: "News",
      emoji: "📰",
      title: String(doc.title || "Ministry News"),
      subject: `📰 News Update: ${doc.title} — ${sn}`,
      details: [
        doc.author ? `Author: ${String(doc.author)}` : "",
        doc.publishDate ? `Published: ${toIsoDate(doc.publishDate).split("T")[0]}` : "",
        String(doc.excerpt || "").trim().slice(0, 200),
      ],
      ctaLabel: "Read Full Article",
      ctaUrl: `${siteUrl}/news`,
    }),
  });
}

async function notifyEvents(siteName: string, siteUrl: string) {
  await notifyContentType({
    cursorKey: CURSOR.events,
    model: EventModel,
    siteName,
    siteUrl,
    label: "event",
    buildSubjectAndDetails: (doc, sn) => ({
      contentTypeLabel: "Event",
      emoji: "📅",
      title: String(doc.title || "Upcoming Event"),
      subject: `📅 New Event: ${doc.title} — ${sn}`,
      details: [
        doc.date ? `Date: ${toIsoDate(doc.date).split("T")[0]}` : "",
        doc.time ? `Time: ${String(doc.time)}` : "",
        doc.location ? `Location: ${String(doc.location)}` : "",
        doc.category ? `Category: ${String(doc.category)}` : "",
        doc.description ? String(doc.description).slice(0, 160) : "",
      ],
      ctaLabel: "View Event Details",
      ctaUrl: `${siteUrl}/events`,
    }),
  });
}

async function notifyBooks(siteName: string, siteUrl: string) {
  await notifyContentType({
    cursorKey: CURSOR.books,
    model: BookModel,
    siteName,
    siteUrl,
    label: "book",
    buildSubjectAndDetails: (doc, sn) => ({
      contentTypeLabel: "Book",
      emoji: "📖",
      title: String(doc.title || "New Book"),
      subject: `📖 New Book Available: ${doc.title} — ${sn}`,
      details: [
        doc.author ? `Author: ${String(doc.author)}` : "",
        doc.category ? `Category: ${String(doc.category)}` : "",
        doc.publisher ? `Publisher: ${String(doc.publisher)}` : "",
        doc.language ? `Language: ${String(doc.language)}` : "",
        doc.description ? String(doc.description).slice(0, 180) : "",
      ],
      ctaLabel: "Read / Download Book",
      ctaUrl: `${siteUrl}/library`,
    }),
  });
}

async function notifyProjects(siteName: string, siteUrl: string) {
  await notifyContentType({
    cursorKey: CURSOR.projects,
    model: ProjectModel,
    siteName,
    siteUrl,
    label: "project",
    buildSubjectAndDetails: (doc, sn) => ({
      contentTypeLabel: "Evangelical Project",
      emoji: "✝️",
      title: String(doc.name || "New Ministry Project"),
      subject: `✝️ New Project: ${doc.name} — ${sn}`,
      details: [
        doc.category ? `Category: ${String(doc.category)}` : "",
        doc.topic ? `Topic: ${String(doc.topic)}` : "",
        doc.distribution ? `Distribution: ${String(doc.distribution)}` : "",
        doc.year ? `Year: ${String(doc.year)}` : "",
        doc.description ? String(doc.description).slice(0, 180) : "",
      ],
      ctaLabel: "View Project",
      ctaUrl: `${siteUrl}/projects`,
    }),
  });
}

async function notifyDevotions(siteName: string, siteUrl: string) {
  await notifyContentType({
    cursorKey: CURSOR.devotions,
    model: DevotionModel,
    siteName,
    siteUrl,
    label: "devotion",
    buildSubjectAndDetails: (doc, sn) => ({
      contentTypeLabel: "Daily Devotion",
      emoji: "🙏",
      title: String(doc.title || "Daily Devotion"),
      subject: `🙏 New Devotion: ${doc.title} — ${sn}`,
      details: [
        doc.date ? `Date: ${toIsoDate(doc.date).split("T")[0]}` : "",
        doc.excerpt ? String(doc.excerpt).slice(0, 200) : "",
      ],
      ctaLabel: "Read Devotion",
      ctaUrl: `${siteUrl}/devotions`,
    }),
  });
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function runContentNotificationJob() {
  try {
    await connectMongo();
    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://www.sypeministry.org").trim().replace(/\/+$/, "");

    console.log(
      `[ContentNotify] Running notification job (delay: ${NOTIFY_AFTER_HOURS}h). ` +
      `Eligible if created before ${eligibilityCutoff().toISOString()}.`
    );

    await notifyNews(siteName, siteUrl);
    await notifyEvents(siteName, siteUrl);
    await notifyBooks(siteName, siteUrl);
    await notifyProjects(siteName, siteUrl);
    await notifyDevotions(siteName, siteUrl);
  } catch (err) {
    console.error("[ContentNotify] Scheduled job failed:", err);
  }
}
