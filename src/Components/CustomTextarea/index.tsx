import type { TextareaHTMLAttributes } from "react";

interface CustomTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: string;
}

export default function CustomTextarea({
  className = "",
  label = "Enter text...",
  ...props
}: CustomTextareaProps) {
  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-[#7D7D7D]">
        {label}
      </label>
      <textarea
        {...props}
        className={`rounded-md w-full h-25 px-3 placeholder:text-[#7d7d7d] py-2 text-sm outline-none border-[#0755E9] border-[0.5px] ${className}`}
      />
    </div>
  );
}
