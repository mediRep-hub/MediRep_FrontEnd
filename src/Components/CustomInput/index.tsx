import type { InputHTMLAttributes } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  placeholder?: string;
}

export default function CustomInput({
  className = "",
  label = "Enter text...",
  placeholder = "",
  ...props
}: CustomInputProps) {
  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-gray-500">
        {label}
      </label>
      <input
        {...props}
        placeholder={placeholder}
        className={`rounded-md w-full h-14 px-3 py-2 text-sm outline-none border-primary border-[0.5px] ${className}`}
      />
    </div>
  );
}
