"use client";

import React from "react";
import clsx from "clsx";

interface ItineraryItem {
  title: string;
  shortDescription: string;
  sightseeing: string[];
  toggles?: string[];
}

const badgeColor = {
  Transfer: "bg-blue-100 text-blue-700",
  Meals: "bg-yellow-100 text-yellow-700",
  Hotel: "bg-green-100 text-green-700",
  Sightseeing: "bg-purple-100 text-purple-700",
};

const ItinerarySection = ({ itenary }: { itenary: ItineraryItem[] }) => {
  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-text-primary mb-12 font-primary">
        Day-wise Itinerary
      </h2>
      <div className="space-y-12">
        {itenary?.map((item, index) => (
          <div
            key={index}
            className="relative bg-white rounded-3xl shadow-lg p-8 border border-gray-200 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Day Badge */}
            <div className="absolute -top-6 left-8 bg-[#C22A54] text-white w-12 h-12 flex items-center justify-center font-bold text-lg rounded-full shadow-lg">
              {index + 1}
            </div>

            {/* Details */}
            <div className="flex-1 mt-8 md:mt-0">
              <h4 className="text-xl font-bold text-text-primary mb-3 font-primary">
                {item.title}
              </h4>
              <p className="text-base text-text-secondary mb-4 leading-relaxed">
                {item.shortDescription}
              </p>

              {/* Sightseeing list */}
              <ul className="list-disc list-inside mb-6 text-base text-text-secondary space-y-2">
                {item.sightseeing.map((s, i) => (
                  <li key={i} className="leading-relaxed">
                    {s}
                  </li>
                ))}
              </ul>

              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {item.toggles?.map((toggle, idx) => (
                  <span
                    key={idx}
                    className={clsx(
                      "text-sm font-semibold px-4 py-2 rounded-full",
                      badgeColor[toggle as keyof typeof badgeColor] ||
                        "bg-gray-200 text-gray-700"
                    )}
                  >
                    {toggle}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ItinerarySection;
