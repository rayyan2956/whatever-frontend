import type { UploadPurpose, UploadUrl } from "@/api/types";
import { api, ApiError } from "./api";

// Direct-to-storage uploads: the API only hands out a presigned URL, the file
// goes straight from the browser to storage, and the returned key is then sent
// to the endpoint that uses it (e.g. PATCH /me with avatarKey).

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

// Same limits the API enforces, checked first so users get an instant message.
export function checkImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return "Choose a JPG, PNG or WebP image.";
  if (file.size > MAX_UPLOAD_BYTES) return "The image must be 10 MB or smaller.";
  return null;
}

export async function uploadFile(purpose: UploadPurpose, file: File): Promise<string> {
  const target = await api<UploadUrl>("/uploads", {
    method: "POST",
    body: { purpose, contentType: file.type, size: file.size },
  });
  let res: Response;
  try {
    res = await fetch(target.uploadUrl, { method: target.method, headers: target.headers, body: file });
  } catch {
    throw new ApiError(0, "UPLOAD_FAILED", "The upload didn't finish. Check your connection and try again.");
  }
  if (!res.ok) {
    throw new ApiError(res.status, "UPLOAD_FAILED", "The upload didn't finish. Please try again.");
  }
  return target.key;
}
