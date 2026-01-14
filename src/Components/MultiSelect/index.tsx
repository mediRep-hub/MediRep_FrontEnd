import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export interface SelectedOption {
  label: string;
  amount: number;
}

interface MultiSelectProps {
  options: SelectedOption[];
  value?: SelectedOption[];
  onChange?: (value: SelectedOption[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // handle select/deselect
  const handleSelect = (option: SelectedOption) => {
    let newValue: SelectedOption[];
    const exists = value.find((v) => v.label === option.label);

    if (exists) {
      // remove if already selected
      newValue = value.filter((v) => v.label !== option.label);
    } else {
      // add with default amount
      newValue = [...value, option];
    }
    onChange?.(newValue);
  };

  // handle amount change
  const handleAmountChange = (label: string, amount: number) => {
    const newValue = value.map((v) =>
      v.label === label ? { ...v, amount } : v
    );
    onChange?.(newValue);
  };

  // calculate total
  const totalAmount = value.reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-gray-500">
        {placeholder}
      </label>

      <div
        className="flex items-center h-14 justify-between px-4 py-2 border-primary border-[0.5px] rounded-md bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex flex-wrap gap-2">
          {value.length > 0 ? (
            value.map((val, idx) => (
              <span
                key={idx}
                className="bg-primary text-white px-2 py-1 rounded-md text-xs"
              >
                {val.label} ({val.amount})
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </span>

        <IoIosArrowDown
          className={`transition-transform duration-200 text-primary ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-[#E5EBF7] border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {options.map((option, index) => {
            const selected = !!value.find((v) => v.label === option.label);
            const selectedValue = value.find((v) => v.label === option.label);

            return (
              <li
                key={index}
                className="px-4 py-2 text-sm cursor-pointer flex items-center justify-between gap-2 text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleSelect(option)}
                    className="cursor-pointer"
                  />
                  <span>{option.label}</span>
                </div>

                {selected && (
                  <input
                    type="number"
                    min={0}
                    value={selectedValue?.amount || 0}
                    onChange={(e) =>
                      handleAmountChange(option.label, Number(e.target.value))
                    }
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                )}
              </li>
            );
          })}

          {/* Total at bottom */}
          {value.length > 0 && (
            <li className="px-4 py-2 text-sm font-semibold border-t mt-2">
              Total: {totalAmount}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
