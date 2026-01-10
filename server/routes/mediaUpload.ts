// Media Upload Route (Images, Videos, Documents)
import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import { mediaUpload, getMediaUrl, getThumbnailUrl } from "../lib/mediaUpload";

// Upload single media file
export const uploadMedia: RequestHandler = (req, res) => {
  mediaUpload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const category = (req.query.category as string) || "";
    const type = (req.query.type as string) || req.file.mimetype.split("/")[0]; // image, video, document
    const mediaUrl = getMediaUrl(category, type, req.file.filename);

    res.json({
      success: true,
      url: mediaUrl,
      filename: req.file.filename,
      size: req.file.size,
      type,
      category,
      mimetype: req.file.mimetype,
    });
  });
};

// Upload thumbnail for video
export const uploadThumbnail: RequestHandler = (req, res) => {
  const multerUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "public", "media", "thumbnails"));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-");
        const filename = `thumb-${basename}-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    }),
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

  multerUpload.single("thumbnail")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No thumbnail uploaded" });
    }

    const thumbnailUrl = getThumbnailUrl(req.file.filename);

    res.json({
      success: true,
      url: thumbnailUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
};

// Upload multiple media files
export const uploadMultipleMedia: RequestHandler = (req, res) => {
  mediaUpload.array("files", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const category = (req.query.category as string) || "";
    const files = req.files as Express.Multer.File[];

    const uploadedFiles = files.map((file) => {
      const type = (req.query.type as string) || file.mimetype.split("/")[0];
      return {
        url: getMediaUrl(category, type, file.filename),
        filename: file.filename,
        size: file.size,
        type,
        mimetype: file.mimetype,
      };
    });

    res.json({
      success: true,
      files: uploadedFiles,
      count: uploadedFiles.length,
    });
  });
};
