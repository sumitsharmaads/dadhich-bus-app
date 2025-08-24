"use client";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { tourService } from "@/lib/api/services/tour.service";
import { DestinationData, StateBreakupItem } from "@/lib/api/types/tour.types";

// Image mapping for states - we'll use these based on real tour data
const stateImageMap: Record<string, string> = {
  Punjab: "/images/states/punjab.jpg",
  Haryana: "/images/states/haryana.jpg",
  Delhi: "/images/states/delhi.jpg",
  Rajasthan: "/images/states/rajasthan.jpg",
  Bihar: "/images/states/bihar.jpg",
  "Uttar Pradesh": "/images/states/uttar_pardesh.jpg",
  "West Bengal": "/images/states/pachim_bengal.jpg",
  Uttarakhand: "/images/states/uttrakhand.jpg",
  "Himachal Pradesh": "/images/states/himachal_pardesh.jpg",
  "Jammu and Kashmir": "/images/states/jammu_kashmir.jpg",
  Maharashtra: "/images/states/maharashtra.jpg",
  Gujarat: "/images/states/gujarat.jpg",
  "Madhya Pradesh": "/images/states/madhya_pradesh.jpg",
  Chhattisgarh: "/images/states/chhattisgarh.jpg",
  Jharkhand: "/images/states/jharkhand.jpg",
  Odisha: "/images/states/odisha.jpg",
  "Andhra Pradesh": "/images/states/andhra_pradesh.jpg",
  Telangana: "/images/states/telangana.jpg",
  Karnataka: "/images/states/karnataka.jpg",
  "Tamil Nadu": "/images/states/tamil_nadu.jpg",
  Kerala: "/images/states/kerala.jpg",
  Goa: "/images/states/goa.jpg",
  Assam: "/images/states/assam.jpg",
  "Arunachal Pradesh": "/images/states/arunachal_pradesh.jpg",
  Manipur: "/images/states/manipur.jpg",
  Meghalaya: "/images/states/meghalaya.jpg",
  Mizoram: "/images/states/mizoram.jpg",
  Nagaland: "/images/states/nagaland.jpg",
  Tripura: "/images/states/tripura.jpg",
  Sikkim: "/images/states/sikkim.jpg",
  default: "/images/states/default.jpg",
};

const TopDestinations: React.FC = () => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get real tour data to see which destinations actually have tours
        const facetsResponse = await tourService.getFacets();
        const stateBreakupResponse = await tourService.getStateBreakup();

        if (facetsResponse?.data && stateBreakupResponse?.data) {
          // Use real tour data to create dynamic destinations
          const cityCounts = facetsResponse.data.cityCounts || [];
          const stateBreakup = stateBreakupResponse.data || [];

          // Create dynamic destinations based on actual tour data
          const dynamicDestinations: DestinationData[] = [];

          // Process city counts to get state-level data
          const stateMap = new Map<
            string,
            { count: number; cities: string[] }
          >();

          cityCounts.forEach((city) => {
            // Try to find state from state breakup data
            const stateData = stateBreakup.find((item) =>
              new RegExp(item.state, "i").test(city.state || "")
            );

            if (stateData) {
              const stateName = stateData.state;
              if (stateMap.has(stateName)) {
                const existing = stateMap.get(stateName)!;
                existing.count += city.count;
                existing.cities.push(city.name);
              } else {
                stateMap.set(stateName, {
                  count: city.count,
                  cities: [city.name],
                });
              }
            }
          });

          // Convert to DestinationData format
          stateMap.forEach((data, stateName) => {
            const imagePath =
              stateImageMap[stateName] || stateImageMap["default"];

            dynamicDestinations.push({
              name: stateName,
              image: imagePath,
              state: stateName,
              listings: data.count,
            });
          });

          // Sort by listing count (highest first) and take top 10
          dynamicDestinations.sort((a, b) => b.listings - a.listings);
          const topDestinations = dynamicDestinations.slice(0, 10);

          // If we don't have enough dynamic data, fallback to static with real counts
          if (topDestinations.length < 6) {
            const fallbackDestinations = Object.entries(stateImageMap)
              .filter(([key]) => key !== "default")
              .slice(0, 10)
              .map(([stateName, imagePath]) => {
                const stateData = stateBreakup.find((item) =>
                  new RegExp(item.state, "i").test(stateName)
                );

                return {
                  name: stateName,
                  image: imagePath,
                  state: stateName,
                  listings: stateData?.count || 0,
                };
              })
              .sort((a, b) => b.listings - a.listings);

            setData(fallbackDestinations);
          } else {
            setData(topDestinations);
          }
        } else {
          // Fallback to static data with zero listings
          const fallbackData = Object.entries(stateImageMap)
            .filter(([key]) => key !== "default")
            .slice(0, 10)
            .map(([stateName, imagePath]) => ({
              name: stateName,
              image: imagePath,
              state: stateName,
              listings: 0,
            }));
          setData(fallbackData);
        }
      } catch (error) {
        // Fallback to static data with zero listings
        const fallbackData = Object.entries(stateImageMap)
          .filter(([key]) => key !== "default")
          .slice(0, 10)
          .map(([stateName, imagePath]) => ({
            name: stateName,
            image: imagePath,
            state: stateName,
            listings: 0,
          }));
        setData(fallbackData);
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
                {/* Additional overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white p-3">
                  <h3 className="font-bold text-sm md:text-base text-white drop-shadow-lg">
                    {item.name}
                  </h3>
                  <p
                    className="text-xs text-white/95 drop-shadow-md"
                    aria-live="polite"
                  >
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
