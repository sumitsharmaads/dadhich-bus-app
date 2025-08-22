"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TravelExplore } from "@mui/icons-material";
import { inquiryService } from "@/lib/api/services/inquiry.service";
import { CustomTourPlanningRequest } from "@/lib/api/types/inquiry.types";

interface PlanMyTourModalProps {
  open: boolean;
  onClose: () => void;
}

const PlanMyTourModal: React.FC<PlanMyTourModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    from: "",
    departureDate: "",
    days: "",
    adults: "",
    children: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = "Full name is required";
    if (!/^\d{10}$/.test(formData.phone))
      nextErrors.phone = "Enter a valid 10-digit mobile number";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      nextErrors.email = "Enter a valid email";
    if (!formData.from.trim()) nextErrors.from = "City is required";
    if (formData.days && isNaN(Number(formData.days)))
      nextErrors.days = "Enter a valid number of days";
    if (formData.adults && isNaN(Number(formData.adults)))
      nextErrors.adults = "Enter a valid number";
    if (formData.children && isNaN(Number(formData.children)))
      nextErrors.children = "Enter a valid number";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const inquiryData: CustomTourPlanningRequest = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        from: formData.from.trim(),
        departureDate: formData.departureDate || undefined,
        days: formData.days || undefined,
        adults: formData.adults || undefined,
        children: formData.children || undefined,
        message: formData.message.trim() || undefined,
      };

      const response = await inquiryService.submitCustomTourPlanning(
        inquiryData
      );

      if (response.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          from: "",
          departureDate: "",
          days: "",
          adults: "",
          children: "",
          message: "",
        });
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      from: "",
      departureDate: "",
      days: "",
      adults: "",
      children: "",
      message: "",
    });
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="plan-tour-modal"
      aria-describedby="plan-tour-form"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 600,
          bgcolor: "var(--color-surface-primary)",
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Header */}
          <Box
            sx={{
              p: 4,
              pb: 2,
              position: "relative",
              borderBottom: "1px solid var(--color-neutral-200)",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box textAlign="center">
              <TravelExplore
                sx={{
                  fontSize: 48,
                  color: "var(--color-primary-500)",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                Plan Your Custom Tour
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ color: "var(--color-text-secondary)" }}
              >
                Tell us your preferences and we&apos;ll create the perfect
                itinerary
              </Typography>
            </Box>
          </Box>

          {/* Success/Error Messages */}
          {submitSuccess && (
            <Alert severity="success" sx={{ m: 2 }}>
              Your inquiry has been submitted successfully! We&apos;ll get back
              to you soon.
            </Alert>
          )}

          {submitError && (
            <Alert severity="error" sx={{ m: 2 }}>
              {submitError}
            </Alert>
          )}

          {/* Form Content */}
          <Box sx={{ p: 4, pt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--color-neutral-300)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--color-primary-500)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-primary-500)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--color-text-secondary)",
                    "&.Mui-focused": {
                      color: "var(--color-primary-500)",
                    },
                  },
                }}
              />

              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Email Address (optional)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-neutral-300)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                      "&.Mui-focused": {
                        color: "var(--color-primary-500)",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-neutral-300)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                      "&.Mui-focused": {
                        color: "var(--color-primary-500)",
                      },
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Travelling From (City)"
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                error={!!errors.from}
                helperText={errors.from}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--color-neutral-300)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--color-primary-500)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-primary-500)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--color-text-secondary)",
                    "&.Mui-focused": {
                      color: "var(--color-primary-500)",
                    },
                  },
                }}
              />

              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Departure Date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-neutral-300)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                      "&.Mui-focused": {
                        color: "var(--color-primary-500)",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Duration (Days)"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  error={!!errors.days}
                  helperText={errors.days}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-neutral-300)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                      "&.Mui-focused": {
                        color: "var(--color-primary-500)",
                      },
                    },
                  }}
                />
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  error={!!errors.adults}
                  helperText={errors.adults}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-neutral-300)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                      "&.Mui-focused": {
                        color: "var(--color-primary-500)",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Children (5-12 yrs)"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  error={!!errors.children}
                  helperText={errors.children}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-neutral-300)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                      "&.Mui-focused": {
                        color: "var(--color-primary-500)",
                      },
                    },
                  }}
                />
              </Box>

              <TextField
                multiline
                rows={3}
                fullWidth
                label="Any Special Requests?"
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--color-neutral-300)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--color-primary-500)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-primary-500)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--color-text-secondary)",
                    "&.Mui-focused": {
                      color: "var(--color-primary-500)",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  backgroundColor: "var(--color-primary-500)",
                  "&:hover": {
                    backgroundColor: "var(--color-primary-600)",
                  },
                  "&:disabled": {
                    backgroundColor: "var(--color-neutral-300)",
                  },
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {loading ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} color="inherit" />
                    Sending...
                  </Box>
                ) : (
                  "SEND ENQUIRY"
                )}
              </Button>
            </Stack>

            <Box
              mt={3}
              pt={3}
              borderTop="1px solid var(--color-neutral-200)"
              textAlign="center"
            >
              <Typography
                variant="body2"
                sx={{ color: "var(--color-text-secondary)" }}
              >
                ✅ We respect your privacy. Only our team will contact you.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PlanMyTourModal;
