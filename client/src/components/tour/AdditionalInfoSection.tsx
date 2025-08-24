"use client";

import React from "react";
import { Grid, Card, Typography, Chip } from "@mui/material";
import { TravelExplore, AccessTime, Group, Hotel } from "@mui/icons-material";

interface AdditionalInfoSectionProps {
  data: any;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  data,
}) => {
  return (
    <section className="mb-8 sm:mb-12">
      <div className="text-center mb-6 sm:mb-8">
        <Typography
          variant="h4"
          className="font-black text-gray-800 mb-3 sm:mb-4 text-2xl sm:text-3xl"
        >
          Additional Information
        </Typography>
        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto rounded-full"></div>
      </div>

      <Card className="p-6 sm:p-8 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <Grid container spacing={{ xs: 4, sm: 6 }}>
          {/* Tour Details */}
          <Grid item xs={12} md={6}>
            <div className="text-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-[#C22A54] to-[#A82046] p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                <TravelExplore className="text-xl sm:text-2xl text-white" />
              </div>
              <Typography
                variant="h6"
                className="font-black text-[#C22A54] mb-2 text-lg sm:text-xl"
              >
                Tour Details
              </Typography>
              <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto rounded-full"></div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                    <AccessTime className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">
                    Duration:
                  </span>
                </div>
                <span className="font-bold text-base sm:text-lg text-[#C22A54]">
                  {data?.duration || `${data?.days} days`}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full">
                    <Group className="text-green-600 text-sm" />
                  </div>
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">
                    Capacity:
                  </span>
                </div>
                <span className="font-bold text-base sm:text-lg text-[#C22A54]">
                  {data?.capacity} people
                </span>
              </div>

              {data?.minCapacity && data?.maxCapacity && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-purple-100 p-1.5 sm:p-2 rounded-full">
                      <Group className="text-purple-600 text-sm" />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Group Size:
                    </span>
                  </div>
                  <span className="font-bold text-base sm:text-lg text-[#C22A54]">
                    {data.minCapacity} - {data.maxCapacity} people
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-orange-100 p-1.5 sm:p-2 rounded-full">
                    <div className="text-orange-600 text-sm font-bold">📊</div>
                  </div>
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">
                    Status:
                  </span>
                </div>
                <Chip
                  label={data?.status}
                  size="medium"
                  sx={{
                    backgroundColor:
                      data?.status === "published" ? "#10B981" : "#F59E0B",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.75rem sm:text-sm",
                    borderRadius: "20px",
                    padding: "6px 12px sm:8px 16px",
                  }}
                />
              </div>

              {data?.difficulty && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-red-100 p-1.5 sm:p-2 rounded-full">
                      <div className="text-red-600 text-sm font-bold">🏔️</div>
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Difficulty Level:
                    </span>
                  </div>
                  <Chip
                    label={data.difficulty}
                    size="medium"
                    sx={{
                      backgroundColor:
                        data.difficulty === "easy"
                          ? "#10B981"
                          : data.difficulty === "moderate"
                          ? "#F59E0B"
                          : "#EF4444",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.75rem sm:text-sm",
                      borderRadius: "20px",
                      padding: "6px 12px sm:8px 16px",
                    }}
                  />
                </div>
              )}

              {data?.fitnessLevel && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-full">
                      <div className="text-indigo-600 text-sm font-bold">
                        💪
                      </div>
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Fitness Required:
                    </span>
                  </div>
                  <span className="font-bold text-base sm:text-lg text-[#C22A54]">
                    {data.fitnessLevel}
                  </span>
                </div>
              )}

              {data?.category && (
                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-pink-100 p-1.5 sm:p-2 rounded-full">
                      <div className="text-pink-600 text-sm font-bold">🏷️</div>
                    </div>
                    <span className="text-gray-700 font-semibold text-sm sm:text-base">
                      Category:
                    </span>
                  </div>
                  <span className="font-bold text-base sm:text-lg text-[#C22A54]">
                    {data.category}
                  </span>
                </div>
              )}
            </div>
          </Grid>

          {/* Stay Description */}
          {data?.stayDescription && data.stayDescription.length > 0 && (
            <Grid item xs={12} md={6}>
              <div className="text-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-[#C22A54] to-[#A82046] p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                  <Hotel className="text-xl sm:text-2xl text-white" />
                </div>
                <Typography
                  variant="h6"
                  className="font-black text-[#C22A54] mb-2 text-lg sm:text-xl"
                >
                  Stay Details
                </Typography>
                <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto rounded-full"></div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {data.stayDescription.map((stay: any, index: number) => (
                  <div
                    key={index}
                    className="group p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-800 group-hover:text-[#C22A54] transition-colors text-base sm:text-lg"
                      >
                        {stay.nights} night{stay.nights !== 1 ? "s" : ""} in{" "}
                        {stay.place}
                      </Typography>
                      <div className="bg-gradient-to-br from-[#C22A54] to-[#A82046] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                        {stay.nights}N
                      </div>
                    </div>

                    {stay.accommodation && (
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Hotel className="text-sm" />
                        <Typography
                          variant="body2"
                          className="font-medium text-sm"
                        >
                          {stay.accommodation}
                        </Typography>
                      </div>
                    )}

                    {stay.checkIn && stay.checkOut && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <AccessTime className="text-sm" />
                        <Typography
                          variant="body2"
                          className="font-medium text-sm"
                        >
                          Check-in: {stay.checkIn} | Check-out: {stay.checkOut}
                        </Typography>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Grid>
          )}

          {/* Age Group & Special Requirements */}
          {((data?.ageGroup && data.ageGroup.length > 0) ||
            (data?.specialRequirements &&
              data.specialRequirements.length > 0)) && (
            <Grid item xs={12} md={6}>
              <div className="text-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-[#C22A54] to-[#A82046] p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                  <div className="text-white text-lg sm:text-2xl font-bold">
                    ⚠️
                  </div>
                </div>
                <Typography
                  variant="h6"
                  className="font-black text-[#C22A54] mb-2 text-lg sm:text-xl"
                >
                  Requirements & Restrictions
                </Typography>
                <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto rounded-full"></div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {data?.ageGroup && data.ageGroup.length > 0 && (
                  <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <Typography
                      variant="h6"
                      className="text-gray-800 mb-2 sm:mb-3 font-bold text-base sm:text-lg"
                    >
                      👥 Age Group:
                    </Typography>
                    <div className="flex gap-2 flex-wrap">
                      {data.ageGroup.map((age: string, index: number) => (
                        <Chip
                          key={index}
                          label={age}
                          size="medium"
                          sx={{
                            backgroundColor: "rgba(194, 42, 84, 0.1)",
                            color: "#C22A54",
                            border: "2px solid rgba(194, 42, 84, 0.2)",
                            fontWeight: 600,
                            fontSize: "0.75rem sm:text-sm",
                            borderRadius: "20px",
                            padding: "6px 12px sm:8px 16px",
                            "&:hover": {
                              backgroundColor: "rgba(194, 42, 84, 0.2)",
                            },
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {data?.specialRequirements &&
                  data.specialRequirements.length > 0 && (
                    <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                      <Typography
                        variant="h6"
                        className="text-gray-800 mb-2 sm:mb-3 font-bold text-base sm:text-lg"
                      >
                        🎯 Special Requirements:
                      </Typography>
                      <div className="flex gap-2 flex-wrap">
                        {data.specialRequirements.map(
                          (req: string, index: number) => (
                            <Chip
                              key={index}
                              label={req}
                              size="medium"
                              sx={{
                                backgroundColor: "rgba(168, 32, 70, 0.1)",
                                color: "#A82046",
                                border: "2px solid rgba(168, 32, 70, 0.2)",
                                fontWeight: 600,
                                fontSize: "0.75rem sm:text-sm",
                                borderRadius: "20px",
                                padding: "6px 12px sm:8px 16px",
                                "&:hover": {
                                  backgroundColor: "rgba(168, 32, 70, 0.2)",
                                },
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </Grid>
          )}

          {/* Cancellation & Refund Policies */}
          {(data?.cancellationPolicy || data?.refundPolicy) && (
            <Grid item xs={12} md={6}>
              <div className="text-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-[#C22A54] to-[#A82046] p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                  <div className="text-white text-lg sm:text-2xl font-bold">
                    📋
                  </div>
                </div>
                <Typography
                  variant="h6"
                  className="font-black text-[#C22A54] mb-2 text-lg sm:text-xl"
                >
                  Policies
                </Typography>
                <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#C22A54] to-[#A82046] mx-auto rounded-full"></div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {data?.cancellationPolicy && (
                  <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <Typography
                      variant="h6"
                      className="text-gray-800 mb-2 sm:mb-3 font-bold text-base sm:text-lg"
                    >
                      ❌ Cancellation Policy:
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-gray-700 leading-relaxed text-sm sm:text-base"
                    >
                      {data.cancellationPolicy}
                    </Typography>
                  </div>
                )}

                {data?.refundPolicy && (
                  <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <Typography
                      variant="h6"
                      className="text-gray-800 mb-2 sm:mb-3 font-bold text-base sm:text-lg"
                    >
                      💰 Refund Policy:
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-gray-700 leading-relaxed text-sm sm:text-base"
                    >
                      {data.refundPolicy}
                    </Typography>
                  </div>
                )}
              </div>
            </Grid>
          )}
        </Grid>
      </Card>
    </section>
  );
};

export default AdditionalInfoSection;
