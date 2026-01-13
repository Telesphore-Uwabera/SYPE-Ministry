// Document Upload Component for Admin Panel
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  value?: string;
  onChange: (url: string) => void;
  category?: string;
  label?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export default function DocumentUpload({
  value,
  onChange,
  category = "books",
  label = "Upload Document",
  className = "",
  accept = ".pdf",
  maxSize = 200, // 200MB default
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(value ? "Current file" : null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (accept.includes(".pdf") && file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    // Upload file
    setUploading(true);
    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/upload/media?category=${category}&type=document`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
      setFileName(file.name);
      toast({
        title: "Upload successful",
        description: "Document uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      setFileName(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setFileName(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      {value && fileName ? (
        <div className="relative group">
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                  <p className="text-xs text-foreground/60 truncate">{value}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-foreground/70">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-8 h-8 text-foreground/40" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-foreground/60">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-foreground/50 mt-1">
                  PDF up to {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
