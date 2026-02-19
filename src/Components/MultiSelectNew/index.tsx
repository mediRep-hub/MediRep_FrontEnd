import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface SelectedOption {
  label: string;
  amount: number;
}

interface MultiSelectProps {
  options: string[];
  value?: SelectedOption[];
  onChange?: (value: SelectedOption[]) => void;
  placeholder?: string;
}

export default function MultiSelectNew({
  options,
  value = [],
  onChange,
  placeholder = "Select The Options",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const exists = value.find((v) => v.label === option);
    const newValue = exists
      ? value.filter((v) => v.label !== option)
      : [...value, { label: option, amount: 0 }];
    onChange?.(newValue);
  };

  const updateAmount = (option: string, amountStr: string) => {
    const amount = amountStr === "" ? 0 : Number(amountStr);
    const newValue = value.map((v) =>
      v.label === option ? { ...v, amount } : v,
    );
    onChange?.(newValue);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7d7d7d]">
        {placeholder}
      </label>

      <div
        className="flex items-center min-h-14 justify-between px-4 py-2 border-[#0755E9] border rounded-md bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {value.length > 0 ? (
            value.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs text-white rounded-md bg-[#0755E9]"
              >
                {item.label}: {item.amount}
              </span>
            ))
          ) : (
            <span className="text-[#7d7d7d] text-sm">Select options</span>
          )}
        </div>
        <IoIosArrowDown
          className={`transition-transform text-[#0755E9] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-[#E5EBF7] rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option, idx) => {
            const selected = value.find((v) => v.label === option);

            return (
              <li
                key={idx}
                className="flex items-center justify-between gap-2 px-4 py-2 text-sm"
              >
                <div
                  className={`cursor-pointer ${
                    selected ? "text-[#0755E9]" : "text-[#131313]"
                  }`}
                  onClick={() => toggleOption(option)}
                >
                  {option}
                </div>
                {selected && (
                  <input
                    type="number"
                    value={selected.amount}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => updateAmount(option, e.target.value)}
                    className="w-20 px-2 py-1 text-sm border rounded-md border-[#7d7d7d]/48 focus:outline-0"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
