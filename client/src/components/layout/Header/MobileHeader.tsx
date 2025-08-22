"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PublicRoutes } from "@/constants/routes";

interface MobileHeaderProps {
  toggleMenu: () => void;
  menuOpen: boolean;
  mobileView: boolean;
  isLoggedIn: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  toggleMenu,
  menuOpen,
  mobileView,
  isLoggedIn,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      toggleMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    toggleMenu(); // Close the menu when a link is clicked
  };

  const isActive = useCallback(
    (route: string) => {
      return pathname === route;
    },
    [pathname]
  );

  const classname = (route: string, homeFlag?: boolean) => {
    const homeRoute = pathname === "/" || pathname === "";
    return `block p-3 hover:font-semibold active:font-semibold transition-colors rounded-lg hover:bg-neutral-100
                ${
                  isActive(route) || (homeFlag && homeRoute)
                    ? "font-semibold text-primary-500 bg-primary-50"
                    : "text-text-primary"
                }`;
  };

  return (
    <div
      ref={ref}
      className={`fixed top-[76px] right-0 max-w-[500px] w-[320px] md:w-[50vw] bg-surface-primary border border-neutral-200 rounded-l-lg shadow-xl p-4 transition-all duration-300 ease-in-out z-50 ${
        menuOpen
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-full pointer-events-none"
      }`}
      style={{
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
    >
      <div className="border-b border-primary-200 mb-4 pb-2">
        <div className="w-8 h-1 bg-primary-500 rounded-full mx-auto"></div>
      </div>

      <nav className="space-y-2">
        <Link
          href={PublicRoutes.HOME}
          className={classname(PublicRoutes.HOME, true)}
          onClick={handleLinkClick}
        >
          Home
        </Link>
        <Link
          href={PublicRoutes.TOURS}
          className={classname(PublicRoutes.TOURS)}
          onClick={handleLinkClick}
        >
          Tours
        </Link>
        <Link
          href={PublicRoutes.ABOUT_US}
          className={classname(PublicRoutes.ABOUT_US)}
          onClick={handleLinkClick}
        >
          About
        </Link>
        <Link
          href={PublicRoutes.SERVICES}
          className={classname(PublicRoutes.SERVICES)}
          onClick={handleLinkClick}
        >
          Services
        </Link>
        <Link
          href={PublicRoutes.FAQ}
          className={classname(PublicRoutes.FAQ)}
          onClick={handleLinkClick}
        >
          FAQ
        </Link>
        <Link
          href={PublicRoutes.CONTACT}
          className={classname(PublicRoutes.CONTACT)}
          onClick={handleLinkClick}
        >
          Contact
        </Link>

        {mobileView && (
          <button
            className="block w-full text-left p-3 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            onClick={() => {
              router.push(PublicRoutes.QUICK_INQUERY);
              handleLinkClick();
            }}
          >
            Inquiry Now
          </button>
        )}
      </nav>

      {mobileView && !isLoggedIn && (
        <div className="mt-6 pt-4 border-t border-neutral-200 space-y-3">
          <Link
            href={PublicRoutes.LOGIN}
            onClick={handleLinkClick}
            className="block w-full text-center px-4 py-2 rounded-lg border border-neutral-300 hover:border-primary-500 transition-colors text-text-primary hover:text-primary-500"
          >
            Sign In
          </Link>
          <Link
            href={PublicRoutes.SIGNUP}
            onClick={handleLinkClick}
            className="block w-full text-center bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};
