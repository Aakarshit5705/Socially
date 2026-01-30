"use client";

import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getNotifications } from "@/actions/notification.actions";

export default function NotificationBell() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setHasUnread(data.some(n => !n.read));
      } catch {}
    };

    fetchNotifications();
  }, []);

  return (
    <Link href="/notifications" className="relative flex items-center gap-2">
      {/* Bell icon */}
      <motion.div
        whileHover={{ rotate: [0, -8, 8, -6, 6, 0] }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <BellIcon className="h-4 w-4" />

        {/* Unread indicator */}
        {hasUnread && (
          <>
            {/* Glow dot */}
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />

            {/* Ping ripple */}
            <motion.span
              className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-emerald-400"
              animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </>
        )}
      </motion.div>

      <span className="hidden lg:inline">Notifications</span>
    </Link>
  );
}
