"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header/Header";
import { Footer } from "./Footer";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 1.5; // 100vh + 50vh
      if (window.scrollY > scrollThreshold) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isClient]);

  const scrollToTop = () => {
    if (isClient) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle hash-based section scrolling (for internal navigation)
  useEffect(() => {
    if (!isClient) return;

    const hash = window.location.hash;
    if (hash) {
      const sectionElement = document.querySelector(hash);
      if (sectionElement) {
        setTimeout(() => {
          sectionElement.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, isClient]);

  // Check if current page is admin page
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen" id="mainContent">
      {/* Header with fixed positioning for admin pages */}
      <div className={isAdminPage ? "fixed top-0 left-0 right-0 z-50" : ""}>
        <Header />
      </div>

      {/* Main content with proper spacing for admin pages */}
      <main className={`flex-1 ${isAdminPage ? "bg-gray-50" : ""}`}>
        {children}
      </main>

      {!isAdminPage && <Footer />}

      {/* Scroll to Top Button */}
      {showScrollToTop && !isAdminPage && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-all duration-300 z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-6 w-6 group-hover:transform group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
