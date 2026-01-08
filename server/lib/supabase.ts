// Supabase Client Configuration
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️  Supabase environment variables are not set. Please configure SUPABASE_URL and SUPABASE_ANON_KEY in your .env file"
  );
}

// Client for public operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (uses service role key)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Storage bucket names
export const STORAGE_BUCKETS = {
  IMAGES: "images",
  VIDEOS: "videos",
  DOCUMENTS: "documents",
} as const;

// Helper function to upload file to Supabase Storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Buffer,
  options?: {
    contentType?: string;
    upsert?: boolean;
  }
) {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured");
  }

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert || false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return {
    path: data.path,
    url: publicUrl,
  };
}

// Helper function to delete file from Supabase Storage
export async function deleteFile(bucket: string, path: string) {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured");
  }

  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

  if (error) {
    throw error;
  }
}

// Helper function to get public URL
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
