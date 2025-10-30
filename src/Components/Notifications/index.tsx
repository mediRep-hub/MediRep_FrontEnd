import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";

export default function Notification() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = [
    "New appointment booked",
    "Doctor updated profile",
    "Reminder: Meeting at 3 PM",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="w-12 h-12 cursor-pointer bg-primary rounded-full flex items-center justify-center relative"
      >
        <FaBell className="text-white text-[24px]" />
        {notifications.length > 0 && (
          <span className="absolute top-2.5 right-3.5 bg-red-500 text-white text-[10px] font-bold px-[4px] py-[4px] rounded-full">
            {/* {notifications.length} */}
          </span>
        )}
      </div>

      <div
        className={`absolute lg:left-1/2 left-0 lg:-translate-x-1/2 mt-2 w-64 bg-white shadow-xl rounded-xl overflow-hidden z-50 transform transition-all duration-300 ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-3 font-medium border-b-[3px] border-primary">
          Notifications
        </div>
        <ul className="max-h-60 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((note, i) => (
              <li key={i} className="p-3 text-sm hover:bg-gray-100 transition">
                {note}
              </li>
            ))
          ) : (
            <li className="p-3 text-sm text-gray-500">No notifications</li>
          )}
        </ul>
      </div>
    </div>
  );
}
