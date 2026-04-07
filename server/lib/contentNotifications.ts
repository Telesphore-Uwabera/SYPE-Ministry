import { EventModel, MemberModel, MetadataModel, NewsArticleModel } from "../models/core";
import { sendMail } from "./mailer";
import { connectMongo } from "./mongoose";

const NEWS_CURSOR_KEY = "content_notifications_news_cursor_iso";
const EVENTS_CURSOR_KEY = "content_notifications_events_cursor_iso";
const BATCH_LIMIT = 20;

function escapeHtml(value: string) {
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

async function getActiveMemberRecipients(): Promise<Array<{ email: string; name: string }>> {
  const members = await MemberModel.find({ status: "Active" }).select("email name").exec();
  const map = new Map<string, string>();
  for (const m of members) {
    const email = String(m?.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) continue;
    if (!map.has(email)) map.set(email, String(m?.name || "").trim());
  }
  return Array.from(map.entries()).map(([email, name]) => ({ email, name }));
}

function buildProfessionalUpdateEmail(options: {
  recipientName?: string;
  siteName: string;
  siteUrl: string;
  contentTypeLabel: string;
  title: string;
  details: string[];
  ctaLabel: string;
  ctaUrl: string;
}) {
  const greeting = options.recipientName ? `Dear ${escapeHtml(options.recipientName)},` : "Dear Member,";
  const detailsHtml = options.details
    .filter(Boolean)
    .map((item) => `<li style="margin: 0 0 6px 0;">${escapeHtml(item)}</li>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #186d84; color: white; padding: 24px; text-align: center;">
        <h2 style="margin: 0;">${escapeHtml(options.contentTypeLabel)} Update</h2>
      </div>
      <div style="padding: 28px; background-color: #ffffff;">
        <p style="margin-top: 0;">${greeting}</p>
        <p>We are pleased to share a new <strong>${escapeHtml(options.contentTypeLabel.toLowerCase())}</strong> update from <strong>${escapeHtml(options.siteName)}</strong>.</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; letter-spacing: 0.04em; text-transform: uppercase;">Title</p>
          <h3 style="margin: 0 0 10px 0; color: #0f172a;">${escapeHtml(options.title)}</h3>
          ${detailsHtml ? `<ul style="margin: 0; padding-left: 18px; color: #334155;">${detailsHtml}</ul>` : ""}
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${escapeHtml(options.ctaUrl)}" style="display: inline-block; background-color: #186d84; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 12px 24px; font-weight: bold;">
            ${escapeHtml(options.ctaLabel)}
          </a>
        </div>

        <p style="margin-bottom: 0;">Thank you for being an active member of our ministry community.</p>

        <div style="margin-top: 26px; padding-top: 18px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #64748b; text-align: center;">
          In Christian fellowship,<br />
          <strong>${escapeHtml(options.siteName)} Team</strong><br />
          <a href="${escapeHtml(options.siteUrl)}">${escapeHtml(options.siteUrl)}</a>
        </div>
      </div>
    </div>
  `;

  const text = [
    `${options.contentTypeLabel} Update - ${options.siteName}`,
    "",
    greeting.replace(/<[^>]+>/g, ""),
    "",
    `New ${options.contentTypeLabel.toLowerCase()} update: ${options.title}`,
    ...options.details.filter(Boolean),
    "",
    `${options.ctaLabel}: ${options.ctaUrl}`,
    "",
    `${options.siteName}`,
    options.siteUrl,
  ].join("\n");

  return { html, text };
}

async function getCursorDate(key: string): Promise<Date | null> {
  const record = await MetadataModel.findOne({ key }).exec();
  if (!record?.value?.iso) return null;
  const parsed = new Date(String(record.value.iso));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

async function setCursorDate(key: string, date: Date): Promise<void> {
  await MetadataModel.findOneAndUpdate(
    { key },
    { key, value: { iso: date.toISOString() } },
    { upsert: true }
  );
}

async function notifyNews(siteName: string, siteUrl: string) {
  const cursor = await getCursorDate(NEWS_CURSOR_KEY);
  const latest = await NewsArticleModel.findOne({}).sort({ createdAt: -1 }).exec();
  if (!latest?.createdAt) return;

  // Bootstrap cursor on first run to avoid emailing all historical content.
  if (!cursor) {
    await setCursorDate(NEWS_CURSOR_KEY, new Date(latest.createdAt));
    return;
  }

  const newArticles = await NewsArticleModel.find({ createdAt: { $gt: cursor } })
    .sort({ createdAt: 1 })
    .limit(BATCH_LIMIT)
    .exec();
  if (newArticles.length === 0) return;

  const recipients = await getActiveMemberRecipients();
  if (recipients.length === 0) return;

  let newestSeen = cursor;
  for (const article of newArticles) {
    const articleId = idOf(article);
    const articleUrl = `${siteUrl}/news/${articleId}`;
    const subject = `News Update: ${article.title} - ${siteName}`;
    const createdAtIso = toIsoDate(article.createdAt);
    const publishDateIso = toIsoDate(article.publishDate);
    for (const recipient of recipients) {
      const { html, text } = buildProfessionalUpdateEmail({
        recipientName: recipient.name,
        siteName,
        siteUrl,
        contentTypeLabel: "News",
        title: String(article.title || "Latest Ministry News"),
        details: [
          `Author: ${String(article.author || "SYPE Ministry Team")}`,
          `Published: ${publishDateIso.split("T")[0]}`,
          String(article.excerpt || "").slice(0, 180),
        ],
        ctaLabel: "Read Full News",
        ctaUrl: articleUrl,
      });
      await sendMail({ to: recipient.email, subject, html, text }).catch((err) =>
        console.error(`[ContentNotify] Failed News email to ${recipient.email}:`, err)
      );
    }

    const createdAt = new Date(createdAtIso);
    if (createdAt.getTime() > newestSeen.getTime()) newestSeen = createdAt;
  }

  await setCursorDate(NEWS_CURSOR_KEY, newestSeen);
  console.log(`[ContentNotify] Sent news notifications for ${newArticles.length} new article(s).`);
}

async function notifyEvents(siteName: string, siteUrl: string) {
  const cursor = await getCursorDate(EVENTS_CURSOR_KEY);
  const latest = await EventModel.findOne({}).sort({ createdAt: -1 }).exec();
  if (!latest?.createdAt) return;

  // Bootstrap cursor on first run to avoid emailing all historical content.
  if (!cursor) {
    await setCursorDate(EVENTS_CURSOR_KEY, new Date(latest.createdAt));
    return;
  }

  const newEvents = await EventModel.find({ createdAt: { $gt: cursor } })
    .sort({ createdAt: 1 })
    .limit(BATCH_LIMIT)
    .exec();
  if (newEvents.length === 0) return;

  const recipients = await getActiveMemberRecipients();
  if (recipients.length === 0) return;

  let newestSeen = cursor;
  for (const event of newEvents) {
    const eventUrl = `${siteUrl}/events`;
    const subject = `Event Announcement: ${event.title} - ${siteName}`;
    const eventDateIso = toIsoDate(event.date);
    const createdAtIso = toIsoDate(event.createdAt);
    for (const recipient of recipients) {
      const { html, text } = buildProfessionalUpdateEmail({
        recipientName: recipient.name,
        siteName,
        siteUrl,
        contentTypeLabel: "Event",
        title: String(event.title || "Upcoming Event"),
        details: [
          `Date: ${eventDateIso.split("T")[0]}`,
          `Time: ${String(event.time || "TBA")}`,
          `Location: ${String(event.location || "To be announced")}`,
        ],
        ctaLabel: "View Event Details",
        ctaUrl: eventUrl,
      });
      await sendMail({ to: recipient.email, subject, html, text }).catch((err) =>
        console.error(`[ContentNotify] Failed Event email to ${recipient.email}:`, err)
      );
    }

    const createdAt = new Date(createdAtIso);
    if (createdAt.getTime() > newestSeen.getTime()) newestSeen = createdAt;
  }

  await setCursorDate(EVENTS_CURSOR_KEY, newestSeen);
  console.log(`[ContentNotify] Sent event notifications for ${newEvents.length} new event(s).`);
}

export async function runContentNotificationJob() {
  try {
    await connectMongo();
    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://www.sypeministry.org").trim().replace(/\/+$/, "");
    await notifyNews(siteName, siteUrl);
    await notifyEvents(siteName, siteUrl);
  } catch (err) {
    console.error("[ContentNotify] Scheduled job failed:", err);
  }
}
