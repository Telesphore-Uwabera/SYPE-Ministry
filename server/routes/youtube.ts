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
        console.log("YouTube Channel ID:", channelId);
      } else {
        const errorData = await channelResponse.json().catch(() => ({}));
        console.warn("Failed to fetch channel ID by handle:", channelResponse.status, errorData);
      }
    } catch (err) {
      console.warn("Failed to fetch channel ID by handle, will use search method:", err);
    }

    // Fetch videos from channel
    let videosData: any;
    if (channelId) {
      // Use channel ID (more reliable)
      try {
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${Math.max(limit * 3, 50)}&key=${YOUTUBE_API_KEY}`
        );
        if (videosResponse.ok) {
          videosData = await videosResponse.json();
          console.log(`Fetched ${videosData.items?.length || 0} videos from channel`);
        } else {
          const errorData = await videosResponse.json().catch(() => ({}));
          console.error("YouTube search API error:", videosResponse.status, errorData);
        }
      } catch (err) {
        console.error("Error fetching videos by channel ID:", err);
      }
    }

    // Fallback: Use search API if channel ID method failed
    if (!videosData || !videosData.items || videosData.items.length === 0) {
      console.log("Using fallback search method");
      try {
        const searchQuery = encodeURIComponent(`@${channelHandle}`);
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&order=date&maxResults=${Math.max(limit * 3, 50)}&key=${YOUTUBE_API_KEY}`
        );
        
        if (!videosResponse.ok) {
          const errorData = await videosResponse.json().catch(() => ({}));
          console.error("YouTube API error:", videosResponse.status, videosResponse.statusText, errorData);
          if (cachedVideos.length > 0) {
            console.log("Returning cached videos");
            return res.json(cachedVideos.slice(0, limit));
          }
          return res.json([]);
        }
        
        videosData = await videosResponse.json();
        console.log(`Fetched ${videosData.items?.length || 0} videos from search`);
      } catch (err) {
        console.error("Error in fallback search:", err);
        if (cachedVideos.length > 0) {
          return res.json(cachedVideos.slice(0, limit));
        }
        return res.json([]);
      }
    }

    // Map all videos first
    let videos: YouTubeVideo[] = (videosData.items || [])
      .map((item: any) => {
        // Get video ID - can be in item.id.videoId (from search) or item.id (from playlist)
        const videoId = item.id?.videoId || item.id;
        return {
          id: videoId,
          videoId: videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          publishedAt: item.snippet.publishedAt,
          description: item.snippet.description || item.snippet.title,
        };
      })
      .filter((video: YouTubeVideo) => {
        // Only filter by channel if we didn't use channelId (i.e., used search method)
        if (!channelId) {
          // For search results, try to ensure it's from the right channel
          // But be less strict - just check if it exists
          return true;
        }
        return true; // If we used channelId, all results are from the channel
      });

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
