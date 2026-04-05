"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function CoverImageUpload({ value, onChange }: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with external value
  useEffect(() => {
    setPreview(value);
  }, [value]);

  const compressAndUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Optimizing and uploading image...");

    try {
      // 1. Client-side Compression & WebP Conversion
      const webpBlob = await compressImageToWebP(file);
      
      // 2. Upload to Supabase
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
      const filePath = `covers/${fileName}`;

      const { data, error } = await supabase.storage
        .from("skill-covers")
        .upload(filePath, webpBlob, {
          contentType: "image/webp",
          upsert: true,
        });

      if (error) throw error;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("skill-covers")
        .getPublicUrl(filePath);

      onChange(publicUrl);
      setPreview(publicUrl);
      toast.success("Image uploaded and optimized!", { id: loadingToast });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const compressImageToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200; // Good for HD but efficient
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Failed to get canvas context"));

          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as WebP with 80% quality
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Canvas toBlob failed"));
            },
            "image/webp",
            0.8
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          await compressAndUpload(file);
          break;
        }
      }
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await compressAndUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        COVER IMAGE (PASTE OR UPLOAD)
      </label>
      
      <div
        onPaste={handlePaste}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex aspect-[16/8] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted transition-all hover:border-primary/50 hover:bg-muted/80 ${
          uploading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {preview ? (
          <div className="relative h-full w-full p-2">
            <img
              src={preview}
              alt="Cover Preview"
              className="h-full w-full rounded object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100 rounded">
              <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                CHANGE
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="rounded-full border-2 border-border p-2">
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-wide">CLICK OR PASTE</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                OPTIMIZING...
              </span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {preview && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
            setPreview("");
          }}
          className="self-start text-[10px] font-bold text-destructive hover:underline"
        >
          REMOVE IMAGE
        </button>
      )}
    </div>
  );
}
