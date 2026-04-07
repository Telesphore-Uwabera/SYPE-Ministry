
import { YouTubeSyncModel, MemberModel } from "../models/core";
import { sendMail } from "./mailer";
import { connectMongo } from "./mongoose";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const CHANNEL_HANDLE = "sypeministry5276";

/** Hours after YouTube publish time before sending email (default 0 = immediate). */
const notifyAfterHoursRaw = Number.parseInt(process.env.YOUTUBE_NOTIFY_AFTER_HOURS || "0", 10);
const notifyAfterHours =
  Number.isFinite(notifyAfterHoursRaw) && notifyAfterHoursRaw >= 0 ? notifyAfterHoursRaw : 0;
const NOTIFY_AFTER_MS = notifyAfterHours * 60 * 60 * 1000;

interface YouTubeVideo {
    videoId: string;
    title: string;
    thumbnail: string;
    publishedAt: Date;
}

const PLAYLIST_MAX_PAGES = 10;

async function fetchLatestVideos(): Promise<YouTubeVideo[]> {
    if (!YOUTUBE_API_KEY) return [];

    try {
        // 1. Get channel ID and uploads playlist ID
        const channelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`
        );
        if (!channelResponse.ok) return [];

        const channelData = await channelResponse.json();
        const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsPlaylistId) return [];

        // 2. Fetch videos from the uploads playlist (paginated so older uploads stay discoverable until notified)
        const videos: YouTubeVideo[] = [];
        let pageToken: string | undefined;

        for (let page = 0; page < PLAYLIST_MAX_PAGES; page++) {
            const params = new URLSearchParams({
                part: "snippet",
                playlistId: uploadsPlaylistId,
                maxResults: "50",
                key: YOUTUBE_API_KEY,
            });
            if (pageToken) params.set("pageToken", pageToken);

            const playlistResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
            if (!playlistResponse.ok) break;

            const playlistData = await playlistResponse.json();
            for (const item of playlistData.items || []) {
                const publishedRaw = item?.snippet?.publishedAt;
                const publishedAt = publishedRaw ? new Date(publishedRaw) : new Date(NaN);
                videos.push({
                    videoId: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
                    publishedAt,
                });
            }
            pageToken = playlistData.nextPageToken;
            if (!pageToken) break;
        }

        return videos;
    } catch (error) {
        console.error("Error fetching YouTube videos in sync job:", error);
        return [];
    }
}

export async function syncYouTubeAndNotify() {
    console.log(`[YouTubeSync] Starting sync job at ${new Date().toISOString()}`);

    const latestVideos = await fetchLatestVideos();
    if (latestVideos.length === 0) return;

    const siteName = (process.env.SITE_NAME || "SYPE Ministry").trim();
    const siteUrl = (process.env.SITE_URL || "https://www.sypeministry.org").trim().replace(/\/+$/, "");

    const members = await MemberModel.find({ status: "Active" }).select("email name").exec();
    const recipients = new Map<string, string>();
    for (const member of members) {
        const email = String(member?.email || "").trim().toLowerCase();
        if (!email || !email.includes("@")) continue;
        if (!recipients.has(email)) recipients.set(email, String(member?.name || "").trim());
    }
    if (recipients.size === 0) return;

    for (const video of latestVideos) {
        // Check if we've already notified for this video
        const existing = await YouTubeSyncModel.findOne({ videoId: video.videoId });
        if (existing) continue;

        if (Number.isNaN(video.publishedAt.getTime())) {
            console.warn(`[YouTubeSync] Skipping video ${video.videoId}: missing publishedAt`);
            continue;
        }

        const notifyEligibleAfter = video.publishedAt.getTime() + NOTIFY_AFTER_MS;
        if (Date.now() < notifyEligibleAfter) {
            const hoursLeft = Math.ceil((notifyEligibleAfter - Date.now()) / (60 * 60 * 1000));
            console.log(
                `[YouTubeSync] Video not yet due for email (${notifyAfterHours}h after publish): ${video.title} (${video.videoId}) — ~${hoursLeft}h remaining`
            );
            continue;
        }

        console.log(`[YouTubeSync] Video eligible for notification: ${video.title} (${video.videoId})`);

        const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
        const subject = `New YouTube Upload: ${video.title} - ${siteName}`;

        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #186d84; color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0;">New YouTube Video Uploaded</h2>
        </div>
        <div style="padding: 32px; background-color: white;">
          <p>Dear Member,</p>
          <p>We are pleased to share the latest upload from <strong>${siteName}</strong>.</p>
          
          <div style="margin: 24px 0; text-align: center;">
            <a href="${videoUrl}" style="text-decoration: none; color: #111827;">
              <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
              <h3 style="margin-top: 16px;">${video.title}</h3>
            </a>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${videoUrl}" style="background-color: #186d84; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Watch Video Now</a>
          </div>

          <p style="margin-top: 32px;">Thank you for your continued commitment to the ministry.</p>
          
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #718096; text-align: center;">
            Stay blessed,<br>
            <strong>${siteName} Team</strong><br>
            <a href="${siteUrl}">${siteUrl}</a>
          </div>
        </div>
      </div>
    `;

        // Send emails in batches or one by one
        // For now, one by one to keep it simple and respect potential rate limits
        for (const [email] of recipients) {
            await sendMail({
                to: email,
                subject,
                html,
                text: `New YouTube upload from ${siteName}: ${video.title}. Watch now: ${videoUrl}`,
            }).catch(err => console.error(`Failed to send YouTube notification to ${email}:`, err));
        }

        // Save as notified
        await YouTubeSyncModel.create({
            videoId: video.videoId,
            title: video.title,
            publishedAt: video.publishedAt,
        });

        console.log(`[YouTubeSync] Successfully notified for video: ${video.videoId}`);
    }
}

/** Runs Mongo connect + YouTube delayed-notification sync (safe to call on a timer). */
export async function runYouTubeNotifyJob() {
  try {
    await connectMongo();
    await syncYouTubeAndNotify();
  } catch (err) {
    console.error("[YouTubeSync] Scheduled job failed:", err);
  }
}
