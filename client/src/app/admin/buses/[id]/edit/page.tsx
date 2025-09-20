"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Clear,
  DirectionsBus,
  Settings,
  Person,
  Visibility,
  Close,
  Chair,
  Bed,
  Remove,
  SpaceBar,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { busService } from "@/lib/api/services/bus.service";
import { NumberTextField } from "@/components/common";
import { formatDate, formatTime, formatDateTime } from "@/utils/dateFormat";
import {
  Bus,
  UpdateBusData,
  BusType,
  BUS_AMENITIES,
  SeatLayoutCell,
} from "@/lib/api/types/bus.types";

// Seat Layout Visualization Component
const SeatLayoutVisualizer: React.FC<{
  seatLayout: Bus["seatLayout"];
  onLayoutChange: (layout: SeatLayoutCell[]) => void;
  busType: BusType;
}> = ({ seatLayout, onLayoutChange, busType }) => {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);

  if (!seatLayout?.rows || !seatLayout?.cols) {
    return (
      <Alert severity="info">
        Configure rows and columns to generate seat layout
      </Alert>
    );
  }

  const rows = seatLayout.rows;
  const cols = seatLayout.cols;

  const handleSeatClick = (row: number, col: number) => {
    if (!editMode) return;

    const seatKey = `${row}-${col}`;
    const newSelected = new Set(selectedSeats);

    if (newSelected.has(seatKey)) {
      newSelected.delete(seatKey);
    } else {
      newSelected.add(seatKey);
    }

    setSelectedSeats(newSelected);
  };

  const changeSeatType = (type: "seat" | "berth" | "aisle" | "empty") => {
    if (selectedSeats.size === 0) return;

    const newLayout = [...(seatLayout.layout || [])];

    selectedSeats.forEach((seatKey) => {
      const [row, col] = seatKey.split("-").map(Number);
      const existingIndex = newLayout.findIndex(
        (seat) => seat.row === row && seat.col === col
      );

      if (existingIndex >= 0) {
        newLayout[existingIndex] = { ...newLayout[existingIndex], type };
      } else {
        newLayout.push({
          row,
          col,
          type,
          code: `${String.fromCharCode(65 + row)}${col + 1}`,
        });
      }
    });

    onLayoutChange(newLayout);
    setSelectedSeats(new Set());
  };

  const getSeatType = (row: number, col: number) => {
    const seat = seatLayout.layout?.find((s) => s.row === row && s.col === col);
    return seat?.type || "seat";
  };

  const getSeatIcon = (type: string) => {
    switch (type) {
      case "berth":
        return <Bed fontSize="small" />;
      case "aisle":
        return <Remove fontSize="small" />;
      case "empty":
        return <SpaceBar fontSize="small" />;
      default:
        return <Chair fontSize="small" />;
    }
  };

  const getSeatColor = (type: string, row: number, col: number) => {
    const seatKey = `${row}-${col}`;
    if (selectedSeats.has(seatKey)) {
      return "primary.main";
    }

    switch (type) {
      case "berth":
        return "#9c27b0";
      case "aisle":
        return "#f5f5f5";
      case "empty":
        return "#e0e0e0";
      default:
        return "#2196f3";
    }
  };

  const isDriverSeat = (row: number, col: number) => row === 0 && col === 0;

  const isSteeringWheel = (row: number, col: number) => row === 0 && col === 1;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Seat Layout Preview</Typography>
        <Button
          variant={editMode ? "contained" : "outlined"}
          size="small"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Exit Edit Mode" : "Edit Layout"}
        </Button>
      </Box>

      {editMode && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Select seats and change their type:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Chair />}
              onClick={() => changeSeatType("seat")}
              disabled={selectedSeats.size === 0}
            >
              Seat
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Bed />}
              onClick={() => changeSeatType("berth")}
              disabled={selectedSeats.size === 0}
            >
              Berth
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Remove />}
              onClick={() => changeSeatType("aisle")}
              disabled={selectedSeats.size === 0}
            >
              Aisle
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SpaceBar />}
              onClick={() => changeSeatType("empty")}
              disabled={selectedSeats.size === 0}
            >
              Empty
            </Button>
          </Box>
        </Box>
      )}

      {/* Bus Layout Container */}
      <Box
        sx={{
          border: "2px solid #ccc",
          borderRadius: 2,
          p: 2,
          bgcolor: "white",
          position: "relative",
          overflow: "auto",
        }}
      >
        {/* Driver Area */}
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Driver Area
          </Typography>
        </Box>

        {/* Seat Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 1,
            maxWidth: "fit-content",
            mx: "auto",
          }}
        >
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => {
              const seatType = getSeatType(row, col);
              const seatKey = `${row}-${col}`;

              return (
                <Box
                  key={seatKey}
                  sx={{
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    bgcolor: getSeatColor(seatType, row, col),
                    color: "white",
                    cursor: editMode ? "pointer" : "default",
                    position: "relative",
                    "&:hover": editMode
                      ? {
                          opacity: 0.8,
                          transform: "scale(1.05)",
                        }
                      : {},
                    transition: "all 0.2s",
                  }}
                  onClick={() => handleSeatClick(row, col)}
                >
                  {isDriverSeat(row, col) ? (
                    <Tooltip title="Driver Seat">
                      <Box sx={{ color: "#ff9800" }}>
                        <Typography variant="caption" fontWeight="bold">
                          D
                        </Typography>
                      </Box>
                    </Tooltip>
                  ) : isSteeringWheel(row, col) ? (
                    <Tooltip title="Steering Wheel">
                      <Box sx={{ color: "#666" }}>
                        <Typography variant="caption">⚙️</Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    <>
                      {getSeatIcon(seatType)}
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: 2,
                          right: 2,
                          fontSize: "0.6rem",
                          color: "inherit",
                        }}
                      >
                        {String.fromCharCode(65 + row)}
                        {col + 1}
                      </Typography>
                    </>
                  )}
                </Box>
              );
            })
          )}
        </Box>

        {/* Legend */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#2196f3",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Seat</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#9c27b0",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Berth</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#f5f5f5",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Aisle</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#e0e0e0",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Empty</Typography>
          </Box>
        </Box>
      </Box>

      {/* Layout Statistics */}
      {seatLayout.layout && seatLayout.layout.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Layout Summary:
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Chip
              label={`${
                seatLayout.layout.filter((s) => s.type === "seat").length
              } Seats`}
              size="small"
              color="primary"
            />
            <Chip
              label={`${
                seatLayout.layout.filter((s) => s.type === "berth").length
              } Berths`}
              size="small"
              color="secondary"
            />
            <Chip
              label={`${
                seatLayout.layout.filter((s) => s.type === "aisle").length
              } Aisles`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${
                seatLayout.layout.filter((s) => s.type === "empty").length
              } Empty`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const EditBusPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const busId = params.id as string;

  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSeatLayout, setShowSeatLayout] = useState(false);

  const fetchBus = useCallback(async () => {
    try {
      setLoading(true);
      const busData = await busService.getBus(busId);
      setBus(busData);
      setShowSeatLayout(
        !!busData.seatLayout?.rows && !!busData.seatLayout?.cols
      );
    } catch (error) {
      console.error("Error fetching bus:", error);
      router.push("/admin/buses");
    } finally {
      setLoading(false);
    }
  }, [busId, router]);

  useEffect(() => {
    if (busId) {
      fetchBus();
    }
  }, [busId, fetchBus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!bus) return;

    const { name, value } = e.target;
    setBus((prev) => ({ ...prev!, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (e: SelectChangeEvent<BusType>) => {
    if (!bus) return;

    const { name, value } = e.target;
    if (name) {
      setBus((prev) => ({ ...prev!, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!bus) return;

    const { name, value } = e.target;
    setBus((prev) => ({
      ...prev!,
      operator: { ...prev!.operator!, [name]: value },
    }));
  };

  const handleAmenitiesChange = (event: SelectChangeEvent<string[]>) => {
    if (!bus) return;

    const value = event.target.value as string[];
    setBus((prev) => ({ ...prev!, amenities: value }));
  };

  const handleSeatLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!bus) return;

    const { name, value } = e.target;
    setBus((prev) => ({
      ...prev!,
      seatLayout: { ...prev!.seatLayout!, [name]: Number(value) },
    }));
  };

  const validate = () => {
    if (!bus) return false;

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
    if (!bus || !validate()) return;

    setSaving(true);
    try {
      const payload: UpdateBusData = {
        name: bus.name.trim(),
        registrationNumber: bus.registrationNumber.trim(),
        capacity: Number(bus.capacity),
        totalSeats: bus.totalSeats || bus.capacity,
        type: bus.type,
        ac: bus.ac,
        amenities: bus.amenities,
        operator: bus.operator?.name ? bus.operator : undefined,
        seatLayout:
          bus.seatLayout?.rows && bus.seatLayout?.cols
            ? bus.seatLayout
            : undefined,
        notes: bus.notes,
        isActive: bus.isActive,
      };

      await busService.updateBus(busId, payload);
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
    if (bus) {
      fetchBus();
      setErrors({});
    }
  };

  const generateSeatLayout = () => {
    if (!bus?.seatLayout?.rows || !bus?.seatLayout?.cols) return;

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
      ...prev!,
      seatLayout: { ...prev!.seatLayout!, layout },
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!bus) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Bus not found</Alert>
      </Container>
    );
  }

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
            Edit Bus: {bus.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Update bus details, amenities, operator information, and seat layout
        </Typography>

        {/* Quick Actions */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => setShowSeatLayout(!showSeatLayout)}
            disabled={!bus.seatLayout?.rows || !bus.seatLayout?.cols}
          >
            {showSeatLayout ? "Hide" : "Show"} Seat Layout
          </Button>
        </Box>
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
                      
                      value={bus.totalSeats || ""}
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
                              ...prev!,
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
                      value={bus.notes || ""}
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

            {/* Seat Layout Visualization */}
            {showSeatLayout && bus.seatLayout?.rows && bus.seatLayout?.cols && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <SeatLayoutVisualizer
                    seatLayout={bus.seatLayout}
                    onLayoutChange={(layout) =>
                      setBus((prev) => ({
                        ...prev!,
                        seatLayout: { ...prev!.seatLayout!, layout },
                      }))
                    }
                    busType={bus.type}
                  />
                </CardContent>
              </Card>
            )}

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

                {/* Seat Layout Visualizer */}
                {showSeatLayout &&
                  bus.seatLayout?.rows &&
                  bus.seatLayout?.cols && (
                    <Box sx={{ mt: 3 }}>
                      <SeatLayoutVisualizer
                        seatLayout={bus.seatLayout}
                        onLayoutChange={(layout) =>
                          setBus((prev) => ({
                            ...prev!,
                            seatLayout: { ...prev!.seatLayout!, layout },
                          }))
                        }
                        busType={bus.type}
                      />
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
                          ...prev!,
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
            {saving ? "Updating..." : "Update Bus"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditBusPage;
