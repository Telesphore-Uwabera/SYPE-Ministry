import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, Calendar, User, Search as SearchIcon, Filter as FilterIcon } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { Book } from "@/types/admin";
import { Input } from "@/components/ui/input";

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

  useEffect(() => {
    fetch("/api/admin/books")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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

  const renderBooks = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      );
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
      <StaggerContainer
        detectScrollDirection
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        staggerDelay={0.15}
        direction="up"
      >
        {filteredBooks.map((book) => (
          <HoverAnimation key={book.id} scale={1.02} y={-8}>
            <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
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
                {book.featured && (
                  <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <CardHeader>
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
                {book.description && (
                  <p className="text-sm text-foreground/70 line-clamp-3 mb-4 flex-1">
                    {book.description}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    {book.category}
                  </span>
                  {book.fileUrl && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <a
                        href={book.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Track download
                          fetch(`/api/admin/books/${book.id}/download`, {
                            method: "POST",
                          }).catch(() => {});
                        }}
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </HoverAnimation>
        ))}
      </StaggerContainer>
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
    </Layout>
  );
}
