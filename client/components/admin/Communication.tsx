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
import { Label } from "@/components/ui/label";
import { Mail, Plus, Search, Edit, Trash2, Download, Users, UserCheck, UserX, MessageSquare } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { EmailCampaign, EmailSubscriber } from "@/types/admin";
import { Textarea } from "@/components/ui/textarea";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  readAt?: string;
  repliedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Communication() {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<EmailSubscriber | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null);
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
    loadContactSubmissions();
    loadCampaigns();
  }, []);

  const loadContactSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/contact");
      const data = await response.json();
      if (Array.isArray(data)) {
        setContactSubmissions(data);
      }
    } catch (error) {
      console.error("Error loading contact submissions:", error);
    }
  };

  const handleUpdateSubmission = async (id: string, updates: Partial<ContactSubmission>) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update submission");
      loadContactSubmissions();
      toast({
        title: "Success",
        description: "Contact submission updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update submission.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete submission");
      loadContactSubmissions();
      toast({
        title: "Success",
        description: "Contact submission deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete submission.",
        variant: "destructive",
      });
    }
  };

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

  const loadCampaigns = async () => {
    try {
      const response = await fetch("/api/admin/campaigns");
      const data = await response.json().catch(() => []);
      if (Array.isArray(data)) setCampaigns(data);
    } catch (error) {
      console.error("Error loading campaigns:", error);
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

  const [campaignForm, setCampaignForm] = useState({
    subject: "",
    body: "",
  });

  const resetCampaignForm = () => {
    setEditingCampaign(null);
    setCampaignForm({ subject: "", body: "" });
  };

  const handleCampaignEdit = (c: EmailCampaign) => {
    setEditingCampaign(c);
    setCampaignForm({ subject: c.subject || "", body: c.body || "" });
    setCampaignDialogOpen(true);
  };

  const handleCampaignSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { subject: campaignForm.subject, body: campaignForm.body, status: "draft" };
      const url = editingCampaign ? `/api/admin/campaigns/${editingCampaign.id}` : "/api/admin/campaigns";
      const method = editingCampaign ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Failed to save campaign");
      toast({
        title: editingCampaign ? "Campaign updated" : "Campaign created",
        description: "Your campaign has been saved as a draft.",
      });
      setCampaignDialogOpen(false);
      resetCampaignForm();
      loadCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save campaign.",
        variant: "destructive",
      });
    }
  };

  const handleCampaignDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete campaign");
      toast({ title: "Campaign deleted", description: "Campaign removed successfully." });
      loadCampaigns();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete campaign.", variant: "destructive" });
    }
  };

  const handleCampaignSend = async (c: EmailCampaign) => {
    if (!c?.id) return;
    try {
      setSendingCampaignId(c.id);
      const response = await fetch(`/api/admin/campaigns/${c.id}/send`, { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Failed to send campaign");
      const firstError = Array.isArray(data?.errors) ? data.errors?.[0]?.error : undefined;
      if (data?.ok === false || (data?.failed ?? 0) > 0) {
        toast({
          title: "Campaign completed with errors",
          description: `${firstError ? `Reason: ${firstError} • ` : ""}Sent: ${data?.sent ?? "?"} • Failed: ${data?.failed ?? "?"} • Recipients: ${data?.recipients ?? "?"}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Campaign sent",
          description: `Sent: ${data?.sent ?? "?"} • Failed: ${data?.failed ?? "?"} • Recipients: ${data?.recipients ?? "?"}`,
        });
      }
      loadCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to send campaign.",
        variant: "destructive",
      });
    } finally {
      setSendingCampaignId(null);
    }
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

      {/* Contact Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact Submissions
          </CardTitle>
          <CardDescription>View and manage contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactSubmissions
                  .filter((sub) => {
                    const matchesSearch = 
                      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      sub.subject.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
                    return matchesSearch && matchesStatus;
                  })
                  .map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.subject}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            submission.status === "new"
                              ? "default"
                              : submission.status === "read"
                              ? "secondary"
                              : submission.status === "replied"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setSubmissionNotes(submission.notes || "");
                              if (submission.status === "new") {
                                handleUpdateSubmission(submission.id, { status: "read" });
                              }
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Contact Submission</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this contact submission? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSubmission(submission.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {contactSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No contact submissions yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View/Edit Submission Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>View and manage this contact submission</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={selectedSubmission.name} readOnly />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={selectedSubmission.email} readOnly />
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={selectedSubmission.subject} readOnly />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea value={selectedSubmission.message} readOnly rows={6} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedSubmission.status}
                    onValueChange={(value) =>
                      handleUpdateSubmission(selectedSubmission.id, { status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Submitted</Label>
                  <Input
                    value={new Date(selectedSubmission.createdAt).toLocaleString()}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Add internal notes about this submission..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedSubmission(null)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                handleUpdateSubmission(selectedSubmission!.id, { notes: submissionNotes });
                setSelectedSubmission(null);
              }}
            >
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>Manage email campaigns and newsletters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
            <div className="text-sm text-foreground/70">
              Sends to <strong>active subscribers</strong> only.
            </div>
            <Dialog open={campaignDialogOpen} onOpenChange={(open) => {
              setCampaignDialogOpen(open);
              if (!open) resetCampaignForm();
            }}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                  <DialogTitle>{editingCampaign ? "Edit Campaign" : "Create Campaign"}</DialogTitle>
                  <DialogDescription>Write your message. This will be sent to all active subscribers when you click “Send”.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCampaignSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaignSubject">Subject *</Label>
                    <Input
                      id="campaignSubject"
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm((p) => ({ ...p, subject: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaignBody">Body *</Label>
                    <Textarea
                      id="campaignBody"
                      value={campaignForm.body}
                      onChange={(e) => setCampaignForm((p) => ({ ...p, body: e.target.value }))}
                      placeholder="You can paste plain text or HTML here."
                      rows={10}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setCampaignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Draft</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-foreground/60 py-8">
                    No campaigns yet
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.subject}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "sent" ? "default" : "secondary"}>{c.status}</Badge>
                    </TableCell>
                    <TableCell>{(c.recipients || []).length}</TableCell>
                    <TableCell>{c.sentDate ? new Date(c.sentDate).toLocaleString() : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCampaignEdit(c)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleCampaignSend(c)}
                          disabled={sendingCampaignId === c.id || c.status === "sent"}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {sendingCampaignId === c.id ? "Sending..." : c.status === "sent" ? "Sent" : "Send"}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete campaign?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the campaign draft/history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCampaignDelete(c.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
}
