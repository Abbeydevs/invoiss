"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import NextImage from "next/image";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (isLoading) return;
    setIsLoading(true);

    const file = acceptedFiles[0];
    if (!file) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/upload", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to get upload signature");
      }
      const data = await response.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", data.apiKey);
      formData.append("signature", data.signature);
      formData.append("timestamp", data.timestamp);
      formData.append("folder", data.folder);
      formData.append("upload_preset", "invoiss_preset");

      const uploadUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();

      onChange(uploadData.secure_url);
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
      }`}
    >
      <input {...getInputProps()} />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {value ? (
        <div className="space-y-4">
          <NextImage
            src={value}
            alt="Uploaded logo"
            width={128}
            height={128}
            className="mx-auto h-32 w-32 object-contain rounded-lg"
          />
          <p className="text-sm text-gray-500">
            Drag & drop or click to replace
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="font-semibold text-gray-700">
            Upload your company logo
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, or JPEG</p>
        </div>
      )}
    </div>
  );
}
