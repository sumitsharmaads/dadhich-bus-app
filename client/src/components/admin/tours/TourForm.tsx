"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  CreateTourRequest,
  UpdateTourRequest,
} from "@/lib/api/types/tour.types";
import { tourService } from "@/lib/api/services/tour.service";
import { successPopup, errorPopup, confirmPopup } from "@/utils/errors/alerts";
import BasicInfoSection from "./sections/BasicInfoSection";
import SourcesPlacesSection from "./sections/SourcesPlacesSection";
import ItinerarySection from "./sections/ItinerarySection";
import BusCaptainSection from "./sections/BusCaptainSection";
import AmountSection from "./sections/AmountSection";
import AdvancedSection from "./sections/AdvancedSection";
import SeoSection from "./sections/SeoSection";

interface TourFormProps {
  mode: "create" | "edit";
  tourId?: string;
  initialData?: Partial<CreateTourRequest>;
}

const TourForm: React.FC<TourFormProps> = ({ mode, tourId, initialData }) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with default values
  const [form, setForm] = useState<CreateTourRequest>({
    tourName: "",
    description: "",
    shortDescription: "",
    highlights: [],
    sources: [],
    places: [],
    heroImage: undefined,
    gallery: [],
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    duration: "",
    days: 0,
    nights: 0,
    stayDescription: [],
    busId: "",
    captainUserId: "",
    inclusive: [],
    exclusive: [],
    type: [],
    category: "",
    capacity: 0,
    minCapacity: 0,
    maxCapacity: 0,
    itinerary: [],
    pricing: {
      minFare: 0,
      maxFare: 0,
      currencyCode: "INR",
      adultPrice: 0,
      childPrice: 0,
      infantPrice: 0,
      singleSupplement: 0,
      taxes: 0,
      serviceCharge: 0,
    },
    discount: undefined,
    groupDiscounts: [],
    difficulty: "easy",
    ageGroup: [],
    fitnessLevel: "",
    specialRequirements: [],
    cancellationPolicy: "",
    refundPolicy: "",
    seo: {
      title: "",
      description: "",
      keywords: [],
    },
    seoRoutePath: "",
    status: "draft",
    isActive: true,
    isFeatured: false,
    ...initialData,
  });

  const steps = [
    "Basic Information",
    "Sources & Places",
    "Itinerary",
    "Bus & Captain",
    "Amount & Discounts",
    "Advanced Features",
    "SEO",
  ];

  // Load tour data for edit mode
  useEffect(() => {
    if (mode === "edit" && tourId) {
      loadTourData();
    }
  }, [mode, tourId]);

  const loadTourData = async () => {
    if (!tourId) return;

    setLoading(true);
    try {
      // Use admin endpoint for edit mode to get complete tour data
      const response = await tourService.getAdminTourById(tourId);
      if (response) {
        const tourData = response;
        setForm({
          tourName: tourData.tourName || "",
          description: tourData.description || "",
          shortDescription: tourData.shortDescription || "",
          highlights: tourData.highlights || [],
          sources: tourData.sources || [],
          places: tourData.places || [],
          heroImage: tourData.heroImage,
          gallery: tourData.gallery || [],
          startDate: tourData.startDate || new Date().toISOString(),
          endDate: tourData.endDate || new Date().toISOString(),
          duration: tourData.duration || "",
          days: tourData.days || 0,
          nights: tourData.nights || 0,
          stayDescription: tourData.stayDescription || [],
          busId: tourData.busId || "",
          captainUserId:
            typeof tourData.captainUserId === "string"
              ? tourData.captainUserId
              : (tourData.captainUserId as any)?._id || "",
          inclusive: tourData.inclusive || [],
          exclusive: tourData.exclusive || [],
          type: tourData.type || [],
          category: tourData.category || "",
          capacity: tourData.capacity || 0,
          minCapacity: tourData.minCapacity || 0,
          maxCapacity: tourData.maxCapacity || 0,
          itinerary: tourData.itinerary || [],
          pricing: tourData.pricing || {
            minFare: 0,
            maxFare: 0,
            currencyCode: "INR",
            adultPrice: 0,
            childPrice: 0,
            infantPrice: 0,
            singleSupplement: 0,
            taxes: 0,
            serviceCharge: 0,
          },
          discount: tourData.discount,
          groupDiscounts: tourData.groupDiscounts || [],
          difficulty: tourData.difficulty || "easy",
          ageGroup: tourData.ageGroup || [],
          fitnessLevel: tourData.fitnessLevel || "",
          specialRequirements: tourData.specialRequirements || [],
          cancellationPolicy: tourData.cancellationPolicy || "",
          refundPolicy: tourData.refundPolicy || "",
          seo: tourData.seo || {
            title: "",
            description: "",
            keywords: [],
          },
          seoRoutePath: tourData.seoRoutePath || "",
          status: tourData.status || "draft",
          isActive: tourData.isActive ?? true,
          isFeatured: tourData.isFeatured ?? false,
        });
      }
    } catch (error) {
      errorPopup("Failed to load tour data");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof CreateTourRequest, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNestedFormChange = (
    parentField: keyof CreateTourRequest,
    field: string,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation for mandatory fields
    if (!form.tourName?.trim()) {
      newErrors.tourName = "Tour name is required";
    }

    if (!form.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!form.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.startDate) >= new Date(form.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!form.inclusive?.length) {
      newErrors.inclusive = "At least one inclusive feature is required";
    }

    if (!form.type?.length) {
      newErrors.type = "At least one tour type is required";
    }

    if (!form.pricing?.minFare || form.pricing.minFare <= 0) {
      newErrors["pricing.minFare"] =
        "Minimum fare is required and must be greater than 0";
    }

    if (!form.capacity || form.capacity <= 0) {
      newErrors.capacity = "Capacity is required and must be greater than 0";
    }

    if (!form.sources?.length) {
      newErrors.sources = "At least one source is required";
    }

    if (!form.places?.length) {
      newErrors.places = "At least one destination is required";
    }

    // Additional validation rules
    if (
      form.minCapacity &&
      form.maxCapacity &&
      form.minCapacity > form.maxCapacity
    ) {
      newErrors.maxCapacity =
        "Maximum capacity must be greater than minimum capacity";
    }

    if (form.pricing?.maxFare && form.pricing.maxFare < form.pricing.minFare) {
      newErrors["pricing.maxFare"] =
        "Maximum fare must be greater than minimum fare";
    }

    // Validate pricing fields
    if (
      form.pricing?.adultPrice &&
      form.pricing.minFare &&
      form.pricing.adultPrice < form.pricing.minFare
    ) {
      newErrors["pricing.adultPrice"] =
        "Adult price must be greater than or equal to minimum fare";
    }

    if (
      form.pricing?.childPrice &&
      form.pricing.adultPrice &&
      form.pricing.childPrice > form.pricing.adultPrice
    ) {
      newErrors["pricing.childPrice"] =
        "Child price must be less than adult price";
    }

    if (
      form.pricing?.infantPrice &&
      form.pricing.childPrice &&
      form.pricing.infantPrice > form.pricing.childPrice
    ) {
      newErrors["pricing.infantPrice"] =
        "Infant price must be less than child price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      errorPopup("Please fix the validation errors before saving");
      return;
    }

    const confirmed = await confirmPopup(
      `Are you sure you want to ${
        mode === "create" ? "create" : "update"
      } this tour?`
    );

    if (!confirmed) return;

    setSaving(true);
    try {
      let response;

      if (mode === "create") {
        // Transform data to correct API format
        const transformedData = transformFormDataForAPI(form);
        response = await tourService.createTour(transformedData);
      } else if (tourId) {
        // Transform data to correct API format
        const transformedData = transformFormDataForAPI(form);
        const updateData: UpdateTourRequest = {
          _id: tourId,
          ...transformedData,
        };

        response = await tourService.updateTour(tourId, updateData);
      }

      if (response?.success) {
        successPopup(
          `Tour ${mode === "create" ? "created" : "updated"} successfully!`
        );
        router.push("/admin/tours");
      } else {
        errorPopup(response?.message || `Failed to ${mode} tour`);
      }
    } catch (error) {
      errorPopup(`Failed to ${mode} tour`);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickSave = async () => {
    // Quick save with all fields from BasicInfo and SourcesPlaces sections
    const quickSaveData = {
      // Basic Info Section fields
      tourName: form.tourName,
      description: form.description,
      shortDescription: form.shortDescription,
      startDate: form.startDate,
      endDate: form.endDate,
      duration: form.duration,
      days: form.days,
      nights: form.nights,
      inclusive: form.inclusive,
      type: form.type,
      pricing: form.pricing,
      capacity: form.capacity,
      minCapacity: form.minCapacity,
      maxCapacity: form.maxCapacity,

      // Sources & Places Section fields
      sources: form.sources,
      places: form.places,
      // Default values for other sections
      status: "draft" as const,
      isActive: true,
      isFeatured: false,
    };

    setSaving(true);
    try {
      // Transform data to correct API format
      const transformedData = transformFormDataForAPI(quickSaveData);
      const response = await tourService.createTour(transformedData);
      if (response.success) {
        successPopup(
          "Tour saved successfully! You can edit it later to add more details."
        );
        router.push("/admin/tours");
      } else {
        errorPopup(response.message || "Failed to save tour");
      }
    } catch (error) {
      errorPopup("Failed to save tour");
    } finally {
      setSaving(false);
    }
  };

  // Transform form data to correct API format
  const transformFormDataForAPI = (formData: any) => {
    const transformed = { ...formData };

    // Transform sources: ensure cityId is a string
    if (transformed.sources && Array.isArray(transformed.sources)) {
      transformed.sources = transformed.sources.map((source: any) => ({
        ...source,
        cityId:
          typeof source.cityId === "string"
            ? source.cityId
            : source.cityId?._id || source.cityId,
      }));
    }

    // Transform places: ensure cityId is a string
    if (transformed.places && Array.isArray(transformed.places)) {
      transformed.places = transformed.places.map((place: any) => ({
        ...place,
        cityId:
          typeof place.cityId === "string"
            ? place.cityId
            : place.cityId?._id || place.cityId,
      }));
    }

    // Transform captainUserId: ensure it's a string
    if (
      transformed.captainUserId &&
      typeof transformed.captainUserId === "object"
    ) {
      transformed.captainUserId =
        transformed.captainUserId._id || transformed.captainUserId;
    }

    // Transform busId: ensure it's a string
    if (transformed.busId && typeof transformed.busId === "object") {
      transformed.busId = transformed.busId._id || transformed.busId;
    }

    return transformed;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      // Validate Basic Info Section
      const basicErrors: Record<string, string> = {};
      if (!form.tourName?.trim())
        basicErrors.tourName = "Tour name is required";
      if (!form.startDate) basicErrors.startDate = "Start date is required";
      if (!form.endDate) basicErrors.endDate = "End date is required";
      if (!form.inclusive?.length)
        basicErrors.inclusive = "At least one inclusive feature is required";
      if (!form.type?.length)
        basicErrors.type = "At least one tour type is required";
      if (!form.pricing?.minFare || form.pricing.minFare <= 0)
        basicErrors["pricing.minFare"] = "Minimum fare is required";
      if (!form.capacity || form.capacity <= 0)
        basicErrors.capacity = "Capacity is required";

      if (Object.keys(basicErrors).length > 0) {
        setErrors(basicErrors);
        errorPopup("Please fix the validation errors before proceeding");
        return;
      }
    } else if (activeStep === 1) {
      // Validate Sources & Places Section
      const sourcesErrors: Record<string, string> = {};
      if (!form.sources?.length)
        sourcesErrors.sources = "At least one source is required";
      if (!form.places?.length)
        sourcesErrors.places = "At least one destination is required";

      if (Object.keys(sourcesErrors).length > 0) {
        setErrors(sourcesErrors);
        errorPopup("Please fix the validation errors before proceeding");
        return;
      }
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoSection
            form={form}
            onFormChange={handleFormChange}
            onNestedFormChange={handleNestedFormChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <SourcesPlacesSection
            form={form}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <ItinerarySection
            form={form}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <BusCaptainSection
            form={form}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <AmountSection
            form={form}
            onFormChange={handleFormChange}
            onNestedFormChange={handleNestedFormChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <AdvancedSection
            form={form}
            onFormChange={handleFormChange}
            onNestedFormChange={handleNestedFormChange}
            errors={errors}
          />
        );
      case 6:
        return (
          <SeoSection
            form={form}
            onFormChange={handleFormChange}
            onNestedFormChange={handleNestedFormChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {mode === "create" ? "Create New Tour" : "Edit Tour"}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Fill in the tour details below. You can navigate between sections
          using the stepper below.
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => handleStepClick(index)}
                sx={{ cursor: "pointer" }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

      {/* Action Buttons */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
          </Box>

          <Stack direction="row" spacing={2}>
            {mode === "create" && activeStep === 1 && (
              <Button
                variant="outlined"
                onClick={handleQuickSave}
                disabled={saving}
              >
                Create and Skip Further
              </Button>
            )}

            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={
                  saving ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Tour"
                  : "Update Tour"}
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Progress Indicator */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
        </Typography>
      </Box>
    </Container>
  );
};

export default TourForm;
