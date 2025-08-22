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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Tooltip,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
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
} from "@mui/icons-material";
import { placesService } from "@/lib/api/services/places.service";
import { Country, CreateCountryRequest } from "@/lib/api/types/places.types";
import { successPopup, errorPopup, confirmPopup } from "@/utils/errors/alerts";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 10;

const CountriesPage: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filterVisible, setFilterVisible] = useState(true);
  const [filters, setFilters] = useState<{
    name: string;
    code: string;
    isPublished: string;
  }>({
    name: "",
    code: "",
    isPublished: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CreateCountryRequest>({
    name: "",
    code: "",
    slug: "",
    isPublished: true,
  });

  const fetchCountries = async () => {
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

      const response = await placesService.listCountries(apiParams);
      setCountries(response);
      setTotalCount(response.length);
      setPageCount(Math.max(1, Math.ceil(response.length / ITEMS_PER_PAGE)));
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      errorPopup("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterSelectChange = (e: SelectChangeEvent<string>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      name: "",
      code: "",
      slug: "",
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (country: Country) => {
    setEditId(country._id);
    setForm({
      name: country.name,
      code: country.code,
      slug: country.slug,
      isPublished: country.isPublished,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    const name = form.name?.trim();
    const code = form.code?.trim();

    if (!name || !code) {
      errorPopup("Name and Code are required");
      return;
    }

    // Generate slug if not provided
    if (!form.slug) {
      form.slug = placesService.generateSlug(name);
    }

    setSaving(true);
    try {
      if (editId) {
        await placesService.updateCountry(editId, form);
        successPopup("Country updated successfully");
      } else {
        await placesService.createCountry(form);
        successPopup("Country created successfully");
      }
      setModalOpen(false);
      fetchCountries();
    } catch (error) {
      console.error("Failed to save country:", error);
      errorPopup("Failed to save country");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmPopup(
      "Are you sure you want to delete this country?"
    );
    if (confirmed) {
      try {
        await placesService.deleteCountry(id);
        successPopup("Country deleted successfully");
        fetchCountries();
      } catch (error) {
        console.error("Failed to delete country:", error);
        errorPopup("Failed to delete country");
      }
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await placesService.toggleCountryPublished(id, currentStatus);
      successPopup(
        `Country ${currentStatus ? "unpublished" : "published"} successfully`
      );
      fetchCountries();
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
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows: any[] = XLSX.utils.sheet_to_json(sheet);

      const countriesToUpload: CreateCountryRequest[] = [];
      for (let i = 0; i < rawRows.length; i++) {
        const row = rawRows[i];
        const name = (row.name || "").toString().trim();
        const code = (row.code || "").toString().trim();

        if (!name || !code) {
          if (i > 0) {
            successPopup(
              `Upload parsed until row ${i}. Stopped at first incomplete row.`
            );
          } else {
            errorPopup("First row is missing required fields (name, code)");
          }
          break;
        }

        countriesToUpload.push({
          name,
          code: code.toUpperCase(),
          slug: placesService.generateSlug(name),
          isPublished: true,
        });
      }

      if (countriesToUpload.length === 0) return;

      // Create countries one by one
      for (const country of countriesToUpload) {
        try {
          await placesService.createCountry(country);
        } catch (error) {
          console.error(`Failed to create country ${country.name}:`, error);
        }
      }

      successPopup(
        `Successfully uploaded ${countriesToUpload.length} countries`
      );
      fetchCountries();
    } catch (error) {
      console.error("Failed to upload file:", error);
      errorPopup("Failed to upload file");
    } finally {
      event.currentTarget.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      { name: "India", code: "IN" },
      { name: "United States", code: "US" },
      { name: "United Kingdom", code: "UK" },
      { name: "Canada", code: "CA" },
      { name: "Australia", code: "AU" },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Countries Template");
    XLSX.writeFile(wb, "Countries_Template.xlsx");
  };

  const handleDownloadCountries = () => {
    const data = countries.map((country) => ({
      name: country.name,
      code: country.code,
      slug: country.slug,
      isPublished: country.isPublished,
      createdAt: new Date(country.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Countries");
    XLSX.writeFile(wb, "Countries_Export.xlsx");
  };

  const filteredCountries = countries.filter((country) => {
    const nameMatch = country.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const codeMatch = country.code
      .toLowerCase()
      .includes(filters.code.toLowerCase());
    const publishedMatch =
      filters.isPublished === "" ||
      (filters.isPublished === "true" && country.isPublished) ||
      (filters.isPublished === "false" && !country.isPublished);

    return nameMatch && codeMatch && publishedMatch;
  });

  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Countries Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage countries with ISO codes and slugs for the places system
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Countries
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
                {countries.filter((c) => c.isPublished).length}
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
                {countries.filter((c) => !c.isPublished).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Page
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>
                {currentPage} / {pageCount}
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
            Upload Countries
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
            onClick={handleDownloadCountries}
            startIcon={<Download />}
          >
            Export Countries
          </Button>
          <Button
            variant="outlined"
            onClick={fetchCountries}
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
        <Button variant="contained" onClick={openAddModal} startIcon={<Add />}>
          Add Country
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
                  label="Country Name"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="ISO Code"
                  name="code"
                  value={filters.code}
                  onChange={handleFilterChange}
                  size="small"
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
                    setFilters({ name: "", code: "", isPublished: "" });
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

      {/* Countries Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ISO Code</TableCell>
              <TableCell>Country Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCountries.map((country) => (
              <TableRow key={country._id} hover>
                <TableCell>
                  <Chip
                    label={country.code}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {country.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    color="text.secondary"
                  >
                    {country.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={country.isPublished ? "Published" : "Draft"}
                    color={country.isPublished ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(country.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip
                      title={country.isPublished ? "Unpublish" : "Publish"}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleTogglePublished(
                            country._id,
                            country.isPublished
                          )
                        }
                      >
                        {country.isPublished ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => openEditModal(country)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(country._id)}
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

      {/* Pagination */}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editId ? "Edit Country" : "Add New Country"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country Name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                fullWidth
                size="small"
                placeholder="e.g., India"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ISO Code"
                name="code"
                value={form.code}
                onChange={handleFormChange}
                fullWidth
                size="small"
                placeholder="e.g., IN"
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Slug (auto-generated if empty)"
                name="slug"
                value={form.slug}
                onChange={handleFormChange}
                fullWidth
                size="small"
                placeholder="e.g., india"
                helperText="Leave empty to auto-generate from name"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleSwitchChange}
                  />
                }
                label="Published"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CountriesPage;
