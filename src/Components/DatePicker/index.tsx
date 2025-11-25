import { DatePicker as AntDatePicker } from "antd";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";
import { FaCalendar } from "react-icons/fa";

interface CustomDatePickerProps extends DatePickerProps {
  className?: string;
  label?: string;
  placeholder?: string;
}

export default function DatePicker({
  className = "",
  label = "Select Date",
  placeholder = "Pick a date",
  ...props
}: CustomDatePickerProps) {
  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 z-10 bg-white px-1 text-xs text-[#7D7D7D]">
        {label}
      </label>

      <AntDatePicker
        {...props}
        placeholder={placeholder}
        className={`rounded-md w-full h-14 px-3 py-2 text-sm border-primary border-[0.5px] ${className}`}
        style={{ height: "56px", width: "100%" }}
        format="YYYY-MM-DD"
        defaultValue={dayjs()}
        suffixIcon={
          <FaCalendar
            className="text-primary"
            style={{ fontSize: "22px", cursor: "pointer" }}
          />
        }
      />
    </div>
  );
}
