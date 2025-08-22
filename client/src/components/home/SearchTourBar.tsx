"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/lib/service";

type SuggestionType = {
  tourname: string;
  _id: string;
  minfair: string | number;
  days: number;
  night: number;
  sourceName: string;
  price: number | string;
};

const SearchTourBar: React.FC = () => {
  const [query, setQuery] = useState(""); // Search query
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]); // Search suggestions
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced query
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
        const response = await get<{
          success: boolean;
          data: SuggestionType[];
        }>(`tours/smartSearch?q=${debouncedQuery}`); // API call for search
        if (response?.data?.data) {
          setSuggestions(response.data?.data); // Set suggestions based on response
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
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

  // Memoize suggestions to avoid unnecessary re-renders
  const memoizedSuggestions = useMemo(() => suggestions, [suggestions]);

  return (
    <div className="relative w-full max-w-lg z-40">
      <input
        type="text"
        placeholder="Search for tours, destinations..."
        value={query}
        onChange={handleInputChange}
        aria-label="Search tours"
        className="w-full px-4 py-2 rounded-full border border-neutral-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 font-primary"
      />
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
          className="absolute w-full bg-white shadow-lg mt-1 rounded-lg max-h-60 overflow-y-auto z-50"
          role="listbox"
          aria-label="Search suggestions"
        >
          {memoizedSuggestions.map((suggestion: SuggestionType) => (
            <div
              key={suggestion._id}
              className="px-4 py-2 hover:bg-neutral-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
              onClick={() => handleSuggestionClick(suggestion._id)} // Redirect on click
            >
              <h4 className="font-semibold text-neutral-800 font-secondary">
                {suggestion.tourname} from {suggestion?.sourceName || ""}
              </h4>
              <p className="text-sm text-neutral-600 font-primary">
                ₹ {suggestion.price || suggestion.minfair} | {suggestion.days}D{" "}
                {suggestion.night}N
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTourBar;
