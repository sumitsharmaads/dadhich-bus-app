"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PublicRoutes } from "@/constants/routes";
import { MobileHeader } from "./MobileHeader";
import { AvatarDropdown } from "./AvatarDropdown";
import { useAuth } from "@/contexts/AuthContextProvider";
import Image from "next/image";
import { useWebsite } from "@/contexts/WebsiteProvider";

export const Header: React.FC = () => {
  const { websiteInfo } = useWebsite();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewPort, setViewPort] = useState({
    mobileView: false,
    tabView: false,
  });

  const handleViewPort = (screenWidth: number) => {
    if (screenWidth <= 560) {
      setViewPort({
        mobileView: true,
        tabView: false,
      });
    } else if (screenWidth <= 780) {
      setViewPort({
        mobileView: false,
        tabView: true,
      });
    } else {
      setViewPort({
        mobileView: false,
        tabView: false,
      });
    }
  };

  useEffect(() => {
    const innerWidth = window.innerWidth;
    handleViewPort(innerWidth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const currentScreenSize = window.innerWidth;
      handleViewPort(currentScreenSize);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const isActive = useCallback(
    (route: string) => {
      return pathname === route;
    },
    [pathname]
  );

  const classname = (route: string, homeFlag?: boolean) => {
    const homeRoute = pathname === "/" || pathname === "";
    return `relative inline-block font-primary capitalize hover:font-semibold active:font-semibold transition-all duration-200
              ${
                isActive(route) || (homeFlag && homeRoute)
                  ? "font-semibold text-primary-500"
                  : "text-text-primary hover:text-primary-500"
              }`;
  };

  const { isAuthenticated, state: user, isAdmin } = useAuth();

  // Check if current page is admin page
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <header className="p-4 flex justify-between items-center bg-surface-primary border-b border-neutral-200 sticky top-0 z-40 backdrop-blur-sm">
      <div className="flex items-center">
        <div className="w-[50px] md:w-[60px] flex items-center">
          <Link href={PublicRoutes.HOME}>
            <Image
              src={websiteInfo?.branding?.logo?.url || "/images/logo.png"}
              alt="Logo"
              width={60}
              height={52}
              className="h-[52px] object-cover"
              priority
            />
          </Link>
        </div>
      </div>

      {!viewPort.mobileView && !viewPort.tabView && !isAdminPage && (
        <nav className="flex space-x-6">
          <Link
            href={PublicRoutes.HOME}
            className={classname(PublicRoutes.HOME, true)}
          >
            Home
          </Link>
          <Link
            href={PublicRoutes.TOURS}
            className={classname(PublicRoutes.TOURS)}
          >
            Tours
          </Link>
          <Link
            href={PublicRoutes.ABOUT_US}
            className={classname(PublicRoutes.ABOUT_US)}
          >
            About
          </Link>
          <Link
            href={PublicRoutes.SERVICES}
            className={classname(PublicRoutes.SERVICES)}
          >
            Services
          </Link>
          <Link href={PublicRoutes.FAQ} className={classname(PublicRoutes.FAQ)}>
            FAQ
          </Link>
          <Link
            href={PublicRoutes.CONTACT}
            className={classname(PublicRoutes.CONTACT)}
          >
            Contact
          </Link>
        </nav>
      )}

      {/* Admin Page Title */}
      {isAdminPage && (
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-primary-500">
            Dadhich Bus Service - Admin
          </h1>
        </div>
      )}

      <div className="flex items-center space-x-4">
        {viewPort.mobileView && isAuthenticated && <AvatarDropdown />}
        {!viewPort.mobileView && (
          <>
            {isAuthenticated ? (
              <AvatarDropdown />
            ) : (
              <>
                <Link
                  href={PublicRoutes.LOGIN}
                  className="px-4 py-2 rounded border border-neutral-300 hover:border-primary-500 transition-colors text-text-primary hover:text-primary-500"
                >
                  Sign In
                </Link>
                <Link
                  href={PublicRoutes.SIGNUP}
                  className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </>
        )}
        {!viewPort.mobileView && !isAdminPage && (
          <span className="w-px h-6 bg-neutral-300"></span>
        )}
        {!viewPort.mobileView && !isAdminPage && (
          <button
            className="text-primary-500 hover:text-primary-600 hover:underline transition-colors"
            onClick={() => router.push(PublicRoutes.QUICK_INQUERY)}
          >
            Inquiry Now
          </button>
        )}
        {(viewPort.tabView || viewPort.mobileView) && !isAdminPage && (
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="focus:outline-none p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 text-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        )}
      </div>
      {menuOpen &&
        (viewPort.mobileView || viewPort.tabView) &&
        !isAdminPage && (
          <MobileHeader
            toggleMenu={toggleMenu}
            menuOpen={menuOpen}
            mobileView={viewPort.mobileView}
            isLoggedIn={isAuthenticated}
          />
        )}
    </header>
  );
};
