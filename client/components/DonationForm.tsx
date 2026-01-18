import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, Loader2 } from "lucide-react";

interface DonationFormProps {
  onSuccess?: () => void;
}

export default function DonationForm({ onSuccess }: DonationFormProps) {
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    amount: "",
    currency: "RWF",
    type: "one-time",
    paymentMethod: "",
    paymentStatus: "unpaid" as "paid" | "unpaid" | "installment",
    projectId: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.paymentMethod) {
        toast({
          title: "Payment method required",
          description: "Please select a payment method to continue.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/admin/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            donorName: formData.donorName,
            donorEmail: formData.donorEmail,
            donorPhone: formData.donorPhone,
            amount: parseFloat(formData.amount),
            currency: formData.currency,
            type: formData.type,
            paymentMethod: formData.paymentMethod,
            paymentStatus: formData.paymentStatus || "unpaid",
            projectId: formData.projectId || undefined,
            notes: formData.message || undefined,
            date: new Date().toISOString(),
            receiptSent: false,
          }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit donation");
      }

      toast({
        title: "Donation submitted successfully",
        description: "Thank you for your generous donation! We will contact you shortly.",
      });

      // Reset form
      setFormData({
        donorName: "",
        donorEmail: "",
        donorPhone: "",
        amount: "",
        currency: "RWF",
        type: "one-time",
        paymentMethod: "",
        paymentStatus: "unpaid",
        projectId: "",
        message: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit donation. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Make a Donation
        </CardTitle>
        <CardDescription>
          Fill out the form below to make a donation to SYPE Ministry. All donations help us spread the Gospel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="donorName">Full Name *</Label>
              <Input
                id="donorName"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donorEmail">Email Address *</Label>
              <Input
                id="donorEmail"
                type="email"
                value={formData.donorEmail}
                onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="donorPhone">Phone Number *</Label>
              <Input
                id="donorPhone"
                type="tel"
                inputMode="numeric"
                value={formData.donorPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    donorPhone: e.target.value.replace(/[^\d]/g, ""),
                  })
                }
                placeholder="0780XXXXXX"
                pattern="[0-9]*"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="1000"
                min="1"
                step="1"
                required
              />
            </div>
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="type">Donation Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
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
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status *</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => setFormData({ ...formData, paymentStatus: value as "paid" | "unpaid" | "installment" })}
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Specific Project (Optional)</Label>
              <Input
                id="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="Project name or ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any special instructions or messages..."
              rows={4}
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground/70">
            <p className="mb-2">
              <strong>Payment Instructions:</strong>
            </p>
            <p className="mb-2">
              After submitting this form, please make your payment using one of the following methods:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>MTN Mobile Money: *182*1*1*0782789883# (Registered to: Niyonkuru Simeon)</li>
              <li>Bank Transfer: Contact us for bank details</li>
              <li>Cash: Contact us to arrange a meeting</li>
            </ul>
            <p className="mt-2 text-xs">
              Once payment is confirmed, you will receive a receipt via email.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Submit Donation Form
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
