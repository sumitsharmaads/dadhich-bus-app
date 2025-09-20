"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Grid,
  FormHelperText,
  InputAdornment,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { CreateTourRequest } from "@/lib/api/types/tour.types";
import { TOUR_TYPES, INCLUSIVE_FEATURES } from "@/constants/tourConstants";
import { NumberTextField } from "@/components/common";
import { formatDate, formatTime, formatDateTime } from "@/utils/dateFormat";

interface BasicInfoSectionProps {
  form: CreateTourRequest;
  onFormChange: (field: keyof CreateTourRequest, value: any) => void;
  onNestedFormChange: (
    parentField: keyof CreateTourRequest,
    field: string,
    value: any
  ) => void;
  errors: Record<string, string>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  onFormChange,
  onNestedFormChange,
  errors,
}) => {
  const [newInclusive, setNewInclusive] = useState("");
  const [newType, setNewType] = useState("");

  // Auto-calculate days, nights, and duration when dates change
  useEffect(() => {
    if (form.startDate && form.endDate) {
      const start = dayjs(form.startDate);
      const end = dayjs(form.endDate);
      const days = end.diff(start, "day");
      const nights = Math.max(0, days - 1);

      // Only update if values are different to avoid infinite loops
      if (form.days !== days) {
        onFormChange("days", days);
      }
      if (form.nights !== nights) {
        onFormChange("nights", nights);
      }
      if (form.duration !== `${days}D/${nights}N`) {
        onFormChange("duration", `${days}D/${nights}N`);
      }
    }
  }, [
    form.startDate,
    form.endDate,
    form.days,
    form.nights,
    form.duration,
    onFormChange,
  ]);

  // Calculate duration, days, and nights
  const calculateDuration = () => {
    if (form.startDate && form.endDate) {
      const start = dayjs(form.startDate);
      const end = dayjs(form.endDate);
      const days = end.diff(start, "day");
      const nights = days - 1;
      return {
        duration: `${days}D/${nights}N`,
        days,
        nights: Math.max(0, nights),
      };
    }
    return { duration: "", days: 0, nights: 0 };
  };

  const { duration, days, nights } = calculateDuration();

  const handleAddInclusive = () => {
    if (newInclusive.trim() && !form.inclusive?.includes(newInclusive.trim())) {
      onFormChange("inclusive", [
        ...(form.inclusive || []),
        newInclusive.trim(),
      ]);
      setNewInclusive("");
    }
  };

  const handleRemoveInclusive = (index: number) => {
    const updated = form.inclusive?.filter((_, i) => i !== index) || [];
    onFormChange("inclusive", updated);
  };

  const handleAddType = () => {
    if (newType.trim() && !form.type?.includes(newType.trim())) {
      onFormChange("type", [...(form.type || []), newType.trim()]);
      setNewType("");
    }
  };

  const handleRemoveType = (index: number) => {
    const updated = form.type?.filter((_, i) => i !== index) || [];
    onFormChange("type", updated);
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    value: Dayjs | null
  ) => {
    if (value) {
      onFormChange(field, value.toDate());

      // Auto-calculate and update days, nights, and duration when dates change
      if (field === "startDate" && form.endDate) {
        const start = value;
        const end = dayjs(form.endDate);
        const days = end.diff(start, "day");
        const nights = Math.max(0, days - 1);

        onFormChange("days", days);
        onFormChange("nights", nights);
        onFormChange("duration", `${days}D/${nights}N`);
      } else if (field === "endDate" && form.startDate) {
        const start = dayjs(form.startDate);
        const end = value;
        const days = end.diff(start, "day");
        const nights = Math.max(0, days - 1);

        onFormChange("days", days);
        onFormChange("nights", nights);
        onFormChange("duration", `${days}D/${nights}N`);
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Section 1: Basic Information (Mandatory)
        </Typography>

        <Grid container spacing={3}>
          {/* Tour Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tour Name *"
              value={form.tourName || ""}
              onChange={(e) => onFormChange("tourName", e.target.value)}
              error={!!errors.tourName}
              helperText={errors.tourName}
              required
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description (HTML Rich Text)"
              value={form.description || ""}
              onChange={(e) => onFormChange("description", e.target.value)}
              multiline
              rows={4}
              placeholder="Enter tour description (supports HTML)"
            />
          </Grid>

          {/* Short Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Description"
              value={form.shortDescription || ""}
              onChange={(e) => onFormChange("shortDescription", e.target.value)}
              multiline
              rows={2}
              placeholder="Brief description for previews"
            />
          </Grid>

          {/* Start Date & Time */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date *"
                value={form.startDate ? dayjs(form.startDate) : null}
                onChange={(value: Dayjs | null) =>
                  handleDateChange("startDate", value)
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time *"
                value={form.startDate ? dayjs(form.startDate) : null}
                onChange={(value: Dayjs | null) =>
                  handleDateChange("startDate", value)
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* End Date & Time */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date *"
                value={form.endDate ? dayjs(form.endDate) : null}
                onChange={(value: Dayjs | null) =>
                  handleDateChange("endDate", value)
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="End Time *"
                value={form.endDate ? dayjs(form.endDate) : null}
                onChange={(value: Dayjs | null) =>
                  handleDateChange("endDate", value)
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Calculated Duration Fields (Non-editable) */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Duration"
              value={duration}
              InputProps={{ readOnly: true }}
              helperText="Auto-calculated from dates"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Days"
              value={days}
              InputProps={{ readOnly: true }}
              helperText="Auto-calculated"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nights"
              value={nights}
              InputProps={{ readOnly: true }}
              helperText="Auto-calculated"
            />
          </Grid>

          {/* Inclusive Features */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Inclusive Features *
            </Typography>
            {errors.inclusive && (
              <FormHelperText error sx={{ mb: 1 }}>
                {errors.inclusive}
              </FormHelperText>
            )}
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Inclusive Feature</InputLabel>
                  <Select
                    value={newInclusive}
                    onChange={(e) => setNewInclusive(e.target.value)}
                    label="Select Inclusive Feature"
                  >
                    {INCLUSIVE_FEATURES.map((feature) => (
                      <MenuItem key={feature} value={feature}>
                        {feature}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddInclusive}
                  disabled={!newInclusive}
                >
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {form.inclusive?.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() => handleRemoveInclusive(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Tour Types */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Tour Types *
            </Typography>
            {errors.type && (
              <FormHelperText error sx={{ mb: 1 }}>
                {errors.type}
              </FormHelperText>
            )}
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Tour Type</InputLabel>
                  <Select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    label="Select Tour Type"
                  >
                    {TOUR_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddType}
                  disabled={!newType}
                >
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {form.type?.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() => handleRemoveType(index)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Pricing */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Pricing
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <NumberTextField
                  fullWidth
                  label="Minimum Fare *"
                  value={form.pricing?.minFare || ""}
                  onChange={(e) =>
                    onNestedFormChange(
                      "pricing",
                      "minFare",
                      Number(e.target.value)
                    )
                  }
                  error={!!errors["pricing.minFare"]}
                  helperText={errors["pricing.minFare"]}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberTextField
                  fullWidth
                  label="Maximum Fare"
                  value={form.pricing?.maxFare || ""}
                  onChange={(e) =>
                    onNestedFormChange(
                      "pricing",
                      "maxFare",
                      Number(e.target.value)
                    )
                  }
                  error={!!errors["pricing.maxFare"]}
                  helperText={errors["pricing.maxFare"] || "Optional"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberTextField
                  fullWidth
                  label="Adult Price"
                  type="number"
                  value={form.pricing?.adultPrice || ""}
                  onChange={(e) =>
                    onNestedFormChange(
                      "pricing",
                      "adultPrice",
                      Number(e.target.value)
                    )
                  }
                  error={!!errors["pricing.adultPrice"]}
                  helperText={errors["pricing.adultPrice"] || "Optional"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberTextField
                  fullWidth
                  label="Child Price"
                  type="number"
                  value={form.pricing?.childPrice || ""}
                  onChange={(e) =>
                    onNestedFormChange(
                      "pricing",
                      "childPrice",
                      Number(e.target.value)
                    )
                  }
                  error={!!errors["pricing.childPrice"]}
                  helperText={errors["pricing.childPrice"] || "Optional"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberTextField
                  fullWidth
                  label="Infant Price"
                  value={form.pricing?.infantPrice || ""}
                  onChange={(e) =>
                    onNestedFormChange(
                      "pricing",
                      "infantPrice",
                      Number(e.target.value)
                    )
                  }
                  error={!!errors["pricing.infantPrice"]}
                  helperText={errors["pricing.infantPrice"] || "Optional"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberTextField
                  fullWidth
                  label="Single Supplement"
                  value={form.pricing?.singleSupplement || ""}
                  onChange={(e) =>
                    onNestedFormChange(
                      "pricing",
                      "singleSupplement",
                      Number(e.target.value)
                    )
                  }
                  error={!!errors["pricing.singleSupplement"]}
                  helperText={errors["pricing.singleSupplement"] || "Optional"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberTextField
                  fullWidth
                  label="Taxes"
                  value={form.pricing?.taxes || ""}
                  onChange={(e) =>
                    onNestedFormChange(
                      "pricing",
                      "taxes",
                      Number(e.target.value)
                    )
                  }
                  error={!!errors["pricing.taxes"]}
                  helperText={errors["pricing.taxes"] || "Optional"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberTextField
                  fullWidth
                  label="Service Charge"
                  value={form.pricing?.serviceCharge || ""}
                  onChange={(e) =>
                    onNestedFormChange(
                      "pricing",
                      "serviceCharge",
                      Number(e.target.value)
                    )
                  }
                  error={!!errors["pricing.serviceCharge"]}
                  helperText={errors["pricing.serviceCharge"] || "Optional"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Currency"
                  value="INR"
                  InputProps={{ readOnly: true }}
                  helperText="Default currency"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Capacity */}
          <Grid item xs={12} md={4}>
            <NumberTextField
              fullWidth
              label="Total Capacity *"
              value={form.capacity || ""}
              onChange={(e) => onFormChange("capacity", Number(e.target.value))}
              error={!!errors.capacity}
              helperText={errors.capacity}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <NumberTextField
              fullWidth
              label="Minimum Capacity"
              value={form.minCapacity || ""}
              onChange={(e) =>
                onFormChange("minCapacity", Number(e.target.value))
              }
              error={!!errors.minCapacity}
              helperText={errors.minCapacity || "Optional"}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <NumberTextField
              fullWidth
              label="Maximum Capacity"
              value={form.maxCapacity || ""}
              onChange={(e) =>
                onFormChange("maxCapacity", Number(e.target.value))
              }
              error={!!errors.maxCapacity}
              helperText={errors.maxCapacity || "Optional"}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
