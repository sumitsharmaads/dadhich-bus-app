"use client";

import React, { useState } from "react";
import { NumberTextField } from "@/components/common";
import { formatDate, formatTime, formatDateTime } from "@/utils/dateFormat";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  OutlinedInput,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  CreateTourRequest,
  TourItineraryItem,
} from "@/lib/api/types/tour.types";
import {
  ITINERARY_TOGGLES,
  ITINERARY_MEALS,
  ITINERARY_HIGHLIGHTS,
} from "@/constants/tourConstants";

interface ItinerarySectionProps {
  form: CreateTourRequest;
  onFormChange: (field: keyof CreateTourRequest, value: any) => void;
  errors: Record<string, string>;
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  form,
  onFormChange,
  errors,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Itinerary form state
  const [itineraryForm, setItineraryForm] = useState<
    Partial<TourItineraryItem>
  >({
    title: "",
    shortDescription: "",
    toggles: [],
    sightseeing: [],
    order: 0,
    day: 0,
    duration: "",
    meals: [],
    accommodation: "",
    transportation: "",
    highlights: [],
    notes: "",
  });

  // Remove manual input states since we're using multiselect now

  // New handler functions for multiselect
  const handleToggleChange = (event: any) => {
    const value = event.target.value;
    setItineraryForm((prev) => ({
      ...prev,
      toggles: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleMealChange = (event: any) => {
    const value = event.target.value;
    setItineraryForm((prev) => ({
      ...prev,
      meals: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleHighlightChange = (event: any) => {
    const value = event.target.value;
    setItineraryForm((prev) => ({
      ...prev,
      highlights: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSightseeingChange = (event: any) => {
    const value = event.target.value;
    setItineraryForm((prev) => ({
      ...prev,
      sightseeing: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = () => {
    if (!itineraryForm.title) return;

    const newItinerary: TourItineraryItem = {
      title: itineraryForm.title,
      shortDescription: itineraryForm.shortDescription || "",
      toggles: itineraryForm.toggles || [],
      sightseeing: itineraryForm.sightseeing || [],
      order: itineraryForm.order || 0,
      day: itineraryForm.day || 0,
      duration: itineraryForm.duration || "",
      meals: itineraryForm.meals || [],
      accommodation: itineraryForm.accommodation || "",
      transportation: itineraryForm.transportation || "",
      highlights: itineraryForm.highlights || [],
      notes: itineraryForm.notes || "",
    };

    if (editingIndex !== null) {
      // Edit existing itinerary
      const updatedItinerary = [...(form.itinerary || [])];
      updatedItinerary[editingIndex] = newItinerary;
      onFormChange("itinerary", updatedItinerary);
      setEditingIndex(null);
    } else {
      // Add new itinerary
      onFormChange("itinerary", [...(form.itinerary || []), newItinerary]);
    }

    // Reset form
    setItineraryForm({
      title: "",
      shortDescription: "",
      toggles: [],
      sightseeing: [],
      order: 0,
      day: 0,
      duration: "",
      meals: [],
      accommodation: "",
      transportation: "",
      highlights: [],
      notes: "",
    });
  };

  const handleEdit = (index: number) => {
    const item = form.itinerary?.[index];
    if (item) {
      setItineraryForm({
        title: item.title,
        shortDescription: item.shortDescription || "",
        toggles: item.toggles || [],
        sightseeing: item.sightseeing || [],
        order: item.order || 0,
        day: item.day || 0,
        duration: item.duration || "",
        meals: item.meals || [],
        accommodation: item.accommodation || "",
        transportation: item.transportation || "",
        highlights: item.highlights || [],
        notes: item.notes || "",
      });
      setEditingIndex(index);
    }
  };

  const handleDelete = (index: number) => {
    const updatedItinerary =
      form.itinerary?.filter((_, i) => i !== index) || [];
    onFormChange("itinerary", updatedItinerary);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setItineraryForm({
      title: "",
      shortDescription: "",
      toggles: [],
      sightseeing: [],
      order: 0,
      day: 0,
      duration: "",
      meals: [],
      accommodation: "",
      transportation: "",
      highlights: [],
      notes: "",
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Section 3: Itinerary (Non-mandatory)
        </Typography>

        {/* Add/Edit Itinerary Form */}
        <Box sx={{ mb: 4, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {editingIndex !== null
              ? "Edit Itinerary Item"
              : "Add New Itinerary Item"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title *"
                value={itineraryForm.title}
                onChange={(e) =>
                  setItineraryForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Short Description"
                value={itineraryForm.shortDescription}
                onChange={(e) =>
                  setItineraryForm((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <NumberTextField
                fullWidth
                label="Order"
                
                value={itineraryForm.order}
                onChange={(e) =>
                  setItineraryForm((prev) => ({
                    ...prev,
                    order: Number(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <NumberTextField
                fullWidth
                label="Day"
                
                value={itineraryForm.day}
                onChange={(e) =>
                  setItineraryForm((prev) => ({
                    ...prev,
                    day: Number(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration"
                value={itineraryForm.duration}
                onChange={(e) =>
                  setItineraryForm((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                placeholder="e.g., 2 hours, Full day"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Accommodation"
                value={itineraryForm.accommodation}
                onChange={(e) =>
                  setItineraryForm((prev) => ({
                    ...prev,
                    accommodation: e.target.value,
                  }))
                }
                placeholder="e.g., Hotel name, Camping"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transportation"
                value={itineraryForm.transportation}
                onChange={(e) =>
                  setItineraryForm((prev) => ({
                    ...prev,
                    transportation: e.target.value,
                  }))
                }
                placeholder="e.g., Bus, Train, Flight"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={itineraryForm.notes}
                onChange={(e) =>
                  setItineraryForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                multiline
                rows={2}
                placeholder="Additional notes or instructions"
              />
            </Grid>

            {/* Toggles */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Toggles
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Toggles</InputLabel>
                <Select
                  multiple
                  value={itineraryForm.toggles || []}
                  onChange={handleToggleChange}
                  input={<OutlinedInput label="Toggles" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {ITINERARY_TOGGLES.map((toggle) => (
                    <MenuItem key={toggle} value={toggle}>
                      {toggle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sightseeing */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Sightseeing Places
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Highlights & Activities</InputLabel>
                <Select
                  multiple
                  value={itineraryForm.highlights || []}
                  onChange={handleHighlightChange}
                  input={<OutlinedInput label="Highlights & Activities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {ITINERARY_HIGHLIGHTS.map((highlight) => (
                    <MenuItem key={highlight} value={highlight}>
                      {highlight}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography
                variant="caption"
                sx={{ mt: 1, display: "block", color: "text.secondary" }}
              >
                💡 Tip: Select from predefined highlights above, or add custom
                places in the notes section
              </Typography>
            </Grid>

            {/* Meals */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Meals
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Meals & Dining</InputLabel>
                <Select
                  multiple
                  value={itineraryForm.meals || []}
                  onChange={handleMealChange}
                  input={<OutlinedInput label="Meals & Dining" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          color="success"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {ITINERARY_MEALS.map((meal) => (
                    <MenuItem key={meal} value={meal}>
                      {meal}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Highlights */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Tour Highlights
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Tour Highlights</InputLabel>
                <Select
                  multiple
                  value={itineraryForm.highlights || []}
                  onChange={handleHighlightChange}
                  input={<OutlinedInput label="Tour Highlights" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          color="warning"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {ITINERARY_HIGHLIGHTS.map((highlight) => (
                    <MenuItem key={highlight} value={highlight}>
                      {highlight}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Custom Sightseeing Places */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Custom Sightseeing Places
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter custom places separated by commas (e.g., Local Market, Temple, Museum)"
                value={itineraryForm.sightseeing?.join(", ") || ""}
                onChange={(e) => {
                  const places = e.target.value
                    .split(",")
                    .map((p) => p.trim())
                    .filter((p) => p);
                  setItineraryForm((prev) => ({
                    ...prev,
                    sightseeing: places,
                  }));
                }}
                helperText="Add custom places that are not in the predefined highlights list"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={handleSubmit}>
              {editingIndex !== null ? "Update" : "Add"} Itinerary Item
            </Button>
            {editingIndex !== null && (
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>

        {/* Itinerary List */}
        {form.itinerary && form.itinerary.length > 0 ? (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Current Itinerary ({form.itinerary.length} items)
            </Typography>

            {form.itinerary.map((item, index) => (
              <Accordion
                key={index}
                expanded={expandedItem === index}
                onChange={() =>
                  setExpandedItem(expandedItem === index ? null : index)
                }
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="subtitle2">
                      Day {item.day || index + 1}: {item.title}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(index);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Description:</strong>{" "}
                        {item.shortDescription || "No description"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Duration:</strong>{" "}
                        {item.duration || "Not specified"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Accommodation:</strong>{" "}
                        {item.accommodation || "Not specified"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Transportation:</strong>{" "}
                        {item.transportation || "Not specified"}
                      </Typography>
                    </Grid>
                    {item.toggles && item.toggles.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Toggles:</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {item.toggles.map((toggle, i) => (
                            <Chip key={i} label={toggle} size="small" />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                    {item.sightseeing && item.sightseeing.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Sightseeing:</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {item.sightseeing.map((place, i) => (
                            <Chip
                              key={i}
                              label={place}
                              size="small"
                              color="secondary"
                            />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                    {item.meals && item.meals.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Meals:</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {item.meals.map((meal, i) => (
                            <Chip
                              key={i}
                              label={meal}
                              size="small"
                              color="success"
                            />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                    {item.highlights && item.highlights.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Highlights:</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {item.highlights.map((highlight, i) => (
                            <Chip
                              key={i}
                              label={highlight}
                              size="small"
                              color="warning"
                            />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                    {item.notes && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Notes:</strong> {item.notes}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
            No itinerary items added yet. Use the form above to add your tour
            itinerary.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ItinerarySection;
