"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  Badge,
  Divider,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Publish,
  Unpublished,
  FilterList,
  Search,
  Clear,
  Download,
  Upload,
  MoreVert,
  CalendarToday,
  LocationOn,
  AttachMoney,
  Group,
  Schedule,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Cancel,
  Warning,
} from "@mui/icons-material";
import { Autocomplete } from "@mui/material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { tourService } from "@/lib/api/services/tour.service";
import { placesService } from "@/lib/api/services/places.service";
import {
  Tour,
  AdminTourListParams,
  AdminTourStats,
} from "@/lib/api/types/tour.types";
import { City } from "@/lib/api/types/places.types";
import { successPopup, errorPopup, confirmPopup } from "@/utils/errors/alerts";
import Breadcrumb from "@/components/admin/common/Breadcrumb";

const ITEMS_PER_PAGE = 20;

const AdminToursPage: React.FC = () => {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminTourStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTours, setTotalTours] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [filters, setFilters] = useState<AdminTourListParams>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    search: "",
    status: "all",
    type: "",
    sourceCity: "",
    destinationCity: "",
    startDate: "",
    endDate: "",
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    fetchTours();
    fetchStats();
  }, [filters]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await tourService.getAdminTourList(filters);

      if (response.success) {
        setTours(response.data.tours);
        setTotalTours(response.data.total);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.page);
      } else {
        errorPopup(response.message || "Failed to fetch tours");
        // Set default values if API fails
        setTours([]);
        setTotalTours(0);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      errorPopup("Failed to fetch tours");
      // Set default values if API fails
      setTours([]);
      setTotalTours(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await tourService.getAdminTourStats();
      if (response.success) {
        setStats(response.data);
      } else {
        // Set default stats if API fails
        setStats({
          totalTours: 0,
          publishedTours: 0,
          draftTours: 0,
          activeTours: 0,
          totalCapacity: 0,
          totalRevenue: 0,
          upcomingTours: 0,
          completedTours: 0,
        });
      }
    } catch (error) {
      // Set default stats if API fails
      setStats({
        totalTours: 0,
        publishedTours: 0,
        draftTours: 0,
        activeTours: 0,
        totalCapacity: 0,
        totalRevenue: 0,
        upcomingTours: 0,
        completedTours: 0,
      });
    }
  };

  const searchCities = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setCities([]);
      return;
    }

    setCitiesLoading(true);
    try {
      const citiesData = await placesService.listCities({
        name: searchTerm,
        isPublished: true,
      });
      setCities(citiesData);
    } catch (error) {
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  };

  const clearCities = () => {
    setCities([]);
  };

  // Debounced search function
  const debouncedSearchCities = React.useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          searchCities(searchTerm);
        }, 300);
      };
    }, []),
    []
  );

  const handleFilterChange = (key: keyof AdminTourListParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: "",
      status: "all",
      type: "",
      sourceCity: "",
      destinationCity: "",
      startDate: "",
      endDate: "",
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSelectedTours([]);
    clearCities();
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTours(tours.map((tour) => tour._id));
    } else {
      setSelectedTours([]);
    }
  };

  const handleSelectTour = (tourId: string) => {
    setSelectedTours((prev) =>
      prev.includes(tourId)
        ? prev.filter((id) => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handlePublishTour = async (tourId: string) => {
    try {
      const response = await tourService.publishTour(tourId);
      if (response.success) {
        successPopup("Tour published successfully");
        fetchTours();
        fetchStats();
      } else {
        errorPopup(response.message || "Failed to publish tour");
      }
    } catch (error) {
      errorPopup("Failed to publish tour");
    }
  };

  const handleDraftTour = async (tourId: string) => {
    try {
      const response = await tourService.draftTour(tourId);
      if (response.success) {
        successPopup("Tour moved to draft");
        fetchTours();
        fetchStats();
      } else {
        errorPopup(response.message || "Failed to move tour to draft");
      }
    } catch (error) {
      errorPopup("Failed to move tour to draft");
    }
  };

  const handleToggleActive = async (tourId: string, isActive: boolean) => {
    try {
      const response = await tourService.toggleTourActive(tourId, isActive);
      if (response.success) {
        successPopup(
          `Tour ${isActive ? "activated" : "deactivated"} successfully`
        );
        fetchTours();
        fetchStats();
      } else {
        errorPopup(response.message || "Failed to update tour status");
      }
    } catch (error) {
      errorPopup("Failed to update tour status");
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    const confirmed = await confirmPopup(
      "Are you sure you want to delete this tour? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await tourService.deleteTour(tourId);
      if (response.success) {
        successPopup("Tour deleted successfully");
        fetchTours();
        fetchStats();
      } else {
        errorPopup(response.message || "Failed to delete tour");
      }
    } catch (error) {
      errorPopup("Failed to delete tour");
    }
  };

  const handleBulkPublish = async () => {
    if (selectedTours.length === 0) {
      errorPopup("Please select tours to publish");
      return;
    }

    try {
      const response = await tourService.bulkPublishTours(selectedTours);
      if (response.success) {
        successPopup(
          `${response.data.successCount} tours published successfully`
        );
        setSelectedTours([]);
        fetchTours();
        fetchStats();
      } else {
        errorPopup(response.message || "Failed to publish tours");
      }
    } catch (error) {
      errorPopup("Failed to publish tours");
    }
  };

  const handleBulkDraft = async () => {
    if (selectedTours.length === 0) {
      errorPopup("Please select tours to move to draft");
      return;
    }

    try {
      const response = await tourService.bulkDraftTours(selectedTours);
      if (response.success) {
        successPopup(`${response.data.successCount} tours moved to draft`);
        setSelectedTours([]);
        fetchTours();
        fetchStats();
      } else {
        errorPopup(response.message || "Failed to move tours to draft");
      }
    } catch (error) {
      errorPopup("Failed to move tours to draft");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTours.length === 0) {
      errorPopup("Please select tours to delete");
      return;
    }

    const confirmed = await confirmPopup(
      `Are you sure you want to delete ${selectedTours.length} tours? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const response = await tourService.bulkDeleteTours(selectedTours);
      if (response.success) {
        successPopup(
          `${response.data.successCount} tours deleted successfully`
        );
        setSelectedTours([]);
        fetchTours();
        fetchStats();
      } else {
        errorPopup(response.message || "Failed to delete tours");
      }
    } catch (error) {
      errorPopup("Failed to delete tours");
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    try {
      const response = await tourService.exportTours({ format, filters });
      if (response.success && response.data.downloadUrl) {
        // Handle base64 data URL for Excel export
        if (response.data.downloadUrl.startsWith("data:")) {
          // Create download link for base64 data
          if (typeof document !== "undefined") {
            const link = document.createElement("a");
            link.href = response.data.downloadUrl;
            link.download =
              response.data.filename ||
              `tours-${dayjs().format("YYYY-MM-DD")}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            successPopup(
              `Tours exported successfully as ${format.toUpperCase()}`
            );
          }
        } else {
          // Handle regular URL download
          if (typeof document !== "undefined") {
            const link = document.createElement("a");
            link.href = response.data.downloadUrl;
            link.download =
              response.data.filename ||
              `tours-${dayjs().format("YYYY-MM-DD")}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            successPopup(
              `Tours exported successfully as ${format.toUpperCase()}`
            );
          }
        }
      } else {
        errorPopup(response.message || "Failed to export tours");
      }
    } catch (error) {
      errorPopup("Failed to export tours");
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      errorPopup("Please select a file to import");
      return;
    }

    setImporting(true);
    try {
      const response = await tourService.importTours(importFile);
      if (response.success) {
        const { totalRows, successCount, failedCount, errors, results } =
          response.data;

        if (failedCount > 0) {
          // Show detailed results for failed imports
          const errorDetails = errors.slice(0, 5).join("\n"); // Show first 5 errors
          const message = `Import completed with ${successCount} successes and ${failedCount} failures.\n\nFirst few errors:\n${errorDetails}`;

          if (errors.length > 5) {
            errorPopup(
              `${message}\n\n... and ${
                errors.length - 5
              } more errors. Check console for full details.`
            );
          } else {
            errorPopup(message);
          }

          // Log full results to console for debugging
        } else {
          successPopup(`Successfully imported ${successCount} tours`);
        }

        setImportDialogOpen(false);
        setImportFile(null);
        fetchTours();
        fetchStats();
      } else {
        errorPopup(response.message || "Failed to import tours");
      }
    } catch (error) {
      errorPopup("Failed to import tours");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    tourService.downloadTourTemplate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle fontSize="small" />;
      case "draft":
        return <Warning fontSize="small" />;
      default:
        return <Cancel fontSize="small" />;
    }
  };

  if (loading && tours.length === 0) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Tours", current: true },
        ]}
      />

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="h4" fontWeight={600}>
            Tours Management
          </Typography>
          <Badge badgeContent={totalTours} color="primary">
            <Chip label="Total Tours" variant="outlined" />
          </Badge>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage tours, itineraries, pricing, and publishing status
        </Typography>
      </Box>

      {/* Debug Section - Remove this after testing */}
      <Box sx={{ mb: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          🔍 Debug Info
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Current Filters:</strong> {JSON.stringify(filters, null, 2)}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Total Tours:</strong> {totalTours} |{" "}
          <strong>Current Page:</strong> {currentPage} |{" "}
          <strong>Total Pages:</strong> {totalPages}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const allFilters = {
              ...filters,
              status: "all" as const,
              search: "",
              sourceCity: "",
              destinationCity: "",
            };
            setFilters(allFilters);
          }}
          sx={{ mr: 1 }}
        >
          Reset All Filters
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const draftFilters = { ...filters, status: "draft" as const };
            setFilters(draftFilters);
          }}
          sx={{ mr: 1 }}
        >
          Show Draft Tours Only
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const publishedFilters = {
              ...filters,
              status: "published" as const,
            };
            setFilters(publishedFilters);
          }}
        >
          Show Published Tours Only
        </Button>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {stats.publishedTours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Published Tours
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
                  <Warning sx={{ fontSize: 40, color: "warning.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {stats.draftTours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Draft Tours
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
                  <Group sx={{ fontSize: 40, color: "info.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {stats.totalCapacity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Capacity
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
                  <Schedule sx={{ fontSize: 40, color: "primary.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {stats.upcomingTours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upcoming Tours
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
            <FilterList /> Filters & Search
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              {filtersVisible ? "Hide" : "Show"} Filters
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={clearFilters}
              startIcon={<Clear />}
            >
              Clear
            </Button>
          </Box>
        </Box>

        {filtersVisible && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Search Tours"
                  size="small"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  fullWidth
                  placeholder="Tour name, description..."
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) =>
                    `${option.name}, ${option.state?.name || "N/A"}`
                  }
                  value={
                    cities.find((city) => city.name === filters.sourceCity) ||
                    null
                  }
                  onChange={(event, newValue) => {
                    handleFilterChange("sourceCity", newValue?.name || "");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  onInputChange={(event, newInputValue) => {
                    debouncedSearchCities(newInputValue);
                  }}
                  loading={citiesLoading}
                  filterOptions={(x) => x} // Disable built-in filtering
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Source City"
                      size="small"
                      placeholder="Search cities..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {citiesLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.state?.name}, {option.country?.name}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No cities found"
                  loadingText="Searching cities..."
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) =>
                    `${option.name}, ${option.state?.name || "N/A"}`
                  }
                  value={
                    cities.find(
                      (city) => city.name === filters.destinationCity
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleFilterChange("destinationCity", newValue?.name || "");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  onInputChange={(event, newInputValue) => {
                    debouncedSearchCities(newInputValue);
                  }}
                  loading={citiesLoading}
                  filterOptions={(x) => x} // Disable built-in filtering
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Destination City"
                      size="small"
                      placeholder="Search cities..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {citiesLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.state?.name}, {option.country?.name}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No cities found"
                  loadingText="Searching cities..."
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="date"
                  label="Start Date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="date"
                  label="End Date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Min Price"
                  type="number"
                  size="small"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  fullWidth
                  placeholder="0"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Max Price"
                  type="number"
                  size="small"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  fullWidth
                  placeholder="10000"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    label="Sort By"
                  >
                    <MenuItem value="createdAt">Created Date</MenuItem>
                    <MenuItem value="tourName">Tour Name</MenuItem>
                    <MenuItem value="startDate">Start Date</MenuItem>
                    <MenuItem value="pricing.minFare">Price</MenuItem>
                    <MenuItem value="capacity">Capacity</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      handleFilterChange("sortOrder", e.target.value)
                    }
                    label="Sort Order"
                  >
                    <MenuItem value="desc">Descending</MenuItem>
                    <MenuItem value="asc">Ascending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
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
        <Box sx={{ display: "flex", gap: 1 }}>
          {selectedTours.length > 0 && (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={handleBulkPublish}
                startIcon={<Publish />}
              >
                Publish ({selectedTours.length})
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleBulkDraft}
                startIcon={<Unpublished />}
              >
                Draft ({selectedTours.length})
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleBulkDelete}
                startIcon={<Delete />}
              >
                Delete ({selectedTours.length})
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDownloadTemplate}
            startIcon={<Download />}
          >
            Download Template
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setImportDialogOpen(true)}
            startIcon={<Upload />}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleExport("excel")}
            startIcon={<Download />}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/admin/tours/add")}
            startIcon={<Add />}
          >
            Add Tour
          </Button>
        </Box>
      </Box>

      {/* Tours Table */}
      <Paper sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedTours.length > 0 &&
                      selectedTours.length < tours.length
                    }
                    checked={
                      tours.length > 0 && selectedTours.length === tours.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Tour Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Source → Destination</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTours.includes(tour._id)}
                      onChange={() => handleSelectTour(tour._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {tour.tourName}
                      </Typography>
                      {tour.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {tour.description.substring(0, 50)}...
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tour.status}
                      color={getStatusColor(tour.status)}
                      icon={getStatusIcon(tour.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {tour.sources[0]?.cityName || "N/A"} →{" "}
                        {tour.places[0]?.name || "N/A"}
                      </Typography>
                      {tour.places.length > 1 && (
                        <Typography variant="caption" color="text.secondary">
                          +{tour.places.length - 1} more places
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {dayjs(tour.startDate).format("DD MMM YYYY")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        to {dayjs(tour.endDate).format("DD MMM YYYY")}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {tour.days || 0}D / {tour.nights || 0}N
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{tour.capacity}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{tour.pricing.minFare}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tour.pricing.currencyCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View Tour">
                        <IconButton
                          size="small"
                          onClick={() =>
                            router.push(`/admin/tours/${tour._id}`)
                          }
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit Tour">
                        <IconButton
                          size="small"
                          onClick={() =>
                            router.push(`/admin/tours/${tour._id}/edit`)
                          }
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title={
                          tour.status === "published"
                            ? "Move to Draft"
                            : "Publish"
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            tour.status === "published"
                              ? handleDraftTour(tour._id)
                              : handlePublishTour(tour._id)
                          }
                        >
                          {tour.status === "published" ? (
                            <Unpublished />
                          ) : (
                            <Publish />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title={tour.isActive ? "Deactivate" : "Activate"}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleToggleActive(tour._id, !tour.isActive)
                          }
                        >
                          {tour.isActive ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Tour">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteTour(tour._id)}
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

        <TablePagination
          component="div"
          count={totalTours}
          page={currentPage - 1}
          onPageChange={handlePageChange}
          rowsPerPage={ITEMS_PER_PAGE}
          rowsPerPageOptions={[ITEMS_PER_PAGE]}
        />
      </Paper>

      {/* Empty State */}
      {!loading && tours.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No tours found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filters.search ||
            filters.status !== "all" ||
            filters.sourceCity ||
            filters.destinationCity
              ? "Try adjusting your filters or search criteria"
              : "Get started by creating your first tour"}
          </Typography>
          {!filters.search &&
            filters.status === "all" &&
            !filters.sourceCity &&
            !filters.destinationCity && (
              <Button
                variant="contained"
                onClick={() => router.push("/admin/tours/add")}
                startIcon={<Add />}
              >
                Create First Tour
              </Button>
            )}
        </Box>
      )}

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Tours</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload an Excel or CSV file to import multiple tours at once.
            </Typography>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              style={{ marginBottom: "16px" }}
            />
            <Alert severity="info">
              <strong>Note:</strong> Make sure your file follows the required
              format. Download the template first to see the correct structure.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!importFile || importing}
            startIcon={importing ? <CircularProgress size={20} /> : <Upload />}
          >
            {importing ? "Importing..." : "Import"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminToursPage;
