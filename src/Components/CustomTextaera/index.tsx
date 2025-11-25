interface CustomTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  className?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  height?: string;
  onValueChange?: (value: string) => void;
}

export default function CustomTextarea({
  className = "",
  label = "Enter text...",
  placeholder = "",
  height = "80px",
  value,
  onValueChange,
  ...props
}: CustomTextareaProps) {
  return (
    <div className="relative w-full leading-[0px]">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7D7D7D]">
        {label}
      </label>
      <textarea
        {...props}
        value={value}
        placeholder={placeholder}
        style={{ height }}
        className={`rounded-md w-full px-3 py-2 text-sm outline-none border-primary border-[0.5px] resize-none ${className}`}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
      />
    </div>
  );
}
