/**
 * Storage helpers for public image uploads.
 */
import { supabase } from "./supabase";

function sanitizeBaseName(filename = "image") {
  return filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";
}

export async function uploadPublicImage({ bucket, file, userId }) {
  if (!file) return null;

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeBaseName = sanitizeBaseName(file.name);
  const path = `${userId}/${Date.now()}-${safeBaseName}.${extension}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return {
    path,
    publicUrl: data.publicUrl,
  };
}
