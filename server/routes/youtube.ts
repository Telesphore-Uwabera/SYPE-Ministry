import { RequestHandler } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../middleware/errorHandler";

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
export const getLatestVideos: RequestHandler = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
  const category = req.query.category as string | undefined;
  const now = Date.now();

  // If no API key, return empty array
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key not configured. Returning empty array.");
    return res.json([]);
  }

  // Return cached data if it's still fresh (only if no category filter and cache has enough videos)
  // Only use cache if it has at least as many videos as requested
  if (!category && cachedVideos.length > 0 && cachedVideos.length >= limit && now - cacheTimestamp < CACHE_DURATION) {
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
  const channelHandle = "sypeministry5276"; // Without @ for API calls

  // Step 1: Get channel ID using channels.list API with handle
  let channelId: string | null = null;
  let uploadsPlaylistId: string | null = null;

  try {
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id,contentDetails&forHandle=${channelHandle}&key=${YOUTUBE_API_KEY}`
    );
    if (channelResponse.ok) {
      const channelData = await channelResponse.json();
      if (channelData.items && channelData.items.length > 0) {
        channelId = channelData.items[0].id;
        uploadsPlaylistId = channelData.items[0].contentDetails?.relatedPlaylists?.uploads;
        console.log("YouTube Channel ID:", channelId);
        console.log("Uploads Playlist ID:", uploadsPlaylistId);
      }
    } else {
      const errorData = await channelResponse.json().catch(() => ({}));
      console.warn("Failed to fetch channel ID by handle:", channelResponse.status, errorData);
    }
  } catch (err) {
    console.warn("Failed to fetch channel ID by handle:", err);
  }

  // Step 2: Fetch videos from channel using the most reliable method
  let videosData: any;

  // Method 1: Use uploads playlist (most reliable for getting all channel videos)
  if (uploadsPlaylistId) {
    try {
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${limit}&order=date&key=${YOUTUBE_API_KEY}`
      );
      if (playlistResponse.ok) {
        const playlistData = await playlistResponse.json();
        if (playlistData.items && playlistData.items.length > 0) {
          // Transform playlist items to match our video format
          videosData = {
            items: playlistData.items.map((item: any) => ({
              id: { videoId: item.snippet.resourceId.videoId },
              snippet: item.snippet
            }))
          };
          console.log(`Fetched ${videosData.items.length} videos from uploads playlist`);
        }
      } else {
        const errorData = await playlistResponse.json().catch(() => ({}));
        console.warn("Failed to fetch from uploads playlist:", playlistResponse.status, errorData);
      }
    } catch (err) {
      console.warn("Error fetching from uploads playlist:", err);
    }
  }

  // Method 2: Use search API with channelId (fallback if playlist method failed)
  if ((!videosData || !videosData.items || videosData.items.length === 0) && channelId) {
    try {
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${limit}&key=${YOUTUBE_API_KEY}`
      );
      if (videosResponse.ok) {
        videosData = await videosResponse.json();
        console.log(`Fetched ${videosData.items?.length || 0} videos from channel search`);
      } else {
        const errorData = await videosResponse.json().catch(() => ({}));
        console.error("YouTube search API error:", videosResponse.status, errorData);
      }
    } catch (err) {
      console.error("Error fetching videos by channel ID:", err);
    }
  }

  // Method 3: Fallback to search by handle (last resort)
  if (!videosData || !videosData.items || videosData.items.length === 0) {
    console.log("Using fallback search method by handle");
    try {
      const searchQuery = encodeURIComponent(`@${channelHandle}`);
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&order=date&maxResults=${limit}&key=${YOUTUBE_API_KEY}`
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
});
