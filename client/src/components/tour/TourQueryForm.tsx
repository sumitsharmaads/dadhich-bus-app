"use client";

import React, { useState } from "react";
import { inquiryService } from "@/lib/api/services/inquiry.service";
import { successPopup, errorPopup } from "@/utils/errors/alerts";

interface TourQueryFormProps {
  tourId: string;
  tourName: string;
  onClose: () => void;
}

interface QueryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  tourId: string;
  tourName: string;
  route: string;
  approxDate?: string;
  passengers?: number;
}

const TourQueryForm: React.FC<TourQueryFormProps> = ({
  tourId,
  tourName,
  onClose,
}) => {
  const [formData, setFormData] = useState<QueryFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    tourId,
    tourName,
    route: `${window.location.origin}/tour/${tourId}`,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      errorPopup("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errorPopup("Please enter a valid email address");
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      errorPopup("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const response = await inquiryService.submitTourInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tourId: formData.tourId,
        tourName: formData.tourName,
        route: formData.route,
        approxDate: formData.approxDate,
        passengers: formData.passengers,
        message: formData.message,
      });

      if (response.success) {
        successPopup(
          "Your query has been submitted successfully! We'll get back to you soon."
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          tourId,
          tourName,
          route: `${window.location.origin}/tour/${tourId}`,
          approxDate: "",
          passengers: undefined,
        });
        onClose();
      } else {
        errorPopup("Failed to submit query. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      errorPopup("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-text-primary font-primary">
              Send Query
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
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
          <p className="text-sm text-text-secondary mt-2">
            Ask about{" "}
            <span className="font-semibold text-primary-500">{tourName}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Approximate Date */}
          <div>
            <label
              htmlFor="approxDate"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Preferred Travel Date
            </label>
            <input
              type="date"
              id="approxDate"
              name="approxDate"
              value={formData.approxDate || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Number of Passengers */}
          <div>
            <label
              htmlFor="passengers"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Number of Passengers
            </label>
            <input
              type="number"
              id="passengers"
              name="passengers"
              value={formData.passengers || ""}
              onChange={handleInputChange}
              min="1"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter number of passengers"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Your Query *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder="Tell us about your requirements, dates, group size, or any specific questions..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-text-primary rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Query"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourQueryForm;
