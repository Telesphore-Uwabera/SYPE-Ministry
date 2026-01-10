import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, Search, Edit, Trash2, Download, Users, UserCheck, UserX } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { EmailSubscriber } from "@/types/admin";

export default function Communication() {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<EmailSubscriber | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Omit<EmailSubscriber, "id" | "subscribedAt">>({
    email: "",
    name: "",
    status: "active",
    source: "admin",
    tags: [],
  });

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const response = await fetch("/api/admin/subscribers");
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubscribers(data);
      }
    } catch (error) {
      console.error("Error loading subscribers:", error);
      toast({
        title: "Error",
        description: "Failed to load subscribers. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubscriber) {
        const response = await fetch(`/api/admin/subscribers/${editingSubscriber.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update subscriber");

        toast({
          title: "Subscriber updated",
          description: "Subscriber information has been updated successfully.",
        });
      } else {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create subscriber");
        }

        toast({
          title: "Subscriber added",
          description: "New subscriber has been added successfully.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadSubscribers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save subscriber. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (subscriber: EmailSubscriber) => {
    setEditingSubscriber(subscriber);
    setFormData({
      email: subscriber.email,
      name: subscriber.name || "",
      status: subscriber.status,
      source: subscriber.source || "admin",
      tags: subscriber.tags || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/subscribers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete subscriber");

      toast({
        title: "Subscriber deleted",
        description: "Subscriber has been deleted successfully.",
      });
      loadSubscribers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subscriber. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const activeSubscribers = subscribers.filter((s) => s.status === "active");
    const csv = [
      ["Email", "Name", "Subscribed At", "Source"],
      ...activeSubscribers.map((s) => [
        s.email,
        s.name || "",
        new Date(s.subscribedAt).toLocaleDateString(),
        s.source || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sype-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Subscriber list has been exported to CSV.",
    });
  };

  const resetForm = () => {
    setEditingSubscriber(null);
    setFormData({
      email: "",
      name: "",
      status: "active",
      source: "admin",
      tags: [],
    });
  };

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      searchTerm === "" ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || subscriber.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeSubscribers = subscribers.filter((s) => s.status === "active").length;
  const totalSubscribers = subscribers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Communication</h2>
            <p className="text-foreground/70">Email campaigns and messaging</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSubscriber ? "Edit Subscriber" : "Add New Subscriber"}</DialogTitle>
                <DialogDescription>
                  {editingSubscriber ? "Update subscriber information" : "Add a new email subscriber"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "unsubscribed" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingSubscriber ? "Update" : "Add"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Subscribers</CardDescription>
            <CardTitle className="text-3xl">{totalSubscribers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Subscribers</CardDescription>
            <CardTitle className="text-3xl">{activeSubscribers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unsubscribed</CardDescription>
            <CardTitle className="text-3xl">{totalSubscribers - activeSubscribers}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Email Subscribers */}
      <Card>
        <CardHeader>
          <CardTitle>Email Subscribers</CardTitle>
          <CardDescription>Manage your email subscription list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>{subscriber.name || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscriber.source || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>
                        {subscriber.status === "active" ? (
                          <Badge variant="default" className="bg-green-500">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <UserX className="w-3 h-3 mr-1" />
                            Unsubscribed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(subscriber)}
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
                                  This action cannot be undone. This will permanently delete the subscriber "{subscriber.email}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(subscriber.id)}>
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

      {/* Email Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>Manage email campaigns and newsletters</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/50 text-center py-8">Email campaign management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
