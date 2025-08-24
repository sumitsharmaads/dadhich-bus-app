"use client";

import React from "react";
import { Typography } from "@mui/material";
import { Star } from "@mui/icons-material";

interface TourHighlightsSectionProps {
  highlights: string[];
}

const TourHighlightsSection: React.FC<TourHighlightsSectionProps> = ({
  highlights,
}) => {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <Typography
          variant="h3"
          className="font-bold text-gray-900 mb-3 text-2xl md:text-3xl"
        >
          Tour Highlights
        </Typography>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className="group p-5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="text-white text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <Typography
                  variant="body1"
                  className="font-medium text-gray-900 leading-relaxed"
                >
                  {highlight}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TourHighlightsSection;
