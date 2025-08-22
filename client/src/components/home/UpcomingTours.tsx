"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tourService } from "@/lib/api/services/tour.service";
import { TourListItem } from "@/lib/api/types/tour.types";
import dayjs from "dayjs";

const UpcomingTours: React.FC = () => {
  const router = useRouter();
  const [tours, setTours] = useState<TourListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await tourService.getUpcomingTours(4);

        if (response?.data) {
          setTours(response.data);
        } else {
          setTours([]);
        }
      } catch (error) {
        setError("Failed to load upcoming tours");
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleReadMore = (id: string) => {
    router.push(`/tour/${id}`);
  };

  if (loading) {
    return (
      <section className="my-12">
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-primary">
              Upcoming Tours
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse"
              >
                <div className="h-32 bg-gray-300"></div>
                <div className="p-3">
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-12">
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-primary">
              Upcoming Tours
            </h2>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-12">
      {tours && tours.length > 0 && (
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-primary">
              Upcoming Tours
            </h2>
          </div>

          {/* Compact Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tours.map((tour, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                {/* Compact Image Section */}
                <div className="relative h-32">
                  <img
                    src={
                      tour?.heroImage?.url ||
                      "/images/public/home/6f58de3c4b3d1d5d94614fd604778a4c.png"
                    }
                    alt={tour.tourName}
                    className="w-full h-full object-cover"
                    crossOrigin={"anonymous"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  {/* Tour Type Badge - Top Left */}
                  {tour.type && tour.type.length > 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs bg-primary-500 text-white rounded-full font-medium">
                        {tour.type[0]}
                      </span>
                    </div>
                  )}

                  {/* Tour Name - Bottom */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-sm font-semibold text-white font-secondary leading-tight line-clamp-2">
                      {tour.tourName}
                    </h3>
                  </div>
                </div>

                {/* Compact Content Section */}
                <div className="p-3 space-y-2">
                  {/* Route & Duration - Compact Row */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {tour.places
                        ?.slice(0, 2)
                        .map((p) => p.name)
                        .join(" → ")}
                    </span>
                    <span className="text-primary-600 font-medium">
                      {tour.days}D/{tour.nights}N
                    </span>
                  </div>

                  {/* Date & Price - Compact Row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {dayjs(tour.startDate).format("DD MMM")}
                    </span>
                    {tour.pricing?.minFare && (
                      <span className="text-primary-600 font-semibold">
                        ₹{tour.pricing.minFare.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Inclusions & Capacity - Compact Row */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">
                      {tour.inclusive?.slice(0, 2).join(", ")}
                      {tour.inclusive && tour.inclusive.length > 2 && "..."}
                    </span>
                    {tour.capacity && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tour.capacity} seats
                      </span>
                    )}
                  </div>

                  {/* Read More Button */}
                  <button
                    className="w-full mt-2 bg-primary-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                    onClick={() => handleReadMore(tour._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingTours;
