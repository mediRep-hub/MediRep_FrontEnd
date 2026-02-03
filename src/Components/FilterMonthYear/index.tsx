import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { DateRange } from "react-date-range";
import type { Range, RangeKeyDict } from "react-date-range";
import { addDays, format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangePickerProps {
  value?: { startDate: Date; endDate: Date };
  onChange?: (range: { startDate: Date; endDate: Date }) => void;
}

export const MonthYearPicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const [range, setRange] = useState<Range>({
    startDate: value?.startDate ?? new Date(),
    endDate: value?.endDate ?? addDays(new Date(), 7),
    key: "selection",
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    setRange(selection);
    onChange?.({
      startDate: selection.startDate!,
      endDate: selection.endDate!,
    });
  };

  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full lg:w-[190px]">
      <div
        className="flex items-center justify-between px-3 py-2 text-sm border border-[#0755E9] rounded-lg cursor-pointer bg-secondary"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:calendar-clock"
            width={20}
            height={20}
            color="#0755E9"
          />
          <span className="text-[#131313]">
            {format(range.startDate!, "MMM-dd")} →{" "}
            {format(range.endDate!, "MMM-dd")}
          </span>
        </div>

        <Icon
          icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
          width={20}
          height={20}
          color="#0755E9"
        />
      </div>
      {open && isMobile && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="bg-white w-full rounded-t-xl p-3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-sm">Select Date Range</p>
              <Icon
                icon="material-symbols:close-rounded"
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            <DateRange
              ranges={[range]}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              months={1}
              direction="vertical"
              editableDateInputs={false}
            />
          </div>
        </div>
      )}
      {open && !isMobile && (
        <div className="absolute z-50 mt-2 shadow-xl rounded-lg overflow-hidden">
          <DateRange
            ranges={[range]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            editableDateInputs={false}
          />
        </div>
      )}
    </div>
  );
};
