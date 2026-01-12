import { Icon } from "@iconify/react";
import { useState } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

interface MonthYearPickerProps {
  value: { month: string; year: number };
  onChange: (val: { month: string; year: number }) => void;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleMonthChange = (month: string) => {
    onChange({ ...value, month });
  };

  const handleYearChange = (year: number) => {
    onChange({ ...value, year });
  };

  return (
    <div className="relative inline-block w-full h-10 lg:w-45">
      <div
        className="flex items-center justify-between px-3 py-2 text-sm text-[#131313] border border-[#0755E9] rounded-lg cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <Icon icon="mdi:calendar" width={20} height={20} color="#0755E9" />
          <span>{`${value.month}-${value.year}`}</span>
        </div>
        <Icon
          icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
          width={20}
          height={20}
        />
      </div>

      {open && (
        <div className="absolute z-50 flex w-full gap-2 p-3 mt-1 text-xs bg-[#E5EBF7] rounded shadow-lg">
          <select
            className="flex-1 p-1 border border-[#0755E9] rounded"
            value={value.month}
            onChange={(e) => handleMonthChange(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="flex-1 p-1 border-[#0755E9] border rounded"
            value={value.year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
