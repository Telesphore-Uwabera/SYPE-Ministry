import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StructuredData from "./StructuredData";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: Record<string, any>;
}

const getSiteOrigin = (): string => {
  // Prefer explicit env var if provided (useful once you switch to sypeministry.org)
  const envOrigin = (import.meta as any)?.env?.VITE_SITE_URL as string | undefined;
  if (envOrigin) return envOrigin.replace(/\/+$/, "");
  // Fallback to runtime origin in the browser
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  // Last resort (legacy Netlify default)
  // Last resort (legacy Netlify default)
  return "https://www.sypeministry.org";
};

const SITE_ORIGIN = getSiteOrigin();

const defaultSEO = {
  title: "SYPE Ministry - Equipping Young Professionals for Evangelism",
  description:
    "SYPE (Seventh-day Adventist Young Professionals in Evangelism) - Equipping young professionals for evangelism through talents, professions, and service. Based in Kigali, Rwanda.",
  // Focused thematic keyword groups for better usability and maintenance
  keywords: (
    [
      // Organization & identity
      "SYPE Ministry, Seventh-day Adventist, SDA, Kigali, Rwanda, Young Professionals, about SYPE, mission statement",
      // Programs & ministries
      "Devotions, Daily devotionals, Youth ministry, Membership, Projects, Events, Retreats, Leadership training, Volunteer programs",
      // Outreach & missions
      "Evangelism, Community outreach, Mission trips, Church planting, Health evangelism, Literature evangelism",
      // Media & resources
      "News, Articles, Videos, YouTube channel, Podcast, Media library, Sermon resources, Digital library, Downloads",
      // Donations & fundraising
      "Donate, Donations, Online giving, MTN Mobile Money, Fundraising, Sponsorship, Donor management",
      // Engagement & admin
      "Contact, Volunteer signup, Event registration, Newsletter, Subscribe, Member management, Admin dashboard",
      // Technical & SEO
      "Sitemap, robots.txt, structured data, JSON-LD, Open Graph, Twitter Card, hreflang, PWA, webmanifest, Core Web Vitals",
    ].join(', ')
  ),
  image: `${SITE_ORIGIN}/Images/sype-social.png`,
  url: SITE_ORIGIN,
  type: "website",
};

export default function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url,
  type = defaultSEO.type,
  schema,
}: SEOProps) {
  const location = useLocation();
  const [seoMap, setSeoMap] = useState<Record<string, string> | null>(null);
  const currentUrl = url || `${defaultSEO.url}${location.pathname}`;
  const fullTitle = title.includes("SYPE Ministry") ? title : `${title} | SYPE Ministry`;

  useEffect(() => {
    // Try to load per-route keywords mapping generated at build time
    if (!seoMap) {
      fetch('/seo-keywords.json')
        .then((r) => r.json())
        .then((m) => setSeoMap(m))
        .catch(() => null);
    }
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    // Prefer explicit keywords prop, then per-route mapping, then default
    const routeKey = location.pathname || '';
    const mapped = seoMap && (seoMap[routeKey] || seoMap[routeKey.replace(/^\//, '')]);
    const keywordsContent = keywords || mapped || defaultSEO.keywords;
    updateMetaTag("keywords", keywordsContent);

    // Open Graph tags
    updateMetaTag("og:title", fullTitle, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");
    updateMetaTag("og:image:type", "image/png", "property");
    updateMetaTag("og:image:width", "1200", "property");
    updateMetaTag("og:image:height", "630", "property");
    updateMetaTag("og:url", currentUrl, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:site_name", "SYPE Ministry", "property");
    updateMetaTag("og:locale", "en_US", "property");

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:site", "@sypeministry5276");

    // Additional meta tags
    updateMetaTag("author", "SYPE Ministry");
    updateMetaTag("robots", "index, follow");
    updateMetaTag("theme-color", "#186d84");

    // Provide alt text for social images and twitter creator handle
    updateMetaTag("og:image:alt", fullTitle, "property");
    updateMetaTag("twitter:image:alt", fullTitle);
    updateMetaTag("twitter:creator", "@sypeministry5276");

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);

    // Add hreflang link for English (helps international SEO)
    let hreflang = document.querySelector('link[rel="alternate"][hreflang]') as HTMLLinkElement;
    if (!hreflang) {
      hreflang = document.createElement("link");
      hreflang.setAttribute("rel", "alternate");
      hreflang.setAttribute("hreflang", "en");
      document.head.appendChild(hreflang);
    }
    hreflang.setAttribute("href", currentUrl);
  }, [title, description, keywords, image, currentUrl, type, fullTitle]);

  // Generate breadcrumb schema automatically for most pages
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": location.pathname.split("/").filter(Boolean).map((segment, index, array) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      "item": `${SITE_ORIGIN}/${array.slice(0, index + 1).join("/")}`
    }))
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      {schema && <StructuredData data={schema} />}
    </>
  );
}

