"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  disabled?: boolean;
}

interface CloudinaryResponse {
  secure_url?: string;
  url?: string;
  error?: { message?: string };
}

export function ImageUploader({
  value,
  onChange,
  max = 10,
  disabled = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const isConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  const handleFiles = async (files: FileList) => {
    if (!isConfigured) {
      toast.error("Image upload is not configured.");
      return;
    }
    const remaining = max - value.length;
    const picked = Array.from(files).slice(0, remaining);
    if (picked.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB.`);
        continue;
      }

      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd },
        );
        const body = (await res.json()) as CloudinaryResponse;
        const url = body.secure_url ?? body.url;
        if (!res.ok || !url) {
          toast.error(body.error?.message ?? "Upload failed");
          continue;
        }
        uploaded.push(url);
      } catch {
        toast.error("Upload failed. Please try again.");
      }
    }

    if (uploaded.length > 0) {
      onChange([...value, ...uploaded]);
      toast.success(
        uploaded.length === 1
          ? "Image uploaded"
          : `${uploaded.length} images uploaded`,
      );
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="group relative h-24 w-24 overflow-hidden rounded-md border-2 border-border"
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-danger text-surface opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            disabled={disabled || uploading || !isConfigured}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border-strong bg-surface-2/50 text-ink-muted transition-colors",
              "hover:border-ink hover:text-ink",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5" aria-hidden="true" />
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  Add
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) void handleFiles(e.target.files);
        }}
      />

      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>
          {value.length}/{max} images
        </span>
        {!isConfigured && (
          <span className="text-warning">
            Upload is disabled — add Cloudinary env vars
          </span>
        )}
      </div>

      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange([])}
          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}