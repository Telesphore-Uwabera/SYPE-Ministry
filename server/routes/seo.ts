import { RequestHandler } from "express";
import { connectMongo } from "../lib/mongoose";
import { NewsArticleModel, DevotionModel, EventModel } from "../models/core";
import { asyncHandler } from "../middleware/asyncHandler";

export const getSitemap: RequestHandler = asyncHandler(async (req, res) => {
  await connectMongo();

  const [news, devotions, events] = await Promise.all([
    NewsArticleModel.find({}).select("_id updatedAt").lean().exec(),
    DevotionModel.find({}).select("_id updatedAt").lean().exec(),
    EventModel.find({}).select("_id updatedAt").lean().exec(),
  ]);

  const siteUrl = (process.env.SITE_URL || "https://sypeministry.org").replace(/\/+$/, "");
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/news</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/devotions</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/membership</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/donations</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/faqs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

  // Add News Articles
  news.forEach((n: any) => {
    xml += `
  <url>
    <loc>${siteUrl}/news/${n._id}</loc>
    <lastmod>${new Date(n.updatedAt || new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add Devotions
  devotions.forEach((d: any) => {
    xml += `
  <url>
    <loc>${siteUrl}/devotions/${d._id}</loc>
    <lastmod>${new Date(d.updatedAt || new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add Events
  events.forEach((e: any) => {
    xml += `
  <url>
    <loc>${siteUrl}/events/${e._id}</loc>
    <lastmod>${new Date(e.updatedAt || new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});
