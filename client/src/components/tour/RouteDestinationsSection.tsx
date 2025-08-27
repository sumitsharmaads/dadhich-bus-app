"use client";

import React from "react";
import { Typography, Card, CardContent, Box, Chip } from "@mui/material";
import { Tour } from "@/lib/api/types/tour.types";
import { LocationOn, AccessTime, DirectionsCar } from "@mui/icons-material";

interface RouteDestinationsSectionProps {
  data: Tour;
}

const RouteDestinationsSection: React.FC<RouteDestinationsSectionProps> = ({
  data,
}) => {
  if (!data?.sources || !data?.places) return null;

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
      <Typography
        variant="h5"
        className="font-semibold text-gray-800 mb-4 flex items-center gap-2"
      >
        <span className="text-2xl">🗺️</span>
        Route & Destinations
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Starting Points */}
        <div>
          <Typography
            variant="h6"
            className="font-medium text-gray-700 mb-3 flex items-center gap-2"
          >
            <DirectionsCar className="text-blue-500" />
            Starting Points
          </Typography>
          <div className="space-y-3">
            {data.sources.map((source, index) => (
              <Card
                key={index}
                className="border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LocationOn className="text-red-500 text-sm" />
                      <Typography
                        variant="body2"
                        className="font-medium text-gray-800"
                      >
                        {source.cityName || "Unknown City"}
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography
                        variant="body2"
                        className="font-semibold text-green-600"
                      >
                        ₹{source.fare?.toLocaleString() || "N/A"}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {source.departureTime || "TBD"}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div>
          <Typography
            variant="h6"
            className="font-medium text-gray-700 mb-3 flex items-center gap-2"
          >
            <span className="text-2xl">🎯</span>
            Destinations
          </Typography>
          <div className="space-y-2">
            {data.places.map((place, index) => (
              <Card
                key={index}
                className="border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Chip
                        label={`Step ${index + 1}`}
                        size="small"
                        className="bg-green-100 text-green-800 text-xs font-medium"
                      />
                      <div>
                        <Typography
                          variant="body2"
                          className="font-medium text-gray-800"
                        >
                          {place.name || "Unknown Place"}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-gray-500 flex items-center gap-1"
                        >
                          <LocationOn className="text-xs" />
                          {place.state || "Unknown State"}
                        </Typography>
                      </div>
                    </div>
                    <div className="text-right">
                      <Typography
                        variant="caption"
                        className="text-blue-600 font-medium flex items-center gap-1"
                      >
                        <AccessTime className="text-xs" />
                        {place.stayDuration
                          ? `${place.stayDuration} hours`
                          : "TBD"}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Typography variant="body2" className="text-gray-600 text-center">
          <span className="font-medium">
            {data.places?.length || 0} destinations
          </span>{" "}
          •
          <span className="font-medium">
            {" "}
            {data.sources?.length || 0} starting points
          </span>{" "}
          •
          <span className="font-medium">
            {" "}
            Total duration: {data.days || 0} days
          </span>
        </Typography>
      </div>
    </section>
  );
};

export default RouteDestinationsSection;
