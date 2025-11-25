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
  placeholder = "Select options",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    let newValue: string[];
    if (value.includes(option)) {
      newValue = value.filter((item) => item !== option);
    } else {
      newValue = [...value, option];
    }
    if (onChange) onChange(newValue);
  };

  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
        {placeholder}
      </label>
      <div
        className="flex items-center min-h-[56px] justify-between px-4 py-2 border-primary border-[0.5px] rounded-md bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex flex-wrap items-center gap-2">
          {value.length > 0 ? (
            <>
              {value.map((val, idx) => (
                <span
                  key={idx}
                  className="bg-primary text-white px-2 py-1 rounded-md text-xs mr-1"
                >
                  {val}
                </span>
              ))}
            </>
          ) : (
            <span className="text-[#7d7d7d] text-sm">Select options</span>
          )}
        </span>

        <IoIosArrowDown
          className={` min-w-[16px] transition-transform duration-200 text-primary ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {isOpen && (
        <ul className="absolute mt-1 w-full bg-[#E5EBF7] border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option, index) => {
            const selected = value.includes(option);
            return (
              <li
                key={index}
                className="px-4 py-2 text-sm cursor-pointer flex items-center gap-2  text-heading hover:bg-gray-100 "
                onClick={() => handleSelect(option)}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  readOnly
                  className="cursor-pointer"
                />
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
