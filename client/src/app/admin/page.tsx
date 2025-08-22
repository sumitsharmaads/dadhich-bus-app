"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Box,
  Divider,
  Chip,
  Alert,
  Button,
} from "@mui/material";
import {
  People,
  DirectionsBus,
  Place,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  AdminPanelSettings,
  PersonOff,
  PersonAdd,
  Tour,
} from "@mui/icons-material";
import { adminService } from "@/lib/api/services/admin.service";
import { busService } from "@/lib/api/services/bus.service";
import { DashboardStats } from "@/lib/api/types/admin.types";
import { BusStats } from "@/lib/api/types/bus.types";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [busStats, setBusStats] = useState<BusStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userStats, busStatsData] = await Promise.all([
        adminService.getDashboardStats(),
        busService.getBusStats(),
      ]);

      if (userStats) {
        setDashboardData(userStats);
      }

      if (busStatsData) {
        setBusStats(busStatsData);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setError(
        error?.response?.data?.message || "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const revenueChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          5000, 7000, 8000, 12000, 15000, 11000, 9000, 10000, 13000, 14000,
          15000, 16000,
        ],
        backgroundColor: "rgba(194, 42, 84, 0.6)",
        borderColor: "rgba(194, 42, 84, 1)",
        borderWidth: 1,
      },
    ],
  };

  const bookingsChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Bookings",
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: "rgba(32, 37, 66, 1)",
        backgroundColor: "rgba(32, 37, 66, 0.1)",
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your business today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* User Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <People sx={{ fontSize: 40, color: "primary.main" }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {dashboardData?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <People sx={{ fontSize: 40, color: "success.main" }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {dashboardData?.activeUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AdminPanelSettings sx={{ fontSize: 40, color: "info.main" }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {dashboardData?.adminUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admin Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <People sx={{ fontSize: 40, color: "warning.main" }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {dashboardData?.captainUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Captains
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bus Stats */}
      {busStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Fleet Overview
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <DirectionsBus sx={{ fontSize: 40, color: "primary.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {busStats.totalBuses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Buses
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <DirectionsBus sx={{ fontSize: 40, color: "success.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {busStats.activeBuses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Buses
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <DirectionsBus sx={{ fontSize: 40, color: "info.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {busStats.seaterBuses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seater Buses
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <DirectionsBus sx={{ fontSize: 40, color: "warning.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {busStats.acBuses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AC Buses
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Revenue Overview" />
            <CardContent>
              <Bar
                data={revenueChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Weekly Bookings" />
            <CardContent>
              <Line
                data={bookingsChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={() => router.push("/admin/users/add")}
                    fullWidth
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Add User
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    startIcon={<DirectionsBus />}
                    onClick={() => router.push("/admin/buses/add")}
                    fullWidth
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Add Bus
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    startIcon={<Place />}
                    onClick={() => router.push("/admin/places/add")}
                    fullWidth
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Add Place
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    startIcon={<Tour />}
                    onClick={() => router.push("/admin/tours/add")}
                    fullWidth
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Add Tour
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Status */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="System Status" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" color="success.main">
                      Online
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Server Status
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" color="success.main">
                      {dashboardData?.totalUsers || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Users
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" color="success.main">
                      {dashboardData?.activeUsers || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" color="success.main">
                      99.9%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Uptime
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
