import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface SearchSelectionProps {
  options?: string[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function SearchSelection({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
}: SearchSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(value || null);

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <label className="absolute -top-3 left-5 bg-secondary rounded-md px-1 text-sm text-[#7d7d7d]">
        {placeholder}
      </label>
      <div
        className="flex items-center capitalize h-12 justify-between bg-secondary px-4 py-2 border-[0.5px] border-[#7d7d7d] rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-sm ${selected ? "text-heading" : "text-[#7d7d7d]"}`}
        >
          {selected || "Select the option"}
        </span>
        <IoIosArrowDown
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          } text-[#7d7d7d]`}
        />
      </div>
      {isOpen && options.length > 0 && (
        <ul className="absolute mt-1 w-full bg-[#E5EBF7] border border-gray-200 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
          {options.map((option, idx) => (
            <li
              key={idx}
              className={`px-4 py-2 text-sm cursor-pointer ${
                option === selected
                  ? "bg-primary text-white"
                  : "text-heading hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
