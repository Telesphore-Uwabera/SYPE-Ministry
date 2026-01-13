import { useState, useEffect } from "react";
import { MediaFile } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Search, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaSelectorProps {
  category?: string;
  type?: "image" | "video" | "all";
  onSelect: (media: MediaFile) => void;
  selectedUrl?: string;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
}

export default function MediaSelector({
  category = "devotions",
  type = "image",
  onSelect,
  selectedUrl,
  trigger,
  title = "Select Media",
  description = "Choose an image from the media gallery",
}: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMediaFiles();
    }
  }, [isOpen, category, type]);

  const loadMediaFiles = async () => {
    setLoading(true);
    try {
      const categoryParam = category ? `category=${category}` : "";
      const typeParam = type !== "all" ? `type=${type}` : "";
      const params = [categoryParam, typeParam].filter(Boolean).join("&");
      const url = `/api/admin/media${params ? `?${params}` : ""}`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        setMediaFiles(data);
      }
    } catch (error) {
      console.error("Error loading media files:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = mediaFiles.filter((media) => {
    if (searchTerm === "") return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      media.name?.toLowerCase().includes(searchLower) ||
      media.description?.toLowerCase().includes(searchLower) ||
      media.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleSelect = (media: MediaFile) => {
    onSelect(media);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button type="button" variant="outline" className="w-full">
      <ImageIcon className="w-4 h-4 mr-2" />
      {selectedUrl ? "Change Image" : "Select from Gallery"}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
            <Input
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-foreground/60">Loading media...</p>
                </div>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-foreground/70 mb-2">
                  {searchTerm ? "No media found matching your search" : "No media available"}
                </p>
                <p className="text-sm text-foreground/60">
                  {searchTerm
                    ? "Try a different search term"
                    : `Upload images with category "${category}" in Media Management`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedia.map((media) => {
                  const isSelected = selectedUrl === media.url;
                  return (
                    <Card
                      key={media.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onClick={() => handleSelect(media)}
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt={media.name || "Media"}
                            className="w-full h-full object-cover"
                          />
                        ) : media.thumbnail ? (
                          <img
                            src={media.thumbnail}
                            alt={media.name || "Media"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground opacity-40" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-2">
                              <Check className="w-5 h-5" />
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium line-clamp-2">
                          {media.name || "Untitled"}
                        </p>
                        {media.description && (
                          <p className="text-xs text-foreground/60 line-clamp-1 mt-1">
                            {media.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Image Preview */}
          {selectedUrl && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={selectedUrl}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Selected Image</p>
                    <p className="text-xs text-foreground/60 line-clamp-1">
                      {selectedUrl}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect({ id: "", url: "", name: "", type: "image", category: "" } as MediaFile);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
