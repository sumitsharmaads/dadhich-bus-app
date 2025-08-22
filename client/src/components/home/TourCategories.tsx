"use client";

import React from "react";
import {
  UserGroupIcon,
  BuildingLibraryIcon,
  CloudIcon,
  CalendarDaysIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const categories = [
  {
    name: "Family Tours",
    icon: <UserGroupIcon className="w-8 h-8" />,
    bg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    name: "Devotional Yatra",
    icon: <BuildingLibraryIcon className="w-8 h-8" />,
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    name: "Hill Stations",
    icon: <CloudIcon className="w-8 h-8" />,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    name: "Weekend Getaways",
    icon: <CalendarDaysIcon className="w-8 h-8" />,
    bg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    name: "Adventure Trips",
    icon: <TruckIcon className="w-8 h-8" />,
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const TourCategories: React.FC = () => {
  return (
    <section className="py-16 bg-surface-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary font-secondary mb-4">
            Tour Categories
          </h2>
          <p className="text-text-secondary text-lg">
            Choose from our diverse range of travel experiences
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-surface-secondary hover:bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[200px] flex-shrink-0"
              >
                <div
                  className={`${category.bg} ${category.iconColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {category.icon}
                </div>
                <h3 className="text-center font-semibold text-text-primary group-hover:text-primary-500 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourCategories;
