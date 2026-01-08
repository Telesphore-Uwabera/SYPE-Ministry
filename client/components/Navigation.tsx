import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Heart, ChevronDown, Users, Mail, HelpCircle, FileText, BookOpen, DollarSign, Building2, FolderOpen, Newspaper, Calendar, Video, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ContactInfoBar from "./ContactInfoBar";

interface SearchResult {
  title: string;
  href: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Membership", href: "/membership" },
    { label: "Donations", href: "/donations" },
    { label: "Library", href: "/library" },
    { label: "News", href: "/news" },
    { label: "Departments", href: "/departments" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  const quickLinks = [
    { label: "Join Ministry", href: "/membership", icon: Users },
    { label: "Support Us", href: "/donations", icon: Heart },
    { label: "Contact", href: "/contact", icon: Mail },
    { label: "FAQs", href: "/faqs", icon: HelpCircle },
  ];

  // Searchable content
  const searchableContent: SearchResult[] = [
    { title: "Home", href: "/", description: "Welcome to SYPE Ministry", category: "Pages", icon: FileText },
    { title: "About Us", href: "/about", description: "Learn about our history, mission, and vision", category: "Pages", icon: FileText },
    { title: "Membership", href: "/membership", description: "Join SYPE Ministry and become a member", category: "Pages", icon: Users },
    { title: "Donations", href: "/donations", description: "Support our evangelism efforts", category: "Pages", icon: DollarSign },
    { title: "Library", href: "/library", description: "Access ministry resources and materials", category: "Pages", icon: BookOpen },
    { title: "News", href: "/news", description: "Latest news and announcements", category: "Pages", icon: Newspaper },
    { title: "Devotions", href: "/devotions", description: "Weekly devotion program", category: "Pages", icon: Calendar },
    { title: "Videos", href: "/videos", description: "Watch ministry videos and content", category: "Pages", icon: Video },
    { title: "Departments", href: "/departments", description: "Explore our ministry departments", category: "Pages", icon: Building2 },
    { title: "Projects", href: "/projects", description: "View our evangelical projects", category: "Pages", icon: FolderOpen },
    { title: "Contact", href: "/contact", description: "Get in touch with us", category: "Pages", icon: Mail },
    { title: "FAQs", href: "/faqs", description: "Frequently asked questions", category: "Pages", icon: HelpCircle },
    { title: "Terms and Conditions", href: "/terms", description: "Terms of service", category: "Legal", icon: FileText },
    { title: "Privacy Policy", href: "/privacy", description: "Privacy policy and data protection", category: "Legal", icon: FileText },
    { title: "Cookies Policy", href: "/cookies", description: "Cookie usage policy", category: "Legal", icon: FileText },
  ];

  // Advanced scroll effects with direction detection and progress
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (currentScrollY / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      // Detect scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setScrollDirection("down");
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setScrollDirection("up");
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close quick menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showQuickMenu && !(event.target as Element).closest('.quick-menu-container')) {
        setShowQuickMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQuickMenu]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = searchableContent
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const categoryMatch = item.category.toLowerCase().includes(query);
        return titleMatch || descMatch || categoryMatch;
      })
      .slice(0, 8); // Limit to 8 results

    setSearchResults(results);
    setSelectedResultIndex(0);
  }, [searchQuery]);

  // Keyboard shortcuts for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }

      // Close search with Escape
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery("");
        setSearchResults([]);
      }

      // Navigate results with arrow keys
      if (showSearch && searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedResultIndex((prev) => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && searchResults[selectedResultIndex]) {
          e.preventDefault();
          navigate(searchResults[selectedResultIndex].href);
          setShowSearch(false);
          setSearchQuery("");
          setSearchResults([]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, searchResults, selectedResultIndex, navigate]);

  // Focus search input when modal opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Contact Info Bar */}
      <ContactInfoBar />

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary z-[60] origin-left"
        animate={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.1 }}
        style={{ top: "40px" }} // Adjust based on contact bar height (h-10 = 40px)
      />

      {/* Main Navigation with fade and zoom effects */}
      <motion.nav
        ref={navRef}
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-lg top-10 md:top-12"
            : "bg-white/80 backdrop-blur-sm border-b border-border/30 shadow-sm top-10 md:top-12"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo with zoom animation */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/"
                className="flex items-center gap-3 font-heading font-bold text-xl md:text-2xl text-primary hover:text-primary/90 transition-colors group"
              >
                <motion.div
                  className="relative"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src="/Sype logo.png"
                    alt="SYPE Ministry Logo"
                    className="h-10 md:h-12 w-auto object-contain transition-all duration-300 group-hover:brightness-110"
                  />
                </motion.div>
                <motion.span
                  className="hidden sm:inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  SYPE Ministry
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop Menu with enhanced animations */}
            <div className="hidden lg:flex items-center gap-4">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.href}
                      className="relative px-3 py-2 text-xs font-medium rounded-md overflow-hidden group"
                    >
                      <motion.span
                        className={cn(
                          "relative z-10 block transition-colors duration-300",
                          active
                            ? "text-primary font-semibold"
                            : "text-foreground/80 group-hover:text-primary"
                        )}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {link.label}
                      </motion.span>
                      
                      {/* Active indicator with color transition */}
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 rounded-md"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      
                      {/* Hover effect with color exchange */}
                      {!active && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 rounded-md"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{
                            opacity: 1,
                            scale: 1,
                            backgroundColor: [
                              "rgba(59, 130, 246, 0.1)",
                              "rgba(147, 51, 234, 0.15)",
                              "rgba(59, 130, 246, 0.1)",
                            ],
                          }}
                          transition={{
                            duration: 0.3,
                            backgroundColor: {
                              duration: 0.6,
                              repeat: Infinity,
                              repeatType: "reverse",
                            },
                          }}
                        />
                      )}
                      
                      {/* Zoom effect on hover */}
                      <motion.div
                        className="absolute inset-0 border-2 border-primary/0 rounded-md"
                        whileHover={{
                          borderColor: "rgba(59, 130, 246, 0.3)",
                          scale: 1.05,
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Action Buttons */}
              <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-border/30">
                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-primary relative"
                  aria-label="Search"
                  onClick={() => setShowSearch(true)}
                >
                  <Search size={20} />
                  <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full font-semibold hidden lg:block">
                    K
                  </span>
                </motion.button>

                {/* Quick Access Menu */}
                <div className="relative quick-menu-container">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowQuickMenu(!showQuickMenu)}
                    className="px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground/80 hover:text-primary flex items-center gap-1"
                    aria-label="Quick access menu"
                  >
                    <span>Quick</span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        showQuickMenu && "rotate-180"
                      )}
                    />
                  </motion.button>

                  {/* Quick Menu Dropdown */}
                  <AnimatePresence>
                    {showQuickMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-border/50 backdrop-blur-xl overflow-hidden quick-menu-container"
                        onMouseLeave={() => setShowQuickMenu(false)}
                      >
                        {quickLinks.map((link, index) => {
                          const IconComponent = link.icon;
                          return (
                            <motion.div
                              key={link.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                to={link.href}
                                onClick={() => setShowQuickMenu(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                <IconComponent size={18} className="text-primary" />
                                <span>{link.label}</span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Donate Button - Prominent CTA */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/donations"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:from-primary/90 hover:to-primary/80"
                  >
                    <Heart size={16} className="fill-current" />
                    <span>Donate</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Mobile Menu Button with zoom animation */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground relative"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu with enhanced animations */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="lg:hidden overflow-hidden border-t border-border/50 bg-white/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 space-y-1">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: -30, opacity: 0, scale: 0.9 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ x: -30, opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden group",
                          active
                            ? "bg-gradient-to-r from-primary/15 to-primary/10 text-primary font-semibold"
                            : "text-foreground/80 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary"
                        )}
                      >
                        <motion.span
                          className="relative z-10 block"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {link.label}
                        </motion.span>
                        {active && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                            layoutId="mobileActive"
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Mobile Donate Button */}
                <motion.div
                  initial={{ x: -30, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{
                    delay: navLinks.length * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  className="pt-2"
                >
                  <Link
                    to="/donations"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <Heart size={16} className="fill-current" />
                    <span>Support Evangelism</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Duplicate Navigation - Appears when scrolling down, fades when scrolling up */}
      <motion.nav
        initial={{ y: -100, opacity: 0, scale: 0.9 }}
        animate={{
          y: scrollDirection === "down" && isScrolled ? 0 : -100,
          opacity: scrollDirection === "down" && isScrolled ? 1 : 0,
          scale: scrollDirection === "down" && isScrolled ? 1 : 0.9,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-500 w-full",
          "bg-white/90 backdrop-blur-lg border-b border-border/40 shadow-xl top-10 md:top-12"
        )}
      >
        <div className="w-full px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20 md:h-24 lg:h-28">
            {/* Duplicate Logo - Only logo, no text */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                to="/"
                className="flex items-center font-heading font-bold text-primary"
              >
                <img
                  src="/Sype logo.png"
                  alt="SYPE Ministry Logo"
                  className="h-14 md:h-16 lg:h-20 w-auto object-contain"
                />
              </Link>
            </motion.div>

            {/* Duplicate Desktop Menu */}
            <div className="hidden lg:flex items-center gap-4">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="relative px-4 py-2 text-sm font-medium rounded-md overflow-hidden group"
                  >
                    <motion.span
                      className={cn(
                        "relative z-10 block transition-colors duration-300",
                        active
                          ? "text-primary font-semibold"
                          : "text-foreground/80 group-hover:text-primary"
                      )}
                      whileHover={{ scale: 1.1 }}
                    >
                      {link.label}
                    </motion.span>
                    {active && (
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded-md"
                        layoutId="duplicateActiveNav"
                        transition={{ type: "spring", stiffness: 380 }}
                      />
                    )}
                    <motion.div
                      className="absolute inset-0 bg-primary/5 rounded-md opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                );
              })}
              
              {/* Duplicate Action Buttons */}
              <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-border/30">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-primary"
                  aria-label="Search"
                  onClick={() => setShowSearch(true)}
                >
                  <Search size={20} />
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/donations"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <Heart size={16} className="fill-current" />
                    <span>Donate</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl border border-border/50 z-[80] overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border/50">
                <Search size={20} className="text-foreground/50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages, content, and more..."
                  className="flex-1 outline-none text-base bg-transparent placeholder:text-foreground/50"
                />
                <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 text-xs font-semibold text-foreground/50 bg-muted rounded border border-border/50">
                  <span>Esc</span>
                </kbd>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {searchQuery.trim() === "" ? (
                  <div className="p-8 text-center text-foreground/60">
                    <Search size={48} className="mx-auto mb-4 text-foreground/30" />
                    <p className="text-sm">Start typing to search...</p>
                    <p className="text-xs mt-2 text-foreground/40">
                      Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+K</kbd> or <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Cmd+K</kbd> to open search
                    </p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-8 text-center text-foreground/60">
                    <Search size={48} className="mx-auto mb-4 text-foreground/30" />
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                    <p className="text-xs mt-2 text-foreground/40">Try different keywords</p>
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                      {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                    </div>
                    {searchResults.map((result, index) => {
                      const IconComponent = result.icon;
                      const isSelected = index === selectedResultIndex;
                      return (
                        <Link
                          key={result.href}
                          to={result.href}
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3 hover:bg-primary/5 transition-colors cursor-pointer",
                            isSelected && "bg-primary/10"
                          )}
                          onMouseEnter={() => setSelectedResultIndex(index)}
                        >
                          <div className={cn(
                            "p-2 rounded-lg",
                            isSelected ? "bg-primary/20 text-primary" : "bg-muted text-foreground/60"
                          )}>
                            <IconComponent size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={cn(
                                "font-medium text-sm",
                                isSelected ? "text-primary" : "text-foreground"
                              )}>
                                {result.title}
                              </p>
                              <span className="text-xs text-foreground/40 bg-muted px-2 py-0.5 rounded">
                                {result.category}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/60 line-clamp-1">
                              {result.description}
                            </p>
                          </div>
                          <ArrowRight 
                            size={16} 
                            className={cn(
                              "text-foreground/30 transition-transform",
                              isSelected && "text-primary translate-x-1"
                            )} 
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border/50 bg-muted/30 flex items-center justify-between text-xs text-foreground/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background rounded border border-border/50">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-background rounded border border-border/50">↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background rounded border border-border/50">Enter</kbd>
                    <span>Select</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background rounded border border-border/50">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
