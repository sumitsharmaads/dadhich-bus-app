"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Publish,
  Unpublished,
  Visibility,
  VisibilityOff,
  Delete,
  LocationOn,
  Schedule,
  AttachMoney,
  Group,
  Info,
  Route,
  Hotel,
} from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { tourService } from "@/lib/api/services/tour.service";
import { Tour } from "@/lib/api/types/tour.types";
import { successPopup, errorPopup, confirmPopup } from "@/utils/errors/alerts";
import Breadcrumb from "@/components/admin/common/Breadcrumb";
import dayjs from "dayjs";

const TourViewPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const tourId = params?.id as string;
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  const fetchTour = async () => {
    try {
      const tourData = await tourService.getTourById(tourId);
      setTour(tourData);
    } catch (error) {
      console.error("Failed to fetch tour:", error);
      errorPopup("Failed to fetch tour");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      const response = await tourService.publishTour(tourId);
      if (response.success) {
        successPopup("Tour published successfully");
        fetchTour();
      } else {
        errorPopup(response.message || "Failed to publish tour");
      }
    } catch (error) {
      console.error("Failed to publish tour:", error);
      errorPopup("Failed to publish tour");
    }
  };

  const handleDraft = async () => {
    try {
      const response = await tourService.draftTour(tourId);
      if (response.success) {
        successPopup("Tour moved to draft");
        fetchTour();
      } else {
        errorPopup(response.message || "Failed to move tour to draft");
      }
    } catch (error) {
      console.error("Failed to move tour to draft:", error);
      errorPopup("Failed to move tour to draft");
    }
  };

  const handleToggleActive = async () => {
    if (!tour) return;

    try {
      const response = await tourService.toggleTourActive(
        tourId,
        !tour.isActive
      );
      if (response.success) {
        successPopup(
          `Tour ${tour.isActive ? "deactivated" : "activated"} successfully`
        );
        fetchTour();
      } else {
        errorPopup(response.message || "Failed to update tour status");
      }
    } catch (error) {
      console.error("Failed to update tour status:", error);
      errorPopup("Failed to update tour status");
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmPopup(
      "Are you sure you want to delete this tour? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await tourService.deleteTour(tourId);
      if (response.success) {
        successPopup("Tour deleted successfully");
        router.push("/admin/tours");
      } else {
        errorPopup(response.message || "Failed to delete tour");
      }
    } catch (error) {
      console.error("Failed to delete tour:", error);
      errorPopup("Failed to delete tour");
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

  if (!tour) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 3 }}>
          Tour not found. Please check the URL and try again.
        </Alert>
      </Container>
    );
  }

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

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Tours", href: "/admin/tours" },
          { label: tour.tourName, current: true },
        ]}
      />

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/admin/tours")}
          >
            Back to Tours
          </Button>
          <Typography variant="h4" fontWeight={600}>
            {tour.tourName}
          </Typography>
          <Chip
            label={tour.status}
            color={getStatusColor(tour.status)}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Tour ID: {tourId}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => router.push(`/admin/tours/${tourId}/edit`)}
          startIcon={<Edit />}
        >
          Edit Tour
        </Button>

        {tour.status === "published" ? (
          <Button
            variant="outlined"
            onClick={handleDraft}
            startIcon={<Unpublished />}
          >
            Move to Draft
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={handlePublish}
            startIcon={<Publish />}
          >
            Publish Tour
          </Button>
        )}

        <Button
          variant="outlined"
          onClick={handleToggleActive}
          startIcon={tour.isActive ? <VisibilityOff /> : <Visibility />}
        >
          {tour.isActive ? "Deactivate" : "Activate"}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          startIcon={<Delete />}
        >
          Delete Tour
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Basic Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Info /> Basic Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Tour Name:</strong>
                </Typography>
                <Typography variant="body1">{tour.tourName}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong>
                </Typography>
                <Chip
                  label={tour.status}
                  color={getStatusColor(tour.status)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Capacity:</strong>
                </Typography>
                <Typography variant="body1">{tour.capacity} people</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Active:</strong>
                </Typography>
                <Chip
                  label={tour.isActive ? "Active" : "Inactive"}
                  color={tour.isActive ? "success" : "default"}
                  size="small"
                />
              </Grid>

              {tour.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Description:</strong>
                  </Typography>
                  <Typography variant="body1">{tour.description}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Dates & Duration */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Schedule /> Dates & Duration
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Start Date:</strong>
                </Typography>
                <Typography variant="body1">
                  {dayjs(tour.startDate).format("DD MMM YYYY")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>End Date:</strong>
                </Typography>
                <Typography variant="body1">
                  {dayjs(tour.endDate).format("DD MMM YYYY")}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Duration:</strong>
                </Typography>
                <Typography variant="body1">
                  {tour.days || 0} Days / {tour.nights || 0} Nights
                </Typography>
              </Grid>

              {tour.duration && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Duration Text:</strong>
                  </Typography>
                  <Typography variant="body1">{tour.duration}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Sources & Destinations */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Route /> Sources & Destinations
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Source Cities
                </Typography>
                {tour.sources.map((source, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2" fontWeight={600}>
                        {source.cityName || "City"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fare: ₹{source.fare}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Destination Cities
                </Typography>
                {tour.places.map((place, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2" fontWeight={600}>
                        {place.name || "City"}
                      </Typography>
                      {place.state && (
                        <Typography variant="body2" color="text.secondary">
                          State: {place.state}
                        </Typography>
                      )}
                      {place.order !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          Order: {place.order}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          </Paper>

          {/* Pricing */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <AttachMoney /> Pricing
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Minimum Fare:</strong>
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{tour.pricing.minFare} {tour.pricing.currencyCode}
                </Typography>
              </Grid>

              {tour.discount && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Discount:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {tour.discount.type === "percent"
                      ? `${tour.discount.value}%`
                      : `₹${tour.discount.value}`}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Features */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Group /> Tour Features
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Inclusive Features
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tour.inclusive.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Tour Types
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tour.type.map((type, index) => (
                    <Chip
                      key={index}
                      label={type}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Schedule /> Itinerary
              </Typography>

              <List>
                {tour.itinerary.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <Typography variant="h6" color="primary">
                        {index + 1}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={item.shortDescription}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Tour Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tour Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong>{" "}
                {dayjs(tour.createdAt).format("DD MMM YYYY")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Last Updated:</strong>{" "}
                {dayjs(tour.updatedAt).format("DD MMM YYYY")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Sources:</strong> {tour.sources.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Destinations:</strong> {tour.places.length}
              </Typography>
              {tour.itinerary && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Itinerary Days:</strong> {tour.itinerary.length}
                </Typography>
              )}
            </Box>
          </Paper>

          {/* SEO Information */}
          {tour.seo && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                SEO Information
              </Typography>

              {tour.seo.title && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Meta Title:</strong>
                  </Typography>
                  <Typography variant="body2">{tour.seo.title}</Typography>
                </Box>
              )}

              {tour.seo.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Meta Description:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {tour.seo.description}
                  </Typography>
                </Box>
              )}

              {tour.seo.keywords && tour.seo.keywords.length > 0 && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Keywords:</strong>
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {tour.seo.keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TourViewPage;
