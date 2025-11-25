import React, { useState, useRef, useEffect } from "react";
import { RiFolderUploadFill } from "react-icons/ri";
import { uploadFile } from "../../api/uploadServices";

interface ImagePickerProps {
  label?: string;
  className?: string;
  placeholder?: string;
  fileType?: string;
  type?: "image" | "file" | "both";
  value?: string | null;
  onChange?: (url: string) => void;
}

export default function ImagePicker({
  label = "",
  className = "",
  placeholder = "Choose a file",
  fileType = "images",
  type = "image",
  value = "",
  onChange,
}: ImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!userSelected) {
      if (value) {
        setPreview(value);
        try {
          const extractedName = value.split("/").pop() || "uploaded_file";
          setFileName(extractedName);
        } catch {
          setFileName("uploaded_file");
        }
      } else {
        setPreview(null);
        setFileName(null);
      }
    }
  }, [value, userSelected]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUserSelected(true);
    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
    } else {
      setPreview(null);
    }

    try {
      setUploading(true);
      const response = await uploadFile(file, fileType);
      const uploadedUrl = response.data?.url;

      if (uploadedUrl) {
        setPreview(uploadedUrl);
        onChange?.(uploadedUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      setTimeout(() => setUserSelected(false), 500);
    }
  };

  const handleClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const getAcceptType = () => {
    if (type === "image") return "image/*";
    if (type === "file") return ".pdf,.doc,.docx,.xls,.xlsx,.txt";
    return "*/*";
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="absolute -top-2 left-5 z-9 bg-white px-1 text-xs text-[#7D7D7D]">
          {label}
        </label>
      )}

      <div
        className={`rounded-md w-full h-14 px-3 py-2 flex items-center justify-between border-primary border-[0.5px] cursor-pointer transition-all duration-200 ${
          uploading ? "opacity-80 cursor-not-allowed" : ""
        } ${className}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-[#7D7D7D]">Uploading...</span>
            </div>
          ) : preview && type !== "file" ? (
            <div className="flex items-center gap-3">
              <img
                src={preview}
                alt="Preview"
                className="h-10 w-10 object-cover rounded-md"
              />
              {fileName && (
                <span className="text-sm text-heading truncate lg:max-w-[300px] max-w-[180px]">
                  {fileName}
                </span>
              )}
            </div>
          ) : fileName ? (
            <span className="text-sm text-heading truncate lg:max-w-[300px] max-w-[180px]">
              {fileName}
            </span>
          ) : (
            <span className="text-[#7d7d7d] text-sm">{placeholder}</span>
          )}
        </div>

        {!uploading && (
          <RiFolderUploadFill size={22} className="text-primary" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptType()}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
