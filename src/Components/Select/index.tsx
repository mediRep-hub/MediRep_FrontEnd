import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface CustomSelectProps {
  options?: string[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  firstSelected?: boolean;
}

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  firstSelected = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(value || null);
  useEffect(() => {
    setSelected(value || null);
  }, [value]);

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
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7D7D7D]">
        {placeholder}
      </label>
      <div
        className="flex items-center h-14 justify-between bg-white px-4 py-2 border-[0.5px] border-primary rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-sm ${selected ? "text-heading" : "text-[#7d7d7d]"}`}
        >
          {selected || "Select the Options"}
        </span>
        <IoIosArrowDown
          className={`transition-transform duration-200 text-primary ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {isOpen && options.length > 0 && (
        <ul
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="absolute mt-1 w-full bg-[#E5EBF7] border border-gray-200 rounded-md shadow-xl z-10 max-h-60 overflow-y-auto"
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-4 flex items-center h-[56px] text-sm cursor-pointer ${
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
