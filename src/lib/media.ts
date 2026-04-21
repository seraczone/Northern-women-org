import { supabase } from "@/lib/supabase";

export const MEDIA_BUCKET = "assets";

type StorageListItem = {
  name: string;
  created_at?: string;
  updated_at?: string;
  size?: number;
  metadata?: Record<string, unknown> | null;
};

export interface MediaFile {
  name: string;
  path: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  size: number | null;
  contentType: string | null;
}

const storage = supabase.storage.from(MEDIA_BUCKET);

export async function listMediaFiles() {
  const { data, error } = await storage.list("", {
    limit: 200,
  });

  if (error) {
    return {
      data: [] as MediaFile[],
      error,
    };
  }

  const files = (data ?? [])
    .filter((item) => item.name && !item.name.endsWith("/"))
    .map((item) => mapStorageItem(item as StorageListItem))
    .sort((left, right) => {
      const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
      const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
      return rightTime - leftTime;
    });

  return {
    data: files,
    error: null,
  };
}

export function normalizeFileName(input: string, fallbackName: string) {
  const source = input.trim() || fallbackName;
  const sourceParts = splitFileName(source);
  const fallbackParts = splitFileName(fallbackName);

  const baseName =
    sanitizeFileSegment(sourceParts.base) ||
    sanitizeFileSegment(fallbackParts.base) ||
    "media-file";
  const extension = sanitizeExtension(sourceParts.extension || fallbackParts.extension);

  return extension ? `${baseName}.${extension}` : baseName;
}

export function formatFileSize(bytes: number | null) {
  if (bytes === null) {
    return "Unknown size";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const rounded = value >= 10 ? value.toFixed(0) : value.toFixed(1);
  return `${rounded} ${units[unitIndex]}`;
}

function mapStorageItem(item: StorageListItem): MediaFile {
  const { data } = storage.getPublicUrl(item.name);

  return {
    name: item.name,
    path: item.name,
    url: data.publicUrl,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    size: getFileSize(item),
    contentType: getContentType(item),
  };
}

function splitFileName(name: string) {
  const dotIndex = name.lastIndexOf(".");

  if (dotIndex <= 0) {
    return {
      base: name,
      extension: "",
    };
  }

  return {
    base: name.slice(0, dotIndex),
    extension: name.slice(dotIndex + 1),
  };
}

function sanitizeFileSegment(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeExtension(value: string) {
  return value
    .trim()
    .replace(/^\./, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function getFileSize(item: StorageListItem) {
  if (typeof item.size === "number") {
    return item.size;
  }

  const metadataSize = item.metadata?.size;

  if (typeof metadataSize === "number") {
    return metadataSize;
  }

  if (typeof metadataSize === "string") {
    const parsed = Number(metadataSize);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function getContentType(item: StorageListItem) {
  const metadataMimetype = item.metadata?.mimetype;
  return typeof metadataMimetype === "string" ? metadataMimetype : null;
}
