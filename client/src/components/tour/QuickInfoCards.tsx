"use client";

import React from "react";
import { Typography } from "@mui/material";
import { CalendarMonth, AccessTime, Group, Star } from "@mui/icons-material";

interface QuickInfoCardsProps {
  data: any;
}

const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({ data }) => {
  const stats = [
    {
      icon: <CalendarMonth className="text-lg" />,
      value: data?.days || 0,
      label: "Days",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <AccessTime className="text-lg" />,
      value: data?.nights || 0,
      label: "Nights",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <Group className="text-lg" />,
      value: data?.capacity || 0,
      label: "Max Capacity",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Star className="text-lg" />,
      value: "4.8",
      label: "Rating",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm"
          >
            <div className="p-4 text-center">
              {/* Icon with subtle background */}
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} mb-3 group-hover:scale-105 transition-transform duration-300`}
              >
                <div className="text-white text-lg">{stat.icon}</div>
              </div>

              {/* Value */}
              <Typography
                variant="h4"
                className="font-bold text-gray-900 mb-1 text-2xl"
              >
                {stat.value}
              </Typography>

              {/* Label */}
              <Typography
                variant="body2"
                className="text-gray-600 font-medium text-sm"
              >
                {stat.label}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickInfoCards;
