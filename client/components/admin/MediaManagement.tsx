import { useState, useEffect, useRef } from "react";
import { MediaFile } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Upload, Search, Edit, Trash2, Video, FileText, X, Loader2, Play } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function MediaManagement() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MediaFile>>({
    name: "",
    type: "image",
    category: "",
    description: "",
    tags: [],
    url: "",
    thumbnail: "",
    youtubeUrl: "",
  });

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const loadMediaFiles = async () => {
    try {
      const response = await fetch("/api/admin/media");
      const data = await response.json();
      if (Array.isArray(data)) {
        setMediaFiles(data);
      }
    } catch (error) {
      console.error("Error loading media files:", error);
      toast({
        title: "Error",
        description: "Failed to load media files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!formData.category) {
      toast({
        title: "Category required",
        description: "Please select a category before uploading files.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let completed = 0;
      const total = files.length;

      for (const file of Array.from(files)) {
        const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document";
        
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);

        const response = await fetch(`/api/upload/media?category=${formData.category}&type=${type}`, {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const uploadResult = await response.json();
        completed++;
        setUploadProgress((completed / total) * 100);

        // Create media record
        const mediaData = {
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          type: type,
          url: uploadResult.url,
          size: uploadResult.size.toString(),
          category: formData.category || undefined,
          description: formData.description || undefined,
          tags: formData.tags || [],
        };

        const createResponse = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mediaData),
        });

        if (!createResponse.ok) {
          const error = await createResponse.json();
          throw new Error(error.error || "Failed to create media record");
        }
      }

      toast({
        title: "Upload successful",
        description: `Successfully uploaded ${files.length} file(s).`,
      });

      resetForm();
      loadMediaFiles();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Thumbnail must be an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("thumbnail", file);

      const response = await fetch("/api/upload/thumbnail", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Thumbnail upload failed");
      }

      const result = await response.json();
      setFormData({ ...formData, thumbnail: result.url });
      
      toast({
        title: "Thumbnail uploaded",
        description: "Thumbnail uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload thumbnail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = "";
      }
    }
  };

  const handleEdit = (file: MediaFile) => {
    setEditingFile(file);
    setFormData({
      name: file.name,
      type: file.type,
      category: file.category || "",
      description: file.description || "",
      tags: file.tags || [],
      url: file.url,
      thumbnail: file.thumbnail || "",
      youtubeUrl: file.youtubeUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingFile) return;

    try {
      const response = await fetch(`/api/admin/media/${editingFile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update media file");

      toast({
        title: "Media updated",
        description: "Media file has been updated successfully.",
      });

      setIsDialogOpen(false);
      resetForm();
      loadMediaFiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update media file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete media file");

      toast({
        title: "Media deleted",
        description: "Media file has been deleted successfully.",
      });
      loadMediaFiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete media file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingFile(null);
    setFormData({
      name: "",
      type: "image",
      category: "",
      description: "",
      tags: [],
      url: "",
      thumbnail: "",
      youtubeUrl: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch =
      searchTerm === "" ||
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || file.category === filterCategory;
    const matchesType = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "image":
        return <Badge className="bg-blue-500">Image</Badge>;
      case "video":
        return <Badge className="bg-purple-500">Video</Badge>;
      case "document":
        return <Badge className="bg-green-500">Document</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handlePreview = (file: MediaFile) => {
    setPreviewUrl(file.url);
    setPreviewType(file.type === "video" ? "video" : file.type === "image" ? "image" : null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Media Management</h2>
            <p className="text-foreground/70">Upload and manage media files (images, videos, documents)</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFile ? "Edit Media File" : "Upload Media Files"}</DialogTitle>
              <DialogDescription>
                {editingFile ? "Update media file information" : "Upload images, videos, or documents for use on the website"}
              </DialogDescription>
            </DialogHeader>

            {!editingFile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="testimony">Testimony (Videos)</SelectItem>
                        <SelectItem value="graphics">Graphics (Images)</SelectItem>
                        <SelectItem value="posters">Posters (Images)</SelectItem>
                        <SelectItem value="devotions">Devotions (Images)</SelectItem>
                        <SelectItem value="media">General Media</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-foreground/60">
                      Images → Devotions section | Videos → Featured videos with YouTube links
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Media Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value as "image" | "video" | "document" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select Files</Label>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-foreground/70">Uploading... {Math.round(uploadProgress)}%</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-foreground/40" />
                        <div>
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-foreground/60 mt-1">
                            Images (JPEG, PNG, GIF, WebP), Videos (MP4, MOV, AVI, WebM), Documents (PDF, DOC, DOCX)
                          </p>
                          <p className="text-xs text-foreground/50 mt-1">Max size: 100MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the media file..."
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category || ""}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="testimony">Testimony</SelectItem>
                        <SelectItem value="graphics">Graphics</SelectItem>
                        <SelectItem value="posters">Posters</SelectItem>
                        <SelectItem value="media">General Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description..."
                    rows={3}
                  />
                </div>

                {editingFile.type === "video" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Video Thumbnail (Optional)</Label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Thumbnail
                          </Button>
                        </div>
                        {formData.thumbnail && (
                          <div className="w-24 h-16 border rounded overflow-hidden">
                            <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtubeUrl">Featured Video YouTube Link (Optional)</Label>
                      <Input
                        id="youtubeUrl"
                        type="url"
                        value={formData.youtubeUrl || ""}
                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-foreground/60">
                        Add YouTube link for featured videos. This will be displayed on the Devotions page as a featured video with link to the full video on YouTube.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded p-4 bg-muted/30">
                    {editingFile.type === "image" ? (
                      <img src={editingFile.url} alt={editingFile.name} className="max-w-full h-48 object-contain mx-auto" />
                    ) : editingFile.type === "video" ? (
                      <video src={editingFile.url} controls className="max-w-full h-48 mx-auto" />
                    ) : (
                      <div className="flex items-center justify-center h-48">
                        <FileText className="w-16 h-16 text-foreground/40" />
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate}>Update</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>All uploaded media files displayed on the Videos & Multimedia page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="testimony">Testimony</SelectItem>
                <SelectItem value="graphics">Graphics</SelectItem>
                <SelectItem value="posters">Posters</SelectItem>
                <SelectItem value="devotions">Devotions</SelectItem>
                <SelectItem value="media">General Media</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No media files found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded overflow-hidden border cursor-pointer" onClick={() => handlePreview(file)}>
                          {file.type === "image" ? (
                            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                          ) : file.type === "video" ? (
                            <div className="w-full h-full bg-muted flex items-center justify-center relative">
                              {file.thumbnail ? (
                                <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                              ) : (
                                <Video className="w-6 h-6 text-foreground/40" />
                              )}
                              <Play className="w-4 h-4 text-white absolute" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <FileText className="w-6 h-6 text-foreground/40" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{getTypeBadge(file.type)}</TableCell>
                      <TableCell>
                        {file.category ? (
                          <Badge variant="outline">{file.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{formatFileSize(file.size)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(file)}
                          >
                            {file.type === "image" || file.type === "video" ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(file)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the media file "{file.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(file.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {previewUrl && previewType && (
        <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Media Preview</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg">
              {previewType === "image" ? (
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-[70vh] object-contain" />
              ) : (
                <video src={previewUrl} controls className="max-w-full max-h-[70vh]" />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
