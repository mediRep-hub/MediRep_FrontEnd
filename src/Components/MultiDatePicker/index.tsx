import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { FaCalendar } from "react-icons/fa";

const { RangePicker } = DatePicker;

interface MultiDatePickerProps
  extends Omit<RangePickerProps, "onChange" | "value" | "placeholder"> {
  className?: string;
  label?: string;
  placeholder?: string;
  value?: [Dayjs | null, Dayjs | null];
  onChange?: (dates: [Dayjs | null, Dayjs | null]) => void;
}

export default function MultiDatePicker({
  className = "",
  label = "Select Date Range",
  placeholder = "Pick two dates",
  value = [null, null],
  onChange,
  ...props
}: MultiDatePickerProps) {
  const [selectedRange, setSelectedRange] =
    useState<[Dayjs | null, Dayjs | null]>(value);
  const [open, setOpen] = useState(false);

  const handleChange: RangePickerProps["onChange"] = (dates) => {
    if (!dates) return;

    setSelectedRange(dates as [Dayjs | null, Dayjs | null]);
    if (onChange) onChange(dates as [Dayjs | null, Dayjs | null]);
  };

  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 z-10 bg-white px-1 text-xs text-gray-500">
        {label}
      </label>
      <div
        className={`flex items-center h-14 px-3 py-2 border-primary border-[0.5px] rounded-md bg-white cursor-pointer ${className}`}
        onClick={() => setOpen(true)}
      >
        <span className="text-xs flex flex-wrap gap-2">
          {selectedRange[0] && selectedRange[1] ? (
            <>
              <span className="text-white text-xs bg-primary px-2 py-1 rounded-md">
                {selectedRange[0]?.format("YYYY-MM-DD")}
              </span>
              <span className="text-white text-xs bg-primary px-2 py-1 rounded-md">
                {selectedRange[1]?.format("YYYY-MM-DD")}
              </span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>

        <FaCalendar
          className="text-primary"
          style={{ fontSize: "22px", marginLeft: "auto" }}
        />
      </div>
      <RangePicker
        {...props}
        open={open}
        onOpenChange={(o) => setOpen(o)}
        format="YYYY-MM-DD"
        onChange={handleChange}
        style={{
          position: "absolute",
          top: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
