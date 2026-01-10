import { RequestHandler } from "express";

// YouTube Video interface
interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  videoId: string;
}

// In-memory cache for YouTube videos (refresh every hour)
let cachedVideos: YouTubeVideo[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

// Category keywords for filtering videos
const categoryKeywords: Record<string, string[]> = {
  sermons: ["sermon", "teaching", "bible study", "preaching", "message", "word"],
  evangelism: ["evangelism", "outreach", "mission", "gospel", "witness", "sharing"],
};

/**
 * Fetch latest videos from YouTube channel with optional category filtering
 * Note: Requires YouTube Data API v3 key in environment variables
 * Category filtering works by searching for keywords in video titles/descriptions
 */
export const getLatestVideos: RequestHandler = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
    const category = req.query.category as string | undefined;
    const now = Date.now();

    // If no API key, return empty array
    if (!YOUTUBE_API_KEY) {
      console.warn("YouTube API key not configured. Returning empty array.");
      return res.json([]);
    }

    // Return cached data if it's still fresh (only if no category filter)
    if (!category && cachedVideos.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
      // Apply category filter to cached data if needed
      if (category && categoryKeywords[category.toLowerCase()]) {
        const keywords = categoryKeywords[category.toLowerCase()];
        const filtered = cachedVideos.filter((video) => {
          const title = video.title?.toLowerCase() || "";
          const description = video.description?.toLowerCase() || "";
          return keywords.some(keyword => title.includes(keyword) || description.includes(keyword));
        });
        return res.json(filtered.slice(0, limit));
      }
      return res.json(cachedVideos.slice(0, limit));
    }

    // Channel handle: @sypeministry5276
    // First, try to get channel ID using channels.list API with handle
    const channelHandle = "sypeministry5276"; // Without @ for API calls
    
    // Try to get channel ID first
    let channelId: string | null = null;
    try {
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${channelHandle}&key=${YOUTUBE_API_KEY}`
      );
      if (channelResponse.ok) {
        const channelData = await channelResponse.json();
        channelId = channelData.items?.[0]?.id || null;
      }
    } catch (err) {
      console.warn("Failed to fetch channel ID by handle, will use search method");
    }

    // Fetch videos from channel
    let videosData: any;
    if (channelId) {
      // Use channel ID (more reliable)
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${limit * 3}&key=${YOUTUBE_API_KEY}`
      );
      if (videosResponse.ok) {
        videosData = await videosResponse.json();
      }
    }

    // Fallback: Use search API if channel ID method failed
    if (!videosData || !videosData.items) {
      const searchQuery = encodeURIComponent(`@${channelHandle} SYPE Ministry`);
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&order=date&maxResults=${limit * 3}&key=${YOUTUBE_API_KEY}`
      );
      
      if (!videosResponse.ok) {
        console.error("YouTube API error:", videosResponse.status, videosResponse.statusText);
        if (cachedVideos.length > 0) {
          return res.json(cachedVideos.slice(0, limit));
        }
        return res.json([]);
      }
      
      videosData = await videosResponse.json();
    }

    // Map all videos first
    let videos: YouTubeVideo[] = (videosData.items || [])
      .filter((item: any) => {
        // Ensure video is from SYPE channel
        const channelTitle = item.snippet.channelTitle?.toLowerCase() || "";
        return channelTitle.includes("sype");
      })
      .map((item: any) => ({
        id: item.id.videoId,
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description || item.snippet.title,
      }));

    // Apply category filter if specified
    if (category && categoryKeywords[category.toLowerCase()]) {
      const keywords = categoryKeywords[category.toLowerCase()];
      videos = videos.filter((video) => {
        const title = video.title?.toLowerCase() || "";
        const description = video.description?.toLowerCase() || "";
        return keywords.some(keyword => title.includes(keyword) || description.includes(keyword));
      });
    }

    // Update cache (only if no category filter)
    if (!category) {
      cachedVideos = videos;
      cacheTimestamp = now;
    }

    res.json(videos.slice(0, limit));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    // Return cached data if available, otherwise empty array
    if (cachedVideos.length > 0) {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      return res.json(cachedVideos.slice(0, limit));
    }
    res.json([]);
  }
};
