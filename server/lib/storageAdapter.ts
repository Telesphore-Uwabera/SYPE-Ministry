// Storage Adapter - Supports Cloudinary in production and local files in development
import path from "path";
import { getCloudinary, isCloudinaryConfigured } from "./cloudinary";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  path: string;
}

// Determine if we should use Cloudinary (when configured) or local files (development)
const USE_CLOUDINARY = isCloudinaryConfigured();

/**
 * Upload file to storage (Supabase in production, local in development)
 */
export async function uploadToStorage(
  file: Express.Multer.File,
  category: string = "media",
  type: "image" | "video" | "document" = "image"
): Promise<UploadResult> {
  if (USE_CLOUDINARY) {
    return uploadToCloudinary(file, category, type);
  } else {
    return uploadToLocal(file, category, type);
  }
}

/**
 * Upload file to Cloudinary
 */
async function uploadToCloudinary(
  file: Express.Multer.File,
  category: string,
  type: "image" | "video" | "document"
): Promise<UploadResult> {
  if (!file.buffer) {
    throw new Error("File buffer is required for upload. Make sure multer is configured with memory storage.");
  }
  const timestamp = Date.now();
  const randomSuffix = Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-");
  const filename = `${basename}-${timestamp}-${randomSuffix}${ext}`;

  const folderParts = ["sype-ministry"];
  if (type) folderParts.push(type);
  if (category && category !== "media") folderParts.push(category);
  const folder = folderParts.join("/");

  const resourceType = type === "image" ? "image" : type === "video" ? "video" : "raw";
  const cld = getCloudinary();

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: filename.replace(ext, ""),
        overwrite: false,
      },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
    stream.end(file.buffer);
  });

  return {
    url: uploadResult.secure_url || uploadResult.url,
    filename,
    size: file.size,
    path: uploadResult.public_id || filename,
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
  if (!USE_CLOUDINARY) {
    // In development, local files can be deleted manually or left as-is
    return;
  }

  const cld = getCloudinary();
  const resourceType = type === "image" ? "image" : type === "video" ? "video" : "raw";

  // URL-based deletion is ambiguous on Cloudinary; prefer storing and deleting by public_id.
  // We best-effort parse the public_id from the URL.
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  const publicId = match?.[1];
  if (!publicId) return;

  await cld.uploader.destroy(publicId, { resource_type: resourceType });
}

/**
 * Get public URL for a file (used for existing files or manual URL generation)
 */
export function getStorageUrl(
  category: string,
  type: "image" | "video" | "document",
  filename: string
): string {
  // For Cloudinary we store full URLs in DB; this helper is mainly for local dev.
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
