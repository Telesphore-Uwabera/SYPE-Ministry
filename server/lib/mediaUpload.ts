// Media Upload Configuration using Multer
// Supports Images, Videos, and Documents
// Files are stored in public/media/ folder and committed to GitHub

import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";

// Define upload directories for different media types
const MEDIA_UPLOAD_DIRS = {
  images: path.join(process.cwd(), "public", "media", "images"),
  videos: path.join(process.cwd(), "public", "media", "videos"),
  documents: path.join(process.cwd(), "public", "media", "documents"),
  thumbnails: path.join(process.cwd(), "public", "media", "thumbnails"),
  // Category-specific folders
  testimony: path.join(process.cwd(), "public", "media", "videos", "testimony"),
  graphics: path.join(process.cwd(), "public", "media", "images", "graphics"),
  posters: path.join(process.cwd(), "public", "media", "images", "posters"),
  devotions: path.join(process.cwd(), "public", "images", "devotions"), // Images for devotions section
};

// Ensure directories exist
Object.values(MEDIA_UPLOAD_DIRS).forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for media files
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = (req.query.category as string) || "media";
    const fileType = (req.query.type as string) || file.mimetype.split("/")[0]; // image, video, document
    
    let uploadPath: string;
    
    // Use category-specific folders if category is provided
    if (category === "testimony" && fileType === "video") {
      uploadPath = MEDIA_UPLOAD_DIRS.testimony;
    } else if (category === "graphics" && fileType === "image") {
      uploadPath = MEDIA_UPLOAD_DIRS.graphics;
    } else if (category === "posters" && fileType === "image") {
      uploadPath = MEDIA_UPLOAD_DIRS.posters;
    } else if (category === "devotions" && fileType === "image") {
      uploadPath = MEDIA_UPLOAD_DIRS.devotions;
    } else {
      // Use type-based folders
      if (fileType === "image") {
        uploadPath = MEDIA_UPLOAD_DIRS.images;
      } else if (fileType === "video") {
        uploadPath = MEDIA_UPLOAD_DIRS.videos;
      } else {
        uploadPath = MEDIA_UPLOAD_DIRS.documents;
      }
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-");
    const filename = `${basename}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// File filter - allow images, videos, and documents
const mediaFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // For thumbnails, only allow images
  if (req.query.thumbnail === "true" || file.fieldname === "thumbnail") {
    const imageMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (imageMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Thumbnail must be an image file (JPEG, PNG, GIF, WebP)."));
    }
    return;
  }
  
  const allowedMimes = [
    // Images
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    // Videos
    "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/webm",
    // Documents
    "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: Images (JPEG, PNG, GIF, WebP), Videos (MP4, MOV, AVI, WebM), Documents (PDF, DOC, DOCX, XLS, XLSX).`));
  }
};

// Configure multer for media uploads (larger size limit for videos)
export const mediaUpload = multer({
  storage: mediaStorage,
  fileFilter: mediaFileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit for all files
  },
});

// Helper function to get public URL for uploaded media
export function getMediaUrl(category: string, type: string, filename: string): string {
  if (category === "testimony" && type === "video") {
    return `/media/videos/testimony/${filename}`;
  } else if (category === "graphics" && type === "image") {
    return `/media/images/graphics/${filename}`;
  } else if (category === "posters" && type === "image") {
    return `/media/images/posters/${filename}`;
  } else if (category === "devotions" && type === "image") {
    return `/images/devotions/${filename}`;
  } else {
    return `/media/${type}s/${filename}`;
  }
}

// Helper function to get full file path
export function getMediaPath(category: string, type: string, filename: string): string {
  if (category === "testimony" && type === "video") {
    return path.join(MEDIA_UPLOAD_DIRS.testimony, filename);
  } else if (category === "graphics" && type === "image") {
    return path.join(MEDIA_UPLOAD_DIRS.graphics, filename);
  } else if (category === "posters" && type === "image") {
    return path.join(MEDIA_UPLOAD_DIRS.posters, filename);
  } else {
    const dir = type === "image" ? MEDIA_UPLOAD_DIRS.images : type === "video" ? MEDIA_UPLOAD_DIRS.videos : MEDIA_UPLOAD_DIRS.documents;
    return path.join(dir, filename);
  }
}

// Helper to get thumbnail URL
export function getThumbnailUrl(filename: string): string {
  return `/media/thumbnails/${filename}`;
}

// Export upload directories for reference
export { MEDIA_UPLOAD_DIRS };
