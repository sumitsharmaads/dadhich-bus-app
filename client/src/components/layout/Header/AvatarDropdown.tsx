"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PublicRoutes } from "@/constants/routes";
import { useAuth } from "@/contexts/AuthContextProvider";
import User from "@/utils/User";
import Image from "next/image";

interface AvatarDropdownProps {
  isMobile?: boolean;
}

export const AvatarDropdown: React.FC<AvatarDropdownProps> = ({
  isMobile = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, state: user, isAdmin } = useAuth();

  const handleLogOut = async () => {
    setIsOpen(false);
    logout();
  };

  const isActive = useCallback(
    (route: string) => {
      return pathname === route;
    },
    [pathname]
  );

  const classname = (route: string) => {
    return `block w-full text-left px-4 py-2 hover:bg-neutral-100 transition-colors rounded-lg
              ${
                isActive(route)
                  ? "font-semibold text-primary-500 bg-primary-50"
                  : "text-text-primary"
              }`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-neutral-100 transition-colors"
        aria-label="User menu"
      >
        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold border-2 border-neutral-200">
          {user?.fullname
            ? user.fullname
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "U"}
        </div>
        <svg
          className={`w-4 h-4 text-text-secondary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            isMobile ? "right-0" : "right-0"
          } mt-2 w-48 bg-surface-primary border border-neutral-200 rounded-lg shadow-lg py-2 z-50`}
        >
          <Link
            href={PublicRoutes.PROFILE}
            className={classname(PublicRoutes.PROFILE)}
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={classname("/admin")}
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}

          <div className="border-t border-neutral-200 my-2"></div>

          <button
            onClick={handleLogOut}
            className="block w-full text-left px-4 py-2 text-error-600 hover:bg-error-50 transition-colors rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
