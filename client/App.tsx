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

import { checkIsBot } from "@/lib/utils/botDetection";

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

function AppContent() {
  const isBot = checkIsBot();
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return false;
    const hasShown = sessionStorage.getItem("sypeSplashShown") === "true";
    const isHomePage = window.location.pathname === "/";
    // Never show splash to bots or if already shown
    return !hasShown && isHomePage && !isBot;
  });
  const location = useLocation();

  useEffect(() => {
    if (isBot) {
      setShowSplash(false);
      return;
    }

    const hasShown = sessionStorage.getItem("sypeSplashShown") === "true";
    const shouldShow = !hasShown && location.pathname === "/" && !isBot;

    if (!shouldShow) {
      setShowSplash(false);
      return;
    }

    // Reduced prefetching - only prefetch critical data
    const prefetchEndpoints = [
      "/api/news?limit=2",
      "/api/devotions?limit=2",
    ];

    const prefetchWithDelay = async (endpoint: string, delay: number) => {
      setTimeout(() => {
        fetch(endpoint).catch(() => {});
      }, delay);
    };

    prefetchEndpoints.forEach((endpoint, index) => {
      prefetchWithDelay(endpoint, index * 500);
    });

    const timer = window.setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("sypeSplashShown", "true");
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname, isBot]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Use direct Home component for bots to ensure immediate rendering for screenshots */}
          <Route path="/" element={isBot ? <Home /> : <LazyWrapper><LazyHome /></LazyWrapper>} />
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
