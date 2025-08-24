"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/lib/service";

type SuggestionType = {
  _id: string;
  tourName: string;
  description?: string;
  shortDescription?: string;
  days?: number;
  nights?: number;
  pricing?: {
    minFare: number;
    maxFare?: number;
    currencyCode: string;
  };
  enhancedSource: {
    cityId: string | { _id: string; name: string };
    cityName?: string;
    state?: string;
    fare: number;
    cityDetails?: {
      _id: string;
      name: string;
      state?: string;
    };
  };
  enhancedPlaces: Array<{
    cityId: string | { _id: string; name: string };
    name: string;
    state?: string;
    cityDetails?: {
      _id: string;
      name: string;
      state?: string;
    };
  }>;
  type?: string[];
  inclusive?: string[];
  capacity?: number;
  heroImage?: {
    url: string;
  };
  highlights?: string[];
  category?: string;
  difficulty?: string;
  ageGroup?: string;
  fitnessLevel?: string;
};

const SearchTourBar: React.FC = () => {
  const [query, setQuery] = useState(""); // Search query
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]); // Search suggestions
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced query
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Next.js router

  // Debounce hook for query delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // Delay for 300ms before sending API request

    return () => clearTimeout(timer); // Cleanup timer on every query change
  }, [query]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]); // Clear suggestions if query is empty
        return;
      }

      try {
        setLoading(true);

        // Use the new searchtourInformation API
        const response = await get<{
          success: boolean;
          data: {
            tours: SuggestionType[];
            total: number;
            searchQuery: string;
          };
        }>(
          `tours/searchtourInformation?search=${encodeURIComponent(
            debouncedQuery
          )}`
        );

        if (response?.data?.data?.tours) {
          setSuggestions(response.data.data.tours);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle suggestion click, navigate to the selected tour page
  const handleSuggestionClick = (tourId: string) => {
    router.push(`/tour/${tourId}`); // Navigate to the selected tour's page
  };

  // Clear search input and suggestions
  const handleClearSearch = () => {
    setQuery(""); // Reset search query
    setSuggestions([]); // Clear suggestions
  };

  // Helper function to get source city display
  const getSourceDisplay = (tour: SuggestionType) => {
    if (tour.enhancedSource) {
      const cityName =
        typeof tour.enhancedSource.cityId === "string"
          ? tour.enhancedSource.cityName || "Unknown"
          : tour.enhancedSource.cityId.name;
      const state =
        tour.enhancedSource.state || tour.enhancedSource.cityDetails?.state;
      const fare = tour.enhancedSource.fare;

      if (state) {
        return `${cityName}, ${state} (₹${fare?.toLocaleString() || "N/A"})`;
      }
      return `${cityName} (₹${fare?.toLocaleString() || "N/A"})`;
    }
    return "Unknown";
  };

  // Helper function to get destination cities display
  const getDestinationDisplay = (tour: SuggestionType) => {
    if (tour.enhancedPlaces && tour.enhancedPlaces.length > 0) {
      return tour.enhancedPlaces
        .map((place) => {
          const cityName =
            typeof place.cityId === "string" ? place.name : place.cityId.name;
          const state = place.state || place.cityDetails?.state;
          return state ? `${cityName}, ${state}` : cityName;
        })
        .join(", ");
    }
    return "Unknown";
  };

  // Helper function to get price display
  const getPriceDisplay = (tour: SuggestionType) => {
    if (tour.pricing) {
      if (tour.pricing.maxFare && tour.pricing.maxFare > tour.pricing.minFare) {
        return `₹${tour.pricing.minFare.toLocaleString()} - ₹${tour.pricing.maxFare.toLocaleString()}`;
      }
      return `₹${tour.pricing.minFare.toLocaleString()}`;
    }
    return "Price not available";
  };

  // Memoize suggestions to avoid unnecessary re-renders
  const memoizedSuggestions = useMemo(() => suggestions, [suggestions]);

  return (
    <div className="relative w-full max-w-lg z-40">
      <input
        type="text"
        placeholder="Search for tours, destinations, descriptions..."
        value={query}
        onChange={handleInputChange}
        aria-label="Search tours"
        className="w-full px-4 py-2 rounded-full border border-neutral-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 font-primary"
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Clear Search Button */}
      {query && (
        <button
          onClick={handleClearSearch}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded"
          aria-label="Clear search"
        >
          X
        </button>
      )}

      {memoizedSuggestions.length > 0 && (
        <div
          className="absolute w-full bg-white shadow-lg mt-1 rounded-lg max-h-80 overflow-y-auto z-50"
          role="listbox"
          aria-label="Search suggestions"
        >
          {memoizedSuggestions.map((suggestion: SuggestionType) => (
            <div
              key={`${suggestion._id}-${
                suggestion.enhancedSource?.cityId || "unknown"
              }`}
              className="px-4 py-3 hover:bg-neutral-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 border-b border-neutral-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion._id)} // Redirect on click
            >
              {/* Tour Name */}
              <h4 className="font-semibold text-neutral-800 font-secondary text-sm mb-2">
                {suggestion.tourName}
              </h4>

              {/* Route Information */}
              <div className="text-xs text-neutral-600 font-primary mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-medium">From:</span>
                  <span>{getSourceDisplay(suggestion)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">To:</span>
                  <span>{getDestinationDisplay(suggestion)}</span>
                </div>
              </div>

              {/* Tour Details */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                <span>
                  {suggestion.days || 0}D {suggestion.nights || 0}N
                </span>
                {suggestion.type && suggestion.type.length > 0 && (
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                    {suggestion.type[0]}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-xs font-semibold text-primary-600">
                {getPriceDisplay(suggestion)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTourBar;
