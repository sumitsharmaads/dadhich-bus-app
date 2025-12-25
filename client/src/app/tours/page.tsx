"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import CallIcon from "@mui/icons-material/Call";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SearchIcon from "@mui/icons-material/Search";
import {
  Dialog,
  Checkbox,
  FormControlLabel,
  Slider,
  CircularProgress,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Grid,
  Container,
  Divider,
  Rating,
  Avatar,
  Tooltip,
  Fab,
  TextField,
} from "@mui/material";
import HelpWidget from "@/components/home/HelpWidget";
import { TourFilters } from "@/components/tours";
import { tourService } from "@/lib/api/services/tour.service";
import {
  Tour,
  TourFacets,
  TourSearchParams,
  TourPriceRange,
  TourListItem,
} from "@/lib/api/types/tour.types";
import { useWebsite } from "@/contexts/WebsiteProvider";

// Enhanced Brand Colors
const BRAND_COLOR = "#C22A54";
const BRAND_COLOR_HOVER = "#A82046";
const BRAND_TEXT_COLOR = "#C22A54";
const BRAND_COLOR_LIGHT = "#FDECF2";
const BRAND_COLOR_ULTRALIGHT_HOVER = "#FCE7F3";

// "Best Seller" Tag Styling
const BEST_SELLER_BG = `bg-[${BRAND_COLOR_LIGHT}]`;
const BEST_SELLER_TEXT = `text-[${BRAND_TEXT_COLOR}]`;
const BEST_SELLER_BORDER = `border border-[${BRAND_COLOR}]/30`;

const MUTED_ICON_COLOR = "text-gray-500";

const categories = [
  { label: "All", count: 20 },
  { label: "Devotional", count: 6 },
  { label: "Family", count: 5 },
  { label: "Adventure", count: 4 },
  { label: "Luxury", count: 5 },
];

// --- Tour Options Dialog ---
const TourOptionsDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  tour: TourListItem;
}> = ({ open, onClose, tour }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
        },
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Tour Sources & Options for {tour.tourName}
          </h3>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="space-y-4">
          {tour.sources && tour.sources.length > 0 ? (
            tour.sources.map((source, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#C22A54] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    Source {index + 1}: {source.cityName || "Unknown City"}
                  </h4>
                  <Chip
                    label={`₹${source.fare}`}
                    size="small"
                    className="bg-green-100 text-green-700"
                  />
                </div>

                {source.departureTime && (
                  <p className="text-sm text-gray-600 mb-2">
                    🕐 Departure: {source.departureTime}
                  </p>
                )}

                {source.arrivalTime && (
                  <p className="text-sm text-gray-600 mb-2">
                    🕐 Arrival: {source.arrivalTime}
                  </p>
                )}

                {source.onBoarding && source.onBoarding.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">
                      🚌 Boarding Points:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {source.onBoarding.map((point, idx) => (
                        <Chip
                          key={idx}
                          label={point}
                          size="small"
                          variant="outlined"
                          className="text-xs"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <LocationOnIcon className="text-4xl mx-auto mb-2 text-gray-400" />
              <p>No source information available for this tour.</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button
            variant="contained"
            onClick={onClose}
            className="w-full bg-[#C22A54] hover:bg-[#A82046]"
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

// --- Tour Card Component ---
const TourCard: React.FC<{ tour: TourListItem }> = ({ tour }) => {
  const { websiteInfo } = useWebsite();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    const tourUrl = `${window.location.origin}/tour/${tour._id}`;
    if (navigator.share) {
      navigator.share({
        title: tour.tourName,
        text: tour.description || "",
        url: tourUrl,
      });
    } else {
      navigator.clipboard.writeText(tourUrl);
      // You can add a toast notification here
    }
  };

  const handleCall = () => {
    if (websiteInfo?.contact?.phone) {
      window.open(`tel:${websiteInfo.contact.phone}`);
    }
  };

  // Helper functions to get route information
  const getRouteText = () => {
    if (
      tour.sources &&
      tour.places &&
      tour.sources.length > 0 &&
      tour.places.length > 0
    ) {
      const sourceNames = tour.sources
        .map((s) => s.cityName || "Unknown")
        .join(", ");
      const placeNames = tour.places.map((p) => p.name || "Unknown").join(", ");
      return `${sourceNames} → ${placeNames}`;
    }
    return "Route information not available";
  };

  const getDurationText = () => {
    if (tour.days && tour.nights) {
      return `${tour.days}D/${tour.nights}N`;
    } else if (tour.days) {
      return `${tour.days}D`;
    } else if (tour.nights) {
      return `${tour.nights}N`;
    }
    return "Duration not specified";
  };

  const getPriceText = () => {
    if (tour.pricing?.minFare) {
      return `₹${tour.pricing.minFare.toLocaleString()}`;
    }
    return "Price on request";
  };

  return (
    <>
      <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        {/* Compact Tour Image */}
        <div className="relative">
          <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
            <Typography
              variant="h6"
              className="text-white font-semibold text-center px-4 text-sm"
            >
              {tour.tourName}
            </Typography>
          </div>

          {/* Tour Type Badge */}
          {tour.type && tour.type.length > 0 && (
            <div className="absolute top-2 left-2">
              <Chip
                label={tour.type[0]}
                size="small"
                className="bg-primary-500 text-white border-0 text-xs"
              />
            </div>
          )}

          {/* Favorite Button */}
          <IconButton
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            size="small"
          >
            <FavoriteBorderIcon
              className={isFavorite ? "text-red-500" : "text-gray-600"}
              fontSize="small"
            />
          </IconButton>
        </div>

        <CardContent className="p-3">
          {/* Tour Title - Compact */}
          <Typography
            variant="subtitle1"
            className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm"
          >
            {tour.tourName}
          </Typography>

          {/* Tour Description - Compact */}
          <Typography
            variant="body2"
            className="text-gray-600 mb-3 line-clamp-2 text-xs"
          >
            {tour.description || "No description available"}
          </Typography>

          {/* Compact Tour Details Grid */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-gray-600">
                <LocationOnIcon className="text-primary-500 text-xs" />
                {getRouteText()}
              </span>
              <span className="text-primary-600 font-medium">
                {getDurationText()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-gray-600">
                <CalendarMonthIcon className="text-primary-500 text-xs" />
                {tour.startDate
                  ? new Date(tour.startDate).toLocaleDateString()
                  : "Dates not specified"}
              </span>
              <span className="text-gray-500">
                {tour.capacity ? `${tour.capacity} seats` : ""}
              </span>
            </div>
          </div>

          {/* Tour Type & Inclusions - Compact */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tour.type &&
              tour.type
                .slice(0, 2)
                .map((type, index) => (
                  <Chip
                    key={index}
                    label={type}
                    size="small"
                    className="bg-primary-100 text-primary-700 border border-primary-200 text-xs"
                  />
                ))}
            {tour.inclusive &&
              tour.inclusive
                .slice(0, 1)
                .map((inclusion, index) => (
                  <Chip
                    key={index}
                    label={inclusion}
                    size="small"
                    variant="outlined"
                    className="border-gray-300 text-gray-600 text-xs"
                  />
                ))}
          </div>

          {/* Price Section - Compact */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <Typography
                variant="h6"
                className="font-bold text-primary-600 text-lg"
              >
                {getPriceText()}
              </Typography>
              <Typography variant="caption" className="text-gray-500 text-xs">
                per person
              </Typography>
            </div>

            {tour.discount && (
              <div className="text-right">
                <Typography
                  variant="caption"
                  className="text-gray-500 line-through text-xs"
                >
                  ₹
                  {tour.pricing?.minFare
                    ? (tour.pricing.minFare * 1.2).toLocaleString()
                    : "N/A"}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-green-600 font-medium block text-xs"
                >
                  {tour.discount.type === "percent"
                    ? `${tour.discount.value}%`
                    : `₹${tour.discount.value}`}{" "}
                  OFF
                </Typography>
              </div>
            )}
          </div>
        </CardContent>

        <CardActions className="p-3 pt-0">
          <div className="flex gap-2 w-full">
            <Button
              variant="contained"
              component={Link}
              href={`/tour/${tour._id}`}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-sm"
              size="small"
            >
              View Details
            </Button>

            {tour.sources && tour.sources.length > 1 && (
              <Button
                variant="outlined"
                onClick={() => setOptionsOpen(true)}
                className="flex-1 border-primary-500 text-primary-600 hover:bg-primary-50 text-sm"
                size="small"
              >
                View Options ({tour.sources.length})
              </Button>
            )}

            <Tooltip title="Share Tour">
              <IconButton
                onClick={handleShare}
                size="small"
                className="border border-gray-300 hover:border-primary-500 hover:bg-primary-50"
              >
                <LinkIcon className="text-gray-600 text-sm" />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Call ${websiteInfo?.contact?.phone || "us"}`}>
              <IconButton
                onClick={handleCall}
                size="small"
                className="border border-gray-300 hover:border-primary-500 hover:bg-primary-50"
                disabled={!websiteInfo?.contact?.phone}
              >
                <CallIcon className="text-gray-600 text-sm" />
              </IconButton>
            </Tooltip>
          </div>
        </CardActions>
      </Card>

      <TourOptionsDialog
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        tour={tour}
      />
    </>
  );
};

// --- Main Tours Page Component ---
const ToursPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State management
  const [tours, setTours] = useState<TourListItem[]>([]);
  const [facets, setFacets] = useState<TourFacets | null>(null);
  const [priceRange, setPriceRange] = useState<TourPriceRange | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTours, setTotalTours] = useState(0);

  // Filter state
  const [filters, setFilters] = useState<TourSearchParams>({
    q: "",
    type: "",
    inclusive: "",
    priceMin: undefined,
    priceMax: undefined,
    daysMin: undefined,
    daysMax: undefined,
    sourceCity: "",
    placeCity: "",
    state: "",
    capacity: undefined,
    sortBy: "popularity",
  });

  // Mobile drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch tours with infinite scroll
  const fetchTours = useCallback(
    async (
      page: number,
      append: boolean = false,
      searchFilters?: TourSearchParams
    ) => {
      try {
        setLoading(true);
        const filtersToUse = searchFilters || filters;
        const response = await tourService.searchTours({
          ...filtersToUse,
          page,
          items: 10,
        });
        if (response.success && response.data) {
          const newTours = response.data.tours || [];
          const total = response.data.total || 0;

          if (append) {
            setTours((prev) => [...prev, ...newTours]);
          } else {
            setTours(newTours);
          }

          setTotalTours(total);
          setHasMore(
            newTours.length === 10 && tours.length + newTours.length < total
          );
          setCurrentPage(page);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tours");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load more tours for infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchTours(currentPage + 1, true, filters);
    }
  }, [loading, hasMore, currentPage, fetchTours, filters]);

  // Fetch facets on mount
  useEffect(() => {
    const fetchFacets = async () => {
      try {
        const response = await tourService.getFacets();
        if (response.success && response.data) {
          setFacets(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch facets:", err);
      }
    };

    fetchFacets();
  }, []);

  // Initial load
  useEffect(() => {
    fetchTours(1, false, filters);
  }, [fetchTours]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<TourSearchParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setTours([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchTours(1, false, filters);
    if (isMobile) {
      setMobileFiltersOpen(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: TourSearchParams = {
      q: "",
      type: "",
      inclusive: "",
      priceMin: undefined,
      priceMax: undefined,
      daysMin: undefined,
      daysMax: undefined,
      sourceCity: "",
      placeCity: "",
      state: "",
      capacity: undefined,
      sortBy: "popularity",
    };
    setFilters(clearedFilters);
    setTours([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchTours(1, false, clearedFilters);
  };

  // Mobile filter drawer
  const FilterDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileFiltersOpen}
      onClose={() => setMobileFiltersOpen(false)}
      PaperProps={{
        sx: {
          width: "85%",
          maxWidth: "400px",
        },
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-semibold">
            Filters & Search
          </Typography>
          <IconButton onClick={() => setMobileFiltersOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Mobile Search Bar */}
        <div className="flex gap-2 mb-4">
          <TextField
            fullWidth
            placeholder="Search tours... (Press Enter)"
            value={filters.q || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFilterChange({ q: e.target.value })
            }
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                handleApplyFilters();
              }
            }}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: BRAND_COLOR,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: BRAND_COLOR,
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            disabled={loading}
            startIcon={<SearchIcon />}
            sx={{
              backgroundColor: BRAND_COLOR,
              "&:hover": {
                backgroundColor: BRAND_COLOR_HOVER,
              },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              minWidth: "80px",
            }}
          >
            {loading ? "..." : "Go"}
          </Button>
        </div>

        <TourFilters
          facets={facets}
          priceRange={priceRange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
      </div>
    </Drawer>
  );

  if (error) {
    return (
      <Container maxWidth="lg" className="py-8">
        <div className="text-center">
          <Typography variant="h5" className="text-red-600 mb-4">
            Something went wrong!
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-4">
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            className="bg-[#C22A54] hover:bg-[#A82046]"
          >
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Button - Sticky */}
      {isMobile && (
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4">
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setMobileFiltersOpen(true)}
            className="w-full border-[#C22A54] text-[#C22A54] hover:border-[#A82046] hover:bg-[#FDECF2]"
          >
            Filters & Search
          </Button>
        </div>
      )}

      <Container maxWidth="xl" className="py-8">
        {/* Results Header */}
        <div className="mb-6">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Discover Amazing Tours
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-4">
            {totalTours > 0
              ? `Found ${totalTours} amazing tours`
              : "No tours found"}
          </Typography>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md mb-4">
            <TextField
              fullWidth
              placeholder="Search tours by name or description... (Press Enter to search)"
              value={filters.q || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange({ q: e.target.value })
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleApplyFilters();
                }
              }}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: BRAND_COLOR,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: BRAND_COLOR,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              disabled={loading}
              startIcon={<SearchIcon />}
              sx={{
                backgroundColor: BRAND_COLOR,
                "&:hover": {
                  backgroundColor: BRAND_COLOR_HOVER,
                },
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                minWidth: "100px",
              }}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              size="small"
              sx={{
                borderColor: BRAND_COLOR,
                color: BRAND_COLOR,
                "&:hover": {
                  borderColor: BRAND_COLOR_HOVER,
                  backgroundColor: BRAND_COLOR_LIGHT,
                },
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Reset Filters
            </Button>
            <Button
              variant="outlined"
              onClick={() => setMobileFiltersOpen(true)}
              size="small"
              startIcon={<FilterListIcon />}
              sx={{
                borderColor: BRAND_COLOR,
                color: BRAND_COLOR,
                "&:hover": {
                  borderColor: BRAND_COLOR_HOVER,
                  backgroundColor: BRAND_COLOR_LIGHT,
                },
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Advanced Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-6">
                <TourFilters
                  facets={facets}
                  priceRange={priceRange}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onApplyFilters={handleApplyFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          )}

          {/* Tours Grid */}
          <div className="flex-1">
            {/* Search Results Indicator */}
            {(filters.q ||
              filters.type ||
              filters.inclusive ||
              filters.sourceCity ||
              filters.placeCity ||
              filters.state ||
              filters.priceMin ||
              filters.priceMax ||
              filters.daysMin ||
              filters.daysMax ||
              filters.nightsMin ||
              filters.nightsMax ||
              filters.capacity ||
              filters.sortBy !== "popularity") && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Typography variant="body2" className="text-blue-800">
                  <strong>Search Results:</strong> Showing tours matching your
                  criteria
                  {filters.q && ` for "${filters.q}"`}
                  {filters.type &&
                    ` in ${filters.type.split(",").length} category(ies)`}
                  {filters.inclusive &&
                    ` with ${filters.inclusive.split(",").length} inclusion(s)`}
                  {filters.sourceCity && ` from ${filters.sourceCity}`}
                  {filters.placeCity && ` to ${filters.placeCity}`}
                  {filters.state && ` in ${filters.state}`}
                  {filters.priceMin &&
                    filters.priceMax &&
                    ` priced ₹${filters.priceMin}-₹${filters.priceMax}`}
                  {filters.daysMin &&
                    filters.daysMax &&
                    ` lasting ${filters.daysMin}-${filters.daysMax} days`}
                  {filters.sortBy &&
                    filters.sortBy !== "popularity" &&
                    ` sorted by ${filters.sortBy.replace("_", " ")}`}
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ color: "blue.600", mt: 1, p: 0, minWidth: "auto" }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
            {loading && tours.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-12">
                <CircularProgress className="text-[#C22A54] mb-4" />
                <Typography variant="body1" className="text-gray-600">
                  {filters.q ? "Searching for tours..." : "Loading tours..."}
                </Typography>
              </div>
            ) : tours && tours.length > 0 ? (
              <InfiniteScroll
                dataLength={tours.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center items-center py-8">
                    <CircularProgress className="text-[#C22A54]" />
                  </div>
                }
                endMessage={
                  <div className="text-center py-8">
                    <Typography variant="body1" className="text-gray-600">
                      You've seen all available tours!
                    </Typography>
                  </div>
                }
              >
                <Grid container spacing={2}>
                  {tours.map((tour, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      lg={4}
                      xl={3}
                      key={tour._id || index}
                    >
                      <TourCard tour={tour} />
                    </Grid>
                  ))}
                </Grid>
              </InfiniteScroll>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <LocationOnIcon className="text-gray-400 text-6xl mx-auto" />
                </div>
                <Typography variant="h6" className="text-gray-600 mb-2">
                  No tours found
                </Typography>
                <Typography variant="body1" className="text-gray-500 mb-4">
                  Try adjusting your filters or search criteria
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  className="border-[#C22A54] text-[#C22A54] hover:border-[#A82046] hover:bg-[#FDECF2]"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Filter Drawer */}
      <FilterDrawer />

      {/* Help Widget */}
      <HelpWidget />
    </div>
  );
};

export default ToursPage;
