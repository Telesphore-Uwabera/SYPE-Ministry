import { useState, useEffect } from "react";
import { FAQ } from "@/types/admin";
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
import { HelpCircle, Plus, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const { toast } = useToast();
  const [categoryMode, setCategoryMode] = useState<"select" | "custom">("select");

  const [formData, setFormData] = useState<Omit<FAQ, "id">>({
    category: "",
    question: "",
    answer: "",
    order: 0,
  });

  useEffect(() => {
    void loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const response = await fetch("/api/admin/faqs", { cache: "no-store" });
      if (!response.ok) throw new Error(`Failed to load FAQs (${response.status})`);
      const data = await response.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error loading FAQs:", error);
      setFaqs([]);
      toast({
        title: "Error",
        description: error?.message || "Failed to load FAQs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const existingCategories = Array.from(
    new Set(
      faqs
        .map((f) => (f.category || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category?.trim()) {
      toast({
        title: "Validation Error",
        description: "Category is required.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (editingFAQ) {
        const response = await fetch(`/api/admin/faqs/${editingFAQ.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to update FAQ");
        toast({ title: "FAQ updated", description: "FAQ has been updated successfully." });
      } else {
        const response = await fetch("/api/admin/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to create FAQ");
        toast({ title: "FAQ created", description: "New FAQ has been created successfully." });
      }

      window.dispatchEvent(new Event("admin-data-changed"));
      setIsDialogOpen(false);
      resetForm();
      await loadFAQs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save FAQ. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
    });
    setCategoryMode("select");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      if (!response.ok && response.status !== 204) throw new Error("Failed to delete FAQ");
      toast({ title: "FAQ deleted", description: "FAQ has been deleted successfully." });
      window.dispatchEvent(new Event("admin-data-changed"));
      await loadFAQs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete FAQ. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingFAQ(null);
    setFormData({ category: "", question: "", answer: "", order: 0 });
    setCategoryMode("select");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">FAQ Management</h2>
            <p className="text-foreground/70">Manage frequently asked questions</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFAQ ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <div className="space-y-2">
                    <Select
                      value={categoryMode === "custom" ? "__custom__" : (formData.category || "")}
                      onValueChange={(value) => {
                        if (value === "__custom__") {
                          setCategoryMode("custom");
                          setFormData({ ...formData, category: "" });
                          return;
                        }
                        setCategoryMode("select");
                        setFormData({ ...formData, category: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingCategories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                        <SelectItem value="__custom__">Custom…</SelectItem>
                      </SelectContent>
                    </Select>

                    {categoryMode === "custom" && (
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Type a category (e.g., Donations & Support)"
                        required
                      />
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="order">Order *</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                  rows={6}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit">{editingFAQ ? "Update" : "Add"} FAQ</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQs ({faqs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-foreground/50">
                      No FAQs found
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell>{faq.category}</TableCell>
                      <TableCell className="font-medium">{faq.question}</TableCell>
                      <TableCell>{faq.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)}>
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
                                <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this FAQ?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(faq.id)}
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
