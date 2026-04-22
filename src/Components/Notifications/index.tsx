import { onMessage } from "firebase/messaging";
import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { messaging } from "../../firebase";
import { Icon } from "@iconify/react";
import { notifyInfo } from "../Toast";
import { getAllCamps } from "../../api/campsServices";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

interface NotificationType {
  id: string;
  title: string;
  message: string;
  read: boolean;
  removing?: boolean;
}

export default function Notification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { refetch } = useQuery<AxiosResponse<any>>({
    queryKey: ["getAllCamps"],
    queryFn: () => getAllCamps(),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (previous) => previous,
  });

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const title = payload.notification?.title ?? payload.data?.title;
      const body = payload.notification?.body ?? payload.data?.body ?? "";

      if (!title) return;

      const newNotification: NotificationType = {
        id: Date.now().toString(),
        title,
        message: body,
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      notifyInfo(`${title}: ${body}`);

      // ✅ 🔥 Refetch when notification arrives
      refetch();
    });

    return () => {
      unsubscribe();
    };
  }, [refetch]);

  // ── Click outside listener ───────────────────────────────────
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

  // ── Handlers ─────────────────────────────────────────────────
  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, removing: true } : n)),
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // ── UI ────────────────────────────────────────────────────────
  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 🔔 Bell */}
      <div
        onClick={handleOpen}
        className="w-8 h-8 cursor-pointer bg-[#0755E9] rounded-full flex items-center justify-center relative"
      >
        <FaBell className="text-white text-[16px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown */}
      <div
        className={`absolute lg:left-1/2 left-0 lg:-translate-x-1/2 mt-2 md:w-98 w-[320px] bg-white shadow-xl rounded-xl overflow-hidden z-50 transition-all duration-300 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="p-3 font-medium border-b flex items-center justify-between">
          <span>
            Notifications{" "}
            {unreadCount > 0 && (
              <span className="text-xs text-white bg-[#0755E9] rounded-full px-2 py-0.5 ml-1">
                {unreadCount} new
              </span>
            )}
          </span>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-red-500 transition"
            >
              Clear all
            </button>
          )}
        </div>

        {/* List */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-80">
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <div
                key={note.id}
                className={`p-3 flex justify-between text-sm rounded-md border transition-all duration-300 ${
                  note.removing
                    ? "opacity-0 translate-x-10"
                    : note.read
                      ? "bg-[#f7f7f7]"
                      : "bg-[#EAF0FF] border-[#0755E9]"
                }`}
              >
                <div className="flex-1 pr-2">
                  <p className="font-medium">{note.title}</p>
                  <p className="text-xs text-gray-600">{note.message}</p>
                </div>
                <button
                  onClick={() => removeNotification(note.id)}
                  className="text-gray-400 hover:text-red-500 transition shrink-0"
                >
                  <Icon icon="eva:close-fill" className="text-lg" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-500 py-4">
              No notifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
