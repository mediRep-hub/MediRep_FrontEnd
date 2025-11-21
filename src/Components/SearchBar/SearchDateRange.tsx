import { useEffect, useRef, useState } from "react";

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

    // Validation: End date cannot be earlier than start date
    if (
      updated.start &&
      updated.end &&
      new Date(updated.end) < new Date(updated.start)
    ) {
      alert("End date cannot be earlier than start date");
      return;
    }

    setRange(updated);
    onChange?.(updated);
  };

  const selected = range.start && range.end;

  return (
    <div className="relative w-full" ref={divRef}>
      <label className="absolute -top-3 left-5 bg-secondary px-1 text-sm text-gray-500">
        Select Date
      </label>
      <div
        className="flex items-center h-12 justify-between bg-secondary px-4 py-2 border-[0.5px] border-[#7d7d7d] rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-sm ${selected ? "text-heading" : "text-gray-400"}`}
        >
          {selected ? `${range.start}   →  ${range.end}` : "Select Range"}
        </span>
      </div>
      {isOpen && (
        <div className="absolute mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg w-full z-50">
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
              <label className="text-xs text-gray-500">End Date</label>
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
