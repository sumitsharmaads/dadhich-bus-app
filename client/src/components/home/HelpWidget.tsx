"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
} from "@mui/material";
import { inquiryService } from "@/lib/api/services/inquiry.service";
import { HelpWidgetRequest } from "@/lib/api/types/inquiry.types";

type CTAStyle = "friendly" | "playful" | "conversion";

const ctaPresets: Record<
  CTAStyle,
  { label: string; icon: string; button: string; header: string }
> = {
  friendly: {
    label: "🎯 Friendly & Helpful",
    icon: "💬",
    button: "💬 Need Help?",
    header: "We're here to help 😊",
  },
  playful: {
    label: "✨ Playful & Creative",
    icon: "✨",
    button: "✨ Let's Plan Something Fun!",
    header: "Adventure? Let's go 🚀",
  },
  conversion: {
    label: "🛫 Conversion-Focused",
    icon: "🛫",
    button: "🛫 Book Faster Now!",
    header: "Plan fast, travel faster! ✈️",
  },
};

const HelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ctaStyle, setCtaStyle] = useState<CTAStyle>("friendly");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formKey = "helpFormData";

  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(formKey);
      return saved
        ? JSON.parse(saved)
        : {
            name: "",
            email: "",
            phone: "",
            adults: "1",
            children: "0",
            destination: "",
          };
    }
    return {
      name: "",
      email: "",
      phone: "",
      adults: "1",
      children: "0",
      destination: "",
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStyle = localStorage.getItem("ctaStyle") as CTAStyle;
      if (savedStyle && ctaPresets[savedStyle]) {
        setCtaStyle(savedStyle);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone } = formData;
    if (!name || !email || !phone) {
      alert("Please fill in Name, Email, and Phone.");
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const inquiryData: HelpWidgetRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        adults: formData.adults,
        children: formData.children,
        destination: formData.destination.trim() || undefined,
      };

      const response = await inquiryService.submitHelpWidget(inquiryData);

      if (response.success) {
        setSubmitSuccess(true);
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(formKey, JSON.stringify(formData));
        }
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError(
          response.message || "Failed to submit inquiry. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to submit inquiry. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCTAChange = (style: CTAStyle) => {
    setCtaStyle(style);
    if (typeof window !== "undefined") {
      localStorage.setItem("ctaStyle", style);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const cta = ctaPresets[ctaStyle];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#C22A54] hover:bg-[#E53E3E] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-bounce"
          >
            {cta.button}
          </button>
        </div>
      )}

      {/* Chat Form */}
      {isOpen && (
        <div className="bg-white shadow-xl rounded-xl w-80 p-4 animate-slide-up transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-[#C22A54]">{cta.header}</h4>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-[#C22A54]"
            >
              ✕
            </button>
          </div>

          {/* CTA Style Switcher */}
          <div className="mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="cta-style-label">Widget Tone</InputLabel>
              <Select
                labelId="cta-style-label"
                label="Widget Tone"
                value={ctaStyle}
                onChange={(e) => handleCTAChange(e.target.value as CTAStyle)}
              >
                {Object.entries(ctaPresets).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <TextField
              size="small"
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextField
              size="small"
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <TextField
              size="small"
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 10,
              }}
            />
            <div className="flex gap-2">
              <TextField
                size="small"
                type="number"
                inputProps={{ min: 1 }}
                label="Adults"
                value={formData.adults}
                onChange={(e) =>
                  setFormData({ ...formData, adults: e.target.value })
                }
                className="w-1/2"
              />
              <TextField
                size="small"
                type="number"
                inputProps={{ min: 0 }}
                label="Children"
                value={formData.children}
                onChange={(e) =>
                  setFormData({ ...formData, children: e.target.value })
                }
                className="w-1/2"
              />
            </div>
            <TextField
              size="small"
              fullWidth
              label="Preferred Destination"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                background: "linear-gradient(to right, #C22A54, #E53E3E)",
                color: "#fff",
                borderRadius: 9999,
                py: 1,
                fontWeight: 700,
                "&:hover": { background: "#B81D48" },
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} color="inherit" />
                  Sending...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </form>

          {/* Success and Error Messages */}
          {submitSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Your inquiry has been submitted successfully! We&apos;ll get back
              to you soon.
            </Alert>
          )}

          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default HelpWidget;
