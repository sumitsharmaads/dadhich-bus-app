"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Cancel,
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn,
  Info,
  TravelExplore,
  PhotoCamera,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { placesService } from "@/lib/api/services/places.service";
import Breadcrumb from "@/components/admin/common/Breadcrumb";
import {
  CreateCityRequest,
  Country,
  State,
} from "@/lib/api/types/places.types";
import { successPopup, errorPopup } from "@/utils/errors/alerts";

const AddCityPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [form, setForm] = useState<CreateCityRequest>({
    name: "",
    slug: "",
    countryId: "",
    stateId: "",
    isPublished: true,
    location: { type: "Point", coordinates: [0, 0] },
    visitInfo: {
      bestTime: "",
      averageVisitDurationMins: 0,
      openingHours: [],
      entryFees: [],
      amenities: [],
      safetyNotes: "",
    },
    content: {
      description: "",
      longDescription: "",
      tags: [],
      categories: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        ogImageUrl: "",
      },
    },
    travel: {
      howToReach: {
        nearestAirportId: "",
        nearestStationId: "",
        nearestBusId: "",
        notes: "",
      },
      pickupDropPoints: [],
    },
  });

  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (form.countryId) {
      fetchStatesByCountry(form.countryId);
    }
  }, [form.countryId]);

  const fetchCountries = async () => {
    try {
      const response = await placesService.listCountries();
      setCountries(response);
    } catch (error) {
      errorPopup("Failed to fetch countries");
    }
  };

  const fetchStatesByCountry = async (countryId: string) => {
    try {
      const response = await placesService.getStatesByCountry(countryId);
      setStates(response);
    } catch (error) {
      errorPopup("Failed to fetch states");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleLocationChange = (field: "lat" | "lng", value: string) => {
    const numValue = parseFloat(value) || 0;
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location!,
        coordinates:
          field === "lat"
            ? [prev.location!.coordinates[0], numValue]
            : [numValue, prev.location!.coordinates[1]],
      },
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !form.content?.tags?.includes(newTag.trim())) {
      setForm((prev) => ({
        ...prev,
        content: {
          ...prev.content!,
          tags: [...(prev.content?.tags || []), newTag.trim()],
        },
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content!,
        tags: prev.content?.tags?.filter((tag) => tag !== tagToRemove) || [],
      },
    }));
  };

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !form.content?.categories?.includes(newCategory.trim())
    ) {
      setForm((prev) => ({
        ...prev,
        content: {
          ...prev.content!,
          categories: [...(prev.content?.categories || []), newCategory.trim()],
        },
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content!,
        categories:
          prev.content?.categories?.filter((cat) => cat !== categoryToRemove) ||
          [],
      },
    }));
  };

  const addAmenity = () => {
    if (
      newAmenity.trim() &&
      !form.visitInfo?.amenities?.includes(newAmenity.trim())
    ) {
      setForm((prev) => ({
        ...prev,
        visitInfo: {
          ...prev.visitInfo!,
          amenities: [...(prev.visitInfo?.amenities || []), newAmenity.trim()],
        },
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      visitInfo: {
        ...prev.visitInfo!,
        amenities:
          prev.visitInfo?.amenities?.filter(
            (amenity) => amenity !== amenityToRemove
          ) || [],
      },
    }));
  };

  const addKeyword = () => {
    if (
      newKeyword.trim() &&
      !form.content?.seo?.metaKeywords?.includes(newKeyword.trim())
    ) {
      setForm((prev) => ({
        ...prev,
        content: {
          ...prev.content!,
          seo: {
            ...prev.content?.seo!,
            metaKeywords: [
              ...(prev.content?.seo?.metaKeywords || []),
              newKeyword.trim(),
            ],
          },
        },
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content!,
        seo: {
          ...prev.content?.seo!,
          metaKeywords:
            prev.content?.seo?.metaKeywords?.filter(
              (keyword) => keyword !== keywordToRemove
            ) || [],
        },
      },
    }));
  };

  const handleSave = async () => {
    const name = form.name?.trim();
    const countryId = form.countryId?.trim();
    const stateId = form.stateId?.trim();

    if (!name || !countryId || !stateId) {
      errorPopup("Name, Country, and State are required");
      return;
    }

    if (!form.slug) {
      form.slug = placesService.generateSlug(name);
    }

    setSaving(true);
    try {
      await placesService.createCity(form);
      successPopup("City created successfully");
      router.push("/admin/places/cities");
    } catch (error) {
      errorPopup("Failed to create city");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          { label: "Places", href: "/admin/places" },
          { label: "Cities", href: "/admin/places/cities" },
          { label: "Add City", current: true },
        ]}
      />
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <IconButton onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight={600}>
            Add New City
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Create a new city with comprehensive information including location,
          visit details, and SEO
        </Typography>
      </Box>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Info /> Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City Name *"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    fullWidth
                    required
                    placeholder="e.g., Mumbai"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Slug (auto-generated if empty)"
                    name="slug"
                    value={form.slug}
                    onChange={handleFormChange}
                    fullWidth
                    placeholder="e.g., mumbai"
                    helperText="Leave empty to auto-generate from name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Country *</InputLabel>
                    <Select
                      label="Country *"
                      name="countryId"
                      value={form.countryId}
                      onChange={handleSelectChange}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                          {country.name} ({country.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>State *</InputLabel>
                    <Select
                      label="State *"
                      name="stateId"
                      value={form.stateId}
                      onChange={handleSelectChange}
                      disabled={!form.countryId}
                    >
                      {states.map((state) => (
                        <MenuItem key={state._id} value={state._id}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
            </Paper>

            {/* Location Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocationOn /> Location Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Latitude"
                    type="number"
                    value={form.location?.coordinates[1] || ""}
                    onChange={(e) =>
                      handleLocationChange("lat", e.target.value)
                    }
                    fullWidth
                    placeholder="e.g., 19.0760"
                    inputProps={{ step: "any" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Longitude"
                    type="number"
                    value={form.location?.coordinates[0] || ""}
                    onChange={(e) =>
                      handleLocationChange("lng", e.target.value)
                    }
                    fullWidth
                    placeholder="e.g., 72.8777"
                    inputProps={{ step: "any" }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Content & SEO */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <PhotoCamera /> Content & SEO
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={form.content?.description || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        content: {
                          ...prev.content!,
                          description: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Brief description of the city"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Long Description"
                    name="longDescription"
                    value={form.content?.longDescription || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        content: {
                          ...prev.content!,
                          longDescription: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Detailed description of the city"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Meta Title"
                    value={form.content?.seo?.metaTitle || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        content: {
                          ...prev.content!,
                          seo: {
                            ...prev.content?.seo!,
                            metaTitle: e.target.value,
                          },
                        },
                      }))
                    }
                    fullWidth
                    placeholder="SEO meta title"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Meta Description"
                    value={form.content?.seo?.metaDescription || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        content: {
                          ...prev.content!,
                          seo: {
                            ...prev.content?.seo!,
                            metaDescription: e.target.value,
                          },
                        },
                      }))
                    }
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="SEO meta description"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="OG Image URL"
                    value={form.content?.seo?.ogImageUrl || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        content: {
                          ...prev.content!,
                          seo: {
                            ...prev.content?.seo!,
                            ogImageUrl: e.target.value,
                          },
                        },
                      }))
                    }
                    fullWidth
                    placeholder="Open Graph image URL"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Tags */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tags
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={addTag}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {form.content?.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>

            {/* Categories */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Categories
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCategory())
                    }
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={addCategory}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {form.content?.categories?.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      onDelete={() => removeCategory(category)}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>

            {/* Keywords */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                SEO Keywords
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addKeyword())
                    }
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={addKeyword}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {form.content?.seo?.metaKeywords?.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      onDelete={() => removeKeyword(keyword)}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>

            {/* Visit Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <TravelExplore /> Visit Info
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Best Time to Visit"
                    value={form.visitInfo?.bestTime || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        visitInfo: {
                          ...prev.visitInfo!,
                          bestTime: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    size="small"
                    placeholder="e.g., October to March"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Average Visit Duration (minutes)"
                    type="number"
                    value={form.visitInfo?.averageVisitDurationMins || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        visitInfo: {
                          ...prev.visitInfo!,
                          averageVisitDurationMins:
                            parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    fullWidth
                    size="small"
                    placeholder="e.g., 120"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Safety Notes"
                    value={form.visitInfo?.safetyNotes || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        visitInfo: {
                          ...prev.visitInfo!,
                          safetyNotes: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    placeholder="Safety information for visitors"
                  />
                </Grid>
              </Grid>

              {/* Amenities */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Amenities
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add amenity"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addAmenity())
                    }
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={addAmenity}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {form.visitInfo?.amenities?.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      onDelete={() => removeAmenity(amenity)}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
        >
          <Button
            variant="outlined"
            onClick={() => router.back()}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          >
            {saving ? "Creating..." : "Create City"}
          </Button>
        </Box>
      </form>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <strong>💡 Tip:</strong> Fill in as much information as possible. You
        can always edit the city later to add more details.
      </Alert>
    </Container>
  );
};

export default AddCityPage;
