import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface MultiSelectProps {
  options: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select doctors",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // select / deselect
  const handleSelect = (option: string) => {
    let newValue: string[];

    if (value.includes(option)) {
      newValue = value.filter((v) => v !== option);
    } else {
      newValue = [...value, option];
    }

    onChange?.(newValue);
  };

  return (
    <div className="relative w-full">
      {/* Label */}
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-gray-500">
        {placeholder}
      </label>

      {/* Input */}
      <div
        className="flex items-center h-14 justify-between px-4 py-2 border-primary border rounded-md bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex flex-wrap gap-2">
          {value.length > 0 ? (
            value.map((name, idx) => (
              <span
                key={idx}
                className="bg-primary text-white px-2 py-1 rounded-md text-xs"
              >
                {name}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </span>

        <IoIosArrowDown
          className={`transition-transform duration-200 text-primary ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute mt-1 w-full bg-[#E5EBF7] border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => handleSelect(option)}
                className="cursor-pointer"
              />
              <span>{option}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
