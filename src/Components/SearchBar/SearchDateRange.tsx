import { useEffect, useRef, useState } from "react";
import { notifyError } from "../Toast";
import { LuSearch } from "react-icons/lu";

export default function SearchDateRange({ onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState({ start: "", end: "" });
  const divRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const updated = { ...range, [name]: value };

    if (
      updated.start &&
      updated.end &&
      new Date(updated.end) < new Date(updated.start)
    ) {
      notifyError("End date cannot be earlier than start date");
      return;
    }

    setRange(updated);
    onChange?.(updated);
  };

  const selected = range.start && range.end;

  return (
    <div
      className="w-full md:w-[250px] relative flex items-center"
      ref={divRef}
    >
      <p className="bg-secondary font-medium px-1 text-sm text-[#131313]">
        Date:
      </p>
      <div
        className="flex items-center w-full md:w-[200px] h-10 gap-2 bg-secondary px-2 py-2 border-[0.5px] border-[#0755E9] rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LuSearch className="text-[#7d7d7d]" size={16} />
        <span
          className={`text-sm ${selected ? "text-heading" : "text-gray-400"}`}
        >
          {selected ? `${range.start}   →  ${range.end}` : "Select Range"}
        </span>
      </div>
      {isOpen && (
        <div className="absolute mt-1 top-[40px] p-3 bg-white border border-gray-300 rounded-md shadow-lg w-full z-50">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500">Start Date</label>
              <input
                type="date"
                name="start"
                value={range.start}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-[#7d7d7d]">End Date</label>
              <input
                type="date"
                name="end"
                value={range.end}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
