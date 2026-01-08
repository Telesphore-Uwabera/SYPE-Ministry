// Image Upload Route
import { RequestHandler } from "express";
import { upload, getImageUrl } from "../lib/upload";

// Upload single image
export const uploadImage: RequestHandler = (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const category = (req.query.category as string) || "media";
    const imageUrl = getImageUrl(category, req.file.filename);

    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      category,
    });
  });
};

// Upload multiple images
export const uploadImages: RequestHandler = (req, res) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const category = (req.query.category as string) || "media";
    const files = req.files as Express.Multer.File[];

    const uploadedFiles = files.map((file) => ({
      url: getImageUrl(category, file.filename),
      filename: file.filename,
      size: file.size,
    }));

    res.json({
      success: true,
      files: uploadedFiles,
      count: uploadedFiles.length,
    });
  });
};
