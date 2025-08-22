"use client";

import React from "react";
import { Tour } from "@/lib/api/types/tour.types";

// Enhanced Brand Colors
const BRAND_COLOR = "#C22A54";
const BRAND_COLOR_HOVER = "#A82046"; // Darker for hover
const BRAND_TEXT_COLOR = "#C22A54"; // For text

// --- Tour Options Dialog ---
export const TourOptions: React.FC<{
  open: boolean;
  onClose: () => void;
  tourTitle: string;
  source?: Tour["sources"];
  minFair: number | string;
}> = ({ open, onClose, tourTitle, source, minFair }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-center mb-1">
            <h3
              className="text-lg font-semibold"
              style={{ color: BRAND_TEXT_COLOR }}
            >
              {tourTitle} - Options
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Select your preferred boarding location.
          </p>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {source?.map((option, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {option?.cityName || "City"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {option?.onBoarding?.join(", ") || "Boarding point"}
                    </p>
                  </div>
                </div>
                {option.fare !== 0 && (
                  <p
                    className={`text-xs mt-1 ${
                      option.fare > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {option.fare > 0
                      ? ` ₹${option.fare}`
                      : ` ₹${Math.abs(option.fare)}`}{" "}
                    / person
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
