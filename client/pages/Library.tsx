import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, Calendar, User, Search as SearchIcon, Filter as FilterIcon, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { Book } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/lib/apiConfig";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingState } from "@/components/ui/LoadingState";

// Ensure the worker is bundled by Vite and served as a real JS asset (not SPA fallback HTML)
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const BOOK_CATEGORIES: Book["category"][] = [
  "Bible",
  "Ellen G. White Books",
  "Health",
  "Genzura",
  "Inyandiko",
  "Integuza",
  "Others",
];

export default function Library() {
  const [activeCategory, setActiveCategory] = useState<Book["category"] | "All">("All");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "past" | "ongoing" | "future">("all");
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerBook, setReaderBook] = useState<Book | null>(null);
  const [pdfNumPages, setPdfNumPages] = useState<number>(0);
  const [pdfScale, setPdfScale] = useState<number>(1.0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfRequestKey, setPdfRequestKey] = useState(0);
  const [pdfContainerWidth, setPdfContainerWidth] = useState<number>(0);
  const [pagesToRender, setPagesToRender] = useState<number>(3);
  const lastIsMobileRef = useRef<boolean | null>(null);
  const navigate = useNavigate();
  const { id: bookId } = useParams();
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const apiUrl = buildApiUrl("/api/books");
        console.log("Fetching books from:", apiUrl);
        
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`HTTP error! status: ${res.status}`, errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Books data received:", data);
        
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.warn("Books data is not an array:", data);
          setBooks([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
        setBooks([]);
      }
    };
    
    fetchBooks();
  }, []);

  // Filter books by category, search query, and date
  const getFilteredBooks = () => {
    let filtered = [...books];

    // Filter by date
    if (dateFilter === "past") {
      // Books published/uploaded more than 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter((book) => {
        const bookDate = book.publishDate ? new Date(book.publishDate) : book.uploadDate ? new Date(book.uploadDate) : null;
        return bookDate && bookDate < thirtyDaysAgo;
      });
    } else if (dateFilter === "ongoing") {
      // Recently published/uploaded books (within last 30 days) or currently popular
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter((book) => {
        const bookDate = book.publishDate ? new Date(book.publishDate) : book.uploadDate ? new Date(book.uploadDate) : null;
        return bookDate && bookDate >= thirtyDaysAgo;
      });
    } else if (dateFilter === "future") {
      // Books with future publish dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((book) => {
        const bookDate = book.publishDate ? new Date(book.publishDate) : null;
        return bookDate && new Date(bookDate).setHours(0, 0, 0, 0) > today.getTime();
      });
    }

    // Filter by category and search query
    return filtered.filter((book) => {
      const matchesCategory = activeCategory === "All" || book.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const filteredBooks = getFilteredBooks();

  const openReader = (book: Book) => {
    if (!book.fileUrl) return;
    setReaderBook(book);
    setPdfNumPages(0);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    lastIsMobileRef.current = isMobile;
    setPdfScale(isMobile ? 0.7 : 1.0);
    setPdfError(null);
    setPdfRequestKey((prev) => prev + 1);
    setPagesToRender(3);
    setReaderOpen(true);
    navigate(`/library/${book.id}`);
  };

  useEffect(() => {
    if (!bookId || loading) return;
    const match = books.find((book) => book.id === bookId);
    if (match) {
      openReader(match);
      return;
    }
    navigate("/library", { replace: true });
  }, [bookId, books, loading, navigate]);

  const pdfUrl = useMemo(() => {
    if (!readerBook) return "";
    return buildApiUrl(`/api/books/${readerBook.id}/view?ts=${pdfRequestKey}`);
  }, [readerBook, pdfRequestKey]);

  const truncateWords = (text: string, maxWords: number) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return `${words.slice(0, maxWords).join(" ")}...`;
  };

  useEffect(() => {
    if (!readerOpen) return;
    const updateWidth = () => {
      if (pdfContainerRef.current) {
        setPdfContainerWidth(pdfContainerRef.current.clientWidth);
      }
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (lastIsMobileRef.current === null || lastIsMobileRef.current !== isMobile) {
        setPdfScale(isMobile ? 0.7 : 1.0);
        lastIsMobileRef.current = isMobile;
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [readerOpen]);

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!pdfNumPages) return;
      const nearBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 200;
      if (nearBottom) {
        setPagesToRender((prev) => Math.min(pdfNumPages, prev + 3));
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [pdfNumPages]);

  const renderBooks = () => {
    if (loading) {
      return <LoadingState message="Loading books..." icon={BookOpen} />;
    }

    if (filteredBooks.length === 0) {
      return (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-foreground/70 mb-2">
            {searchQuery
              ? "No books found matching your search."
              : activeCategory === "All"
              ? "No books available yet."
              : `No books found in ${activeCategory} category.`}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
          >
            <HoverAnimation scale={1.02} y={-8} className="h-full">
              <Card className="h-full min-h-[480px] sm:min-h-[520px] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 group/image">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-primary opacity-40" />
                  </div>
                )}

                {book.fileUrl && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button
                      size="sm"
                      className="flex items-center gap-2"
                      asChild
                    >
                      <Link
                        to={`/library/${book.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openReader(book);
                        }}
                      >
                        <BookOpen className="w-4 h-4" />
                        Read
                      </Link>
                    </Button>
                  </div>
                )}

                {book.featured && (
                  <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <CardHeader className="shrink-0">
                <CardTitle className="line-clamp-2 text-base mb-2">{book.title}</CardTitle>
                {book.author && (
                  <CardDescription className="flex items-center gap-2 text-xs mb-1">
                    <User className="w-3 h-3" />
                    {book.author}
                  </CardDescription>
                )}
                  <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3 h-3" />
                  {book.publishDate
                    ? new Date(book.publishDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : book.uploadDate
                    ? new Date(book.uploadDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-sm text-foreground/70 mb-4 flex-1 min-h-[4.5rem]">
                  {book.description ? truncateWords(book.description, 40) : ""}
                </p>
                <div className="flex items-center justify-between gap-2 flex-nowrap">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium whitespace-nowrap">
                    {book.category}
                  </span>
                  {book.fileUrl && (
                    <div className="flex items-center gap-2 flex-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 whitespace-nowrap"
                        asChild
                      >
                        <Link
                          to={`/library/${book.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openReader(book);
                          }}
                        >
                          <BookOpen className="w-3 h-3" />
                          Read
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-8 px-0" title="Download">
                        <a
                          href={buildApiUrl(`/api/books/${book.id}/download`)}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Download className="w-4 h-4" />
                          <span className="sr-only">Download</span>
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </HoverAnimation>
        </motion.div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Resource Library
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
              Access our collection of books, articles, and resources organized by category.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Library Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <ScrollAnimation direction="fade" delay={0.4}>
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search books by title, author, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <FilterIcon className="w-4 h-4" />
                  <span>{filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Date Filter Tabs */}
          <ScrollAnimation direction="fade" delay={0.5}>
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Calendar className="w-4 h-4" />
                <span>Filter by date:</span>
              </div>
              <Tabs value={dateFilter} onValueChange={(value) => setDateFilter(value as "all" | "past" | "ongoing" | "future")} className="w-auto">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="ongoing">Recent</TabsTrigger>
                  <TabsTrigger value="future">Future</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </ScrollAnimation>

          {/* Category Tabs */}
          <ScrollAnimation direction="fade" delay={0.6}>
            <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as Book["category"] | "All")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8 overflow-x-auto">
                <TabsTrigger value="All">All</TabsTrigger>
                {BOOK_CATEGORIES.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {BOOK_CATEGORIES.map((category) => (
                <TabsContent key={category} value={category} className="mt-6">
                  {renderBooks()}
                </TabsContent>
              ))}
              <TabsContent value="All" className="mt-6">
                {renderBooks()}
              </TabsContent>
            </Tabs>
          </ScrollAnimation>
        </div>
      </section>

      <Dialog
        open={readerOpen}
        onOpenChange={(open) => {
          setReaderOpen(open);
          if (!open) {
            setReaderBook(null);
            navigate("/library", { replace: true });
          }
        }}
      >
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <div className="p-4 border-b sticky top-0 bg-background z-10 pt-10 md:pt-4">
            <DialogHeader>
              <DialogTitle className="text-base">
                {readerBook?.title || "Book Reader"}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 sticky top-[72px] md:top-[56px] bg-background z-10">
            <div className="text-sm text-foreground/70 min-w-[110px]">
              {pdfNumPages ? `${pdfNumPages} pages` : "Loading pages..."}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPdfScale((s) => Math.max(0.7, Math.round((s - 0.1) * 10) / 10))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="text-sm text-foreground/70 min-w-[70px] text-center">
                {Math.round(pdfScale * 100)}%
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPdfScale((s) => Math.min(2.0, Math.round((s + 0.1) * 10) / 10))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div
            ref={pdfContainerRef}
            className="w-full h-[80vh] bg-muted overflow-auto"
          >
            {readerBook ? (
              <div className="py-6 flex flex-col items-center gap-4">
                <Document
                  key={`${readerBook?.id || "book"}-${pdfRequestKey}`}
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => {
                    setPdfNumPages(numPages);
                    setPdfError(null);
                    setPagesToRender((prev) => Math.min(numPages, Math.max(prev, 3)));
                  }}
                  onLoadError={(err: any) => {
                    console.error("PDF load error:", err);
                    setPdfError("Failed to load this book. Please try again.");
                  }}
                  loading={
                    <div className="w-full h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
                      Loading book...
                    </div>
                  }
                  error={
                    <div className="w-full h-[60vh] flex items-center justify-center text-sm text-destructive">
                      Failed to load book.
                    </div>
                  }
                >
                  {pdfError ? (
                    <div className="w-full h-[60vh] flex items-center justify-center text-sm text-destructive">
                      {pdfError}
                    </div>
                  ) : (
                    Array.from({ length: Math.min(pdfNumPages, pagesToRender) }, (_, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        scale={pdfScale}
                        width={pdfContainerWidth ? Math.min(pdfContainerWidth - 32, 900) : undefined}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    ))
                  )}
                </Document>
                {pdfNumPages > pagesToRender && (
                  <div className="text-xs text-foreground/60 pb-6">
                    Loading more pages...
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                No book selected.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
