"use client";

import React, { useEffect, useMemo, useState, ReactElement } from "react";
import { useParams } from "next/navigation";
import { isValidObjectId } from "@/utils/common";
import { useWebsite } from "@/contexts/WebsiteProvider";
import { tourService } from "@/lib/api/services/tour.service";
import { Tour } from "@/lib/api/types/tour.types";

import AboutTourSection from "@/components/tour/AboutTourSection";
import ItinerarySection from "@/components/tour/ItinerarySection";
import BookingSidebar from "@/components/tour/BookingSidebar";
import { TourOptions } from "@/components/tour/TourOptions";
import TourQueryForm from "@/components/tour/TourQueryForm";
import {
  FlightTakeoff,
  DirectionsCar,
  Restaurant,
  Hotel,
  TravelExplore,
  CalendarMonth,
  AccessTime,
  Group,
  LocationOn,
  Star,
  Discount,
  Phone,
  WhatsApp,
  Email,
  Share,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Container,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Rating,
  Avatar,
  Badge,
} from "@mui/material";

// Enhanced inclusions with better icons and descriptions
const inclusions = [
  {
    label: "Flight",
    icon: <FlightTakeoff />,
    description: "Air travel included",
    color: "#3B82F6",
  },
  {
    label: "Transfer",
    icon: <DirectionsCar />,
    description: "Ground transportation",
    color: "#10B981",
  },
  {
    label: "Breakfast",
    icon: <Restaurant />,
    description: "Daily breakfast",
    color: "#F59E0B",
  },
  {
    label: "Hotel",
    icon: <Hotel />,
    description: "Accommodation included",
    color: "#8B5CF6",
  },
  {
    label: "Sightseeing",
    icon: <TravelExplore />,
    description: "Guided tours",
    color: "#EF4444",
  },
];

// Brand Colors
const BRAND_COLOR = "#C22A54";
const BRAND_COLOR_HOVER = "#A82046";
const BRAND_COLOR_LIGHT = "#FDECF2";

const TourDetailPage: React.FC = () => {
  const { websiteInfo } = useWebsite();
  const params = useParams();
  const tourId = params.id as string;
  const [data, setData] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const inclusiveData: {
    label: string;
    icon: ReactElement;
    highlight?: boolean;
    description: string;
    color: string;
  }[] = useMemo(() => {
    if (!data?.inclusive) return inclusions;

    return inclusions.map((inclusive) => {
      if (data.inclusive.includes(inclusive.label)) {
        return {
          ...inclusive,
          highlight: true,
        };
      }
      return inclusive;
    });
  }, [data?.inclusive]);

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (data?.discount && data.discount.type === "percent") {
      return data.discount.value;
    }
    return 0;
  }, [data?.discount]);

  // Calculate discounted price
  const discountedPrice = useMemo(() => {
    if (data?.pricing?.minFare && discountPercentage > 0) {
      return data.pricing.minFare * (1 - discountPercentage / 100);
    }
    return data?.pricing?.minFare || 0;
  }, [data?.pricing?.minFare, discountPercentage]);

  // Get route information
  const routeInfo = useMemo(() => {
    if (!data || !data.sources || !data.places) return null;

    const sourceNames = data.sources
      .map((s) => s.cityName || "Unknown")
      .join(" → ");
    const destinationNames = data.places
      .map((p) => p.name || "Unknown")
      .join(" → ");

    return {
      source: sourceNames,
      destination: destinationNames,
      totalDistance: `${data.days || 0} Days / ${data.nights || 0} Nights`,
    };
  }, [data]);

  useEffect(() => {
    const fetchTourDetails = async () => {
      if (isValidObjectId(tourId)) {
        try {
          setLoading(true);
          setError(null);
          const tourData = await tourService.getTourById(tourId);
          setData(tourData);
        } catch (error) {
          console.error("Error fetching tour details:", error);
          setError("Failed to load tour details. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid tour ID");
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTourDetails();
    }
  }, [tourId]);

  const handleOpenOptionsDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOptionsDialogOpen(true);
  };

  const handleOpenQueryModal = () => {
    setQueryModalOpen(true);
  };

  const handleCloseQueryModal = () => {
    setQueryModalOpen(false);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: data?.tourName || "Amazing Tour",
          text: data?.description || "Check out this amazing tour!",
          url: window.location.href,
        })
        .catch((error) => {
          console.warn("Error sharing:", error);
          // Fallback to clipboard
          navigator.clipboard.writeText(window.location.href);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  const handleWhatsApp = () => {
    const phone =
      websiteInfo?.phone ||
      (typeof data?.captainUserId === "object"
        ? data.captainUserId._id
        : data?.captainUserId);
    if (!phone) {
      // Fallback to a default number or show an error
      console.warn("No phone number available for WhatsApp");
      return;
    }
    const message = `Hi! I'm interested in the tour: ${
      data?.tourName || "this tour"
    }`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} sx={{ color: BRAND_COLOR }} />
          <Typography variant="h6" className="mt-4 text-gray-600">
            Loading tour details...
          </Typography>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Typography variant="h4" className="font-bold text-gray-800 mb-4">
            {error ? "Error Loading Tour" : "Tour Not Found"}
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-6">
            {error ||
              "The tour you're looking for doesn't exist or has been removed."}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              backgroundColor: BRAND_COLOR,
              "&:hover": { backgroundColor: BRAND_COLOR_HOVER },
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Don't render anything if data is not available
  if (!data) {
    return null;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <Container maxWidth="xl" className="py-6">
          {/* ===================== Hero Section ===================== */}
          <section className="relative w-full mb-8">
            {/* Hero Image with Gallery Support */}
            <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[55vh] rounded-2xl shadow-lg overflow-hidden">
              <img
                src={
                  data?.heroImage?.url ||
                  data?.gallery?.[0]?.url ||
                  "/images/public/home/6f58de3c4b3d1d5d94614fd604778a4c.png"
                }
                alt={data?.tourName}
                className="w-full h-full object-cover"
              />

              {/* Gallery Navigation */}
              {data?.gallery && data.gallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {data.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {discountPercentage}% OFF
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Tooltip title="Add to Favorites">
                  <IconButton
                    onClick={handleFavoriteToggle}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                    }}
                  >
                    {isFavorite ? (
                      <Favorite sx={{ color: "red" }} />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton
                    onClick={handleShare}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            {/* Tour Name and Types */}
            <div className="absolute top-16 left-4 sm:left-6 md:left-8 text-white bg-black/50 p-4 rounded-xl backdrop-blur-md border border-white/20 max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
                {data?.tourName}
              </h1>

              {/* Route Information */}
              {routeInfo && (
                <div className="mb-3 text-white/90">
                  <div className="flex items-center gap-2 mb-1">
                    <LocationOn className="text-xs" />
                    <span className="text-xs font-medium">
                      {routeInfo.source} → {routeInfo.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AccessTime className="text-xs" />
                    <span className="text-xs">{routeInfo.totalDistance}</span>
                  </div>
                </div>
              )}

              {/* Tour Types */}
              <div className="flex gap-2 flex-wrap">
                {data?.type && data.type.length > 0 ? (
                  data.type.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      size="small"
                      sx={{
                        backgroundColor: BRAND_COLOR,
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        "&:hover": { backgroundColor: BRAND_COLOR_HOVER },
                      }}
                    />
                  ))
                ) : (
                  <Chip
                    label="Tour"
                    size="small"
                    sx={{
                      backgroundColor: BRAND_COLOR,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Floating Booking Box - Responsive */}
            <div className="absolute bottom-[-60px] right-4 sm:top-8 sm:right-8 md:top-auto md:bottom-12 md:right-12 w-40 sm:w-56 bg-white text-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center gap-3 border border-gray-200">
              {/* Contact Actions */}
              <div className="flex justify-between w-full text-sm text-center text-[#C22A54]">
                <Tooltip title="Call us">
                  <a
                    className="flex flex-col items-center hover:scale-105 transition-transform"
                    href={`tel:${
                      websiteInfo?.phone ||
                      (typeof data?.captainUserId === "object"
                        ? data.captainUserId._id
                        : data?.captainUserId)
                    }`}
                  >
                    <Phone className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Call</span>
                  </a>
                </Tooltip>
                <Tooltip title="Send Query">
                  <button
                    onClick={handleOpenQueryModal}
                    className="flex flex-col items-center hover:scale-105 transition-transform"
                  >
                    <Email className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Query</span>
                  </button>
                </Tooltip>
                <Tooltip title="WhatsApp">
                  <button
                    onClick={handleWhatsApp}
                    className="flex flex-col items-center hover:scale-105 transition-transform"
                  >
                    <WhatsApp className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">WhatsApp</span>
                  </button>
                </Tooltip>
              </div>

              {/* Pricing */}
              <div className="text-center">
                {discountPercentage > 0 && (
                  <Typography
                    variant="caption"
                    className="text-gray-500 line-through block"
                  >
                    ₹{data?.pricing?.minFare?.toLocaleString()}
                  </Typography>
                )}
                <Typography variant="h5" className="font-bold text-[#C22A54]">
                  ₹{discountedPrice.toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gray-500 font-medium"
                >
                  per person
                </Typography>
                {discountPercentage > 0 && (
                  <Typography
                    variant="caption"
                    className="text-green-600 font-medium block"
                  >
                    Save ₹
                    {(
                      (data?.pricing?.minFare || 0) - discountedPrice
                    ).toLocaleString()}
                  </Typography>
                )}
              </div>

              {/* Group Discounts */}
              {data?.groupDiscounts && data.groupDiscounts.length > 0 && (
                <div className="text-center">
                  <Typography
                    variant="caption"
                    className="text-gray-600 block mb-1"
                  >
                    Group Discounts Available
                  </Typography>
                  {data.groupDiscounts.slice(0, 2).map((discount, index) => (
                    <Typography
                      key={index}
                      variant="caption"
                      className="text-green-600 block"
                    >
                      {discount.minMembers}+ people: {discount.value}
                      {discount.type === "percent" ? "%" : "₹"} off
                    </Typography>
                  ))}
                </div>
              )}

              {/* Multiple Options */}
              {data?.sources && data.sources.length > 1 && (
                <Button
                  variant="contained"
                  onClick={handleOpenOptionsDialog}
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    width: "100%",
                  }}
                >
                  {data.sources.length} Options Available
                </Button>
              )}
            </div>
          </section>

          {/* ========== Mobile/Tablet: Booking Box BEFORE Content ========== */}
          <div className="block lg:hidden mb-12">
            {data && (
              <BookingSidebar {...data} onQueryClick={handleOpenQueryModal} />
            )}
          </div>

          {/* ===================== Main Content Grid ===================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Tour Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* ===================== Quick Info Cards ===================== */}
              <section>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card className="text-center p-4">
                      <CalendarMonth className="text-4xl text-[#C22A54] mb-2" />
                      <Typography variant="h6" className="font-bold">
                        {data?.days || 0}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Days
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card className="text-center p-4">
                      <AccessTime className="text-4xl text-[#C22A54] mb-2" />
                      <Typography variant="h6" className="font-bold">
                        {data?.nights || 0}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Nights
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card className="text-center p-4">
                      <Group className="text-4xl text-[#C22A54] mb-2" />
                      <Typography variant="h6" className="font-bold">
                        {data?.capacity || 0}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Max Capacity
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card className="text-center p-4">
                      <Star className="text-4xl text-[#C22A54] mb-2" />
                      <Typography variant="h6" className="font-bold">
                        4.8
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Rating
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </section>

              {/* ===================== About Section ===================== */}
              <section>
                <AboutTourSection description={data?.description || ""} />
              </section>

              {/* ===================== Route & Destinations ===================== */}
              <section>
                <Typography
                  variant="h4"
                  className="font-bold text-gray-800 mb-6"
                >
                  Route & Destinations
                </Typography>
                <Card className="p-6">
                  <Grid container spacing={4}>
                    {/* Sources */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        className="font-semibold mb-3 text-[#C22A54]"
                      >
                        Starting Points
                      </Typography>
                      {data?.sources && data.sources.length > 0 ? (
                        data.sources.map((source, index) => (
                          <div
                            key={index}
                            className="mb-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <Typography
                              variant="subtitle1"
                              className="font-medium"
                            >
                              {source.cityName || "City"}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              Starting from ₹
                              {source.fare?.toLocaleString() || "0"}
                            </Typography>
                            {source.onBoarding &&
                              source.onBoarding.length > 0 && (
                                <div className="mt-2">
                                  <Typography
                                    variant="caption"
                                    className="text-gray-500"
                                  >
                                    Pickup points:{" "}
                                    {source.onBoarding.join(", ")}
                                  </Typography>
                                </div>
                              )}
                          </div>
                        ))
                      ) : (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <Typography variant="body2" className="text-gray-500">
                            No starting points available
                          </Typography>
                        </div>
                      )}
                    </Grid>

                    {/* Destinations */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        className="font-semibold mb-3 text-[#C22A54]"
                      >
                        Destinations
                      </Typography>
                      {data?.places && data.places.length > 0 ? (
                        data.places.map((place, index) => (
                          <div
                            key={index}
                            className="mb-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <Typography
                              variant="subtitle1"
                              className="font-medium"
                            >
                              {place.name || "Destination"}
                            </Typography>
                            {place.state && (
                              <Typography
                                variant="body2"
                                className="text-gray-600"
                              >
                                {place.state}
                              </Typography>
                            )}
                            {place.order && (
                              <Typography
                                variant="caption"
                                className="text-gray-500"
                              >
                                Stop {place.order}
                              </Typography>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <Typography variant="body2" className="text-gray-500">
                            No destinations available
                          </Typography>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Card>
              </section>

              {/* ===================== Inclusions Section ===================== */}
              <section>
                <Typography
                  variant="h4"
                  className="font-bold text-gray-800 mb-6"
                >
                  What&apos;s Included
                </Typography>
                <Card className="p-6">
                  <Grid container spacing={3}>
                    {inclusiveData && inclusiveData.length > 0 ? (
                      inclusiveData.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.label}>
                          <div
                            className={`text-center p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                              item?.highlight
                                ? "bg-[#FDECF2] border-2 border-[#C22A54]"
                                : "bg-gray-50"
                            }`}
                          >
                            <div
                              className="text-4xl mb-3 mx-auto"
                              style={{
                                color: item?.highlight
                                  ? BRAND_COLOR
                                  : item.color,
                              }}
                            >
                              {item.icon}
                            </div>
                            <Typography
                              variant="subtitle1"
                              className="font-semibold mb-1"
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              {item.description}
                            </Typography>
                          </div>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <div className="text-center p-8 bg-gray-50 rounded-lg">
                          <Typography variant="body2" className="text-gray-500">
                            No inclusions information available
                          </Typography>
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </section>

              {/* ===================== Itinerary Section ===================== */}
              {data?.itinerary && data.itinerary.length > 0 && (
                <section>
                  <ItinerarySection
                    itenary={data.itinerary.map((item) => ({
                      title: item.title,
                      shortDescription: item.shortDescription || "",
                      sightseeing: item.sightseeing || [],
                      toggles: item.toggles || [],
                    }))}
                  />
                </section>
              )}

              {/* ===================== Gallery Section ===================== */}
              {data?.gallery && data.gallery.length > 0 && (
                <section>
                  <Typography
                    variant="h4"
                    className="font-bold text-gray-800 mb-6"
                  >
                    Photo Gallery
                  </Typography>
                  <Grid container spacing={2}>
                    {data.gallery.map((image, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <img
                            src={image.url}
                            alt={`Tour image ${index + 1}`}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </section>
              )}

              {/* ===================== Additional Information ===================== */}
              <section>
                <Typography
                  variant="h4"
                  className="font-bold text-gray-800 mb-6"
                >
                  Additional Information
                </Typography>
                <Card className="p-6">
                  <Grid container spacing={4}>
                    {/* Stay Description */}
                    {data?.stayDescription &&
                      data.stayDescription.length > 0 && (
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="h6"
                            className="font-semibold mb-3 text-[#C22A54]"
                          >
                            Stay Details
                          </Typography>
                          {data.stayDescription.map((stay, index) => (
                            <div
                              key={index}
                              className="mb-2 p-2 bg-gray-50 rounded"
                            >
                              <Typography
                                variant="body2"
                                className="font-medium"
                              >
                                {stay.nights} night
                                {stay.nights !== 1 ? "s" : ""} in {stay.place}
                              </Typography>
                            </div>
                          ))}
                        </Grid>
                      )}

                    {/* Tour Details */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h6"
                        className="font-semibold mb-3 text-[#C22A54]"
                      >
                        Tour Details
                      </Typography>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {data?.duration || `${data?.days} days`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-medium">
                            {data?.capacity} people
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Chip
                            label={data?.status}
                            size="small"
                            color={
                              data?.status === "published"
                                ? "success"
                                : "warning"
                            }
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Card>
              </section>
            </div>

            {/* RIGHT: Sticky Booking Box (desktop only) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                {data && (
                  <BookingSidebar
                    {...data}
                    onQueryClick={handleOpenQueryModal}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Query Modal */}
      {queryModalOpen && data && (
        <TourQueryForm
          tourId={data._id}
          tourName={data.tourName}
          onClose={handleCloseQueryModal}
        />
      )}

      {/* Tour Options Modal */}
      {data?.sources && data.sources.length > 1 && (
        <TourOptions
          open={optionsDialogOpen}
          onClose={() => setOptionsDialogOpen(false)}
          tourTitle={data?.tourName || ""}
          minFair={data?.pricing?.minFare || 0}
          source={data?.sources}
        />
      )}
    </>
  );
};

export default TourDetailPage;
