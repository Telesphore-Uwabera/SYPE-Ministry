// File Upload Configuration using Multer
// Images are stored in public/images/ folder and committed to GitHub

import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";

// Define upload directories
const UPLOAD_DIRS = {
  images: path.join(process.cwd(), "public", "images"),
  news: path.join(process.cwd(), "public", "images", "news"),
  projects: path.join(process.cwd(), "public", "images", "projects"),
  members: path.join(process.cwd(), "public", "images", "members"),
  events: path.join(process.cwd(), "public", "images", "events"),
  media: path.join(process.cwd(), "public", "images", "media"),
  committee: path.join(process.cwd(), "public", "images", "committee"),
};

// Ensure directories exist
Object.values(UPLOAD_DIRS).forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine folder based on field name or query parameter
    const category = (req.query.category as string) || "media";
    const uploadPath = UPLOAD_DIRS[category as keyof typeof UPLOAD_DIRS] || UPLOAD_DIRS.media;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const filename = `${basename}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// File filter - only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Helper function to get public URL for uploaded image
export function getImageUrl(category: string, filename: string): string {
  return `/images/${category}/${filename}`;
}

// Helper function to get full file path
export function getImagePath(category: string, filename: string): string {
  const uploadPath = UPLOAD_DIRS[category as keyof typeof UPLOAD_DIRS] || UPLOAD_DIRS.media;
  return path.join(uploadPath, filename);
}

// Export upload directories for reference
export { UPLOAD_DIRS };
