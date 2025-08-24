"use client";

import React from "react";
import { Typography } from "@mui/material";

interface ExclusiveFeaturesSectionProps {
  exclusive: string[];
}

const ExclusiveFeaturesSection: React.FC<ExclusiveFeaturesSectionProps> = ({
  exclusive,
}) => {
  if (!exclusive || exclusive.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <Typography
          variant="h3"
          className="font-bold text-gray-900 mb-3 text-2xl md:text-3xl"
        >
          Exclusive Features
        </Typography>
        <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exclusive.map((feature, index) => (
          <div
            key={index}
            className="group p-5 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <Typography
                  variant="body1"
                  className="font-medium text-gray-900 leading-relaxed group-hover:text-purple-600 transition-colors"
                >
                  {feature}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExclusiveFeaturesSection;
