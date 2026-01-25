import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import SEO from "./SEO";
import MTNPayment from "./MTNPayment";
import CookieConsent from "./CookieConsent";
import { cn } from "@/lib/utils";

// Initialize Netlify Identity
declare global {
  interface Window {
    netlifyIdentity?: {
      init: () => void;
      on: (event: string, callback: (user: any) => void) => void;
      currentUser: () => any;
      logout: () => void;
      open?: (type?: string) => void;
    };
  }
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isContactBarVisible, setIsContactBarVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Initialize Netlify Identity if available
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init();

      // Handle invite tokens in the URL hash
      const hash = window.location.hash;
      if (hash && hash.includes('invite_token')) {
        // Netlify Identity will automatically handle the invite token
        // Open the modal to complete the invitation
        window.netlifyIdentity.open('signup');
      }
    }

    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Handle hash links for smooth scrolling (but skip invite tokens)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && !hash.includes('invite_token')) {
        const id = hash.startsWith("#") ? hash.slice(1) : hash;
        // Hash IDs may start with digits (e.g. Mongo ObjectId), which are not valid CSS selectors.
        // Prefer getElementById to avoid querySelector selector syntax issues.
        let element: Element | null = document.getElementById(id);
        // Note: we intentionally avoid `document.querySelector(hash)` here because
        // hashes like `#696...` (Mongo ObjectId) are not valid CSS selectors and can crash the app.
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }
      }
    };

    // Check for hash on mount and after navigation
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [location]);

  // Get page-specific SEO data
  const getPageSEO = () => {
    const path = location.pathname;
    // Handle dynamic detail routes first
    if (path.startsWith("/news/")) {
      return {
        title: "News Article - SYPE Ministry",
        description: "Read the full news article from SYPE Ministry.",
        keywords: "SYPE News, Ministry News, SYPE Article",
      };
    }
    if (path.startsWith("/devotions/")) {
      return {
        title: "Devotion - SYPE Ministry",
        description: "Read the full devotion from SYPE Ministry.",
        keywords: "SYPE Devotion, Daily Devotion, Prayer Program",
      };
    }
    if (path.startsWith("/events/")) {
      return {
        title: "Event - SYPE Ministry",
        description: "View event details and ministry activities from SYPE Ministry.",
        keywords: "SYPE Events, Ministry Events, Kigali SDA Events",
      };
    }

    switch (path) {
      case "/about":
        return {
          title: "About Us - SYPE Ministry",
          description:
            "Learn about SYPE Ministry's history, mission, and vision. Discover how we equip young SDA professionals for evangelism in Kigali, Rwanda and beyond.",
          keywords:
            "About SYPE Ministry, SYPE History, SDA Ministry Rwanda, Young Professionals Evangelism, Ministry Mission",
        };
      case "/membership":
        return {
          title: "Membership - Join SYPE Ministry",
          description:
            "Join SYPE Ministry and become part of a community of young professionals committed to spreading the Gospel through their talents and professions.",
          keywords:
            "Join SYPE Ministry, SYPE Membership, SDA Youth Ministry, Ministry Membership, Join Ministry",
        };
      case "/donations":
        return {
          title: "Donations - Support SYPE Ministry",
          description:
            "Support SYPE Ministry's evangelism projects and initiatives. Your financial partnership enables us to produce impactful evangelical content.",
          keywords:
            "Donate to SYPE Ministry, Support Evangelism, Ministry Donations, SYPE Support, Give to Ministry",
        };
      case "/contact":
        return {
          title: "Contact Us - SYPE Ministry",
          description:
            "Get in touch with SYPE Ministry. Contact us via email, phone, or through our contact form. We're here to help!",
          keywords:
            "Contact SYPE Ministry, SYPE Contact, Ministry Contact, Get in Touch, SYPE Email",
        };
      case "/faqs":
        return {
          title: "FAQs - Frequently Asked Questions",
          description:
            "Find answers to common questions about SYPE Ministry, membership, activities, programs, and more.",
          keywords:
            "SYPE FAQs, Frequently Asked Questions, SYPE Questions, Ministry FAQs, SYPE Information",
        };
      case "/devotions":
        return {
          title: "Daily Devotion Program - SYPE Ministry",
          description:
            "Join us every day from 6:00 AM to 7:00 AM for daily prayer and spiritual reflection guided by Jesus' methods and Ellen G. White's teachings.",
          keywords:
            "SYPE Devotions, Weekly Prayer, Sunday Devotion, Prayer Program, Spiritual Reflection",
        };
      case "/news":
        return {
          title: "News - SYPE Ministry",
          description:
            "Stay informed with ministry updates, announcements, and inspiring stories from SYPE Ministry.",
          keywords:
            "SYPE News, Ministry Updates, Announcements, Evangelism News",
        };
      case "/projects":
        return {
          title: "Evangelical Projects - SYPE Ministry",
          description:
            "Discover SYPE Ministry's diverse evangelical initiatives producing impactful content including documentaries, posters, and articles to spread the Gospel.",
          keywords:
            "SYPE Projects, Evangelism Projects, Ministry Projects, Evangelical Content, SYPE Initiatives",
        };
      case "/departments":
        return {
          title: "Departments - SYPE Ministry",
          description:
            "Learn about SYPE Ministry's organizational structure with specialized departments working together to advance our evangelical mission.",
          keywords:
            "SYPE Departments, Ministry Structure, SYPE Organization, Ministry Departments, SYPE Leadership",
        };
      default:
        return {};
    }
  };

  const pageSEO = getPageSEO();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEO {...pageSEO} />
      <Navigation
        isContactBarVisible={isContactBarVisible}
        setIsContactBarVisible={setIsContactBarVisible}
      />
      <main
        className={cn(
          "flex-1 transition-all duration-500",
          isContactBarVisible
            ? "pt-[144px] md:pt-[176px]"
            : "pt-[104px] md:pt-[128px]"
        )}
      >
        {children}
      </main>
      <Footer />
      <BackToTop />
      {/* Floating MTN Payment - Appears on all pages */}
      <MTNPayment variant="floating" className="hidden md:block" />
      <CookieConsent />
    </div>
  );
}
