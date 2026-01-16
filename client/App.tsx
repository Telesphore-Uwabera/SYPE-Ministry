import "./global.css";
// Import API config early to set up fetch override
import "@/lib/apiConfig";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Membership from "./pages/Membership";
import Donations from "./pages/Donations";
import Library from "./pages/Library";
import News from "./pages/News";
import NewsArticlePage from "./pages/NewsArticle";
import Devotions from "./pages/Devotions";
import DevotionDetailPage from "./pages/DevotionDetail";
import EventDetailPage from "./pages/EventDetail";
import Videos from "./pages/Videos";
import Departments from "./pages/Departments";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import FAQs from "./pages/FAQs";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/library" element={<Library />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsArticlePage />} />
            <Route path="/devotions" element={<Devotions />} />
            <Route path="/devotions/:id" element={<DevotionDetailPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
