// Media Upload Route (Images, Videos, Documents)
import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import { uploadToStorage, getStorageUrl } from "../lib/storageAdapter";

// Configure multer to use memory storage (for Supabase upload)
const memoryStorage = multer.memoryStorage();

// File filter - allow images, videos, and documents
const mediaFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: Images, Videos, Documents.`));
  }
};

// Configure multer for media uploads
const mediaUpload = multer({
  storage: memoryStorage,
  fileFilter: mediaFileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit
  },
});

// Upload single media file
export const uploadMedia: RequestHandler = async (req, res) => {
  mediaUpload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const category = (req.query.category as string) || "";
      const type = (req.query.type as string) || 
        (req.file.mimetype.startsWith("image") ? "image" : 
         req.file.mimetype.startsWith("video") ? "video" : "document");

      // Upload to Supabase Storage (or local in dev)
      const result = await uploadToStorage(req.file, category, type as "image" | "video" | "document");

      res.json({
        success: true,
        url: result.url,
        filename: result.filename,
        size: result.size,
        type,
        category,
        mimetype: req.file.mimetype,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload file" });
    }
  });
};

// Upload thumbnail for video
export const uploadThumbnail: RequestHandler = async (req, res) => {
  const thumbnailUpload = multer({
    storage: memoryStorage,
    fileFilter: (req, file, cb) => {
      const imageMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (imageMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Thumbnail must be an image file."));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for thumbnails
  });

  thumbnailUpload.single("thumbnail")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No thumbnail uploaded" });
    }

    try {
      // Upload thumbnail as image to Supabase Storage
      const result = await uploadToStorage(req.file, "thumbnails", "image");

      res.json({
        success: true,
        url: result.url,
        filename: result.filename,
        size: result.size,
      });
    } catch (error: any) {
      console.error("Thumbnail upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload thumbnail" });
    }
  });
};

// Upload multiple media files
export const uploadMultipleMedia: RequestHandler = async (req, res) => {
  mediaUpload.array("files", 10)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    try {
      const category = (req.query.category as string) || "";
      const files = req.files as Express.Multer.File[];

      // Upload all files to Supabase Storage
      const uploadPromises = files.map(async (file) => {
        const type = (req.query.type as string) || 
          (file.mimetype.startsWith("image") ? "image" : 
           file.mimetype.startsWith("video") ? "video" : "document");
        
        const result = await uploadToStorage(file, category, type as "image" | "video" | "document");
        
        return {
          url: result.url,
          filename: result.filename,
          size: result.size,
          type,
          mimetype: file.mimetype,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      res.json({
        success: true,
        files: uploadedFiles,
        count: uploadedFiles.length,
      });
    } catch (error: any) {
      console.error("Multiple upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload files" });
    }
  });
};
