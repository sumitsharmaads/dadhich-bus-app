"use client";

import React from "react";
import { Typography, Button, Tooltip } from "@mui/material";
import {
  Phone,
  Email,
  WhatsApp,
  Share,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";

interface TourHeroSectionProps {
  data: any;
  discountPercentage: number;
  discountedPrice: number;
  routeInfo: any;
  isFavorite: boolean;
  currentImageIndex: number;
  onFavoriteToggle: () => void;
  onShare: () => void;
  onOpenQueryModal: () => void;
  onWhatsApp: () => void;
  onOpenOptionsDialog: (e: React.MouseEvent) => void;
  onImageIndexChange: (index: number) => void;
  websiteInfo: any;
}

const TourHeroSection: React.FC<TourHeroSectionProps> = ({
  data,
  discountPercentage,
  discountedPrice,
  routeInfo,
  isFavorite,
  currentImageIndex,
  onFavoriteToggle,
  onShare,
  onOpenQueryModal,
  onWhatsApp,
  onOpenOptionsDialog,
  onImageIndexChange,
  websiteInfo,
}) => {
  return (
    <section className="relative mb-8">
      {/* Hero Image Container */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden">
        {/* Main Image */}
        <img
          src={
            data?.gallery?.[currentImageIndex]?.url || data?.gallery?.[0]?.url
          }
          alt={data?.tourName}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Top Actions Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          {/* Left: Discount Badge */}
          {discountPercentage > 0 && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Right: Action Buttons */}
          <div className="flex gap-2">
            <Tooltip title="Share" placement="bottom">
              <button
                onClick={onShare}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              >
                <Share className="text-white text-lg" />
              </button>
            </Tooltip>
            <Tooltip
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              placement="bottom"
            >
              <button
                onClick={onFavoriteToggle}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              >
                {isFavorite ? (
                  <Favorite className="text-red-500 text-lg" />
                ) : (
                  <FavoriteBorder className="text-white text-lg" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Typography
            variant="h3"
            className="font-bold mb-2 text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-lg"
          >
            {data?.tourName}
          </Typography>

          {routeInfo && (
            <div className="space-y-1">
              <Typography
                variant="body1"
                className="font-medium text-white/95 drop-shadow-md"
              >
                {routeInfo.source} → {routeInfo.destination}
              </Typography>
              <Typography
                variant="body2"
                className="text-white/90 drop-shadow-md"
              >
                {routeInfo.totalDistance}
              </Typography>
            </div>
          )}
        </div>

        {/* Gallery Navigation */}
        {data?.gallery && data.gallery.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {data.gallery.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => onImageIndexChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Integrated Booking Card */}
      <div className="block lg:hidden mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Pricing Section */}
          <div className="text-center mb-6">
            {discountPercentage > 0 && (
              <Typography
                variant="body2"
                className="text-gray-500 line-through mb-1"
              >
                ₹{data?.pricing?.minFare?.toLocaleString()}
              </Typography>
            )}
            <Typography variant="h4" className="font-bold text-[#C22A54] mb-1">
              ₹{discountedPrice.toLocaleString()}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              per person
            </Typography>
            {discountPercentage > 0 && (
              <div className="mt-2 inline-block px-3 py-1 bg-green-50 rounded-full border border-green-200">
                <Typography
                  variant="caption"
                  className="text-green-700 font-semibold"
                >
                  Save ₹
                  {(
                    (data?.pricing?.minFare || 0) - discountedPrice
                  ).toLocaleString()}
                </Typography>
              </div>
            )}
          </div>

          {/* Contact Actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Tooltip title="Call us" placement="top">
              <a
                href={`tel:${
                  websiteInfo?.phone ||
                  (typeof data?.captainUserId === "object"
                    ? data.captainUserId._id
                    : data?.captainUserId)
                }`}
                className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-[#C22A54] rounded-full flex items-center justify-center mb-2">
                  <Phone className="text-white text-sm" />
                </div>
                <span className="text-xs font-medium text-gray-700">Call</span>
              </a>
            </Tooltip>

            <Tooltip title="Send Query" placement="top">
              <button
                onClick={onOpenQueryModal}
                className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-[#C22A54] rounded-full flex items-center justify-center mb-2">
                  <Email className="text-white text-sm" />
                </div>
                <span className="text-xs font-medium text-gray-700">Query</span>
              </button>
            </Tooltip>

            <Tooltip title="WhatsApp" placement="top">
              <button
                onClick={onWhatsApp}
                className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <WhatsApp className="text-white text-sm" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  WhatsApp
                </span>
              </button>
            </Tooltip>
          </div>

          {/* Group Discounts */}
          {data?.groupDiscounts && data.groupDiscounts.length > 0 && (
            <div className="text-center mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
              <Typography
                variant="body2"
                className="text-green-700 font-semibold mb-2"
              >
                🎉 Group Discounts Available
              </Typography>
              <div className="space-y-1">
                {data.groupDiscounts
                  .slice(0, 2)
                  .map((discount: any, index: number) => (
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
            </div>
          )}

          {/* Multiple Options Button */}
          {data?.sources && data.sources.length > 1 && (
            <Button
              variant="contained"
              onClick={onOpenOptionsDialog}
              fullWidth
              sx={{
                background: "linear-gradient(135deg, #C22A54 0%, #A82046 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #A82046 0%, #8B1A3A 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(194, 42, 84, 0.2)",
                },
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                padding: "12px 24px",
                transition: "all 0.2s ease",
              }}
            >
              View {data.sources.length} Options
            </Button>
          )}
        </div>
      </div>

      {/* Desktop: Floating Booking Card */}
      <div className="hidden lg:block absolute top-8 right-8 w-80 bg-white/95 backdrop-blur-xl text-gray-800 rounded-2xl shadow-2xl p-6 border border-white/20">
        {/* Contact Actions */}
        <div className="flex justify-between w-full text-sm text-center mb-6">
          <Tooltip title="Call us" placement="top">
            <a
              href={`tel:${
                websiteInfo?.phone ||
                (typeof data?.captainUserId === "object"
                  ? data.captainUserId._id
                  : data?.captainUserId)
              }`}
              className="flex flex-col items-center hover:scale-110 transition-transform duration-300 group"
            >
              <div className="bg-[#C22A54] p-3 rounded-full mb-2 group-hover:bg-[#A82046] transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#C22A54]">Call</span>
            </a>
          </Tooltip>

          <Tooltip title="Send Query" placement="top">
            <button
              onClick={onOpenQueryModal}
              className="flex flex-col items-center hover:scale-110 transition-transform duration-300 group"
            >
              <div className="bg-[#C22A54] p-3 rounded-full mb-2 group-hover:bg-[#A82046] transition-colors">
                <Email className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#C22A54]">
                Query
              </span>
            </button>
          </Tooltip>

          <Tooltip title="WhatsApp" placement="top">
            <button
              onClick={onWhatsApp}
              className="flex flex-col items-center hover:scale-110 transition-transform duration-300 group"
            >
              <div className="bg-green-500 p-3 rounded-full mb-2 group-hover:bg-green-600 transition-colors">
                <WhatsApp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600">
                WhatsApp
              </span>
            </button>
          </Tooltip>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          {discountPercentage > 0 && (
            <Typography
              variant="body1"
              className="text-gray-500 line-through mb-2"
            >
              ₹{data?.pricing?.minFare?.toLocaleString()}
            </Typography>
          )}
          <Typography variant="h4" className="font-bold text-[#C22A54] mb-2">
            ₹{discountedPrice.toLocaleString()}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            per person
          </Typography>
          {discountPercentage > 0 && (
            <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
              <Typography
                variant="body2"
                className="text-green-700 font-semibold"
              >
                Save ₹
                {(
                  (data?.pricing?.minFare || 0) - discountedPrice
                ).toLocaleString()}
              </Typography>
            </div>
          )}
        </div>

        {/* Group Discounts */}
        {data?.groupDiscounts && data.groupDiscounts.length > 0 && (
          <div className="text-center mb-6">
            <Typography
              variant="body2"
              className="text-gray-600 mb-2 font-semibold"
            >
              🎉 Group Discounts Available
            </Typography>
            <div className="space-y-1">
              {data.groupDiscounts
                .slice(0, 2)
                .map((discount: any, index: number) => (
                  <Typography
                    key={index}
                    variant="body2"
                    className="text-green-600 font-medium"
                  >
                    {discount.minMembers}+ people: {discount.value}
                    {discount.type === "percent" ? "%" : "₹"} off
                  </Typography>
                ))}
            </div>
          </div>
        )}

        {/* Multiple Options */}
        {data?.sources && data.sources.length > 1 && (
          <Button
            variant="contained"
            onClick={onOpenOptionsDialog}
            fullWidth
            sx={{
              background: "linear-gradient(135deg, #C22A54 0%, #A82046 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #A82046 0%, #8B1A3A 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(194, 42, 84, 0.2)",
              },
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              padding: "12px 24px",
              transition: "all 0.2s ease",
            }}
          >
            {data.sources.length} Options Available
          </Button>
        )}
      </div>
    </section>
  );
};

export default TourHeroSection;
