"use client";

import React, { useEffect, useState } from "react";
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
  Chip,
  Stack,
  Tooltip,
  Card,
  CardContent,
  Alert,
  CircularProgress,
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
  Upload,
  Download,
  Refresh,
  LocationOn,
  Public,
  Drafts,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { placesService } from "@/lib/api/services/places.service";
import Breadcrumb from "@/components/admin/common/Breadcrumb";
import { City, Country, State } from "@/lib/api/types/places.types";
import { successPopup, errorPopup, confirmPopup } from "@/utils/errors/alerts";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 20;

const CitiesPage: React.FC = () => {
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

  const fetchCities = async () => {
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
  };

  const fetchCountries = async () => {
    try {
      const response = await placesService.listCountries();
      setCountries(response);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await placesService.listStates();
      setStates(response);
    } catch (error) {
      console.error("Failed to fetch states:", error);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
    fetchStates();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterSelectChange = (e: SelectChangeEvent<string>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await placesService.bulkUploadCitiesFromFile(file);

      if (result.success) {
        const successCount = result.results.filter(
          (r: any) => r.status === "ok"
        ).length;
        const errorCount = result.results.filter(
          (r: any) => r.status === "error"
        ).length;

        if (errorCount > 0) {
          successPopup(
            `Upload completed with ${successCount} successes and ${errorCount} errors. Check console for details.`
          );
        } else {
          successPopup(`Successfully uploaded ${successCount} cities`);
        }

        fetchCities();
      } else {
        errorPopup(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
      errorPopup("Failed to upload file");
    } finally {
      event.currentTarget.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    placesService.downloadBulkTemplate();
  };

  const handleDownloadCities = () => {
    const data = cities.map((city) => ({
      name: city.name,
      slug: city.slug,
      state: city.state?.name || "Unknown",
      country: city.country?.name || "Unknown",
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
      <Breadcrumb
        items={[
          { label: "Places", href: "/admin/places" },
          { label: "Cities", current: true },
        ]}
      />
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
          <Button component="label" variant="outlined" startIcon={<Upload />}>
            Upload Cities
            <input
              hidden
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
            />
          </Button>
          <Button
            variant="outlined"
            onClick={handleDownloadTemplate}
            startIcon={<Download />}
          >
            Download Template
          </Button>
          <Button
            variant="outlined"
            onClick={handleDownloadCities}
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
                <TextField
                  fullWidth
                  label="City Name"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Select
                  fullWidth
                  size="small"
                  name="countryId"
                  value={filters.countryId}
                  onChange={handleFilterSelectChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All Countries</em>
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name} ({country.code})
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Select
                  fullWidth
                  size="small"
                  name="stateId"
                  value={filters.stateId}
                  onChange={handleFilterSelectChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All States</em>
                  </MenuItem>
                  {states
                    .filter(
                      (s) =>
                        !filters.countryId || s.countryId === filters.countryId
                    )
                    .map((state) => (
                      <MenuItem key={state._id} value={state._id}>
                        {state.name}
                      </MenuItem>
                    ))}
                </Select>
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
        <strong>💡 Tip:</strong> Use the filters above to find specific cities.
        You can also bulk upload cities using Excel files or export your current
        data.
      </Alert>
    </Container>
  );
};

export default CitiesPage;
