
import { YouTubeSyncModel, EmailSubscriberModel, MemberModel } from "../models/core";
import { sendMail } from "./mailer";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const CHANNEL_HANDLE = "sypeministry5276";

interface YouTubeVideo {
    videoId: string;
    title: string;
    thumbnail: string;
}

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

        // 2. Fetch videos from the uploads playlist
        const playlistResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=5&key=${YOUTUBE_API_KEY}`
        );
        if (!playlistResponse.ok) return [];

        const playlistData = await playlistResponse.json();
        return (playlistData.items || []).map((item: any) => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        }));
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

    for (const video of latestVideos) {
        // Check if we've already notified for this video
        const existing = await YouTubeSyncModel.findOne({ videoId: video.videoId });
        if (existing) continue;

        console.log(`[YouTubeSync] New video detected: ${video.title} (${video.videoId})`);

        // Fetch all active subscribers and members
        const subscribers = await EmailSubscriberModel.find({ status: "active" }).select("email name").exec();
        const members = await MemberModel.find({ status: "Active" }).select("email name").exec();

        const recipients = new Set<string>();
        subscribers.forEach(s => recipients.add(s.email));
        members.forEach(m => recipients.add(m.email));

        const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
        const subject = `New Video Upload: ${video.title} - ${siteName}`;

        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #186d84; color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0;">New Video Uploaded!</h2>
        </div>
        <div style="padding: 32px; background-color: white;">
          <p>Hello,</p>
          <p>We are excited to share a new video from <strong>${siteName}</strong> on our YouTube channel.</p>
          
          <div style="margin: 24px 0; text-align: center;">
            <a href="${videoUrl}" style="text-decoration: none; color: #111827;">
              <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
              <h3 style="margin-top: 16px;">${video.title}</h3>
            </a>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${videoUrl}" style="background-color: #186d84; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Watch Video Now</a>
          </div>

          <p style="margin-top: 32px;">Thank you for your continued support and for being part of our mission.</p>
          
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
        for (const email of recipients) {
            await sendMail({
                to: email,
                subject,
                html,
                text: `New Video Uploaded: ${video.title}. Watch it here: ${videoUrl}`,
            }).catch(err => console.error(`Failed to send YouTube notification to ${email}:`, err));
        }

        // Save as notified
        await YouTubeSyncModel.create({
            videoId: video.videoId,
            title: video.title,
        });

        console.log(`[YouTubeSync] Successfully notified for video: ${video.videoId}`);
    }
}
