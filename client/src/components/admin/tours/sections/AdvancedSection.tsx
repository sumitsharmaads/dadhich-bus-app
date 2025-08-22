"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { CreateTourRequest, TourStayItem } from "@/lib/api/types/tour.types";
import {
  TOUR_HIGHLIGHTS,
  SPECIAL_REQUIREMENTS,
} from "@/constants/tourConstants";

interface AdvancedSectionProps {
  form: CreateTourRequest;
  onFormChange: (field: keyof CreateTourRequest, value: any) => void;
  onNestedFormChange: (
    parentField: keyof CreateTourRequest,
    field: string,
    value: any
  ) => void;
  errors: Record<string, string>;
}

const AdvancedSection: React.FC<AdvancedSectionProps> = ({
  form,
  onFormChange,
  onNestedFormChange,
  errors,
}) => {
  const [newHighlight, setNewHighlight] = useState("");
  const [newSpecialRequirement, setNewSpecialRequirement] = useState("");
  const [editingStayIndex, setEditingStayIndex] = useState<number | null>(null);

  // Stay description form state
  const [stayForm, setStayForm] = useState<Partial<TourStayItem>>({
    nights: 0,
    place: "",
    accommodation: "",
    checkIn: "",
    checkOut: "",
  });

  const handleAddHighlight = () => {
    if (
      newHighlight.trim() &&
      !form.highlights?.includes(newHighlight.trim())
    ) {
      onFormChange("highlights", [
        ...(form.highlights || []),
        newHighlight.trim(),
      ]);
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    const updated = form.highlights?.filter((_, i) => i !== index) || [];
    onFormChange("highlights", updated);
  };

  const handleAddSpecialRequirement = () => {
    if (
      newSpecialRequirement.trim() &&
      !form.specialRequirements?.includes(newSpecialRequirement.trim())
    ) {
      onFormChange("specialRequirements", [
        ...(form.specialRequirements || []),
        newSpecialRequirement.trim(),
      ]);
      setNewSpecialRequirement("");
    }
  };

  const handleRemoveSpecialRequirement = (index: number) => {
    const updated =
      form.specialRequirements?.filter((_, i) => i !== index) || [];
    onFormChange("specialRequirements", updated);
  };

  const handleStaySubmit = () => {
    if (!stayForm.place || !stayForm.accommodation) return;

    const newStay: TourStayItem = {
      nights: stayForm.nights || 0,
      place: stayForm.place,
      accommodation: stayForm.accommodation,
      checkIn: stayForm.checkIn || "",
      checkOut: stayForm.checkOut || "",
    };

    if (editingStayIndex !== null) {
      // Edit existing stay
      const updatedStayDescription = [...(form.stayDescription || [])];
      updatedStayDescription[editingStayIndex] = newStay;
      onFormChange("stayDescription", updatedStayDescription);
      setEditingStayIndex(null);
    } else {
      // Add new stay
      onFormChange("stayDescription", [
        ...(form.stayDescription || []),
        newStay,
      ]);
    }

    // Reset form
    setStayForm({
      nights: 0,
      place: "",
      accommodation: "",
      checkIn: "",
      checkOut: "",
    });
  };

  const handleEditStay = (index: number) => {
    const item = form.stayDescription?.[index];
    if (item) {
      setStayForm({
        nights: item.nights || 0,
        place: item.place || "",
        accommodation: item.accommodation || "",
        checkIn: item.checkIn || "",
        checkOut: item.checkOut || "",
      });
      setEditingStayIndex(index);
    }
  };

  const handleDeleteStay = (index: number) => {
    const updatedStayDescription =
      form.stayDescription?.filter((_, i) => i !== index) || [];
    onFormChange("stayDescription", updatedStayDescription);
  };

  const handleCancelStay = () => {
    setEditingStayIndex(null);
    setStayForm({
      nights: 0,
      place: "",
      accommodation: "",
      checkIn: "",
      checkOut: "",
    });
  };

  const handleAgeGroupChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onFormChange("ageGroup", newValue.map(String));
    }
  };

  const handleImageUpload = (field: "heroImage" | "gallery", file: File) => {
    // This would typically upload to Cloudinary and return {url, id}
    // For now, we'll simulate the structure
    const mockImage = {
      url: URL.createObjectURL(file),
      id: `temp_${Date.now()}`,
    };

    if (field === "heroImage") {
      onFormChange("heroImage", mockImage);
    } else {
      onFormChange("gallery", [...(form.gallery || []), mockImage]);
    }
  };

  const handleRemoveImage = (
    field: "heroImage" | "gallery",
    index?: number
  ) => {
    if (field === "heroImage") {
      onFormChange("heroImage", undefined);
    } else if (typeof index === "number") {
      const updatedGallery = form.gallery?.filter((_, i) => i !== index) || [];
      onFormChange("gallery", updatedGallery);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Section 6: Advanced Features (Non-mandatory)
        </Typography>

        {/* Highlights */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tour Highlights
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Tour Highlight</InputLabel>
              <Select
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                label="Select Tour Highlight"
              >
                {TOUR_HIGHLIGHTS.map((highlight) => (
                  <MenuItem key={highlight} value={highlight}>
                    {highlight}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              size="small"
              onClick={handleAddHighlight}
              disabled={!newHighlight}
            >
              Add
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {form.highlights?.map((highlight, index) => (
              <Chip
                key={index}
                label={highlight}
                onDelete={() => handleRemoveHighlight(index)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Images */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Images
          </Typography>

          {/* Hero Image */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Hero Image
            </Typography>

            {form.heroImage ? (
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img
                    src={form.heroImage.url}
                    alt="Hero"
                    style={{
                      width: 100,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Cloudinary ID:</strong> {form.heroImage.id}
                    </Typography>
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveImage("heroImage")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 1 }}
              >
                Upload Hero Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("heroImage", file);
                  }}
                />
              </Button>
            )}
          </Box>

          {/* Gallery */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Gallery Images
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Add to Gallery
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach((file) => handleImageUpload("gallery", file));
                }}
              />
            </Button>

            {form.gallery && form.gallery.length > 0 && (
              <Grid container spacing={2}>
                {form.gallery.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper sx={{ p: 1, position: "relative" }}>
                      <img
                        src={image.url}
                        alt={`Gallery ${index + 1}`}
                        style={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        sx={{ position: "absolute", top: 4, right: 4 }}
                        onClick={() => handleRemoveImage("gallery", index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        ID: {image.id}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Stay Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Stay Description
          </Typography>

          <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Nights"
                  type="number"
                  value={stayForm.nights}
                  onChange={(e) =>
                    setStayForm((prev) => ({
                      ...prev,
                      nights: Number(e.target.value),
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Place *"
                  value={stayForm.place}
                  onChange={(e) =>
                    setStayForm((prev) => ({ ...prev, place: e.target.value }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Accommodation *"
                  value={stayForm.accommodation}
                  onChange={(e) =>
                    setStayForm((prev) => ({
                      ...prev,
                      accommodation: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Check-in Time"
                  value={stayForm.checkIn}
                  onChange={(e) =>
                    setStayForm((prev) => ({
                      ...prev,
                      checkIn: e.target.value,
                    }))
                  }
                  placeholder="e.g., 2:00 PM"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Check-out Time"
                  value={stayForm.checkOut}
                  onChange={(e) =>
                    setStayForm((prev) => ({
                      ...prev,
                      checkOut: e.target.value,
                    }))
                  }
                  placeholder="e.g., 11:00 AM"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={handleStaySubmit}>
                {editingStayIndex !== null ? "Update" : "Add"} Stay Description
              </Button>
              {editingStayIndex !== null && (
                <Button variant="outlined" onClick={handleCancelStay}>
                  Cancel
                </Button>
              )}
            </Box>
          </Box>

          {/* Stay Description List */}
          {form.stayDescription && form.stayDescription.length > 0 ? (
            <Grid container spacing={2}>
              {form.stayDescription.map((stay, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {stay.place} ({stay.nights} nights)
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditStay(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteStay(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Accommodation:</strong> {stay.accommodation}
                    </Typography>
                    {stay.checkIn && (
                      <Typography variant="body2" color="textSecondary">
                        <strong>Check-in:</strong> {stay.checkIn}
                      </Typography>
                    )}
                    {stay.checkOut && (
                      <Typography variant="body2" color="textSecondary">
                        <strong>Check-out:</strong> {stay.checkOut}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
              No stay descriptions added yet.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Age Group and Fitness */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Age Group & Fitness
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Age Group Range
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={form.ageGroup?.map(Number) || [0, 100]}
                  onChange={handleAgeGroupChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 25, label: "25" },
                    { value: 50, label: "50" },
                    { value: 75, label: "75" },
                    { value: 100, label: "100" },
                  ]}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  Selected: {form.ageGroup?.join(" - ") || "Not set"} years
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={form.difficulty || ""}
                  onChange={(e) => onFormChange("difficulty", e.target.value)}
                  label="Difficulty Level"
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="difficult">Difficult</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fitness Level"
                value={form.fitnessLevel || ""}
                onChange={(e) => onFormChange("fitnessLevel", e.target.value)}
                placeholder="e.g., Moderate fitness required"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Special Requirements */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Special Requirements
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Special Requirement</InputLabel>
              <Select
                value={newSpecialRequirement}
                onChange={(e) => setNewSpecialRequirement(e.target.value)}
                label="Select Special Requirement"
              >
                {SPECIAL_REQUIREMENTS.map((requirement) => (
                  <MenuItem key={requirement} value={requirement}>
                    {requirement}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              size="small"
              onClick={handleAddSpecialRequirement}
              disabled={!newSpecialRequirement}
            >
              Add
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {form.specialRequirements?.map((requirement, index) => (
              <Chip
                key={index}
                label={requirement}
                onDelete={() => handleRemoveSpecialRequirement(index)}
                color="warning"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdvancedSection;
