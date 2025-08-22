"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Collapse,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import {
  FilterAlt,
  ExpandLess,
  ExpandMore,
  Search,
  Clear,
  Edit,
  Delete,
  Add,
  Visibility,
  VisibilityOff,
  LocationOn,
  Public,
  Drafts,
  Refresh,
  Download,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { placesService } from "@/lib/api/services/places.service";
import { successPopup, errorPopup, confirmPopup } from "@/utils/errors/alerts";
import { Country, State, City } from "@/lib/api/types/places.types";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 20;

const AdminPlacesPage: React.FC = () => {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [filterVisible, setFilterVisible] = useState(true);
  const [filters, setFilters] = useState<{
    name: string;
    countryId: string;
    stateId: string;
    isPublished: string;
  }>({
    name: "",
    countryId: "",
    stateId: "",
    isPublished: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch cities with filters
  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const nonEmptyFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => String(value).trim() !== ""
        )
      );

      // Create API parameters with proper types
      const apiParams: any = { ...nonEmptyFilters };
      if (apiParams.isPublished !== undefined) {
        apiParams.isPublished = apiParams.isPublished === "true";
      }

      const response = await placesService.listCities(apiParams);
      setCities(response);
      setTotalCount(response.length);
      setPageCount(Math.max(1, Math.ceil(response.length / ITEMS_PER_PAGE)));
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      errorPopup("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await placesService.listCountries();
      setCountries(response);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  // Fetch states
  const fetchStates = async () => {
    try {
      const response = await placesService.listStates();
      setStates(response);
    } catch (error) {
      console.error("Failed to fetch states:", error);
    }
  };

  // Fetch states by country
  const fetchStatesByCountry = async (countryId: string) => {
    try {
      const response = await placesService.getStatesByCountry(countryId);
      setStates(response);
    } catch (error) {
      console.error("Failed to fetch states by country:", error);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
    fetchStates();
  }, [fetchCities]);

  // Update states when country changes
  useEffect(() => {
    if (filters.countryId) {
      fetchStatesByCountry(filters.countryId);
      // Reset state filter when country changes
      setFilters((prev) => ({ ...prev, stateId: "" }));
    } else {
      fetchStates();
    }
  }, [filters.countryId]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterSelectChange = (e: SelectChangeEvent<string>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, name: value }));
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmPopup(
      "Are you sure you want to delete this city?"
    );
    if (confirmed) {
      try {
        await placesService.deleteCity(id);
        successPopup("City deleted successfully");
        fetchCities();
      } catch (error) {
        console.error("Failed to delete city:", error);
        errorPopup("Failed to delete city");
      }
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await placesService.toggleCityPublished(id, currentStatus);
      successPopup(
        `City ${currentStatus ? "unpublished" : "published"} successfully`
      );
      fetchCities();
    } catch (error) {
      console.error("Failed to toggle published status:", error);
      errorPopup("Failed to update published status");
    }
  };

  const handleExportCities = () => {
    const data = cities.map((city) => ({
      name: city.name,
      slug: city.slug,
      state: city.stateId?.name || "Unknown",
      country: city.countryId || "Unknown",
      isPublished: city.isPublished,
      createdAt: new Date(city.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cities");
    XLSX.writeFile(wb, "Cities_Export.xlsx");
  };

  const filteredCities = cities.filter((city) => {
    const nameMatch = city.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const countryMatch =
      filters.countryId === "" || city.countryId === filters.countryId;
    const stateMatch =
      filters.stateId === "" ||
      city?.stateId?._id?.toString() === filters.stateId;
    const publishedMatch =
      filters.isPublished === "" ||
      (filters.isPublished === "true" && city.isPublished) ||
      (filters.isPublished === "false" && !city.isPublished);

    return nameMatch && countryMatch && stateMatch && publishedMatch;
  });

  const paginatedCities = filteredCities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCountryName = (countryId: string) => {
    const country = countries.find((c) => c._id === countryId);
    return country ? country.name : "Unknown";
  };

  const getStateName = (stateId: string) => {
    const state = states.find((s) => s._id === stateId);
    return state ? state.name : "Unknown";
  };

  const getPublishedCount = () => cities.filter((c) => c.isPublished).length;
  const getDraftCount = () => cities.filter((c) => !c.isPublished).length;

  if (loading && cities.length === 0) {
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Cities Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage cities with rich metadata, SEO, and travel information
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Cities
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>
                {totalCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Published
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5, color: "success.main" }}>
                {getPublishedCount()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Draft
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5, color: "warning.main" }}>
                {getDraftCount()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Countries
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5, color: "info.main" }}>
                {new Set(cities.map((c) => c.countryId)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/places/countries")}
            startIcon={<LocationOn />}
          >
            Manage Countries
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/places/states")}
            startIcon={<LocationOn />}
          >
            Manage States
          </Button>
          <Button
            variant="outlined"
            onClick={handleExportCities}
            startIcon={<Download />}
          >
            Export Cities
          </Button>
          <Button
            variant="outlined"
            onClick={fetchCities}
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => router.push("/admin/places/cities/add")}
          startIcon={<Add />}
        >
          Add City
        </Button>
      </Box>

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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  freeSolo
                  options={[]}
                  inputValue={searchTerm}
                  onInputChange={(_, newValue) => handleSearchChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Search City Name"
                      size="small"
                      placeholder="Type to search cities..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => `${option.name} (${option.code})`}
                  value={
                    countries.find((c) => c._id === filters.countryId) || null
                  }
                  onChange={(_, newValue) => {
                    setFilters((prev) => ({
                      ...prev,
                      countryId: newValue?._id || "",
                      stateId: "", // Reset state when country changes
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Select Country"
                      size="small"
                      placeholder="Choose country..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={states}
                  getOptionLabel={(option) => option.name}
                  value={states.find((s) => s._id === filters.stateId) || null}
                  onChange={(_, newValue) => {
                    setFilters((prev) => ({
                      ...prev,
                      stateId: newValue?._id || "",
                    }));
                  }}
                  disabled={!filters.countryId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Select State"
                      size="small"
                      placeholder={
                        filters.countryId
                          ? "Choose state..."
                          : "Select country first"
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Select
                  fullWidth
                  size="small"
                  name="isPublished"
                  value={filters.isPublished}
                  onChange={handleFilterSelectChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All Status</em>
                  </MenuItem>
                  <MenuItem value="true">Published</MenuItem>
                  <MenuItem value="false">Draft</MenuItem>
                </Select>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={() => setCurrentPage(1)}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={() => {
                    setFilters({
                      name: "",
                      countryId: "",
                      stateId: "",
                      isPublished: "",
                    });
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Paper>

      {/* Cities Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>City Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCities.map((city) => (
              <TableRow key={city._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {city.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStateName(city.stateId?._id)}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getCountryName(city.countryId)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    color="text.secondary"
                  >
                    {city.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={city.isPublished ? <Public /> : <Drafts />}
                    label={city.isPublished ? "Published" : "Draft"}
                    color={city.isPublished ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(city.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title={city.isPublished ? "Unpublish" : "Publish"}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleTogglePublished(city._id, city.isPublished)
                        }
                      >
                        {city.isPublished ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() =>
                          router.push(`/admin/places/cities/${city._id}/edit`)
                        }
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(city._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {paginatedCities.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: "center", mt: 2 }}>
          <LocationOn sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No cities found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filters.name ||
            filters.countryId ||
            filters.stateId ||
            filters.isPublished !== ""
              ? "Try adjusting your filters or search criteria"
              : "Get started by adding your first city"}
          </Typography>
          {!(
            filters.name ||
            filters.countryId ||
            filters.stateId ||
            filters.isPublished !== ""
          ) && (
            <Button
              variant="contained"
              onClick={() => router.push("/admin/places/cities/add")}
              startIcon={<Add />}
            >
              Add First City
            </Button>
          )}
        </Paper>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_, p) => setCurrentPage(p)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>💡 Tip:</strong> Use the autocomplete filters above to find
        specific cities by name, country, or state. The system automatically
        updates available states based on your country selection.
      </Alert>
    </Container>
  );
};

export default AdminPlacesPage;
