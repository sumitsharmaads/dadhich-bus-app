"use client";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { tourService } from "@/lib/api/services/tour.service";
import { DestinationData, StateBreakupItem } from "@/lib/api/types/tour.types";

// Static destination data with images
const destinations: Omit<DestinationData, "listings">[] = [
  {
    name: "Punjab",
    image: "/images/states/punjab.jpg",
    state: "Punjab",
  },
  {
    name: "Haryana",
    image: "/images/states/haryana.jpg",
    state: "Haryana",
  },
  {
    name: "Delhi",
    image: "/images/states/delhi.jpg",
    state: "Delhi",
  },
  {
    name: "Rajasthan",
    image: "/images/states/rajasthan.jpg",
    state: "Rajasthan",
  },
  {
    name: "Bihar",
    image: "/images/states/bihar.jpg",
    state: "Bihar",
  },
  {
    name: "Uttar Pradesh",
    image: "/images/states/uttar_pardesh.jpg",
    state: "Uttar Pradesh",
  },
  {
    name: "Paschim Bengal",
    image: "/images/states/pachim_bengal.jpg",
    state: "Paschim Bengal",
  },
  {
    name: "Uttrakhand",
    image: "/images/states/uttrakhand.jpg",
    state: "Uttrakhand",
  },
  {
    name: "Himachal Pradesh",
    image: "/images/states/himachal_pardesh.jpg",
    state: "Himachal Pradesh",
  },
  {
    name: "Jammu and Kashmir",
    image: "/images/states/jammu_kashmir.jpg",
    state: "Jammu and Kashmir",
  },
];

const TopDestinations: React.FC = () => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching state breakup data...");

        const response = await tourService.getStateBreakup();
        console.log("State breakup response:", response);

        if (response?.data) {
          // Map the static destinations with dynamic listing counts
          const updatedData: DestinationData[] = destinations.map(
            (destination) => {
              const stateData = response.data.find((item: StateBreakupItem) =>
                new RegExp(item.state, "i").test(destination.state)
              );

              return {
                ...destination,
                listings: stateData?.count || 0,
              };
            }
          );

          // Sort by listing count (highest first)
          updatedData.sort((a, b) => b.listings - a.listings);
          setData(updatedData);
        } else {
          console.log("No state data found in response");
          // Fallback to static data with zero listings
          setData(destinations.map((dest) => ({ ...dest, listings: 0 })));
        }
      } catch (error) {
        console.error("Error fetching state data:", error);
        // Fallback to static data with zero listings
        setData(destinations.map((dest) => ({ ...dest, listings: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewAll = () => {
    router.push("/tours");
  };

  const handleOpenState = (state: string) => {
    router.push(`/tours?state=${encodeURIComponent(state)}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-4 md:px-10 lg:px-20 py-10 bg-gray-50 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-primary">
          Explore Top <span className="text-primary-500">Destinations</span>
        </h2>
        <button
          className="bg-primary-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 transition-all ease-in-out duration-300"
          onClick={() => handleViewAll()}
        >
          View All
        </button>
      </div>

      {/* Scroll Buttons - Desktop only */}
      <div className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => scroll("left")}
          className="bg-white shadow-md hover:bg-neutral-200 p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => scroll("right")}
          className="bg-white shadow-md hover:bg-neutral-200 p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent hide-scrollbar"
        role="list"
        aria-label="Top destinations by state"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[250px] h-[230px] rounded-xl bg-neutral-200 animate-pulse"
                aria-hidden="true"
              />
            ))
          : data.map((item, index) => (
              <button
                key={index}
                onClick={() => handleOpenState(item.state)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleOpenState(item.state);
                }}
                className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[250px] rounded-xl overflow-hidden relative shadow-md flex-shrink-0 group hover:scale-105 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300"
                role="listitem"
                aria-label={`${item.name}, ${item.listings} listings`}
              >
                <img
                  src={item.image}
                  alt={`${item.name} state image`}
                  className="h-[230px] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3">
                  <h3 className="font-bold text-sm md:text-base">
                    {item.name}
                  </h3>
                  <p className="text-xs opacity-90" aria-live="polite">
                    {item.listings} Listings
                  </p>
                </div>
              </button>
            ))}
      </div>
    </section>
  );
};

export default TopDestinations;
