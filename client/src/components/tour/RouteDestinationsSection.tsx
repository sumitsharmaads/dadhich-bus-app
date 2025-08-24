"use client";

import React from "react";
import { Typography, Chip } from "@mui/material";
import {
  FlightTakeoff,
  LocationOn,
  AccessTime,
  Hotel,
} from "@mui/icons-material";

interface RouteDestinationsSectionProps {
  data: any;
}

const RouteDestinationsSection: React.FC<RouteDestinationsSectionProps> = ({
  data,
}) => {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <Typography
          variant="h3"
          className="font-bold text-gray-900 mb-3 text-2xl md:text-3xl"
        >
          Route & Destinations
        </Typography>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sources */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FlightTakeoff className="text-white text-lg" />
            </div>
            <Typography variant="h5" className="font-semibold text-gray-900">
              Starting Points
            </Typography>
          </div>

          {data?.sources && data.sources.length > 0 ? (
            <div className="space-y-4">
              {data.sources.map((source: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-900"
                    >
                      {source.cityName || "City"}
                    </Typography>
                    <div className="px-3 py-1 bg-gradient-to-r from-[#C22A54] to-[#A82046] text-white rounded-full text-sm font-semibold">
                      ₹{source.fare?.toLocaleString() || "0"}
                    </div>
                  </div>

                  {source.onBoarding && source.onBoarding.length > 0 && (
                    <div className="mb-3">
                      <Typography
                        variant="body2"
                        className="text-gray-600 mb-2 font-medium"
                      >
                        🚌 Pickup Points:
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {source.onBoarding.map((point: string, i: number) => (
                          <Chip
                            key={i}
                            label={point}
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

                  {source.departureTime && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <AccessTime className="text-sm" />
                      <Typography variant="body2" className="font-medium">
                        Departure: {source.departureTime}
                      </Typography>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <Typography variant="body2" className="text-gray-500">
                No starting points available
              </Typography>
            </div>
          )}
        </div>

        {/* Destinations */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <LocationOn className="text-white text-lg" />
            </div>
            <Typography variant="h5" className="font-semibold text-gray-900">
              Destinations
            </Typography>
          </div>

          {data?.places && data.places.length > 0 ? (
            <div className="space-y-4">
              {data.places.map((place: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-900"
                    >
                      {place.name || "Destination"}
                    </Typography>
                    {place.order && (
                      <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-semibold">
                        Stop {place.order}
                      </div>
                    )}
                  </div>

                  {place.state && (
                    <Typography
                      variant="body2"
                      className="text-gray-600 mb-3 font-medium"
                    >
                      📍 {place.state}
                    </Typography>
                  )}

                  {place.stayDuration && place.stayDuration > 0 && (
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Hotel className="text-sm" />
                      <Typography variant="body2" className="font-medium">
                        Stay: {place.stayDuration} day
                        {place.stayDuration !== 1 ? "s" : ""}
                      </Typography>
                    </div>
                  )}

                  {place.activities && place.activities.length > 0 && (
                    <div>
                      <Typography
                        variant="body2"
                        className="text-gray-600 mb-2 font-medium"
                      >
                        🎯 Activities:
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {place.activities.map((activity: string, i: number) => (
                          <Chip
                            key={i}
                            label={activity}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <Typography variant="body2" className="text-gray-500">
                No destinations available
              </Typography>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RouteDestinationsSection;
