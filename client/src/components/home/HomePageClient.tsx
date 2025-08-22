"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicRoutes } from "@/constants/routes";
import UpcomingTours from "@/components/home/UpcomingTours";
import TopDestinations from "@/components/home/TopDestinations";
import TourCategories from "@/components/home/TourCategories";
import YatraBooking from "@/components/home/YatraBooking";
import HomeCarousel from "@/components/home/HomeCarousel";
import PlanTourSection from "@/components/home/PlanTourSection";
import HelpWidget from "@/components/home/HelpWidget";
import PlanMyTourModal from "@/components/home/PlanMyTourModal";
import SearchTourBar from "@/components/home/SearchTourBar";

const HomePageClient: React.FC = () => {
  const router = useRouter();
  const [openTourForm, setOpenTourForm] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary-500 text-white px-3 py-2 rounded"
      >
        Skip to main content
      </a>
      {/* Hero Section */}
      <section
        className="relative h-[70vh] md:h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/images/heroImage.png')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div
          className="relative z-10 text-center text-white px-4 md:px-8"
          aria-labelledby="home-hero-title"
        >
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[#F9A8D4] tracking-wider uppercase font-secondary">
            Best Destinations Around the World
          </h3>
          <h1
            id="home-hero-title"
            className="text-[30px] sm:text-[40px] md:text-[56px] leading-tight font-bold mt-2 font-primary text-white"
          >
            The World Awaits: Travel with Us
          </h1>
          <p className="text-sm md:text-lg mt-4 max-w-2xl mx-auto text-neutral-100">
            Manage the planning; focused on making memories. Our friendly team
            makes sure that everything is taken care of, helping you to have a
            hassle-free and delightful trip.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-[#C22A54] text-white rounded-full shadow-lg hover:bg-[#B81D48] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#C22A54]"
            onClick={() => router.push(PublicRoutes.ABOUT_US)}
            aria-label="Learn more about Dadhcih Bus Service"
          >
            Know More
          </button>
        </div>

        {/* Simplified Search Bar */}
        <div className="absolute -bottom-8 flex justify-center w-full px-4 md:px-8">
          <div className="bg-[#202542] bg-opacity-90 p-4 rounded-full flex items-center w-full max-w-lg">
            {/* Destination Input */}
            <div className="flex flex-col items-start relative flex-grow">
              <div className="flex items-center w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white absolute left-3 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h4l3 10h4l3-8h4"
                  />
                </svg>
                <SearchTourBar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-8 md:h-10 bg-[#1A1D2E]" aria-hidden="true"></div>

      <main id="main-content">
        {/* Upcoming Tours */}
        <UpcomingTours />

        {/* Top Destinations */}
        <TopDestinations />

        {/* Tour Categories */}
        <TourCategories />

        {/* Regions Section */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-[28px] md:text-[36px] font-bold mb-10 font-primary text-text-primary">
              Explore India by Region
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "North India",
                "South India",
                "West India",
                "East India",
                "North-East",
                "Central India",
              ].map((region, i) => (
                <span
                  key={i}
                  className="px-6 py-2 bg-[#C22A54]/10 text-[#7a1532] font-semibold rounded-full text-sm"
                  aria-label={`Explore tours in ${region}`}
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Yatra Booking */}
        <YatraBooking />

        {/* Plan Tour Section */}
        <PlanTourSection onOpenTourForm={() => setOpenTourForm(true)} />

        {/* Home Carousel */}
        <HomeCarousel />

        {/* Plan My Tour Modal */}
        <PlanMyTourModal
          open={openTourForm}
          onClose={() => setOpenTourForm(false)}
        />

        {/* Help Widget */}
        <HelpWidget />
      </main>
    </>
  );
};

export default HomePageClient;
