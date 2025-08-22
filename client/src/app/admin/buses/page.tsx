"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Pagination,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  FilterAlt,
  Search,
  Clear,
  Edit,
  Add,
  DirectionsBus,
  Delete,
  Visibility,
  Refresh,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { busService } from "@/lib/api/services/bus.service";
import {
  Bus,
  BusListCondition,
  BusStats,
  BusType,
  BUS_AMENITIES,
} from "@/lib/api/types/bus.types";

const AdminBusesPage: React.FC = () => {
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BusStats | null>(null);
  const [filters, setFilters] = useState({
    q: "",
    type: "" as string,
    isActive: "" as string,
  });
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalBuses, setTotalBuses] = useState<number>(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedBuses, setSelectedBuses] = useState<string[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<
    "activate" | "deactivate" | "delete"
  >("activate");
  const [showLayoutPreview, setShowLayoutPreview] = useState(false);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const condition: BusListCondition = {
        page,
        items: itemsPerPage,
      };

      // Add filters only if they have values
      if (filters.q && filters.q.trim()) {
        condition.q = filters.q.trim();
      }

      if (filters.type && filters.type !== "") {
        condition.type = filters.type as BusType;
      }

      if (filters.isActive !== "") {
        condition.isActive = filters.isActive === "true";
      }

      const response = await busService.listBuses(condition);

      setBuses(response.buses);
      setTotalBuses(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await busService.getBusStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchBuses();
    fetchStats();
  }, [page, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleFilterSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleClearFilter = () => {
    setFilters({ q: "", type: "", isActive: "" });
    setPage(1);
  };

  const handleEditBus = (busId: string) => {
    router.push(`/admin/buses/${busId}/edit`);
  };

  const handleViewBus = (busId: string) => {
    router.push(`/admin/buses/${busId}`);
  };

  const handleAddBus = () => {
    router.push("/admin/buses/add");
  };

  const handleToggleBusStatus = async (
    busId: string,
    currentStatus: boolean
  ) => {
    try {
      await busService.toggleBusStatus(busId, currentStatus);
      fetchBuses(); // Refresh the list
    } catch (error) {
      console.error("Error updating bus status:", error);
    }
  };

  const handleDeleteBus = async (busId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this bus? This action cannot be undone."
      )
    ) {
      try {
        await busService.deleteBus(busId);
        fetchBuses(); // Refresh the list
      } catch (error) {
        console.error("Error deleting bus:", error);
      }
    }
  };

  const handleSelectBus = (busId: string) => {
    setSelectedBuses((prev) =>
      prev.includes(busId)
        ? prev.filter((id) => id !== busId)
        : [...prev, busId]
    );
  };

  const handleSelectAllBuses = () => {
    if (selectedBuses.length === buses.length) {
      setSelectedBuses([]);
    } else {
      setSelectedBuses(buses.map((bus) => bus._id));
    }
  };

  const handleBulkAction = async () => {
    if (selectedBuses.length === 0) return;

    try {
      if (bulkAction === "delete") {
        if (
          window.confirm(
            `Are you sure you want to delete ${selectedBuses.length} buses? This action cannot be undone.`
          )
        ) {
          await busService.bulkDeleteBuses({ busIds: selectedBuses });
        }
      } else {
        const isActive = bulkAction === "activate";
        await busService.bulkUpdateBuses({
          busIds: selectedBuses,
          updates: { isActive },
        });
      }

      setSelectedBuses([]);
      setBulkActionDialog(false);
      fetchBuses(); // Refresh the list
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const getBusTypeLabel = (type: BusType) => {
    const labels = {
      [BusType.SEATER]: "Seater",
      [BusType.SLEEPER]: "Sleeper",
      [BusType.MIXED]: "Mixed",
    };
    return labels[type] || type;
  };

  const getBusTypeColor = (type: BusType) => {
    const colors = {
      [BusType.SEATER]: "primary" as const,
      [BusType.SLEEPER]: "secondary" as const,
      [BusType.MIXED]: "warning" as const,
    };
    return colors[type] || "default";
  };

  const formatAmenities = (amenities: string[] = []) => {
    return (
      amenities.slice(0, 3).join(", ") + (amenities.length > 3 ? "..." : "")
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Buses Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage fleet details, capacity, amenities, and seat layouts
        </Typography>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <DirectionsBus
                      sx={{ fontSize: 40, color: "primary.main" }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {stats.totalBuses}
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
                    <DirectionsBus
                      sx={{ fontSize: 40, color: "success.main" }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {stats.activeBuses}
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
                        {stats.seaterBuses}
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
                    <DirectionsBus
                      sx={{ fontSize: 40, color: "warning.main" }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {stats.acBuses}
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
        </Box>
      )}

      {/* Filters */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FilterAlt /> Filters
          </Typography>
          <IconButton onClick={() => setFilterVisible(!filterVisible)}>
            {filterVisible ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={filterVisible} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Search"
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
                placeholder="Search by name or registration number"
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Bus Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  label="Bus Type"
                  onChange={handleFilterSelectChange}
                >
                  <MenuItem value="">
                    <em>All Types</em>
                  </MenuItem>
                  <MenuItem value="seater">Seater</MenuItem>
                  <MenuItem value="sleeper">Sleeper</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="isActive"
                  value={filters.isActive}
                  label="Status"
                  onChange={handleFilterSelectChange}
                >
                  <MenuItem value="">
                    <em>All Status</em>
                  </MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearFilter}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={fetchBuses}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {selectedBuses.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary">
                {selectedBuses.length} bus(es) selected
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setBulkActionDialog(true)}
              >
                Bulk Actions
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              fetchBuses();
              fetchStats();
            }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => setShowLayoutPreview(!showLayoutPreview)}
          >
            {showLayoutPreview ? "Hide" : "Show"} Layout Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddBus}
          >
            Add Bus
          </Button>
        </Box>
      </Box>

      {/* Buses Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ width: "5%" }}>
                  <Checkbox
                    checked={
                      selectedBuses.length === buses.length && buses.length > 0
                    }
                    indeterminate={
                      selectedBuses.length > 0 &&
                      selectedBuses.length < buses.length
                    }
                    onChange={handleSelectAllBuses}
                  />
                </TableCell>
                <TableCell sx={{ width: "20%" }}>Bus Details</TableCell>
                <TableCell sx={{ width: "15%" }}>Type & Capacity</TableCell>
                <TableCell sx={{ width: "20%" }}>Amenities</TableCell>
                <TableCell sx={{ width: "10%" }}>Status</TableCell>
                <TableCell sx={{ width: "15%" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus._id} hover>
                  <TableCell>
                    <Checkbox
                      checked={selectedBuses.includes(bus._id)}
                      onChange={() => handleSelectBus(bus._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {bus.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {bus.registrationNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip
                        label={getBusTypeLabel(bus.type)}
                        color={getBusTypeColor(bus.type)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2">
                        {bus.capacity} seats
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {bus.ac ? "AC" : "Non-AC"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {bus.amenities && bus.amenities.length > 0
                        ? formatAmenities(bus.amenities)
                        : "No amenities"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={bus.isActive}
                          onChange={() =>
                            handleToggleBusStatus(bus._id, bus.isActive)
                          }
                          color="primary"
                          size="small"
                        />
                      }
                      label={bus.isActive ? "Active" : "Inactive"}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewBus(bus._id)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Bus">
                        <IconButton
                          size="small"
                          onClick={() => handleEditBus(bus._id)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Bus">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteBus(bus._id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Bulk Action Dialog */}
      <Dialog
        open={bulkActionDialog}
        onClose={() => setBulkActionDialog(false)}
      >
        <DialogTitle>Bulk Action</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value as any)}
              label="Action"
            >
              <MenuItem value="activate">Activate Selected</MenuItem>
              <MenuItem value="deactivate">Deactivate Selected</MenuItem>
              <MenuItem value="delete">Delete Selected</MenuItem>
            </Select>
          </FormControl>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action will affect {selectedBuses.length} bus(es). Are you
            sure?
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBulkAction}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBusesPage;
