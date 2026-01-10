// Storage Adapter - Supports both local files (dev) and Supabase Storage (production)
import { uploadFile, deleteFile, getPublicUrl } from "./supabase";
import path from "path";
import { STORAGE_BUCKETS } from "./supabase";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  path: string;
}

// Determine if we should use Supabase Storage (production) or local files (development)
const USE_SUPABASE_STORAGE = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Upload file to storage (Supabase in production, local in development)
 */
export async function uploadToStorage(
  file: Express.Multer.File,
  category: string = "media",
  type: "image" | "video" | "document" = "image"
): Promise<UploadResult> {
  if (USE_SUPABASE_STORAGE) {
    return uploadToSupabase(file, category, type);
  } else {
    return uploadToLocal(file, category, type);
  }
}

/**
 * Upload file to Supabase Storage
 */
async function uploadToSupabase(
  file: Express.Multer.File,
  category: string,
  type: "image" | "video" | "document"
): Promise<UploadResult> {
  // Determine bucket based on type
  let bucket: string;
  if (type === "image") {
    bucket = STORAGE_BUCKETS.IMAGES;
  } else if (type === "video") {
    bucket = STORAGE_BUCKETS.VIDEOS;
  } else {
    bucket = STORAGE_BUCKETS.DOCUMENTS;
  }

  // Create file path with category folder structure
  const timestamp = Date.now();
  const randomSuffix = Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-");
  const filename = `${basename}-${timestamp}-${randomSuffix}${ext}`;
  
  // Organize by category in bucket
  let filePath: string;
  if (category && category !== "media") {
    filePath = `${category}/${filename}`;
  } else {
    filePath = filename;
  }

  // Upload to Supabase Storage
  const result = await uploadFile(
    bucket,
    filePath,
    file.buffer || Buffer.from(file.path), // Use buffer if available, otherwise read from path
    {
      contentType: file.mimetype,
      upsert: false,
    }
  );

  return {
    url: result.url,
    filename,
    size: file.size,
    path: result.path,
  };
}

/**
 * Upload file to local storage (for development)
 */
async function uploadToLocal(
  file: Express.Multer.File,
  category: string,
  type: "image" | "video" | "document"
): Promise<UploadResult> {
  // In development, files are already saved by multer
  // Just return the URL path
  let url: string;
  
  if (type === "image") {
    if (category === "devotions") {
      url = `/images/devotions/${file.filename}`;
    } else if (category && category !== "media") {
      url = `/images/${category}/${file.filename}`;
    } else {
      url = `/media/images/${file.filename}`;
    }
  } else if (type === "video") {
    if (category === "testimony") {
      url = `/media/videos/testimony/${file.filename}`;
    } else {
      url = `/media/videos/${file.filename}`;
    }
  } else {
    url = `/media/documents/${file.filename}`;
  }

  return {
    url,
    filename: file.filename,
    size: file.size,
    path: file.path,
  };
}

/**
 * Delete file from storage
 */
export async function deleteFromStorage(
  url: string,
  type: "image" | "video" | "document" = "image"
): Promise<void> {
  if (USE_SUPABASE_STORAGE) {
    await deleteFromSupabase(url, type);
  } else {
    // In development, local files can be deleted manually or left as-is
    // Supabase handles deletion automatically
  }
}

/**
 * Delete file from Supabase Storage
 */
async function deleteFromSupabase(
  url: string,
  type: "image" | "video" | "document"
): Promise<void> {
  // Extract path from Supabase URL
  // URL format: https://xxxxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file
  const urlMatch = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
  if (!urlMatch) {
    throw new Error("Invalid Supabase Storage URL");
  }

  const bucket = urlMatch[1];
  const filePath = urlMatch[2];

  await deleteFile(bucket, filePath);
}

/**
 * Get public URL for a file (used for existing files or manual URL generation)
 */
export function getStorageUrl(
  category: string,
  type: "image" | "video" | "document",
  filename: string
): string {
  if (USE_SUPABASE_STORAGE) {
    let bucket: string;
    if (type === "image") {
      bucket = STORAGE_BUCKETS.IMAGES;
    } else if (type === "video") {
      bucket = STORAGE_BUCKETS.VIDEOS;
    } else {
      bucket = STORAGE_BUCKETS.DOCUMENTS;
    }

    const filePath = category && category !== "media" 
      ? `${category}/${filename}`
      : filename;

    return getPublicUrl(bucket, filePath);
  } else {
    // Local development URLs
    if (type === "image") {
      if (category === "devotions") {
        return `/images/devotions/${filename}`;
      } else if (category && category !== "media") {
        return `/images/${category}/${filename}`;
      } else {
        return `/media/images/${filename}`;
      }
    } else if (type === "video") {
      if (category === "testimony") {
        return `/media/videos/testimony/${filename}`;
      } else {
        return `/media/videos/${filename}`;
      }
    } else {
      return `/media/documents/${filename}`;
    }
  }
}
