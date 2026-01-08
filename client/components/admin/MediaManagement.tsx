import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload } from "lucide-react";

export default function MediaManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ImageIcon className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Media Management</h2>
          <p className="text-foreground/70">Upload and manage media files</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>Upload images, videos, and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-foreground/50" />
            <p className="text-foreground/70 mb-4">Drag and drop files here or click to browse</p>
            <Button>Select Files</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>All uploaded media files</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/50 text-center py-8">Media library coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
