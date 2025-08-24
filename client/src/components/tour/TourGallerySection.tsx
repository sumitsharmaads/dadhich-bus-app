"use client";

import React from "react";
import { Typography, Button } from "@mui/material";
import { TravelExplore } from "@mui/icons-material";

interface TourGallerySectionProps {
  gallery: any[];
}

const TourGallerySection: React.FC<TourGallerySectionProps> = ({ gallery }) => {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <Typography
          variant="h3"
          className="font-bold text-gray-900 mb-3 text-2xl md:text-3xl"
        >
          Photo Gallery
        </Typography>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={image.url}
                alt={`Tour image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Overlay with zoom icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <TravelExplore className="text-[#C22A54] text-lg" />
              </div>
            </div>

            {/* Image number badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#C22A54] px-2 py-1 rounded-full text-xs font-semibold">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* View All Photos Button */}
      {gallery.length > 6 && (
        <div className="text-center mt-8">
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: "#C22A54",
              color: "#C22A54",
              "&:hover": {
                borderColor: "#A82046",
                backgroundColor: "rgba(194, 42, 84, 0.05)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(194, 42, 84, 0.15)",
              },
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              padding: "10px 24px",
              transition: "all 0.2s ease",
            }}
          >
            View All {gallery.length} Photos
          </Button>
        </div>
      )}
    </section>
  );
};

export default TourGallerySection;
