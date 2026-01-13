import { useState, useEffect, useRef } from "react";
import { Devotion, MediaFile } from "@/types/admin";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Search, Edit, Trash2, Calendar, Image as ImageIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import MediaSelector from "./MediaSelector";

export default function DevotionManagement() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevotion, setEditingDevotion] = useState<Devotion | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Omit<Devotion, "id" | "createdAt">>>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    excerpt: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    loadDevotions();
  }, []);

  const loadDevotions = async () => {
    try {
      const response = await fetch("/api/admin/devotions");
      const data = await response.json();
      if (Array.isArray(data)) {
        setDevotions(data);
      }
    } catch (error) {
      console.error("Error loading devotions:", error);
      toast({
        title: "Error",
        description: "Failed to load devotions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.image) {
      toast({
        title: "Validation Error",
        description: "Devotion image is required. Please select an image from the media gallery.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingDevotion) {
        const response = await fetch(`/api/admin/devotions/${editingDevotion.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update devotion");

        toast({
          title: "Devotion updated",
          description: "Devotion has been updated successfully.",
        });
      } else {
        const response = await fetch("/api/admin/devotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create devotion");
        }

        toast({
          title: "Devotion created",
          description: "New devotion has been created successfully.",
        });
      }
      setIsDialogOpen(false);
      resetForm();
      loadDevotions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save devotion. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (devotion: Devotion) => {
    setEditingDevotion(devotion);
    setFormData({
      title: devotion.title,
      date: devotion.date.split("T")[0] || devotion.date,
      excerpt: devotion.excerpt,
      content: devotion.content || "",
      image: devotion.image || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/devotions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete devotion");

      toast({
        title: "Devotion deleted",
        description: "Devotion has been deleted successfully.",
      });
      loadDevotions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete devotion. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingDevotion(null);
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      excerpt: "",
      content: "",
      image: "",
    });
  };

  const filteredDevotions = devotions.filter((devotion) => {
    const matchesSearch =
      searchTerm === "" ||
      devotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devotion.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devotion.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Devotion Management</h2>
            <p className="text-foreground/70">Manage daily devotions displayed on the Devotions page</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Devotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDevotion ? "Edit Devotion" : "Create New Devotion"}</DialogTitle>
              <DialogDescription>
                {editingDevotion ? "Update devotion information" : "Create a new daily devotion"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Devotion title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  placeholder="Brief excerpt/summary..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Full Content (Optional)</Label>
                <Textarea
                  id="content"
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full devotion content..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Devotion Image *</Label>
                <p className="text-xs text-foreground/60 mb-2">
                  Select an image from the media gallery (images with category "devotions"). This is required.
                </p>
                <div className="space-y-2">
                  <MediaSelector
                    category="devotions"
                    type="image"
                    onSelect={(media: MediaFile) => {
                      setFormData({ ...formData, image: media?.url || "" });
                    }}
                    selectedUrl={formData.image || ""}
                    title="Select Devotion Image"
                    description="Choose an image from the devotions media gallery. Upload images with category 'devotions' in Media Management first."
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <div className="w-32 h-32 rounded overflow-hidden border">
                        <img
                          src={formData.image}
                          alt="Selected devotion image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => setFormData({ ...formData, image: "" })}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                  {!formData.image && (
                    <p className="text-sm text-destructive">Please select a devotion image</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit">{editingDevotion ? "Update" : "Create"} Devotion</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
            <Input
              placeholder="Search devotions by title or excerpt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Devotions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Devotions ({filteredDevotions.length})</CardTitle>
          <CardDescription>All daily devotions displayed on the Devotions page (last 7 days shown)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Excerpt</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
                      No devotions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevotions.map((devotion) => (
                    <TableRow key={devotion.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(devotion.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{devotion.title}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-foreground/70 line-clamp-2">
                          {devotion.excerpt}
                        </p>
                      </TableCell>
                      <TableCell>
                        {devotion.image ? (
                          <div className="w-16 h-16 rounded overflow-hidden border">
                            <img src={devotion.image} alt={devotion.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No image</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(devotion)}
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
                                <AlertDialogTitle>Delete Devotion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{devotion.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(devotion.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
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
    </div>
  );
}
