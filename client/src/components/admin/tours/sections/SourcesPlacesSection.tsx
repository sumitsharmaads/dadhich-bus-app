"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  CreateTourRequest,
  TourSourceItem,
  TourPlace,
} from "@/lib/api/types/tour.types";
import { City } from "@/lib/api/types/places.types";
import { placesService } from "@/lib/api/services/places.service";

interface SourcesPlacesSectionProps {
  form: CreateTourRequest;
  onFormChange: (field: keyof CreateTourRequest, value: any) => void;
  errors: Record<string, string>;
}

const SourcesPlacesSection: React.FC<SourcesPlacesSectionProps> = ({
  form,
  onFormChange,
  errors,
}) => {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [editingSourceIndex, setEditingSourceIndex] = useState<number | null>(
    null
  );
  const [editingPlaceIndex, setEditingPlaceIndex] = useState<number | null>(
    null
  );
  const [sourceCities, setSourceCities] = useState<City[]>([]);
  const [placeCities, setPlaceCities] = useState<City[]>([]);
  const [sourceCitiesLoading, setSourceCitiesLoading] = useState(false);
  const [placeCitiesLoading, setPlaceCitiesLoading] = useState(false);

  // Source form state
  const [sourceForm, setSourceForm] = useState<Partial<TourSourceItem>>({
    cityId: "",
    cityName: "",
    fare: form.pricing?.minFare || 0,
    onBoarding: [],
    departureTime: "",
    arrivalTime: "",
  });

  // Place form state
  const [placeForm, setPlaceForm] = useState<Partial<TourPlace>>({
    cityId: "",
    name: "",
    state: "",
    order: 0,
    stayDuration: 0,
    activities: [],
  });

  // Temporary states for dynamic fields
  const [newOnBoarding, setNewOnBoarding] = useState("");
  const [newActivity, setNewActivity] = useState("");

  // Search cities for autocomplete - separate for sources and places
  const searchSourceCities = async (searchTerm: string) => {
    if (searchTerm.length < 2) return;

    setSourceCitiesLoading(true);
    try {
      const response = await placesService.listCities({ name: searchTerm });
      if (Array.isArray(response)) {
        setSourceCities(response);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
    } finally {
      setSourceCitiesLoading(false);
    }
  };

  const searchPlaceCities = async (searchTerm: string) => {
    if (searchTerm.length < 2) return;

    setPlaceCitiesLoading(true);
    try {
      const response = await placesService.listCities({ name: searchTerm });
      if (Array.isArray(response)) {
        setPlaceCities(response);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
    } finally {
      setPlaceCitiesLoading(false);
    }
  };

  // Debounced city search for sources
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sourceForm.cityName) {
        searchSourceCities(sourceForm.cityName);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [sourceForm.cityName]);

  // Debounced city search for places
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (placeForm.name) {
        searchPlaceCities(placeForm.name);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [placeForm.name]);

  const handleAddOnBoarding = () => {
    if (
      newOnBoarding.trim() &&
      !sourceForm.onBoarding?.includes(newOnBoarding.trim())
    ) {
      setSourceForm((prev: any) => ({
        ...prev,
        onBoarding: [...(prev.onBoarding || []), newOnBoarding.trim()],
      }));
      setNewOnBoarding("");
    }
  };

  const handleRemoveOnBoarding = (index: number) => {
    setSourceForm((prev: any) => ({
      ...prev,
      onBoarding:
        prev.onBoarding?.filter((_: any, i: number) => i !== index) || [],
    }));
  };

  const handleAddActivity = () => {
    if (
      newActivity.trim() &&
      !placeForm.activities?.includes(newActivity.trim())
    ) {
      setPlaceForm((prev: any) => ({
        ...prev,
        activities: [...(prev.activities || []), newActivity.trim()],
      }));
      setNewActivity("");
    }
  };

  const handleRemoveActivity = (index: number) => {
    setPlaceForm((prev: any) => ({
      ...prev,
      activities:
        prev.activities?.filter((_: any, i: number) => i !== index) || [],
    }));
  };

  const handleSourceSubmit = () => {
    if (!sourceForm.cityId || !sourceForm.cityName || !sourceForm.fare) return;

    const newSource: TourSourceItem = {
      cityId: sourceForm.cityId as any,
      cityName: sourceForm.cityName,
      fare: sourceForm.fare,
      onBoarding: sourceForm.onBoarding || [],
      departureTime: sourceForm.departureTime,
      arrivalTime: sourceForm.arrivalTime,
    };

    if (editingSourceIndex !== null) {
      // Edit existing source
      const updatedSources = [...(form.sources || [])];
      updatedSources[editingSourceIndex] = newSource;
      onFormChange("sources", updatedSources);
      setEditingSourceIndex(null);
    } else {
      // Add new source
      onFormChange("sources", [...(form.sources || []), newSource]);
    }

    // Reset form
    setSourceForm({
      cityId: "",
      cityName: "",
      fare: form.pricing?.minFare || 0,
      onBoarding: [],
      departureTime: "",
      arrivalTime: "",
    });
    setSourceCities([]);
    setSourcesOpen(false);
  };

  const handlePlaceSubmit = () => {
    if (!placeForm.cityId || !placeForm.name || !placeForm.state) return;

    const newPlace: TourPlace = {
      cityId: placeForm.cityId as any,
      name: placeForm.name,
      state: placeForm.state,
      order: placeForm.order || 0,
      stayDuration: placeForm.stayDuration || 0,
      activities: placeForm.activities || [],
    };

    if (editingPlaceIndex !== null) {
      // Edit existing place
      const updatedPlaces = [...(form.places || [])];
      updatedPlaces[editingPlaceIndex] = newPlace;
      onFormChange("places", updatedPlaces);
      setEditingPlaceIndex(null);
    } else {
      // Add new place
      onFormChange("places", [...(form.places || []), newPlace]);
    }

    // Reset form
    setPlaceForm({
      cityId: "",
      name: "",
      state: "",
      order: 0,
      stayDuration: 0,
      activities: [],
    });
    setPlaceCities([]);
    setPlacesOpen(false);
  };

  const handleEditSource = (index: number) => {
    const source = form.sources?.[index];
    if (source) {
      setSourceForm({
        cityId: source.cityId,
        cityName: source.cityName || "",
        fare: source.fare,
        onBoarding: source.onBoarding || [],
        departureTime: source.departureTime || "",
        arrivalTime: source.arrivalTime || "",
      });
      setEditingSourceIndex(index);
      setSourceCities([]); // Clear cities when editing
      setSourcesOpen(true);
    }
  };

  const handleEditPlace = (index: number) => {
    const place = form.places?.[index];
    if (place) {
      setPlaceForm((prev: any) => ({
        cityId: place.cityId,
        name: place.name || "",
        state: place.state || "",
        order: place.order || 0,
        stayDuration: place.stayDuration || 0,
        activities: place.activities || [],
      }));
      setEditingPlaceIndex(index);
      setPlaceCities([]); // Clear cities when editing
      setPlacesOpen(true);
    }
  };

  const handleDeleteSource = (index: number) => {
    const updatedSources = form.sources?.filter((_, i) => i !== index) || [];
    onFormChange("sources", updatedSources);
  };

  const handleDeletePlace = (index: number) => {
    const updatedPlaces = form.places?.filter((_, i) => i !== index) || [];
    onFormChange("places", updatedPlaces);
  };

  const handleCitySelect = (city: City | null, isSource: boolean) => {
    if (city) {
      if (isSource) {
        setSourceForm((prev: any) => ({
          ...prev,
          cityId: city._id,
          cityName: city.name,
        }));
      } else {
        setPlaceForm((prev: any) => ({
          ...prev,
          cityId: city._id,
          name: city.name,
          state: city.stateId?.name || "",
        }));
      }
    } else {
      // Clear city selection
      if (isSource) {
        setSourceForm((prev: any) => ({
          ...prev,
          cityId: "",
          cityName: "",
        }));
      } else {
        setPlaceForm((prev: any) => ({
          ...prev,
          cityId: "",
          name: "",
          state: "",
        }));
      }
    }
  };

  // Clear cities when opening dialogs
  const handleOpenSourcesDialog = () => {
    setSourceCities([]);
    setSourcesOpen(true);
  };

  const handleOpenPlacesDialog = () => {
    setPlaceCities([]);
    setPlacesOpen(true);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Section 2: Sources and Places (Mandatory)
        </Typography>

        {/* Sources Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Tour Sources</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenSourcesDialog}
            >
              Add Source
            </Button>
          </Box>

          {/* Sources Table */}
          {errors.sources && (
            <FormHelperText error sx={{ mb: 2 }}>
              {errors.sources}
            </FormHelperText>
          )}
          {form.sources && form.sources.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell>Fare (₹)</TableCell>
                    <TableCell>Onboarding Points</TableCell>
                    <TableCell>Departure</TableCell>
                    <TableCell>Arrival</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.sources.map((source, index) => (
                    <TableRow key={index}>
                      <TableCell>{source.cityName}</TableCell>
                      <TableCell>₹{source.fare}</TableCell>
                      <TableCell>
                        {source.onBoarding?.map((point, i) => (
                          <Chip
                            key={i}
                            label={point}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>{source.departureTime || "-"}</TableCell>
                      <TableCell>{source.arrivalTime || "-"}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditSource(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSource(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
              No sources added yet. Click "Add Source" to get started.
            </Typography>
          )}
        </Box>

        {/* Places Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Tour Destinations</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenPlacesDialog}
            >
              Add Place
            </Button>
          </Box>

          {/* Places Table */}
          {errors.places && (
            <FormHelperText error sx={{ mb: 2 }}>
              {errors.places}
            </FormHelperText>
          )}
          {form.places && form.places.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Order</TableCell>
                    <TableCell>Stay Duration (hrs)</TableCell>
                    <TableCell>Activities</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.places.map((place, index) => (
                    <TableRow key={index}>
                      <TableCell>{place.name}</TableCell>
                      <TableCell>{place.state}</TableCell>
                      <TableCell>{place.order || "-"}</TableCell>
                      <TableCell>{place.stayDuration || "-"}</TableCell>
                      <TableCell>
                        {place.activities?.map((activity, i) => (
                          <Chip
                            key={i}
                            label={activity}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditPlace(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePlace(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
              No destinations added yet. Click "Add Place" to get started.
            </Typography>
          )}
        </Box>

        {/* Create and Skip Further Option */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Quick Save Option
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            You can save the tour with just the basic information and
            sources/places, then edit later to add more details.
          </Typography>
          <Button variant="outlined" color="primary">
            Create and Skip Further
          </Button>
        </Box>

        {/* Source Add/Edit Dialog */}
        <Dialog
          open={sourcesOpen}
          onClose={() => {
            setSourcesOpen(false);
            setSourceCities([]);
            setEditingSourceIndex(null);
            setSourceForm({
              cityId: "",
              cityName: "",
              fare: form.pricing?.minFare || 0,
              onBoarding: [],
              departureTime: "",
              arrivalTime: "",
            });
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingSourceIndex !== null ? "Edit Source" : "Add New Source"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={sourceCities}
                  getOptionLabel={(option) => option.name}
                  value={
                    sourceCities.find((c) => c._id === sourceForm.cityId) ||
                    null
                  }
                  onChange={(_, value) => handleCitySelect(value, true)}
                  onInputChange={(_, value) =>
                    setSourceForm((prev: any) => ({ ...prev, cityName: value }))
                  }
                  loading={sourceCitiesLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City *"
                      required
                      error={!!errors["sources.cityId"]}
                      helperText={errors["sources.cityId"]}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fare (₹) *"
                  type="number"
                  value={sourceForm.fare}
                  onChange={(e) =>
                    setSourceForm((prev) => ({
                      ...prev,
                      fare: Number(e.target.value),
                    }))
                  }
                  required
                  InputProps={{
                    startAdornment: <Typography>₹</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Departure Time"
                  type="time"
                  value={sourceForm.departureTime}
                  onChange={(e) =>
                    setSourceForm((prev) => ({
                      ...prev,
                      departureTime: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Arrival Time"
                  type="time"
                  value={sourceForm.arrivalTime}
                  onChange={(e) =>
                    setSourceForm((prev) => ({
                      ...prev,
                      arrivalTime: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Onboarding Points
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Add onboarding point"
                    value={newOnBoarding}
                    onChange={(e) => setNewOnBoarding(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddOnBoarding()
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddOnBoarding}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {sourceForm.onBoarding?.map((point, index) => (
                    <Chip
                      key={index}
                      label={point}
                      onDelete={() => handleRemoveOnBoarding(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setSourcesOpen(false);
                setSourceCities([]);
                setEditingSourceIndex(null);
                setSourceForm({
                  cityId: "",
                  cityName: "",
                  fare: form.pricing?.minFare || 0,
                  onBoarding: [],
                  departureTime: "",
                  arrivalTime: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSourceSubmit} variant="contained">
              {editingSourceIndex !== null ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Place Add/Edit Dialog */}
        <Dialog
          open={placesOpen}
          onClose={() => {
            setPlacesOpen(false);
            setPlaceCities([]);
            setEditingPlaceIndex(null);
            setPlaceForm({
              cityId: "",
              name: "",
              state: "",
              order: 0,
              stayDuration: 0,
              activities: [],
            });
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingPlaceIndex !== null
              ? "Edit Destination"
              : "Add New Destination"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={placeCities}
                  getOptionLabel={(option) =>
                    `${option.name} ${option.stateId?.name}`
                  }
                  value={
                    placeCities.find((c) => c._id === placeForm.cityId) || null
                  }
                  onChange={(_, value) => handleCitySelect(value, false)}
                  onInputChange={(_, value) =>
                    setPlaceForm((prev: any) => ({ ...prev, name: value }))
                  }
                  loading={placeCitiesLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City *"
                      required
                      error={!!errors["places.cityId"]}
                      helperText={errors["places.cityId"]}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={placeForm.state}
                  onChange={(e) =>
                    setPlaceForm((prev: any) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  InputProps={{ readOnly: true }}
                  helperText="Auto-populated from city"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Order"
                  type="number"
                  value={placeForm.order}
                  onChange={(e) =>
                    setPlaceForm((prev) => ({
                      ...prev,
                      order: Number(e.target.value),
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stay Duration (hours)"
                  type="number"
                  value={placeForm.stayDuration}
                  onChange={(e) =>
                    setPlaceForm((prev) => ({
                      ...prev,
                      stayDuration: Number(e.target.value),
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Activities
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Add activity"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddActivity()}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddActivity}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {placeForm.activities?.map((activity, index) => (
                    <Chip
                      key={index}
                      label={activity}
                      onDelete={() => handleRemoveActivity(index)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setPlacesOpen(false);
                setPlaceCities([]);
                setEditingPlaceIndex(null);
                setPlaceForm({
                  cityId: "",
                  name: "",
                  state: "",
                  order: 0,
                  stayDuration: 0,
                  activities: [],
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handlePlaceSubmit} variant="contained">
              {editingPlaceIndex !== null ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SourcesPlacesSection;
