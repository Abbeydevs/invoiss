"use client";

import { useState } from "react";
import { Loader2, Upload, X, Check } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (isLoading) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setIsLoading(true);

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
    } catch (error) {
      console.error(error);
      onChange("");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="relative">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() =>
          !isLoading && document.getElementById("logo-upload")?.click()
        }
        className={`
          relative group cursor-pointer overflow-hidden
          rounded-2xl border-2 transition-all duration-300
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
              : value
                ? "border-gray-200 hover:border-gray-300 bg-linear-to-br from-gray-50 to-white"
                : "border-dashed border-gray-300 hover:border-blue-400 bg-linear-to-br from-blue-50/30 to-white"
          }
          ${isLoading ? "pointer-events-none" : ""}
        `}
      >
        <Input
          id="logo-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInput}
          className="hidden"
        />

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium text-gray-700">
              Uploading logo...
            </p>
            <p className="text-xs text-gray-500 mt-1">Please wait</p>
          </div>
        )}

        {value ? (
          <div className="relative p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-white shadow-lg ring-1 ring-gray-200">
                  <Image
                    src={value}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-4"
                    width="100"
                    height="100"
                  />
                </div>

                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                  <Check className="h-4 w-4" />
                </div>

                <Button
                  onClick={removeImage}
                  className="absolute -bottom-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-sm font-medium text-gray-700">
                  Click or drag to replace
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div
                  className={`
                  rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 p-5 shadow-lg
                  transition-all duration-300
                  ${isDragActive ? "scale-110 shadow-blue-300" : "group-hover:scale-105"}
                `}
                >
                  <Upload className="h-10 w-10 text-white" />
                </div>

                {isDragActive && (
                  <div className="absolute inset-0 rounded-2xl bg-blue-400 animate-ping opacity-75"></div>
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-base font-semibold text-gray-800">
                  {isDragActive ? "Drop your logo here" : "Upload company logo"}
                </p>
                <p className="text-sm text-gray-600">
                  Drag and drop or{" "}
                  <span className="text-blue-600 font-medium">
                    browse files
                  </span>
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    PNG
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    JPG
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    JPEG
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!value && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Recommended: Square logo, at least 400x400px
        </p>
      )}
    </div>
  );
}
