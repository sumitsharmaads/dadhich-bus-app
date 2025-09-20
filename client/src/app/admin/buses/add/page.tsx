"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Clear,
  DirectionsBus,
  Settings,
  Person,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { busService } from "@/lib/api/services/bus.service";
import { NumberTextField } from "@/components/common";
import { formatDate, formatTime, formatDateTime } from "@/utils/dateFormat";
import {
  CreateBusData,
  BusType,
  BUS_AMENITIES,
} from "@/lib/api/types/bus.types";

const initialState: CreateBusData = {
  name: "",
  registrationNumber: "",
  capacity: 0,
  totalSeats: 0,
  type: BusType.SEATER,
  ac: true,
  amenities: [],
  images: [],
  operator: {
    name: "",
    contactEmail: "",
    contactPhone: "",
  },
  seatLayout: {
    rows: 0,
    cols: 0,
    layout: [],
  },
  notes: "",
  isActive: true,
};

const AddBusPage: React.FC = () => {
  const router = useRouter();
  const [bus, setBus] = useState<CreateBusData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSeatLayout, setShowSeatLayout] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBus((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (e: SelectChangeEvent<BusType>) => {
    const { name, value } = e.target;
    setBus((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBus((prev) => ({
      ...prev,
      operator: { ...prev.operator!, [name]: value },
    }));
  };

  const handleAmenitiesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setBus((prev) => ({ ...prev, amenities: value }));
  };

  const handleSeatLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBus((prev) => ({
      ...prev,
      seatLayout: { ...prev.seatLayout!, [name]: Number(value) },
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!bus.name.trim()) next.name = "Bus name is required";
    if (!bus.registrationNumber.trim())
      next.registrationNumber = "Registration number is required";
    if (!bus.capacity || bus.capacity <= 0)
      next.capacity = "Enter valid capacity";
    if (bus.totalSeats && bus.totalSeats <= 0)
      next.totalSeats = "Enter valid total seats";
    if (bus.seatLayout?.rows && bus.seatLayout.rows <= 0)
      next.rows = "Enter valid number of rows";
    if (bus.seatLayout?.cols && bus.seatLayout.cols <= 0)
      next.cols = "Enter valid number of columns";

    // Validate operator email if provided
    if (
      bus.operator?.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bus.operator.contactEmail)
    ) {
      next.operatorEmail = "Invalid email format";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        ...bus,
        name: bus.name.trim(),
        registrationNumber: bus.registrationNumber.trim(),
        capacity: Number(bus.capacity),
        totalSeats: bus.totalSeats || bus.capacity, // Default to capacity if not specified
        operator: bus.operator?.name ? bus.operator : undefined, // Only include if operator name is provided
        seatLayout:
          bus.seatLayout?.rows && bus.seatLayout?.cols
            ? bus.seatLayout
            : undefined,
      };

      await busService.createBus(payload);
      router.push("/admin/buses");
    } catch (error: unknown) {
      // Handle specific validation errors from server
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error as {
          response?: {
            data?: { errors?: Array<{ path?: string; message?: string }> };
          };
        };
        if (errorResponse.response?.data?.errors) {
          const serverErrors: Record<string, string> = {};
          errorResponse.response.data.errors.forEach((err) => {
            if (err.path) {
              serverErrors[err.path] = err.message || "Unknown error";
            }
          });
          setErrors(serverErrors);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setBus(initialState);
    setErrors({});
  };

  const generateSeatLayout = () => {
    if (!bus.seatLayout?.rows || !bus.seatLayout?.cols) return;

    const layout: Array<{
      row: number;
      col: number;
      type: "seat" | "berth" | "aisle" | "empty";
      code: string;
    }> = [];
    for (let row = 0; row < bus.seatLayout.rows; row++) {
      for (let col = 0; col < bus.seatLayout.cols; col++) {
        layout.push({
          row,
          col,
          type: "seat" as const,
          code: `${String.fromCharCode(65 + row)}${col + 1}`,
        });
      }
    }

    setBus((prev) => ({
      ...prev,
      seatLayout: { ...prev.seatLayout!, layout },
    }));
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/admin/buses")}
            sx={{ minWidth: "auto" }}
          />
          <Typography variant="h4" fontWeight={600}>
            Add New Bus
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Create a new bus entry with comprehensive details including amenities,
          operator information, and seat layout
        </Typography>
      </Box>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <DirectionsBus color="primary" />
                  <Typography variant="h6">Basic Information</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bus Name"
                      name="name"
                      value={bus.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Registration Number"
                      name="registrationNumber"
                      value={bus.registrationNumber}
                      onChange={handleChange}
                      error={!!errors.registrationNumber}
                      helperText={errors.registrationNumber}
                      fullWidth
                      required
                      placeholder="e.g., MH12AB1234"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <NumberTextField
                label="Capacity"
                      name="capacity"
                      
                      value={bus.capacity}
                      onChange={handleChange}
                      error={!!errors.capacity}
                      helperText={errors.capacity}
                      fullWidth
                      required
                      inputProps={{ min: 1, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <NumberTextField
                label="Total Seats (Optional)"
                      name="totalSeats"
                      
                      value={bus.totalSeats}
                      onChange={handleChange}
                      error={!!errors.totalSeats}
                      helperText={
                        errors.totalSeats || "Leave empty to use capacity"
                      }
                      fullWidth
                      inputProps={{ min: 1, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Bus Type</InputLabel>
                      <Select
                        name="type"
                        value={bus.type}
                        label="Bus Type"
                        onChange={handleSelectChange}
                      >
                        <MenuItem value={BusType.SEATER}>Seater</MenuItem>
                        <MenuItem value={BusType.SLEEPER}>Sleeper</MenuItem>
                        <MenuItem value={BusType.MIXED}>Mixed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={bus.ac}
                          onChange={(e) =>
                            setBus((prev) => ({
                              ...prev,
                              ac: e.target.checked,
                            }))
                          }
                          color="primary"
                        />
                      }
                      label="Air Conditioning"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Notes"
                      name="notes"
                      value={bus.notes}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Additional notes about the bus..."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Settings color="primary" />
                  <Typography variant="h6">Amenities & Features</Typography>
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    multiple
                    value={bus.amenities || []}
                    onChange={handleAmenitiesChange}
                    input={<OutlinedInput label="Amenities" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {BUS_AMENITIES.map((amenity) => (
                      <MenuItem key={amenity} value={amenity}>
                        <Checkbox
                          checked={(bus.amenities || []).indexOf(amenity) > -1}
                        />
                        <ListItemText
                          primary={
                            amenity.charAt(0).toUpperCase() + amenity.slice(1)
                          }
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Operator Information */}
            <Card>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Person color="primary" />
                  <Typography variant="h6">Operator Information</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Operator Name"
                      name="name"
                      value={bus.operator?.name || ""}
                      onChange={handleOperatorChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      value={bus.operator?.contactEmail || ""}
                      onChange={handleOperatorChange}
                      error={!!errors.operatorEmail}
                      helperText={errors.operatorEmail}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Contact Phone"
                      name="contactPhone"
                      value={bus.operator?.contactPhone || ""}
                      onChange={handleOperatorChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Seat Layout Configuration */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Settings color="primary" />
                  <Typography variant="h6">Seat Layout</Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showSeatLayout}
                      onChange={(e) => setShowSeatLayout(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Configure Seat Layout"
                />

                {showSeatLayout && (
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <NumberTextField
                label="Rows"
                          name="rows"
                          
                          value={bus.seatLayout?.rows || ""}
                          onChange={handleSeatLayoutChange}
                          error={!!errors.rows}
                          helperText={errors.rows}
                          fullWidth
                          size="small"
                          inputProps={{ min: 1, max: 20 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <NumberTextField
                label="Columns"
                          name="cols"
                          
                          value={bus.seatLayout?.cols || ""}
                          onChange={handleSeatLayoutChange}
                          error={!!errors.cols}
                          helperText={errors.cols}
                          fullWidth
                          size="small"
                          inputProps={{ min: 1, max: 10 }}
                        />
                      </Grid>
                    </Grid>

                    {bus.seatLayout?.rows && bus.seatLayout?.cols && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={generateSeatLayout}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        Generate Seat Layout
                      </Button>
                    )}

                    {bus.seatLayout?.layout &&
                      bus.seatLayout.layout.length > 0 && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          Seat layout generated with{" "}
                          {bus.seatLayout.layout.length} seats
                        </Alert>
                      )}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Status */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Status
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={bus.isActive}
                      onChange={(e) =>
                        setBus((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      color="primary"
                    />
                  }
                  label="Active"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Active buses can be assigned to routes and tours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}
        >
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            disabled={saving}
            type="submit"
          >
            {saving ? "Creating..." : "Create Bus"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddBusPage;
