import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Plus } from "lucide-react";

export default function Communication() {
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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

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
