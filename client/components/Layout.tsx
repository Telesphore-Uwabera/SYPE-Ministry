import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import SEO from "./SEO";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Handle hash links for smooth scrolling
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
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
          title: "Weekly Devotion Program - SYPE Ministry",
          description:
            "Join us every Sunday from 6:00 PM to 7:00 PM for weekly prayer and spiritual reflection guided by Jesus' methods and Ellen G. White's teachings.",
          keywords:
            "SYPE Devotions, Weekly Prayer, Sunday Devotion, Prayer Program, Spiritual Reflection",
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
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
