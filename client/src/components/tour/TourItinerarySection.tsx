"use client";

import React from "react";
import { Typography, Chip } from "@mui/material";
import {
  AccessTime,
  Hotel,
  DirectionsCar,
  TravelExplore,
} from "@mui/icons-material";

interface TourItinerarySectionProps {
  itinerary: any[];
}

const TourItinerarySection: React.FC<TourItinerarySectionProps> = ({
  itinerary,
}) => {
  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  return (
    <section className="mb-6 sm:mb-8">
      <Typography
        variant="h5"
        className="font-semibold text-gray-800 mb-4 sm:mb-6 text-xl sm:text-2xl text-center"
      >
        Tour Itinerary
      </Typography>

      <div className="space-y-4 sm:space-y-6">
        {itinerary.map((item, index) => (
          <div
            key={index}
            className="relative bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm"
          >
            {/* Day indicator */}
            <div className="absolute -left-2 top-4 sm:top-6 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#C22A54] to-[#A82046] rounded-full flex items-center justify-center shadow-lg">
              <Typography
                variant="caption"
                className="text-white font-bold text-xs"
              >
                {item.day || index + 1}
              </Typography>
            </div>

            <div className="pl-6 sm:pl-8 p-4 sm:p-6">
              <Typography
                variant="h6"
                className="font-semibold mb-2 sm:mb-3 text-[#C22A54] text-lg sm:text-xl"
              >
                {item.title}
              </Typography>

              {item.shortDescription && (
                <Typography
                  variant="body2"
                  className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base"
                >
                  {item.shortDescription}
                </Typography>
              )}

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                {item.duration && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <AccessTime className="text-[#C22A54] text-sm" />
                    <Typography variant="body2" className="font-medium text-sm">
                      {item.duration}
                    </Typography>
                  </div>
                )}

                {item.accommodation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hotel className="text-[#C22A54] text-sm" />
                    <Typography variant="body2" className="font-medium text-sm">
                      {item.accommodation}
                    </Typography>
                  </div>
                )}

                {item.transportation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DirectionsCar className="text-[#C22A54] text-sm" />
                    <Typography variant="body2" className="font-medium text-sm">
                      {item.transportation}
                    </Typography>
                  </div>
                )}

                {item.order && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <TravelExplore className="text-[#C22A54] text-sm" />
                    <Typography variant="body2" className="font-medium text-sm">
                      Stop {item.order}
                    </Typography>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                {item.toggles && item.toggles.length > 0 && (
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-600 mb-2 font-medium"
                    >
                      <strong>Options:</strong>
                    </Typography>
                    <div className="flex gap-2 flex-wrap">
                      {item.toggles.map((toggle: string, i: number) => (
                        <Chip
                          key={i}
                          label={toggle}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(194, 42, 84, 0.1)",
                            color: "#C22A54",
                            border: "1px solid rgba(194, 42, 84, 0.2)",
                            fontSize: "0.75rem",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.sightseeing && item.sightseeing.length > 0 && (
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-600 mb-2 font-medium"
                    >
                      <strong>Sightseeing:</strong>
                    </Typography>
                    <div className="flex gap-2 flex-wrap">
                      {item.sightseeing.map((place: string, i: number) => (
                        <Chip
                          key={i}
                          label={place}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(156, 163, 175, 0.1)",
                            color: "#374151",
                            border: "1px solid rgba(156, 163, 175, 0.2)",
                            fontSize: "0.75rem",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.meals && item.meals.length > 0 && (
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-600 mb-2 font-medium"
                    >
                      <strong>Meals:</strong>
                    </Typography>
                    <div className="flex gap-2 flex-wrap">
                      {item.meals.map((meal: string, i: number) => (
                        <Chip
                          key={i}
                          label={meal}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            color: "#059669",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            fontSize: "0.75rem",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.highlights && item.highlights.length > 0 && (
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-600 mb-2 font-medium"
                    >
                      <strong>Highlights:</strong>
                    </Typography>
                    <div className="flex gap-2 flex-wrap">
                      {item.highlights.map((highlight: string, i: number) => (
                        <Chip
                          key={i}
                          label={highlight}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(245, 158, 11, 0.1)",
                            color: "#D97706",
                            border: "1px solid rgba(245, 158, 11, 0.2)",
                            fontSize: "0.75rem",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Typography variant="body2" className="text-blue-800">
                      <strong>Notes:</strong> {item.notes}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TourItinerarySection;
