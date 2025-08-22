"use client";

import React from "react";

const regions = [
  "North India",
  "South India",
  "West India",
  "East India",
  "North-East",
  "Central India",
];

const RegionsSection: React.FC = () => {
  return (
    <section className="bg-surface-primary py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-text-primary font-secondary">
          Explore India by Region
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {regions.map((region, i) => (
            <span
              key={i}
              className="px-6 py-3 bg-primary-50 text-primary-600 font-semibold rounded-full text-sm hover:bg-primary-100 transition-colors cursor-pointer"
            >
              {region}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionsSection;
