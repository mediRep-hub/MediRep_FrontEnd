import { TimePicker } from "antd";
import { IoTime } from "react-icons/io5";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";

interface CustomTimePickerProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string | null) => void;
}

export default function CustomTimePicker({
  placeholder = "Select Time",
  value,
  onChange,
}: CustomTimePickerProps) {
  const timeValue = value ? dayjs(value, "HH:mm") : null;

  const handleChange = (val: Dayjs | null) => {
    onChange?.(val ? val.format("HH:mm") : null);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* Default OK button color */
      .ant-picker-ok button {
        background-color: #e5e7eb !important; 
        color: #000 !important;
        border: none !important;
      }

      /* When time is selected */
      .time-selected .ant-picker-ok button {
        background-color: #0755E9 !important;
        color: #fff !important;
      }

      /* Placeholder color red */
      .custom-timepicker .ant-picker-input input::placeholder {
        color: #7d7d7d !important;
        opacity: 50% !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full relative">
      <label className="absolute -top-2 left-5 z-10 bg-white px-1 text-xs text-[#7D7D7D]">
        {placeholder}
      </label>
      <TimePicker
        value={timeValue}
        onChange={handleChange}
        format="HH:mm"
        suffixIcon={<IoTime size={20} className="text-primary" />}
        placeholder={placeholder}
        className="custom-timepicker rounded-md w-full h-14 px-3 py-2 text-sm text-heading outline-none border-primary border-[0.5px]"
      />
    </div>
  );
}
