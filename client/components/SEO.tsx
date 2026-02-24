import { useEffect } from "react";
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
  keywords:
    `SYPE Ministry, Seventh-day Adventist, Young Professionals, Evangelism, Rwanda, Kigali, SDA, Ministry, Christian Ministry, Youth Ministry, Christian outreach, youth outreach, young adults ministry, workplace ministry, professional ministry, faith and profession, evangelistic training, evangelism strategies, discipleship, discipleship training, Christian discipleship, Bible study groups, small groups, community Bible study, sermon resources, sermon outlines, daily devotionals, devotional guides, prayer groups, prayer requests, intercessory prayer, worship resources, worship service planning, choir ministry, music ministry, youth choir, praise and worship, spiritual formation, spiritual growth, faith formation, Christian mentorship, mentorship programs, leadership development, Christian leadership, volunteer leadership, volunteer management, volunteer opportunities, community service, outreach programs, mission projects, mission trips, short term missions, long term missions, church planting, church growth, membership classes, baptism preparation, faith classes, pastoral care, counseling resources, pastoral resources, youth leadership, professional development, career mentorship, networking events, young professionals networking, skills development, job readiness, resume workshops, interview coaching, entrepreneurship for youth, social enterprise, nonprofit entrepreneurship, fundraising, donations, online giving, donation forms, secure payments, MTN Mobile Money, payment integration, payment gateways, donation management, donor stewardship, donor recognition, fundraising campaigns, charity events, sponsorship packages, corporate partnerships, CSR partnerships, community partnerships, civic engagement, volunteer recruitment, volunteer training, volunteer onboarding, background checks, safeguarding policies, child protection, safety policies, code of conduct, volunteer expectations, community impact, impact measurement, monitoring and evaluation, reporting tools, annual reports, transparency, accountability, audited financials, stewardship education, tithes and offerings, planned giving, legacy giving, bequests, stewardship campaigns, resource mobilization, grant writing, grant proposals, funding proposals, donor reports, grant reporting, capacity building, training workshops, conferences, seminars, webinars, online workshops, live training, recorded training, e-learning, online courses, LMS integration, certificates, certification programs, curriculum development, facilitator guides, lesson plans, youth group materials, Sunday school resources, children's ministry, family ministry, marriage ministry, pastoral resources for families, counseling referrals, mental health resources, wellbeing programs, health ministry, health evangelism, community health outreach, vaccination awareness, pandemic response, disaster response, emergency relief, crisis response, food distribution, soup kitchens, shelter support, homelessness outreach, refugee support, social services, community development, sustainable development projects, water projects, sanitation projects, agricultural training, sustainable farming, vocational training, trade skills training, digital literacy, coding for youth, STEM outreach, robotics clubs, science outreach, educational scholarships, scholarship programs, internship programs, apprenticeships, career pathways, alumni network, mentorship outcomes, success stories, testimonies, impact stories, story collection, photojournalism, visual storytelling, video storytelling, media ministry, digital media, social media strategy, social media management, content calendar, content strategy, blogging, editorial calendar, news updates, press releases, media relations, public relations, branding, brand guidelines, logo use, color palette, typography, design resources, creative arts ministry, drama ministry, film and video production, podcasting, audio ministry, live streaming, YouTube channel, podcast channel, Vimeo, media hosting, Cloudinary integration, media management, image galleries, video galleries, thumbnails, media selector, media upload, media library, downloadable resources, PDF resources, eBooks, digital library, library resources, book downloads, resources for study, study guides, topical studies, scripture reading plans, Bible reading plans, memory verse plans, scripture memorization, topical devotionals, thematic series, sermon series, sermon archives, sermon transcripts, sermon notes, preaching resources, homiletics resources, sermon illustrations, pulpit resources, liturgy resources, worship planning, liturgical calendar, Adventist resources, Seventh-day Adventist teachings, doctrines, Sabbath observance, Adventist youth programs, Ellen G. White writings, denominational resources, church conference resources, union and conference partnerships, church directory, contact information, office hours, phone numbers, email addresses, physical address, Google Maps location, Kigali location, local partners, community partners, sponsor acknowledgements, fundraising partners, grant partners, donor partners, volunteer testimonials, member testimonials, member stories, community testimonials, beneficiary stories, case studies, best practices, program manuals, operational guidelines, governance documents, board governance, committee management, committee members, committee bios, leadership bios, staff bios, volunteer bios, about us, mission statement, vision statement, core values, history, timeline, milestones, strategic plan, strategic initiatives, program descriptions, project descriptions, event calendar, upcoming events, past events, event registration, ticketing integration, event management, volunteer sign up, RSVP, event photos, event videos, gallery, media archives, news articles, news management, news articles archives, press coverage, newsletters, email newsletters, subscribe forms, email subscription, double opt-in, unsubscribe, email automation, drip campaigns, fundraising appeals, campaign landing pages, conversion tracking, analytics integration, Google Analytics, privacy-first analytics, Matomo, user privacy, GDPR compliance, privacy policy, cookie policy, cookie consent, cookie banner, accessibility, WCAG compliance, ARIA roles, semantic HTML, responsive design, mobile-first design, performance optimization, Core Web Vitals, LCP optimization, CLS fixes, TTFB improvements, caching strategies, CDN use, preconnect hints, preload critical assets, resource hints, service workers, PWA, webmanifest, offline support, manifest link, canonical URLs, rel=canonical, hreflang links, language alternatives, multilingual content, English resources, Kinyarwanda resources, French resources, translation, localization, cross-cultural ministry, cultural sensitivity training, global partnerships, international outreach, cross-border projects, church planting resources, church revitalization, membership retention, retention strategies, engagement metrics, social proof, reviews, Google Reviews, community feedback, surveys, polls, member surveys, beneficiary feedback, impact surveys, monitoring tools, project dashboards, KPI dashboards, charts and reports, visualization, donor dashboards, CRM integration, member management, admin dashboard, analytics dashboard, admin tools, media selector, media uploader, image optimization, lazy loading, responsive images, srcset, alt text, image accessibility, open graph tags, Twitter cards, meta tags, structured data, JSON-LD, schema.org, Organization schema, BreadcrumbList schema, Article schema, NewsArticle schema, FAQ schema, HowTo schema, Speakable schema, rich snippets, search appearance, SERP optimization, local SEO, Google My Business, local listings, business hours, contact points, telephone schema, sameAs social links, social profiles, Facebook, Instagram, Twitter, YouTube, LinkedIn, TikTok, Pinterest, subscriber counts, engagement strategy, community building, online community, forums, discussion groups, moderation policies, code of conduct, community guidelines, safety protocols, child safety, background checks, volunteer agreements, partnership agreements, MOUs, memorandum of understanding, stakeholder engagement, stakeholder mapping, advocacy campaigns, public awareness, awareness campaigns, health campaigns, education campaigns, outreach toolkits, door-to-door ministry resources, tract distribution, literature evangelism, literature distribution, literature resources, tract designs, print resources, flyers, posters, banners, promotional materials, merchandise, branded merchandise, fundraising merchandise, conference merchandise, event swag, sponsorship collateral, sponsorship tiers, corporate sponsor packages, in-kind donations, volunteer grants, matching gifts, payroll giving, workplace giving, CSR engagement, corporate volunteering, team building events, retreat planning, spiritual retreats, weekend retreats, youth retreats, leadership retreats, planning checklists, logistics guides, travel arrangements, safety checklists, risk assessment, emergency plans, insurance guidelines, safeguarding, data protection, secure data storage, backups, database management, MongoDB, Cloudinary storage, media backups, data retention policies, retention schedules, archival procedures, digital preservation, legacy data, migration plans, contact directories, member directories, privacy notices, terms and conditions, legal notices, compliance, auditing, financial reports, budgets, budget templates, transactional records, donation receipts, donation acknowledgements, gift receipts, tax receipts, invoice templates, procurement policies, vendor management, supplier lists, supplier contracts, partnership agreements, memorandums, documentation, FAQs, help center, support resources, contact forms, helpdesk, ticketing, issue tracking, bug reports, feature requests, roadmap, public roadmap, changelog, release notes, versioning, deployment notes, DevOps, CI/CD, build scripts, deployment scripts, Netlify, Render, Vercel, GitHub Actions, pnpm, package management, dependency management, security updates, vulnerability scanning, SSL, HTTPS, certificates, domain management, DNS, domain records, sitemap, sitemap.xml, XML sitemaps, image sitemap, video sitemap, submission to search engines, webmaster tools, Google Search Console, Bing Webmaster Tools, indexing requests, robots.txt, crawl directives, crawl budget, index coverage, URL inspection, performance reports, search analytics, impressions, clicks, CTR, average position, SERP features, featured snippets, knowledge panels, brand search, organic traffic, referral traffic, social referrals, retention metrics, engagement metrics, time on site, bounce rate, pages per session, session duration, conversions, donation conversions, registration conversions, membership conversions, call to action, CTA design, CTA placement, A/B testing, growth experiments, user testing, usability testing, heatmaps, session recordings, Hotjar, FullStory, feedback widgets, contact info, prayer request forms, volunteer forms, sponsor forms, media requests, press inquiries, donate buttons, donate links, payment receipts, thank you pages, confirmation pages, share buttons, social share counts, embed codes, widgets, embeddable media, API endpoints, REST API, GraphQL, webhooks, integrations, Zapier, Make, automation workflows, scheduling, calendar sync, Google Calendar integration, iCal feeds, RSS feeds, podcast RSS, news RSS, content syndication, content partnerships, distribution channels, and cornerstone content, long-tail keywords, local phrases, geo-targeted keywords, and niche search phrases for SYPE Ministry and related outreach initiatives.`,
  image: `${SITE_ORIGIN}/Sype%20logo.webp`,
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

