"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  DirectionsBus,
  Settings,
  Person,
  Visibility,
  Chair,
  Bed,
  Remove,
  SpaceBar,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { busService } from "@/lib/api/services/bus.service";
import {
  Bus,
  BusType,
  BUS_AMENITIES,
  SeatLayoutCell,
} from "@/lib/api/types/bus.types";

// Seat Layout Viewer Component (Read-only)
const SeatLayoutViewer: React.FC<{
  seatLayout: Bus["seatLayout"];
  busType: BusType;
}> = ({ seatLayout, busType }) => {
  if (!seatLayout?.rows || !seatLayout?.cols) {
    return (
      <Alert severity="info">No seat layout configured for this bus</Alert>
    );
  }

  const rows = seatLayout.rows;
  const cols = seatLayout.cols;

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

  const getSeatColor = (type: string) => {
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
      <Typography variant="h6" sx={{ mb: 2 }}>
        Seat Layout
      </Typography>

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
                    bgcolor: getSeatColor(seatType),
                    color:
                      seatType === "aisle" || seatType === "empty"
                        ? "#666"
                        : "white",
                    position: "relative",
                  }}
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
                          color:
                            seatType === "aisle" || seatType === "empty"
                              ? "#666"
                              : "inherit",
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

const ViewBusPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const busId = params.id as string;

  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBus = useCallback(async () => {
    try {
      setLoading(true);
      const busData = await busService.getBus(busId);
      setBus(busData);
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
            Bus Details: {bus.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          View complete bus information, amenities, operator details, and seat
          layout
        </Typography>

        {/* Quick Actions */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => router.push(`/admin/buses/${busId}/edit`)}
          >
            Edit Bus
          </Button>
        </Box>
      </Box>

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
                  <Typography variant="body2" color="text.secondary">
                    Bus Name
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {bus.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Registration Number
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {bus.registrationNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Capacity
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {bus.capacity} passengers
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Seats
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {bus.totalSeats || bus.capacity} seats
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Bus Type
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <Chip
                      label={
                        bus.type.charAt(0).toUpperCase() + bus.type.slice(1)
                      }
                      color="primary"
                      size="small"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Air Conditioning
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <Chip
                      label={bus.ac ? "AC" : "Non-AC"}
                      color={bus.ac ? "success" : "default"}
                      size="small"
                    />
                  </Typography>
                </Grid>
                {bus.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Notes
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {bus.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Amenities */}
          {bus.amenities && bus.amenities.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Settings color="primary" />
                  <Typography variant="h6">Amenities & Features</Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {bus.amenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Seat Layout Visualization */}
          {bus.seatLayout?.rows && bus.seatLayout?.cols && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <SeatLayoutViewer
                  seatLayout={bus.seatLayout}
                  busType={bus.type}
                />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Operator Information */}
          {bus.operator && (
            <Card>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Person color="primary" />
                  <Typography variant="h6">Operator Information</Typography>
                </Box>

                <Grid container spacing={2}>
                  {bus.operator.name && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Operator Name
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {bus.operator.name}
                      </Typography>
                    </Grid>
                  )}
                  {bus.operator.contactEmail && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Contact Email
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {bus.operator.contactEmail}
                      </Typography>
                    </Grid>
                  )}
                  {bus.operator.contactPhone && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Contact Phone
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {bus.operator.contactPhone}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Status */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Status
              </Typography>
              <Chip
                label={bus.isActive ? "Active" : "Inactive"}
                color={bus.isActive ? "success" : "default"}
                size="small"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {bus.isActive
                  ? "This bus is active and can be assigned to routes"
                  : "This bus is inactive and cannot be assigned to routes"}
              </Typography>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                System Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(bus.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(bus.updatedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewBusPage;
