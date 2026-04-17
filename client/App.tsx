import "./global.css";
// Import API config early to set up fetch override
import "@/lib/apiConfig";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomeSplash from "@/components/WelcomeSplash";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LazyWrapper, LazyHome, LazyAbout, LazyMembership, LazyDonations, LazyLibrary, LazyNews, LazyNewsArticle, LazyDevotions, LazyDevotionDetail, LazyEventDetail, LazyVideos, LazyDepartments, LazyProjects, LazyContact, LazyTerms, LazyPrivacy, LazyCookies, LazyFAQs, LazyAdmin, LazyNotFound } from "@/components/LazyRoutes";
import Home from "./pages/Home"; // Direct import for Netlify thumbnails

// Optimized QueryClient with memory management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Helper to check for Netlify thumbnail or prerender bots
const checkIsBot = () => {
  if (typeof window === "undefined") return false;
  return (
    /Netlify|HeadlessChrome|Chrome-Lighthouse|prerender/i.test(navigator.userAgent) ||
    window.location.search.includes("netlify") ||
    !window.sessionStorage
  );
};

function AppContent() {
  const isNetlifyThumbnail = checkIsBot();
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return false;
    const hasShown = sessionStorage.getItem("sypeSplashShown") === "true";
    const isHomePage = window.location.pathname === "/";
    return !hasShown && isHomePage && !isNetlifyThumbnail;
  });
  const location = useLocation();

  useEffect(() => {
    const hasShown = sessionStorage.getItem("sypeSplashShown") === "true";
    const shouldShow = !hasShown && location.pathname === "/" && !isNetlifyThumbnail;

    if (!shouldShow || isNetlifyThumbnail) {
      setShowSplash(false);
      return;
    }

    // Reduced prefetching - only prefetch critical data
    const prefetchEndpoints = [
      "/api/news?limit=2", // Reduced from 3
      "/api/devotions?limit=2", // Reduced from 3
    ];

    // Stagger prefetching to reduce memory spike
    const prefetchWithDelay = async (endpoint: string, delay: number) => {
      setTimeout(() => {
        fetch(endpoint).catch(() => {});
      }, delay);
    };

    prefetchEndpoints.forEach((endpoint, index) => {
      prefetchWithDelay(endpoint, index * 500); // 500ms delay between requests
    });

    const timer = window.setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("sypeSplashShown", "true");
    }, 7000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname, isNetlifyThumbnail]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={isNetlifyThumbnail ? <Home /> : <LazyWrapper><LazyHome /></LazyWrapper>} />
          <Route path="/about" element={<LazyWrapper><LazyAbout /></LazyWrapper>} />
          <Route path="/membership" element={<LazyWrapper><LazyMembership /></LazyWrapper>} />
          <Route path="/donations" element={<LazyWrapper><LazyDonations /></LazyWrapper>} />
          <Route path="/library" element={<LazyWrapper><LazyLibrary /></LazyWrapper>} />
          <Route path="/library/:id" element={<LazyWrapper><LazyLibrary /></LazyWrapper>} />
          <Route path="/news" element={<LazyWrapper><LazyNews /></LazyWrapper>} />
          <Route path="/news/:id" element={<LazyWrapper><LazyNewsArticle /></LazyWrapper>} />
          <Route path="/devotions" element={<LazyWrapper><LazyDevotions /></LazyWrapper>} />
          <Route path="/devotions/:id" element={<LazyWrapper><LazyDevotionDetail /></LazyWrapper>} />
          <Route path="/events/:id" element={<LazyWrapper><LazyEventDetail /></LazyWrapper>} />
          <Route path="/videos" element={<LazyWrapper><LazyVideos /></LazyWrapper>} />
          <Route path="/departments" element={<LazyWrapper><LazyDepartments /></LazyWrapper>} />
          <Route path="/projects" element={<LazyWrapper><LazyProjects /></LazyWrapper>} />
          <Route path="/contact" element={<LazyWrapper><LazyContact /></LazyWrapper>} />
          <Route path="/terms" element={<LazyWrapper><LazyTerms /></LazyWrapper>} />
          <Route path="/privacy" element={<LazyWrapper><LazyPrivacy /></LazyWrapper>} />
          <Route path="/cookies" element={<LazyWrapper><LazyCookies /></LazyWrapper>} />
          <Route path="/faqs" element={<LazyWrapper><LazyFAQs /></LazyWrapper>} />
          <Route path="/admin" element={<LazyWrapper><LazyAdmin /></LazyWrapper>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<LazyWrapper><LazyNotFound /></LazyWrapper>} />
        </Routes>
        {showSplash ? <WelcomeSplash /> : null}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
