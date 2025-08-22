"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Collapse,
  Alert,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  LocationOn as LocationOnIcon,
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  TourSearchParams,
  TourFacets,
  TourPriceRange,
} from "@/lib/api/types/tour.types";

// Brand Colors (matching your existing app)
const BRAND_COLOR = "#C22A54";
const BRAND_COLOR_HOVER = "#A82046";
const BRAND_COLOR_LIGHT = "#FDECF2";
const BRAND_COLOR_ULTRALIGHT = "#FDF2F8";
const SECONDARY_COLOR = "#202542";

interface TourFiltersProps {
  facets: TourFacets | null;
  priceRange: TourPriceRange | null;
  filters: TourSearchParams;
  onFilterChange: (filters: Partial<TourSearchParams>) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const TourFilters: React.FC<TourFiltersProps> = ({
  facets,
  priceRange,
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  isLoading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<TourSearchParams>(filters);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "search",
    "price",
    "duration",
    "types",
    "inclusions",
    "locations",
  ]);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalFilterChange = (key: keyof TourSearchParams, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApplyFilters();
  };

  const handleClear = () => {
    const clearedFilters: TourSearchParams = {};
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const handleSectionToggle = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleTypeToggle = (type: string) => {
    const currentTypes = localFilters.type?.split(",").filter(Boolean) || [];
    if (currentTypes.includes(type)) {
      handleLocalFilterChange(
        "type",
        currentTypes.filter((t) => t !== type).join(",")
      );
    } else {
      handleLocalFilterChange("type", [...currentTypes, type].join(","));
    }
  };

  const handleInclusiveToggle = (feature: string) => {
    const currentInclusive =
      localFilters.inclusive?.split(",").filter(Boolean) || [];
    if (currentInclusive.includes(feature)) {
      handleLocalFilterChange(
        "inclusive",
        currentInclusive.filter((i) => i !== feature).join(",")
      );
    } else {
      handleLocalFilterChange(
        "inclusive",
        [...currentInclusive, feature].join(",")
      );
    }
  };

  const handleLocationToggle = (cityId: string, cityName: string) => {
    const currentCities =
      localFilters.placeCity?.split(",").filter(Boolean) || [];
    if (currentCities.includes(cityId)) {
      handleLocalFilterChange(
        "placeCity",
        currentCities.filter((c) => c !== cityId).join(",")
      );
    } else {
      handleLocalFilterChange(
        "placeCity",
        [...currentCities, cityId].join(",")
      );
    }
  };

  const handleSourceCityToggle = (cityId: string, cityName: string) => {
    const currentCities =
      localFilters.sourceCity?.split(",").filter(Boolean) || [];
    if (currentCities.includes(cityId)) {
      handleLocalFilterChange(
        "sourceCity",
        currentCities.filter((c) => c !== cityId).join(",")
      );
    } else {
      handleLocalFilterChange(
        "sourceCity",
        [...currentCities, cityId].join(",")
      );
    }
  };

  const isTypeSelected = (type: string) => {
    return localFilters.type?.includes(type) || false;
  };

  const isInclusiveSelected = (feature: string) => {
    return localFilters.inclusive?.includes(feature) || false;
  };

  const isLocationSelected = (cityId: string) => {
    return localFilters.placeCity?.includes(cityId) || false;
  };

  const isSourceCitySelected = (cityId: string) => {
    return localFilters.sourceCity?.includes(cityId) || false;
  };

  const getSelectedCount = () => {
    let count = 0;
    if (localFilters.q) count++;
    if (localFilters.priceMin || localFilters.priceMax) count++;
    if (localFilters.daysMin || localFilters.daysMax) count++;
    if (localFilters.type) count++;
    if (localFilters.inclusive) count++;
    if (localFilters.placeCity) count++;
    if (localFilters.sourceCity) count++;
    if (localFilters.state) count++;
    if (localFilters.capacity) count++;
    if (localFilters.sortBy) count++;
    return count;
  };

  const selectedCount = getSelectedCount();

  return (
    <Box className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
      {/* Header */}
      <Box
        className="px-6 py-4 border-b border-neutral-200"
        sx={{ backgroundColor: BRAND_COLOR_ULTRALIGHT }}
      >
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <FilterListIcon sx={{ color: BRAND_COLOR, fontSize: 24 }} />
            <Typography
              variant="h6"
              className="font-semibold text-neutral-800"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Filters & Search
            </Typography>
          </Box>
          {selectedCount > 0 && (
            <Chip
              label={`${selectedCount} active`}
              size="small"
              sx={{
                backgroundColor: BRAND_COLOR,
                color: "white",
                fontSize: "0.75rem",
                height: "20px",
              }}
            />
          )}
        </Box>
      </Box>

      {/* Filter Content */}
      <Box className="p-6 space-y-6">
        {/* Search Section */}
        <Box>
          <Box
            className="flex items-center gap-2 mb-3 cursor-pointer"
            onClick={() => handleSectionToggle("search")}
          >
            <SearchIcon sx={{ color: BRAND_COLOR, fontSize: 20 }} />
            <Typography
              variant="subtitle1"
              className="font-medium text-neutral-700"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Search Tours
            </Typography>
            <ExpandMoreIcon
              className={`transition-transform ${
                expandedSections.includes("search") ? "rotate-180" : ""
              }`}
              sx={{ color: BRAND_COLOR }}
            />
          </Box>
          <Collapse in={expandedSections.includes("search")}>
            <TextField
              fullWidth
              placeholder="Search tours, destinations..."
              value={localFilters.q || ""}
              onChange={(e) => handleLocalFilterChange("q", e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: BRAND_COLOR_LIGHT,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: BRAND_COLOR,
                  },
                },
              }}
            />
          </Collapse>
        </Box>

        {/* Price Range Section */}
        {priceRange?.data && (
          <Box>
            <Box
              className="flex items-center gap-2 mb-3 cursor-pointer"
              onClick={() => handleSectionToggle("price")}
            >
              <CurrencyRupeeIcon sx={{ color: BRAND_COLOR, fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                className="font-medium text-neutral-700"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Price Range
              </Typography>
              <ExpandMoreIcon
                className={`transition-transform ${
                  expandedSections.includes("price") ? "rotate-180" : ""
                }`}
                sx={{ color: BRAND_COLOR }}
              />
            </Box>
            <Collapse in={expandedSections.includes("price")}>
              <Box className="space-y-3">
                <Typography
                  variant="body2"
                  className="text-neutral-600 text-center"
                >
                  ₹{priceRange.data.min.toLocaleString()} - ₹
                  {priceRange.data.max.toLocaleString()}
                </Typography>
                <Slider
                  value={[
                    localFilters.priceMin || priceRange.data.min,
                    localFilters.priceMax || priceRange.data.max,
                  ]}
                  onChange={(_, newValue) => {
                    const [min, max] = newValue as number[];
                    handleLocalFilterChange("priceMin", min);
                    handleLocalFilterChange("priceMax", max);
                  }}
                  min={priceRange.data.min}
                  max={priceRange.data.max}
                  step={100}
                  size="small"
                  sx={{
                    color: BRAND_COLOR,
                    "& .MuiSlider-thumb": { width: 16, height: 16 },
                    "& .MuiSlider-track": { height: 4 },
                    "& .MuiSlider-rail": { height: 4 },
                  }}
                />
                <Box className="flex gap-2">
                  <TextField
                    label="Min Price"
                    type="number"
                    size="small"
                    value={localFilters.priceMin || ""}
                    onChange={(e) =>
                      handleLocalFilterChange(
                        "priceMin",
                        Number(e.target.value)
                      )
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                  <TextField
                    label="Max Price"
                    type="number"
                    size="small"
                    value={localFilters.priceMax || ""}
                    onChange={(e) =>
                      handleLocalFilterChange(
                        "priceMax",
                        Number(e.target.value)
                      )
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Duration Section */}
        <Box>
          <Box
            className="flex items-center gap-2 mb-3 cursor-pointer"
            onClick={() => handleSectionToggle("duration")}
          >
            <AccessTimeIcon sx={{ color: BRAND_COLOR, fontSize: 20 }} />
            <Typography
              variant="subtitle1"
              className="font-medium text-neutral-700"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Duration (Days)
            </Typography>
            <ExpandMoreIcon
              className={`transition-transform ${
                expandedSections.includes("duration") ? "rotate-180" : ""
              }`}
              sx={{ color: BRAND_COLOR }}
            />
          </Box>
          <Collapse in={expandedSections.includes("duration")}>
            <Box className="space-y-3">
              <Slider
                value={[localFilters.daysMin || 1, localFilters.daysMax || 30]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleLocalFilterChange("daysMin", min);
                  handleLocalFilterChange("daysMax", max);
                }}
                min={1}
                max={30}
                step={1}
                size="small"
                sx={{
                  color: BRAND_COLOR,
                  "& .MuiSlider-thumb": { width: 16, height: 16 },
                  "& .MuiSlider-track": { height: 4 },
                  "& .MuiSlider-rail": { height: 4 },
                }}
              />
              <Typography
                variant="body2"
                className="text-neutral-600 text-center"
              >
                {localFilters.daysMin || 1} - {localFilters.daysMax || 30} Days
              </Typography>
              <Box className="flex gap-2">
                <TextField
                  label="Min Days"
                  type="number"
                  size="small"
                  value={localFilters.daysMin || ""}
                  onChange={(e) =>
                    handleLocalFilterChange("daysMin", Number(e.target.value))
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    },
                  }}
                />
                <TextField
                  label="Max Days"
                  type="number"
                  size="small"
                  value={localFilters.daysMax || ""}
                  onChange={(e) =>
                    handleLocalFilterChange("daysMax", Number(e.target.value))
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    },
                  }}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Tour Types Section */}
        {facets?.types && facets.types.length > 0 && (
          <Box>
            <Box
              className="flex items-center gap-2 mb-3 cursor-pointer"
              onClick={() => handleSectionToggle("types")}
            >
              <TrendingUpIcon sx={{ color: BRAND_COLOR, fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                className="font-medium text-neutral-700"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Tour Types ({facets.types.length})
              </Typography>
              <ExpandMoreIcon
                className={`transition-transform ${
                  expandedSections.includes("types") ? "rotate-180" : ""
                }`}
                sx={{ color: BRAND_COLOR }}
              />
            </Box>
            <Collapse in={expandedSections.includes("types")}>
              <Box className="space-y-2">
                {facets.types.map((typeItem) => (
                  <FormControlLabel
                    key={typeItem.type}
                    control={
                      <Checkbox
                        size="small"
                        checked={isTypeSelected(typeItem.type)}
                        onChange={() => handleTypeToggle(typeItem.type)}
                        sx={{
                          "&.Mui-checked": { color: BRAND_COLOR },
                          "&:hover": {
                            backgroundColor: BRAND_COLOR_ULTRALIGHT,
                          },
                        }}
                      />
                    }
                    label={
                      <Box className="flex items-center justify-between w-full">
                        <span className="text-sm text-neutral-700">
                          {typeItem.type}
                        </span>
                        <Chip
                          label={typeItem.count}
                          size="small"
                          sx={{
                            backgroundColor: BRAND_COLOR_LIGHT,
                            color: BRAND_COLOR,
                            fontSize: "0.75rem",
                            height: "20px",
                          }}
                        />
                      </Box>
                    }
                    className="w-full m-0"
                  />
                ))}
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Inclusions Section */}
        {facets?.inclusives && facets.inclusives.length > 0 && (
          <Box>
            <Box
              className="flex items-center gap-2 mb-3 cursor-pointer"
              onClick={() => handleSectionToggle("inclusions")}
            >
              <StarIcon sx={{ color: BRAND_COLOR, fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                className="font-medium text-neutral-700"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Inclusions ({facets.inclusives.length})
              </Typography>
              <ExpandMoreIcon
                className={`transition-transform ${
                  expandedSections.includes("inclusions") ? "rotate-180" : ""
                }`}
                sx={{ color: BRAND_COLOR }}
              />
            </Box>
            <Collapse in={expandedSections.includes("inclusions")}>
              <Box className="space-y-2">
                {facets.inclusives.map((inclusiveItem) => (
                  <FormControlLabel
                    key={inclusiveItem.feature}
                    control={
                      <Checkbox
                        size="small"
                        checked={isInclusiveSelected(inclusiveItem.feature)}
                        onChange={() =>
                          handleInclusiveToggle(inclusiveItem.feature)
                        }
                        sx={{
                          "&.Mui-checked": { color: BRAND_COLOR },
                          "&:hover": {
                            backgroundColor: BRAND_COLOR_ULTRALIGHT,
                          },
                        }}
                      />
                    }
                    label={
                      <Box className="flex items-center justify-between w-full">
                        <span className="text-sm text-neutral-700">
                          {inclusiveItem.feature}
                        </span>
                        <Chip
                          label={inclusiveItem.count}
                          size="small"
                          sx={{
                            backgroundColor: BRAND_COLOR_LIGHT,
                            color: BRAND_COLOR,
                            fontSize: "0.75rem",
                            height: "20px",
                          }}
                        />
                      </Box>
                    }
                    className="w-full m-0"
                  />
                ))}
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Locations Section */}
        {facets?.cityCounts && facets.cityCounts.length > 0 && (
          <Box>
            <Box
              className="flex items-center gap-2 mb-3 cursor-pointer"
              onClick={() => handleSectionToggle("locations")}
            >
              <LocationOnIcon sx={{ color: BRAND_COLOR, fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                className="font-medium text-neutral-700"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Destinations ({facets.cityCounts.length})
              </Typography>
              <ExpandMoreIcon
                className={`transition-transform ${
                  expandedSections.includes("locations") ? "rotate-180" : ""
                }`}
                sx={{ color: BRAND_COLOR }}
              />
            </Box>
            <Collapse in={expandedSections.includes("locations")}>
              <Box className="space-y-2 max-h-48 overflow-y-auto">
                {facets.cityCounts.map((cityItem) => (
                  <FormControlLabel
                    key={cityItem._id}
                    control={
                      <Checkbox
                        size="small"
                        checked={isLocationSelected(cityItem._id)}
                        onChange={() =>
                          handleLocationToggle(cityItem._id, cityItem.name)
                        }
                        sx={{
                          "&.Mui-checked": { color: BRAND_COLOR },
                          "&:hover": {
                            backgroundColor: BRAND_COLOR_ULTRALIGHT,
                          },
                        }}
                      />
                    }
                    label={
                      <Box className="flex items-center justify-between w-full">
                        <Box>
                          <span className="text-sm text-neutral-700 font-medium">
                            {cityItem.name}
                          </span>
                          {cityItem.state && (
                            <Typography
                              variant="caption"
                              className="text-neutral-500 block"
                            >
                              {cityItem.state}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          label={cityItem.count}
                          size="small"
                          sx={{
                            backgroundColor: BRAND_COLOR_LIGHT,
                            color: BRAND_COLOR,
                            fontSize: "0.75rem",
                            height: "20px",
                          }}
                        />
                      </Box>
                    }
                    className="w-full m-0"
                  />
                ))}
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Source Cities Section */}
        {facets?.sourceCities && facets.sourceCities.length > 0 && (
          <Box>
            <Box
              className="flex items-center gap-2 mb-3 cursor-pointer"
              onClick={() => handleSectionToggle("sourceCities")}
            >
              <LocationOnIcon sx={{ color: BRAND_COLOR, fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                className="font-medium text-neutral-700"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Departure Cities ({facets.sourceCities.length})
              </Typography>
              <ExpandMoreIcon
                className={`transition-transform ${
                  expandedSections.includes("sourceCities") ? "rotate-180" : ""
                }`}
                sx={{ color: BRAND_COLOR }}
              />
            </Box>
            <Collapse in={expandedSections.includes("sourceCities")}>
              <Box className="space-y-2 max-h-48 overflow-y-auto">
                {facets.sourceCities.map((cityItem) => (
                  <FormControlLabel
                    key={cityItem._id}
                    control={
                      <Checkbox
                        size="small"
                        checked={isSourceCitySelected(cityItem._id)}
                        onChange={() =>
                          handleSourceCityToggle(cityItem._id, cityItem.name)
                        }
                        sx={{
                          "&.Mui-checked": { color: BRAND_COLOR },
                          "&:hover": {
                            backgroundColor: BRAND_COLOR_ULTRALIGHT,
                          },
                        }}
                      />
                    }
                    label={
                      <Box className="flex items-center justify-between w-full">
                        <span className="text-sm text-neutral-700">
                          {cityItem.name}
                        </span>
                        <Chip
                          label={cityItem.count}
                          size="small"
                          sx={{
                            backgroundColor: BRAND_COLOR_LIGHT,
                            color: BRAND_COLOR,
                            fontSize: "0.75rem",
                            height: "20px",
                          }}
                        />
                      </Box>
                    }
                    className="w-full m-0"
                  />
                ))}
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Additional Filters */}
        <Box>
          <Box
            className="flex items-center gap-2 mb-3 cursor-pointer"
            onClick={() => handleSectionToggle("additional")}
          >
            <FilterListIcon sx={{ color: BRAND_COLOR, fontSize: 20 }} />
            <Typography
              variant="subtitle1"
              className="font-medium text-neutral-700"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Additional Filters
            </Typography>
            <ExpandMoreIcon
              className={`transition-transform ${
                expandedSections.includes("additional") ? "rotate-180" : ""
              }`}
              sx={{ color: BRAND_COLOR }}
            />
          </Box>
          <Collapse in={expandedSections.includes("additional")}>
            <Box className="space-y-4">
              {/* State Filter */}
              <Box>
                <Typography
                  variant="subtitle2"
                  className="font-medium text-neutral-600 mb-2"
                >
                  State
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Filter by state..."
                  value={localFilters.state || ""}
                  onChange={(e) =>
                    handleLocalFilterChange("state", e.target.value)
                  }
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    },
                  }}
                />
              </Box>

              {/* Capacity Filter */}
              <Box>
                <Typography
                  variant="subtitle2"
                  className="font-medium text-neutral-600 mb-2"
                >
                  Minimum Capacity
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Enter capacity..."
                  value={localFilters.capacity || ""}
                  onChange={(e) =>
                    handleLocalFilterChange("capacity", Number(e.target.value))
                  }
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    },
                  }}
                />
              </Box>

              {/* Sort By */}
              <Box>
                <Typography
                  variant="subtitle2"
                  className="font-medium text-neutral-600 mb-2"
                >
                  Sort By
                </Typography>
                <Box className="grid grid-cols-2 gap-2">
                  {[
                    { value: "popularity", label: "Popularity" },
                    { value: "price_asc", label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                    { value: "duration_asc", label: "Duration: Short to Long" },
                    {
                      value: "duration_desc",
                      label: "Duration: Long to Short",
                    },
                    { value: "date_asc", label: "Date: Earliest First" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        localFilters.sortBy === option.value
                          ? "contained"
                          : "outlined"
                      }
                      size="small"
                      onClick={() =>
                        handleLocalFilterChange("sortBy", option.value)
                      }
                      sx={{
                        backgroundColor:
                          localFilters.sortBy === option.value
                            ? BRAND_COLOR
                            : "transparent",
                        color:
                          localFilters.sortBy === option.value
                            ? "white"
                            : BRAND_COLOR,
                        borderColor: BRAND_COLOR,
                        "&:hover": {
                          backgroundColor:
                            localFilters.sortBy === option.value
                              ? BRAND_COLOR_HOVER
                              : BRAND_COLOR_LIGHT,
                        },
                        borderRadius: "8px",
                        textTransform: "none",
                        fontSize: "0.75rem",
                        padding: "4px 8px",
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box className="p-6 border-t border-neutral-200 bg-neutral-50">
        <Box className="space-y-3">
          <Button
            variant="contained"
            fullWidth
            onClick={handleApply}
            disabled={isLoading}
            startIcon={<SearchIcon />}
            sx={{
              backgroundColor: BRAND_COLOR,
              "&:hover": {
                backgroundColor: BRAND_COLOR_HOVER,
              },
              "&:disabled": {
                backgroundColor: BRAND_COLOR_LIGHT,
                color: BRAND_COLOR,
              },
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
              padding: "12px 24px",
              fontSize: "1rem",
            }}
          >
            {isLoading ? "Applying..." : "Apply Filters"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleClear}
            disabled={isLoading}
            startIcon={<ClearIcon />}
            sx={{
              borderColor: BRAND_COLOR,
              color: BRAND_COLOR,
              "&:hover": {
                borderColor: BRAND_COLOR_HOVER,
                backgroundColor: BRAND_COLOR_LIGHT,
              },
              "&:disabled": {
                borderColor: BRAND_COLOR_LIGHT,
                color: BRAND_COLOR_LIGHT,
              },
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
              padding: "12px 24px",
              fontSize: "1rem",
            }}
          >
            Clear All Filters
          </Button>
        </Box>

        {selectedCount > 0 && (
          <Alert
            severity="info"
            className="mt-3"
            sx={{
              backgroundColor: BRAND_COLOR_LIGHT,
              color: BRAND_COLOR,
              "& .MuiAlert-icon": { color: BRAND_COLOR },
            }}
          >
            {selectedCount} filter{selectedCount !== 1 ? "s" : ""} active
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default TourFilters;
