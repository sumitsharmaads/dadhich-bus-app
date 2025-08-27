"use client";

import React, { useEffect, useMemo, useState } from "react";
import { isValidObjectId } from "@/utils/common";
import { useWebsite } from "@/contexts/WebsiteProvider";
import { Tour } from "@/lib/api/types/tour.types";
import { tourService } from "@/lib/api/services/tour.service";
import { INCLUSIVE_FEATURES } from "@/constants/tourConstants";

import AboutTourSection from "@/components/tour/AboutTourSection";
import BookingSidebar from "@/components/tour/BookingSidebar";
import { TourOptions } from "@/components/tour/TourOptions";
import TourQueryForm from "@/components/tour/TourQueryForm";
import TourHeroSection from "@/components/tour/TourHeroSection";
import QuickInfoCards from "@/components/tour/QuickInfoCards";
import InclusionsSection from "@/components/tour/InclusionsSection";
import RouteDestinationsSection from "@/components/tour/RouteDestinationsSection";
import TourHighlightsSection from "@/components/tour/TourHighlightsSection";
import TourItinerarySection from "@/components/tour/TourItinerarySection";
import TourGallerySection from "@/components/tour/TourGallerySection";
import DetailedPricingSection from "@/components/tour/DetailedPricingSection";
import AdditionalInfoSection from "@/components/tour/AdditionalInfoSection";
import { Typography, Button, Container, CircularProgress } from "@mui/material";

// Helper functions for inclusions
const getInclusionIcon = (item: string): string => {
  const iconMap: Record<string, string> = {
    // Accommodation & Meals
    accommodation: "🏨",
    "meals (breakfast)": "🍳",
    "meals (lunch)": "🍽️",
    "meals (dinner)": "🍴",
    "all meals": "🍽️",

    // Transportation
    transportation: "🚌",
    "airport transfer": "✈️",
    "local transport": "🚗",
    "boat transfer": "🚢",
    "flight tickets": "✈️",
    "train tickets": "🚂",
    "bus tickets": "🚌",

    // Services
    "guide services": "👨‍💼",
    "entrance fees": "🎫",
    activities: "🎯",
    "equipment rental": "🎒",
    insurance: "🛡️",
    "visa assistance": "📋",

    // Amenities
    "welcome drink": "🥤",
    snacks: "🍿",
    "water bottles": "💧",
    wifi: "📶",
    "air conditioning": "❄️",
    "room service": "🛎️",
    "laundry service": "👕",
    "spa access": "💆",
    "pool access": "🏊",
    "gym access": "💪",
    parking: "🅿️",
    "pickup & drop": "🚐",
  };

  const key = item.toLowerCase();
  return iconMap[key] || "✅";
};

const getInclusionDescription = (item: string): string => {
  return `${item} included`;
};

const getInclusionColor = (index: number): string => {
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ];
  return colors[index % colors.length];
};

// Brand Colors
const BRAND_COLOR = "#C22A54";
const BRAND_COLOR_HOVER = "#A82046";

interface TourDetailPageClientProps {
  tourId: string;
}

const TourDetailPageClient: React.FC<TourDetailPageClientProps> = ({
  tourId,
}) => {
  const { websiteInfo } = useWebsite();
  const [data, setData] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const inclusiveData = useMemo(() => {
    if (!data?.inclusive || !Array.isArray(data.inclusive)) return [];
    return data.inclusive.map((item, index) => ({
      label: item,
      icon: getInclusionIcon(item),
      description: getInclusionDescription(item),
      color: getInclusionColor(index),
      highlight: true,
    }));
  }, [data?.inclusive]);

  const discountPercentage = useMemo(() => {
    if (data?.discount && data.discount.type === "percent") {
      return data.discount.value;
    }
    return 0;
  }, [data?.discount]);

  const discountedPrice = useMemo(() => {
    if (data?.pricing?.minFare && discountPercentage > 0) {
      return data.pricing.minFare * (1 - discountPercentage / 100);
    }
    return data?.pricing?.minFare || 0;
  }, [data?.pricing?.minFare, discountPercentage]);

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

  const handleOpenQueryModal = () => setQueryModalOpen(true);
  const handleCloseQueryModal = () => setQueryModalOpen(false);
  const handleFavoriteToggle = () => setIsFavorite(!isFavorite);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: data?.tourName || "Amazing Tour",
          text: data?.description || "Check out this amazing tour!",
          url: window.location.href,
        })
        .catch(() => navigator.clipboard.writeText(window.location.href));
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleWhatsApp = () => {
    const phone =
      (typeof data?.captainUserId === "object"
        ? data?.captainUserId?.phone
        : websiteInfo?.contact?.phone) || websiteInfo?.contact?.phone;
    if (!phone) return;
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

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <Container maxWidth="xl" className="py-4 sm:py-6">
          {/* Hero Section */}
          <TourHeroSection
            data={data}
            discountPercentage={discountPercentage}
            discountedPrice={discountedPrice}
            routeInfo={routeInfo}
            isFavorite={isFavorite}
            currentImageIndex={currentImageIndex}
            onFavoriteToggle={handleFavoriteToggle}
            onShare={handleShare}
            onOpenQueryModal={handleOpenQueryModal}
            onWhatsApp={handleWhatsApp}
            onOpenOptionsDialog={handleOpenOptionsDialog}
            onImageIndexChange={setCurrentImageIndex}
            websiteInfo={websiteInfo}
          />

          {/* Mobile/Tablet: Booking Box */}
          <div className="block lg:hidden mb-8 sm:mb-12">
            {data && (
              <BookingSidebar {...data} onQueryClick={handleOpenQueryModal} />
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* About Section */}
              <section>
                <AboutTourSection description={data?.description || ""} />
              </section>

              {/* Quick Info Cards */}
              <QuickInfoCards data={data} />

              {/* Route & Destinations Section - Moved up for better UX */}
              <RouteDestinationsSection data={data} />

              {/* Inclusions Section */}
              <InclusionsSection inclusiveData={inclusiveData} />

              {/* Detailed Pricing Section - Moved up for decision making */}
              <DetailedPricingSection
                pricing={data?.pricing}
                groupDiscounts={data?.groupDiscounts || []}
              />

              {/* Tour Highlights Section */}
              <TourHighlightsSection highlights={data?.highlights || []} />

              {/* Tour Itinerary Section */}
              <TourItinerarySection itinerary={data?.itinerary || []} />

              {/* Tour Gallery Section */}
              <TourGallerySection gallery={data?.gallery || []} />

              {/* Additional Information Section */}
              <AdditionalInfoSection data={data} />
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

export default TourDetailPageClient;
