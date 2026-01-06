import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const defaultSEO = {
  title: "SYPE Ministry - Equipping Young Professionals for Evangelism",
  description:
    "SYPE (Seventh-day Adventist Young Professionals in Evangelism) - Equipping young professionals for evangelism through talents, professions, and service. Based in Kigali, Rwanda.",
  keywords:
    "SYPE Ministry, Seventh-day Adventist, Young Professionals, Evangelism, Rwanda, Kigali, SDA, Ministry, Christian Ministry, Youth Ministry",
  image: "https://sypeministry.netlify.app/Sype%20logo.png",
  url: "https://sypeministry.netlify.app",
  type: "website",
};

export default function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url,
  type = defaultSEO.type,
}: SEOProps) {
  const location = useLocation();
  const currentUrl = url || `${defaultSEO.url}${location.pathname}`;
  const fullTitle = title.includes("SYPE Ministry") ? title : `${title} | SYPE Ministry`;

  useEffect(() => {
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
    updateMetaTag("keywords", keywords);

    // Open Graph tags
    updateMetaTag("og:title", fullTitle, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");
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

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);
  }, [title, description, keywords, image, currentUrl, type, fullTitle]);

  return null;
}

