import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface SearchSelectionProps {
  options?: string[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  firstSelected?: boolean;
}

export default function SearchSelection({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  firstSelected = false,
}: SearchSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(value || null);
  useEffect(() => {
    if (firstSelected && options.length > 0 && !value) {
      setSelected(options[0]);
      onChange?.(options[0]);
    }
  }, [options, value, onChange, firstSelected]);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className="relative  w-full">
      <label className="absolute -top-3 left-5 bg-secondary  px-1 text-sm text-gray-500">
        {placeholder}
      </label>
      <div
        className="flex items-center h-12 justify-between bg-secondary px-4 py-2 border-[0.5px] border-[#7d7d7d]  rounded-md  cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-sm ${selected ? "text-gray-700" : "text-gray-400"}`}
        >
          {selected || "Select the Options"}
        </span>
        <IoIosArrowDown
          className={`transition-transform duration-200 text-[#7d7d7d] ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {isOpen && options.length > 0 && (
        <ul className="absolute mt-1 w-full bg-[#E5EBF7] border border-gray-200 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-4 py-2 text-sm cursor-pointer ${
                option === selected
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
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
