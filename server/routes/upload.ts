// Image Upload Route
import { RequestHandler } from "express";
import multer from "multer";
import { uploadToStorage } from "../lib/storageAdapter";

// Configure multer to use memory storage (for Supabase upload)
const memoryStorage = multer.memoryStorage();

// File filter - only allow images
const imageFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."));
  }
};

// Configure multer for image uploads
const upload = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
});

// Upload single image
export const uploadImage: RequestHandler = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const category = (req.query.category as string) || "media";
      
      // Upload to Supabase Storage (or local in dev)
      const result = await uploadToStorage(req.file, category, "image");

      res.json({
        success: true,
        url: result.url,
        filename: result.filename,
        size: result.size,
        category,
      });
    } catch (error: any) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload image" });
    }
  });
};

// Upload multiple images
export const uploadImages: RequestHandler = async (req, res) => {
  upload.array("images", 10)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    try {
      const category = (req.query.category as string) || "media";
      const files = req.files as Express.Multer.File[];

      // Upload all images to Supabase Storage
      const uploadPromises = files.map((file) => 
        uploadToStorage(file, category, "image")
      );

      const results = await Promise.all(uploadPromises);

      const uploadedFiles = results.map((result) => ({
        url: result.url,
        filename: result.filename,
        size: result.size,
      }));

      res.json({
        success: true,
        files: uploadedFiles,
        count: uploadedFiles.length,
      });
    } catch (error: any) {
      console.error("Multiple image upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload images" });
    }
  });
};
