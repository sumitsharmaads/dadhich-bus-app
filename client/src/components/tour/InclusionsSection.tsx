"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface InclusiveItem {
  label: string;
  icon: string;
  description: string;
  color: string;
  highlight: boolean;
}

interface InclusionsSectionProps {
  inclusiveData: InclusiveItem[];
}

const InclusionsSection: React.FC<InclusionsSectionProps> = ({
  inclusiveData,
}) => {
  if (!inclusiveData || inclusiveData.length === 0) return null;

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
      <Typography
        variant="h5"
        className="font-semibold text-gray-800 mb-4 flex items-center gap-2"
      >
        <span className="text-2xl">✅</span>
        What's Included
      </Typography>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {inclusiveData.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow duration-200 border border-gray-100"
            sx={{ minHeight: "auto" }}
          >
            <CardContent className="p-3 text-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <Typography
                  variant="body2"
                  className="font-medium text-gray-700 text-xs leading-tight"
                  sx={{ lineHeight: 1.2 }}
                >
                  {item.label}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Typography
        variant="body2"
        className="text-gray-500 text-center mt-4 text-sm"
      >
        {inclusiveData.length} services included in your tour package
      </Typography>
    </section>
  );
};

export default InclusionsSection;
