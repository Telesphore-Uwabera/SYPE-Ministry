import { useState, useEffect } from "react";
import { Donation } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { DollarSign, Plus, Search, Edit, Trash2, Download, Mail } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function DonationManagement() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [sendingReceiptId, setSendingReceiptId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Omit<Donation, "id">>>({
    donorName: "",
    donorEmail: "",
    amount: 0,
    amountPaid: 0,
    currency: "RWF",
    date: new Date().toISOString().split("T")[0],
    type: "one-time",
    paymentMethod: "",
    paymentStatus: "unpaid",
    receiptSent: false,
    notes: "",
    projectId: "",
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const response = await fetch("/api/admin/donations");
      const data = await response.json();
      if (Array.isArray(data)) {
        setDonations(data);
      }
    } catch (error) {
      console.error("Error loading donations:", error);
      toast({
        title: "Error",
        description: "Failed to load donations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.paymentMethod) {
        toast({
          title: "Payment method required",
          description: "Please select a payment method to continue.",
          variant: "destructive",
        });
        return;
      }
      if (formData.paymentStatus === "installment") {
        const amount = Number(formData.amount || 0);
        const received = Number(formData.amountPaid || 0);
        if (received < 0 || received > amount) {
          toast({
            title: "Invalid received amount",
            description: "Amount received must be between 0 and the total amount.",
            variant: "destructive",
          });
          return;
        }
      }

      if (editingDonation) {
        const response = await fetch(`/api/admin/donations/${editingDonation.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update donation");

        toast({
          title: "Donation updated",
          description: "Donation record has been updated successfully.",
        });
      } else {
        const response = await fetch("/api/admin/donations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create donation");
        }

        toast({
          title: "Donation recorded",
          description: "New donation has been recorded successfully.",
        });
      }
      setIsDialogOpen(false);
      resetForm();
      loadDonations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    // Handle date format (could be ISO string or date string)
    const donationDate = typeof donation.date === "string" 
      ? (donation.date.includes("T") ? donation.date.split("T")[0] : donation.date)
      : new Date(donation.date).toISOString().split("T")[0];
    
    setFormData({
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      amount: donation.amount,
      amountPaid: donation.amountPaid ?? (donation.paymentStatus === "paid" ? donation.amount : 0),
      currency: donation.currency,
      date: donationDate,
      type: donation.type,
      paymentMethod: donation.paymentMethod || "",
      paymentStatus: donation.paymentStatus || "unpaid",
      receiptSent: donation.receiptSent || false,
      notes: donation.notes || "",
      projectId: donation.projectId || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/donations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete donation");

      toast({
        title: "Donation deleted",
        description: "Donation record has been deleted successfully.",
      });
      loadDonations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendReceipt = async (donation: Donation) => {
    if (!donation?.id) return;
    try {
      setSendingReceiptId(donation.id);
      const response = await fetch(`/api/admin/donations/${donation.id}/send-receipt`, {
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Failed to send receipt");
      }

      toast({
        title: "Receipt sent",
        description: `Receipt sent to ${donation.donorEmail}.`,
      });
      await loadDonations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to send receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingReceiptId(null);
    }
  };

  const resetForm = () => {
    setEditingDonation(null);
    setFormData({
      donorName: "",
      donorEmail: "",
      amount: 0,
      amountPaid: 0,
      currency: "RWF",
      date: new Date().toISOString().split("T")[0],
      type: "one-time",
      paymentMethod: "",
      paymentStatus: "unpaid",
      receiptSent: false,
      notes: "",
      projectId: "",
    });
  };

  const filteredDonations = donations.filter((donation) =>
    donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const paidAmount = filteredDonations
    .filter((d) => d.paymentStatus === "paid")
    .reduce((sum, d) => sum + d.amount, 0);
  const unpaidAmount = filteredDonations
    .filter((d) => (d.paymentStatus || "unpaid") === "unpaid")
    .reduce((sum, d) => sum + d.amount, 0);
  const installmentReceived = filteredDonations
    .filter((d) => d.paymentStatus === "installment")
    .reduce((sum, d) => sum + (d.amountPaid || 0), 0);
  const installmentRemaining = filteredDonations
    .filter((d) => d.paymentStatus === "installment")
    .reduce((sum, d) => sum + Math.max(0, d.amount - (d.amountPaid || 0)), 0);

  const exportToCSV = () => {
    const headers = ["Date", "Donor Name", "Donor Email", "Amount", "Currency", "Type", "Payment Method", "Payment Status", "Amount Received", "Amount Remaining", "Receipt Sent"];
    const rows = filteredDonations.map((d) => [
      d.date,
      d.donorName,
      d.donorEmail,
      d.amount.toString(),
      d.currency,
      d.type,
      d.paymentMethod || "",
      d.paymentStatus || "unpaid",
      (d.paymentStatus === "paid" ? d.amount : d.paymentStatus === "installment" ? (d.amountPaid || 0) : 0).toString(),
      Math.max(0, d.amount - (d.paymentStatus === "paid" ? d.amount : d.paymentStatus === "installment" ? (d.amountPaid || 0) : 0)).toString(),
      d.receiptSent ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast({
      title: "Export successful",
      description: "Donation data has been exported to CSV.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Donation Management</h2>
            <p className="text-foreground/70">Track donations and financial contributions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Record Donation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDonation ? "Edit Donation" : "Record New Donation"}</DialogTitle>
                <DialogDescription>
                  {editingDonation ? "Update donation information" : "Record a new donation"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="donorName">Donor Name *</Label>
                    <Input
                      id="donorName"
                      value={formData.donorName}
                      onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="donorEmail">Donor Email *</Label>
                    <Input
                      id="donorEmail"
                      type="email"
                      value={formData.donorEmail}
                      onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency *</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RWF">RWF</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Donation Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "one-time" | "monthly" | "project-based") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-Time</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="project-based">Project-Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select
                      value={formData.paymentMethod || ""}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                        <SelectItem value="airtel">Airtel Money</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status *</Label>
                    <Select
                      value={formData.paymentStatus || "unpaid"}
                      onValueChange={(value: "paid" | "unpaid" | "installment") =>
                        setFormData({ ...formData, paymentStatus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="installment">Installment Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="projectId">Project ID (Optional)</Label>
                    <Input
                      id="projectId"
                      value={formData.projectId || ""}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      placeholder="Project ID"
                    />
                  </div>
                </div>
                {formData.paymentStatus === "installment" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amountPaid">Amount Received *</Label>
                      <Input
                        id="amountPaid"
                        type="number"
                        step="0.01"
                        min={0}
                        value={Number(formData.amountPaid || 0)}
                        onChange={(e) =>
                          setFormData({ ...formData, amountPaid: parseFloat(e.target.value) || 0 })
                        }
                        required
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <p className="text-sm text-foreground/70">
                        Remaining:{" "}
                        {Math.max(0, Number(formData.amount || 0) - Number(formData.amountPaid || 0)).toLocaleString()}{" "}
                        {formData.currency || "RWF"}
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="receiptSent"
                    checked={formData.receiptSent}
                    onCheckedChange={(checked) => setFormData({ ...formData, receiptSent: checked })}
                  />
                  <Label htmlFor="receiptSent">Receipt Sent</Label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingDonation ? "Update" : "Record"} Donation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Donations</CardDescription>
            <CardTitle className="text-3xl">{filteredDonations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Amount</CardDescription>
            <CardTitle className="text-3xl">{totalAmount.toLocaleString()} RWF</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Amount</CardDescription>
            <CardTitle className="text-3xl">{paidAmount.toLocaleString()} RWF</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unpaid Amount</CardDescription>
            <CardTitle className="text-3xl">{unpaidAmount.toLocaleString()} RWF</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Installments Received</CardDescription>
            <CardTitle className="text-3xl">{installmentReceived.toLocaleString()} RWF</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Installments Remaining</CardDescription>
            <CardTitle className="text-3xl">{installmentRemaining.toLocaleString()} RWF</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receipts Sent</CardDescription>
            <CardTitle className="text-3xl">
              {filteredDonations.filter((d) => d.receiptSent).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
            <Input
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Donations ({filteredDonations.length})</CardTitle>
          <CardDescription>All donation records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Donor Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-foreground/50">
                      No donations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{donation.donorName}</TableCell>
                      <TableCell>{donation.donorEmail}</TableCell>
                      <TableCell>
                        {donation.amount.toLocaleString()} {donation.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{donation.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {donation.paymentStatus === "paid" ? (
                          <Badge className="bg-green-500">Paid</Badge>
                        ) : donation.paymentStatus === "installment" ? (
                          <Badge className="bg-yellow-500">Installment</Badge>
                        ) : (
                          <Badge className="bg-red-500">Unpaid</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {(
                          donation.paymentStatus === "paid"
                            ? donation.amount
                            : donation.paymentStatus === "installment"
                            ? donation.amountPaid || 0
                            : 0
                        ).toLocaleString()}{" "}
                        {donation.currency}
                      </TableCell>
                      <TableCell>
                        {Math.max(
                          0,
                          donation.amount -
                            (donation.paymentStatus === "paid"
                              ? donation.amount
                              : donation.paymentStatus === "installment"
                              ? donation.amountPaid || 0
                              : 0)
                        ).toLocaleString()}{" "}
                        {donation.currency}
                      </TableCell>
                      <TableCell>
                        {donation.receiptSent ? (
                          <Badge className="bg-green-500">Sent</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!donation.receiptSent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={sendingReceiptId === donation.id}
                              onClick={() => handleSendReceipt(donation)}
                              title="Send receipt"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(donation)}
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
                                <AlertDialogTitle>Delete Donation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this donation record? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(donation.id)}
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
