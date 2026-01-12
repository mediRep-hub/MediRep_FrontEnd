import { TimePicker as AntTimePicker } from "antd";
import type { TimePickerProps } from "antd";
import dayjs from "dayjs";
import { FaClock } from "react-icons/fa";

interface CustomTimePickerProps extends TimePickerProps {
  className?: string;
  label?: string;
  placeholder?: string;
}

export default function TimePicker({
  className = "",
  label = "Select Time",
  placeholder = "Pick a time",
  ...props
}: CustomTimePickerProps) {
  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 z-10 bg-white px-1 text-xs text-[#7D7D7D]">
        {label}
      </label>

      <AntTimePicker
        {...props}
        placeholder={placeholder}
        className={`custom-timepicker rounded-md w-full h-14 px-3 py-2 text-sm ${className}`}
        style={{
          height: "56px",
          width: "100%",
          border: "1px solid #0755E9",
          boxShadow: "none",
        }}
        defaultValue={dayjs()}
        suffixIcon={
          <FaClock
            className="text-[#0755E9]"
            style={{ fontSize: "22px", cursor: "pointer" }}
          />
        }
      />
    </div>
  );
}
