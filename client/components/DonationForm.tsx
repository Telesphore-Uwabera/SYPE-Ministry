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
import { Heart, Loader2, Zap } from "lucide-react";

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
    paymentDeadline: "",
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

      const response = await fetch("/api/donations", {
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
          paymentDeadline: formData.paymentDeadline || undefined,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit donation");
      }

      toast({
        title: "Donation submitted successfully",
        description: "Thank you for your generous donation! We have emailed you a confirmation.",
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
        paymentDeadline: "",
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
    <Card className="w-full max-w-2xl mx-auto border-2 border-primary/20 shadow-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-2xl text-primary font-heading">
          <Heart className="w-6 h-6 text-primary fill-primary/20" />
          Make a Donation
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Your support directly fuels our mission to equip young professionals for evangelism.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="donorName" className="font-semibold">Full Name *</Label>
              <Input
                id="donorName"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                placeholder="John Doe"
                required
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donorEmail" className="font-semibold">Email Address *</Label>
              <Input
                id="donorEmail"
                type="email"
                value={formData.donorEmail}
                onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                placeholder="john@example.com"
                required
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="donorPhone" className="font-semibold">Phone Number *</Label>
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
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="font-semibold">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="1000"
                min="1"
                step="1"
                required
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="font-semibold">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RWF">RWF</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="font-semibold">Donation Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-Time</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="project-based">Project-Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="font-semibold">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select method" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="font-semibold">Payment Status *</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => setFormData({ ...formData, paymentStatus: value as "paid" | "unpaid" | "installment" })}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid (Pledge)</SelectItem>
                  <SelectItem value="paid">Paid (Confirmed)</SelectItem>
                  <SelectItem value="installment">Installment Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId" className="font-semibold">Specific Project (Optional)</Label>
              <Input
                id="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="Project name or ID"
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {(formData.paymentStatus === "unpaid" || formData.paymentStatus === "installment") && (
            <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10 transition-all">
              <Label htmlFor="paymentDeadline" className="font-semibold text-primary">Payment Deadline (Optional)</Label>
              <Input
                id="paymentDeadline"
                type="date"
                value={formData.paymentDeadline}
                onChange={(e) => setFormData({ ...formData, paymentDeadline: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-foreground/60">
                When do you plan to complete this payment? We'll send you a gentle reminder on this day.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message" className="font-semibold">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any special instructions or messages..."
              rows={3}
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground/70 border border-border">
            <p className="mb-2 font-bold flex items-center gap-1">
              <Zap className="w-4 h-4 text-primary" />
              Payment Instructions:
            </p>
            <p className="mb-2">
              After submitting, please make your payment:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 font-medium">
              <li>MTN MoMo: <span className="text-primary">*182*1*1*0782789883#</span> (Niyonkuru Simeon)</li>
              <li>Bank Transfer: Contact us for details</li>
              <li>Cash: Contact us to arrange a meeting</li>
            </ul>
            <p className="mt-2 text-xs italic">
              Confirmation receipt will be emailed once payment is verified.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-bold shadow-lg transition-all active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting Commitment...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2 fill-current" />
                Submit Donation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
