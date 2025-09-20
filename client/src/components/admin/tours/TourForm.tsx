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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Badge,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Warning as WarningIcon,
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
  const [expandedStep, setExpandedStep] = useState<number | false>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
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
    {
      title: "Basic Information",
      description: "Tour name, dates, pricing, and basic details (Required)",
      icon: "📝",
      mandatory: true,
    },
    {
      title: "Sources & Places",
      description: "Starting points and destinations (Required)",
      icon: "📍",
      mandatory: true,
    },
    {
      title: "Itinerary",
      description: "Day-by-day tour schedule (Optional)",
      icon: "🗓️",
      mandatory: false,
    },
    {
      title: "Bus & Captain",
      description: "Transportation and guide assignment (Optional)",
      icon: "🚌",
      mandatory: false,
    },
    {
      title: "Amount & Discounts",
      description: "Pricing details and discount options (Optional)",
      icon: "💰",
      mandatory: false,
    },
    {
      title: "Advanced Features",
      description: "Additional tour features and requirements (Optional)",
      icon: "⚙️",
      mandatory: false,
    },
    {
      title: "SEO",
      description: "Search engine optimization settings (Optional)",
      icon: "🔍",
      mandatory: false,
    },
  ];

  // Load tour data for edit mode
  useEffect(() => {
    if (mode === "edit" && tourId) {
      loadTourData();
    }
  }, [mode, tourId]);

  // Helper function to check if a step is completed
  const isStepCompleted = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Basic Information - MANDATORY
        return !!(
          form.tourName?.trim() &&
          form.startDate &&
          form.endDate &&
          form.inclusive?.length &&
          form.type?.length &&
          form.pricing?.minFare &&
          form.capacity
        );
      case 1: // Sources & Places - MANDATORY
        return !!(form.sources?.length && form.places?.length);
      case 2: // Itinerary - OPTIONAL (completed if any itinerary exists)
        return !!form.itinerary?.length;
      case 3: // Bus & Captain - OPTIONAL (completed if any bus/captain assigned)
        return !!(form.busId || form.captainUserId);
      case 4: // Amount & Discounts - OPTIONAL (completed if adult price exists)
        return !!form.pricing?.adultPrice;
      case 5: // Advanced Features - OPTIONAL (completed if any advanced feature is set)
        return !!(
          form.difficulty ||
          form.ageGroup?.length ||
          form.specialRequirements?.length
        );
      case 6: // SEO - OPTIONAL (completed if any SEO field is filled)
        return !!(
          form.seo?.title ||
          form.seo?.description ||
          form.seo?.keywords?.length
        );
      default:
        return false;
    }
  };

  // Helper function to check if a step has errors
  const hasStepErrors = (stepIndex: number): boolean => {
    // Only check for errors in mandatory steps (0 and 1)
    const mandatoryStepErrorFields = {
      0: [
        "tourName",
        "startDate",
        "endDate",
        "inclusive",
        "type",
        "pricing.minFare",
        "capacity",
      ],
      1: ["sources", "places"],
    };

    const fields =
      mandatoryStepErrorFields[
        stepIndex as keyof typeof mandatoryStepErrorFields
      ] || [];
    return fields.some((field) => errors[field]);
  };

  // Update completed steps when form changes
  useEffect(() => {
    const newCompletedSteps = new Set<number>();
    steps.forEach((_, index) => {
      if (isStepCompleted(index)) {
        newCompletedSteps.add(index);
      }
    });
    setCompletedSteps(newCompletedSteps);
  }, [form]);

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

  const handleAccordionChange =
    (step: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedStep(isExpanded ? step : false);
      if (isExpanded) {
        setActiveStep(step);
      }
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
          Fill in the tour details below. Click on any section to expand and
          edit it. Completed sections are marked with a green checkmark, and
          sections with errors are highlighted in red.
        </Typography>
      </Box>

      {/* Accordion Steps */}
      <Box sx={{ mb: 4 }}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const hasErrors = hasStepErrors(index);
          const isExpanded = expandedStep === index;

          return (
            <Accordion
              key={index}
              expanded={isExpanded}
              onChange={handleAccordionChange(index)}
              sx={{
                mb: 2,
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: "0 0 16px 0",
                },
                border: hasErrors
                  ? "2px solid #f44336"
                  : isCompleted
                  ? "2px solid #4caf50"
                  : "1px solid #e0e0e0",
                borderRadius: "8px !important",
                boxShadow: hasErrors
                  ? "0 0 0 1px #f44336"
                  : isCompleted
                  ? "0 0 0 1px #4caf50"
                  : "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: isCompleted
                    ? "#f1f8e9"
                    : hasErrors
                    ? "#ffebee"
                    : "#fafafa",
                  borderRadius: "8px 8px 0 0",
                  "&.Mui-expanded": {
                    borderRadius: "8px 8px 0 0",
                  },
                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                    margin: "12px 0",
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <Badge
                      badgeContent={index + 1}
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: isCompleted
                            ? "#4caf50"
                            : hasErrors
                            ? "#f44336"
                            : "#1976d2",
                          color: "white",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: isCompleted
                            ? "#4caf50"
                            : hasErrors
                            ? "#f44336"
                            : "#e3f2fd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon
                            sx={{ color: "white", fontSize: 24 }}
                          />
                        ) : hasErrors ? (
                          <WarningIcon sx={{ color: "white", fontSize: 24 }} />
                        ) : (
                          <RadioButtonUncheckedIcon
                            sx={{ color: "#1976d2", fontSize: 24 }}
                          />
                        )}
                      </Box>
                    </Badge>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {step.description}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {step.mandatory && (
                      <Chip
                        label="Required"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {!step.mandatory && (
                      <Chip
                        label="Optional"
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    )}
                    {isCompleted && (
                      <Chip
                        label="Completed"
                        size="small"
                        color="success"
                        icon={<CheckCircleIcon />}
                      />
                    )}
                    {hasErrors && (
                      <Chip
                        label="Has Errors"
                        size="small"
                        color="error"
                        icon={<WarningIcon />}
                      />
                    )}
                    {!isCompleted && !hasErrors && !step.mandatory && (
                      <Chip
                        label="Not Started"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 3, backgroundColor: "white" }}>
                {renderStepContent(index)}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

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
            {/* Show Create Tour button for create mode after step 1 (from step 2 onwards) */}
            {mode === "create" && activeStep >= 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
                startIcon={
                  saving ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                {saving ? "Creating..." : "Create Tour"}
              </Button>
            )}

            {/* Show Update button for edit mode on all steps */}
            {mode === "edit" && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
                startIcon={
                  saving ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                {saving ? "Updating..." : "Update Tour"}
              </Button>
            )}

            {/* Show Next button when not on last step */}
            {activeStep < steps.length - 1 && (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Progress Indicator */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Progress: {completedSteps.size} of {steps.length} sections completed
        </Typography>
        {steps.filter(
          (_, index) => completedSteps.has(index) && steps[index].mandatory
        ).length === 2 && (
          <Typography
            variant="body2"
            color="success.main"
            sx={{ mt: 1, mb: 2, fontWeight: 600 }}
          >
            ✅ All required sections completed! Optional sections can be filled
            later.
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {steps.map((step, index) => (
            <Chip
              key={index}
              label={`${index + 1}. ${step.title}${step.mandatory ? " *" : ""}`}
              size="small"
              color={
                completedSteps.has(index)
                  ? "success"
                  : hasStepErrors(index)
                  ? "error"
                  : step.mandatory
                  ? "primary"
                  : "default"
              }
              variant={completedSteps.has(index) ? "filled" : "outlined"}
              icon={
                completedSteps.has(index) ? (
                  <CheckCircleIcon />
                ) : hasStepErrors(index) ? (
                  <WarningIcon />
                ) : step.mandatory ? (
                  <RadioButtonUncheckedIcon />
                ) : undefined
              }
              onClick={() => {
                setExpandedStep(index);
                setActiveStep(index);
              }}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default TourForm;
