"use client";

import React from "react";
import { Grid, Card, Typography } from "@mui/material";
import { Group } from "@mui/icons-material";

interface DetailedPricingSectionProps {
  pricing: any;
  groupDiscounts: any[];
}

const DetailedPricingSection: React.FC<DetailedPricingSectionProps> = ({
  pricing,
  groupDiscounts,
}) => {
  if (!pricing) {
    return null;
  }

  return (
    <section className="mb-8 sm:mb-12">
      <div className="text-center mb-6 sm:mb-8">
        <Typography
          variant="h4"
          className="font-black text-gray-800 mb-3 sm:mb-4 text-2xl sm:text-3xl"
        >
          Pricing Details
        </Typography>
        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto rounded-full"></div>
      </div>

      <Card className="p-6 sm:p-8 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <Grid container spacing={{ xs: 4, sm: 6 }}>
          {/* Base Pricing */}
          <Grid item xs={12} md={6}>
            <div className="text-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-[#C22A54] to-[#A82046] p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                <div className="text-white text-lg sm:text-2xl font-bold">
                  ₹
                </div>
              </div>
              <Typography
                variant="h6"
                className="font-black text-[#C22A54] mb-2 text-lg sm:text-xl"
              >
                Base Pricing
              </Typography>
              <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto rounded-full"></div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full">
                    <Group className="text-green-600 text-sm" />
                  </div>
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">
                    Adult Price:
                  </span>
                </div>
                <span className="font-black text-lg sm:text-xl text-[#C22A54]">
                  ₹
                  {pricing?.adultPrice?.toLocaleString() ||
                    pricing?.minFare?.toLocaleString() ||
                    "0"}
                </span>
              </div>

              {pricing?.childPrice && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                      <Group className="text-blue-600 text-sm" />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Child Price:
                    </span>
                  </div>
                  <span className="font-black text-lg sm:text-xl text-[#C22A54]">
                    ₹{pricing.childPrice.toLocaleString()}
                  </span>
                </div>
              )}

              {pricing?.infantPrice && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-purple-100 p-1.5 sm:p-2 rounded-full">
                      <Group className="text-purple-600 text-sm" />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Infant Price:
                    </span>
                  </div>
                  <span className="font-black text-lg sm:text-xl text-[#C22A54]">
                    ₹{pricing.infantPrice.toLocaleString()}
                  </span>
                </div>
              )}

              {pricing?.singleSupplement && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-orange-100 p-1.5 sm:p-2 rounded-full">
                      <Group className="text-orange-600 text-sm" />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Single Supplement:
                    </span>
                  </div>
                  <span className="font-black text-lg sm:text-xl text-[#C22A54]">
                    ₹{pricing.singleSupplement.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </Grid>

          {/* Additional Charges */}
          <Grid item xs={12} md={6}>
            <div className="text-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-[#C22A54] to-[#A82046] p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                <div className="text-white text-lg sm:text-2xl font-bold">
                  +
                </div>
              </div>
              <Typography
                variant="h6"
                className="font-black text-[#C22A54] mb-2 text-lg sm:text-xl"
              >
                Additional Charges
              </Typography>
              <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto rounded-full"></div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {pricing?.taxes && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-red-100 p-1.5 sm:p-2 rounded-full">
                      <div className="text-red-600 text-sm font-bold">₹</div>
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Taxes:
                    </span>
                  </div>
                  <span className="font-black text-lg sm:text-xl text-[#C22A54]">
                    ₹{pricing.taxes.toLocaleString()}
                  </span>
                </div>
              )}

              {pricing?.serviceCharge && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-full">
                      <div className="text-yellow-600 text-sm font-bold">
                        ⚡
                      </div>
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Service Charge:
                    </span>
                  </div>
                  <span className="font-black text-lg sm:text-xl text-[#C22A54]">
                    ₹{pricing.serviceCharge.toLocaleString()}
                  </span>
                </div>
              )}

              {pricing?.currencyCode && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-full">
                      <div className="text-indigo-600 text-sm font-bold">
                        💱
                      </div>
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Currency:
                    </span>
                  </div>
                  <span className="font-black text-lg sm:text-xl text-[#C22A54]">
                    {pricing.currencyCode}
                  </span>
                </div>
              )}
            </div>
          </Grid>

          {/* Group Discounts */}
          {groupDiscounts && groupDiscounts.length > 0 && (
            <Grid item xs={12}>
              <div className="text-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                  <div className="text-white text-lg sm:text-2xl font-bold">
                    🎉
                  </div>
                </div>
                <Typography
                  variant="h6"
                  className="font-black text-green-600 mb-2 text-lg sm:text-xl"
                >
                  Group Discounts
                </Typography>
                <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {groupDiscounts.map((discount, index) => (
                  <div
                    key={index}
                    className="group p-4 sm:p-6 bg-gradient-to-br from-green-50 to-white rounded-xl sm:rounded-2xl border border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-lg font-black mb-2 sm:mb-3 inline-block">
                        {discount.minMembers}+ people
                      </div>
                      <Typography
                        variant="h5"
                        className="font-black text-green-600 mb-2 text-lg sm:text-xl"
                      >
                        {discount.value}
                        {discount.type === "percent" ? "%" : "₹"} off
                      </Typography>
                      {discount.description && (
                        <Typography
                          variant="body2"
                          className="text-green-700 font-medium text-sm"
                        >
                          {discount.description}
                        </Typography>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Grid>
          )}
        </Grid>
      </Card>
    </section>
  );
};

export default DetailedPricingSection;
