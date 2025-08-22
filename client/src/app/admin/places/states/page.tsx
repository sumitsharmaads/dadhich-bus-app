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
  Upload,
  Download,
  Refresh,
} from "@mui/icons-material";
import { placesService } from "@/lib/api/services/places.service";
import {
  State,
  CreateStateRequest,
  Country,
} from "@/lib/api/types/places.types";
import { successPopup, errorPopup, confirmPopup } from "@/utils/errors/alerts";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 10;

const StatesPage: React.FC = () => {
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filterVisible, setFilterVisible] = useState(true);
  const [filters, setFilters] = useState<{
    name: string;
    countryId: string;
    isPublished: string;
  }>({
    name: "",
    countryId: "",
    isPublished: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CreateStateRequest>({
    name: "",
    code: "",
    slug: "",
    countryId: "",
    isPublished: true,
  });

  const fetchStates = async () => {
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

      const response = await placesService.listStates(apiParams);
      setStates(response);
      setTotalCount(response.length);
      setPageCount(Math.max(1, Math.ceil(response.length / ITEMS_PER_PAGE)));
    } catch (error) {
      console.error("Failed to fetch states:", error);
      errorPopup("Failed to fetch states");
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

  useEffect(() => {
    fetchStates();
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
      countryId: "",
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (state: State) => {
    setEditId(state._id);
    setForm({
      name: state.name,
      code: state.code || "",
      slug: state.slug,
      countryId: state.countryId,
      isPublished: state.isPublished,
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
    const countryId = form.countryId?.trim();

    if (!name || !countryId) {
      errorPopup("Name and Country are required");
      return;
    }

    // Generate slug if not provided
    if (!form.slug) {
      form.slug = placesService.generateSlug(name);
    }

    setSaving(true);
    try {
      if (editId) {
        await placesService.updateState(editId, form);
        successPopup("State updated successfully");
      } else {
        await placesService.createState(form);
        successPopup("State created successfully");
      }
      setModalOpen(false);
      fetchStates();
    } catch (error) {
      console.error("Failed to save state:", error);
      errorPopup("Failed to save state");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmPopup(
      "Are you sure you want to delete this state?"
    );
    if (confirmed) {
      try {
        await placesService.deleteState(id);
        successPopup("State deleted successfully");
        fetchStates();
      } catch (error) {
        console.error("Failed to delete state:", error);
        errorPopup("Failed to delete state");
      }
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await placesService.toggleStatePublished(id, currentStatus);
      successPopup(
        `State ${currentStatus ? "unpublished" : "published"} successfully`
      );
      fetchStates();
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

      const statesToUpload: CreateStateRequest[] = [];
      for (let i = 0; i < rawRows.length; i++) {
        const row = rawRows[i];
        const name = (row.name || "").toString().trim();
        const code = (row.code || "").toString().trim();
        const countryName = (row.country || "").toString().trim();

        if (!name || !countryName) {
          if (i > 0) {
            successPopup(
              `Upload parsed until row ${i}. Stopped at first incomplete row.`
            );
          } else {
            errorPopup("First row is missing required fields (name, country)");
          }
          break;
        }

        // Find country by name
        const country = countries.find(
          (c) =>
            c.name.toLowerCase() === countryName.toLowerCase() ||
            c.code.toLowerCase() === countryName.toLowerCase()
        );

        if (!country) {
          errorPopup(
            `Country "${countryName}" not found. Please create it first.`
          );
          continue;
        }

        statesToUpload.push({
          name,
          code: code || "",
          slug: placesService.generateSlug(name),
          countryId: country._id,
          isPublished: true,
        });
      }

      if (statesToUpload.length === 0) return;

      // Create states one by one
      for (const state of statesToUpload) {
        try {
          await placesService.createState(state);
        } catch (error) {
          console.error(`Failed to create state ${state.name}:`, error);
        }
      }

      successPopup(`Successfully uploaded ${statesToUpload.length} states`);
      fetchStates();
    } catch (error) {
      console.error("Failed to upload file:", error);
      errorPopup("Failed to upload file");
    } finally {
      event.currentTarget.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      { name: "Maharashtra", code: "MH", country: "India" },
      { name: "Karnataka", code: "KA", country: "India" },
      { name: "Tamil Nadu", code: "TN", country: "India" },
      { name: "California", code: "CA", country: "US" },
      { name: "Texas", code: "TX", country: "US" },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "States Template");
    XLSX.writeFile(wb, "States_Template.xlsx");
  };

  const handleDownloadStates = () => {
    const data = states.map((state) => ({
      name: state.name,
      code: state.code || "",
      slug: state.slug,
      country: state.country?.name || "Unknown",
      isPublished: state.isPublished,
      createdAt: new Date(state.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "States");
    XLSX.writeFile(wb, "States_Export.xlsx");
  };

  const filteredStates = states.filter((state) => {
    const nameMatch = state.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const countryMatch =
      filters.countryId === "" || state.countryId === filters.countryId;
    const publishedMatch =
      filters.isPublished === "" ||
      (filters.isPublished === "true" && state.isPublished) ||
      (filters.isPublished === "false" && !state.isPublished);

    return nameMatch && countryMatch && publishedMatch;
  });

  const paginatedStates = filteredStates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCountryName = (countryId: string) => {
    const country = countries.find((c) => c._id === countryId);
    return country ? country.name : "Unknown";
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          States Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage states/provinces with country relationships for the places
          system
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total States
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
                {states.filter((s) => s.isPublished).length}
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
                {states.filter((s) => !s.isPublished).length}
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
                {new Set(states.map((s) => s.countryId)).size}
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
            Upload States
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
            onClick={handleDownloadStates}
            startIcon={<Download />}
          >
            Export States
          </Button>
          <Button
            variant="outlined"
            onClick={fetchStates}
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
        <Button variant="contained" onClick={openAddModal} startIcon={<Add />}>
          Add State
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
                  label="State Name"
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
                    setFilters({ name: "", countryId: "", isPublished: "" });
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

      {/* States Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>State Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStates.map((state) => (
              <TableRow key={state._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {state.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {state.code ? (
                    <Chip
                      label={state.code}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getCountryName(state.countryId)}
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
                    {state.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={state.isPublished ? "Published" : "Draft"}
                    color={state.isPublished ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(state.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip
                      title={state.isPublished ? "Unpublish" : "Publish"}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleTogglePublished(state._id, state.isPublished)
                        }
                      >
                        {state.isPublished ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => openEditModal(state)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(state._id)}
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
        <DialogTitle>{editId ? "Edit State" : "Add New State"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State Name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                fullWidth
                size="small"
                placeholder="e.g., Maharashtra"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State Code (optional)"
                name="code"
                value={form.code}
                onChange={handleFormChange}
                fullWidth
                size="small"
                placeholder="e.g., MH"
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Country *</InputLabel>
                <Select
                  label="Country *"
                  name="countryId"
                  value={form.countryId}
                  onChange={handleFilterSelectChange}
                  required
                >
                  {countries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name} ({country.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Slug (auto-generated if empty)"
                name="slug"
                value={form.slug}
                onChange={handleFormChange}
                fullWidth
                size="small"
                placeholder="e.g., maharashtra"
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

export default StatesPage;
