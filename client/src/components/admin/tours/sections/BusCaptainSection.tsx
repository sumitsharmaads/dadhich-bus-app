"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Autocomplete,
  Chip,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { CreateTourRequest } from "@/lib/api/types/tour.types";
import { tourService } from "@/lib/api/services/tour.service";

interface BusCaptainSectionProps {
  form: CreateTourRequest;
  onFormChange: (field: keyof CreateTourRequest, value: any) => void;
  errors: Record<string, string>;
}

interface Bus {
  _id: string;
  registrationNumber: string;
  capacity: number;
  type: string;
  isActive: boolean;
}

interface Captain {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  isActive: boolean;
  licenseNumber?: string;
  experience?: number;
}

const BusCaptainSection: React.FC<BusCaptainSectionProps> = ({
  form,
  onFormChange,
  errors,
}) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [busesLoading, setBusesLoading] = useState(false);
  const [captainsLoading, setCaptainsLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedCaptain, setSelectedCaptain] = useState<Captain | null>(null);

  // Fetch available buses and captains on component mount
  useEffect(() => {
    fetchAvailableBuses();
    fetchAvailableCaptains();
  }, []);

  // Set selected bus/captain when form values change
  useEffect(() => {
    if (form.busId && buses.length > 0) {
      const bus = buses.find((b) => b._id === form.busId);
      setSelectedBus(bus || null);
    }
  }, [form.busId, buses]);

  useEffect(() => {
    if (form.captainUserId && captains.length > 0) {
      const captain = captains.find((c) => c._id === form.captainUserId);
      setSelectedCaptain(captain || null);
    }
  }, [form.captainUserId, captains]);

  const fetchAvailableBuses = async () => {
    setBusesLoading(true);
    try {
      const response = await tourService.getAvailableBuses();

      if (response.success) {
        setBuses(response.data || []);
      } else {
        console.error("Buses API error:", response.message);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setBusesLoading(false);
    }
  };

  const fetchAvailableCaptains = async () => {
    setCaptainsLoading(true);
    try {
      const response = await tourService.getAvailableCaptains();

      if (response.success) {
        setCaptains(response.data || []);
      } else {
        console.error("Captains API error:", response.message);
      }
    } catch (error) {
      console.error("Error fetching captains:", error);
    } finally {
      setCaptainsLoading(false);
    }
  };

  const handleBusSelect = (bus: Bus | null) => {
    setSelectedBus(bus);
    onFormChange("busId", bus?._id || "");
  };

  const handleCaptainSelect = (captain: Captain | null) => {
    setSelectedCaptain(captain);
    onFormChange("captainUserId", captain?._id || "");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Section 4: Bus and Captain (Non-mandatory)
        </Typography>

        <Grid container spacing={3}>
          {/* Bus Selection */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Bus Selection
            </Typography>

            <Autocomplete
              options={buses}
              getOptionLabel={(option) =>
                `${option.registrationNumber} (${option.type})`
              }
              value={selectedBus}
              onChange={(_, value) => handleBusSelect(value)}
              loading={busesLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Bus"
                  placeholder="Search for available buses"
                  error={!!errors.busId}
                  helperText={errors.busId}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {option.registrationNumber}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.type} • Capacity: {option.capacity}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText="No buses available"
              loadingText="Loading buses..."
            />

            {/* Selected Bus Details */}
            {selectedBus && (
              <Paper sx={{ mt: 2, p: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Bus Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Bus Number:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {selectedBus.registrationNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Type:</strong>
                    </Typography>
                    <Typography variant="body2">{selectedBus.type}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Capacity:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {selectedBus.capacity} passengers
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Status:</strong>
                    </Typography>
                    <Chip
                      label={selectedBus.isActive ? "Active" : "Inactive"}
                      color={selectedBus.isActive ? "success" : "error"}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Captain Selection */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Captain Selection
            </Typography>

            <Autocomplete
              options={captains}
              getOptionLabel={(option) => option.fullname}
              value={selectedCaptain}
              onChange={(_, value) => handleCaptainSelect(value)}
              loading={captainsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Captain"
                  placeholder="Search for available captains"
                  error={!!errors.captainUserId}
                  helperText={errors.captainUserId}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {option.fullname}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText="No captains available"
              loadingText="Loading captains..."
            />

            {/* Selected Captain Details */}
            {selectedCaptain && (
              <Paper sx={{ mt: 2, p: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Captain Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Name:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {selectedCaptain.fullname}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Username:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {selectedCaptain.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Email:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {selectedCaptain.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Phone:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {selectedCaptain.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Status:</strong>
                    </Typography>
                    <Chip
                      label={selectedCaptain.isActive ? "Active" : "Inactive"}
                      color={selectedCaptain.isActive ? "success" : "error"}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Information Alert */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Bus and captain selection is optional. You
            can assign these later or leave them unassigned for now. The system
            will show only available (active) buses and captains.
          </Typography>
        </Alert>

        {/* Error Display */}
        {busesLoading === false && buses.length === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> No buses found. This might be due to
              authentication issues or no active buses in the system.
            </Typography>
          </Alert>
        )}

        {captainsLoading === false && captains.length === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> No captains found. This might be due to
              authentication issues or no active captains in the system.
            </Typography>
          </Alert>
        )}

        {/* Refresh Buttons */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchAvailableBuses}
            disabled={busesLoading}
          >
            Refresh Buses
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchAvailableCaptains}
            disabled={captainsLoading}
          >
            Refresh Captains
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BusCaptainSection;
