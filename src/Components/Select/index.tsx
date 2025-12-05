import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface CustomSelectProps {
  options?: string[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
}: CustomSelectProps) {
  // generate unique ID for each dropdown instance
  const id = Math.random().toString(36).substring(2);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(value || null);

  useEffect(() => {
    setSelected(value || null);
  }, [value]);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail !== id) setIsOpen(false);
    };

    window.addEventListener("close-all-selects", handler);
    return () => window.removeEventListener("close-all-selects", handler);
  }, [id]);

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);

    if (next) {
      window.dispatchEvent(
        new CustomEvent("close-all-selects", { detail: id })
      );
    }
  };

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
        onClick={toggleOpen}
      >
        <span
          className={`text-sm capitalize ${
            selected ? "text-heading" : "text-[#7d7d7d]"
          }`}
        >
          {selected || "Select the Options"}
        </span>

        <IoIosArrowDown
          className={`transition-transform duration-200 text-primary ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-[#E5EBF7] border rounded-md shadow-xl z-[9999] max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-4 h-[56px] flex items-center cursor-pointer ${
                option === selected
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-heading"
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
