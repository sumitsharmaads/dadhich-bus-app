"use client";

import React from "react";
import { Typography } from "@mui/material";

interface InclusionsSectionProps {
  inclusiveData: any[];
}

const InclusionsSection: React.FC<InclusionsSectionProps> = ({
  inclusiveData,
}) => {
  if (!inclusiveData || inclusiveData.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <Typography
          variant="h3"
          className="font-bold text-gray-900 mb-3 text-2xl md:text-3xl"
        >
          What&apos;s Included
        </Typography>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {inclusiveData.map((item, index) => (
          <div
            key={index}
            className={`group relative p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
              item?.highlight
                ? "bg-gradient-to-br from-[#C22A54]/5 to-[#A82046]/5 border border-[#C22A54]/20"
                : "bg-white border border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                  item?.highlight
                    ? "bg-[#C22A54] text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[#C22A54] group-hover:text-white"
                } transition-all duration-300`}
              >
                <span className="text-xl">{item.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <Typography
                  variant="h6"
                  className={`font-semibold mb-2 ${
                    item?.highlight
                      ? "text-[#C22A54]"
                      : "text-gray-900 group-hover:text-[#C22A54]"
                  } transition-colors`}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-600 leading-relaxed"
                >
                  {item.description}
                </Typography>

                {item?.highlight && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#C22A54] text-white">
                      ✓ Included
                    </span>
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

export default InclusionsSection;
