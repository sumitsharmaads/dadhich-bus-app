"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Modal,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  DirectionsBus,
  AccessTime,
  LocationOn,
  Phone,
  CheckCircle,
  Star,
  Shield,
  TrendingUp,
  Close,
  ArrowForward,
} from "@mui/icons-material";
import { inquiryService } from "@/lib/api/services/inquiry.service";

const OutstationBusRentalPage = () => {
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    purpose: "",
    travelDate: "",
    returnDate: "",
    tourType: "one way",
    passengers: "",
  });
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const features = [
    {
      icon: <DirectionsBus />,
      title: "Luxury Coaches",
      description: "Premium Volvo and luxury coaches for comfortable travel",
    },
    {
      icon: <AccessTime />,
      title: "Multi-Day Packages",
      description: "Flexible packages for extended journeys",
    },
    {
      icon: <LocationOn />,
      title: "Pan India Service",
      description: "Coverage across all major cities and destinations",
    },
    {
      icon: <Phone />,
      title: "24/7 Support",
      description: "Round the clock customer assistance",
    },
  ];

  const amenities = [
    "Air Conditioning",
    "Reclining Seats",
    "Entertainment System",
    "WiFi Connectivity",
    "Reading Lights",
    "Luggage Space",
    "Refreshments",
    "Professional Driver",
  ];

  const popularDestinations = [
    {
      name: "Khatu Shyam",
      image: "/images/public/carosuel/dc86d586f2471430f899b6694f037b33.jpg",
    },
    { name: "Ramdevra", image: "/images/public/rental_hero_image.webp" },
    {
      name: "Jaipur",
      image: "/images/public/carosuel/dc86d586f2471430f899b6694f037b33.jpg",
    },
    { name: "Delhi", image: "/images/public/rental_hero_image.webp" },
  ];

  const pricingPlans = [
    {
      name: "Per Day",
      price: "₹15,000",
      period: "per day",
      description: "Perfect for single day trips and events",
      note: "Price varies based on distance and passenger count",
      features: [
        "Professional Driver",
        "Fuel Included",
        "All Amenities",
        "Flexible Routes",
      ],
      popular: false,
    },
    {
      name: "Multi-Day",
      price: "₹12,000",
      period: "per day",
      description: "Best value for extended tours (3+ days)",
      note: "Price depends on route difficulty and group size",
      features: [
        "Professional Driver",
        "Fuel Included",
        "All Amenities",
        "Tour Planning",
        "Hotel Coordination",
      ],
      popular: true,
    },
    {
      name: "Custom Tour",
      price: "Contact Us",
      period: "custom packages",
      description: "Tailored packages for special requirements",
      note: "Custom pricing based on distance, duration, and requirements",
      features: [
        "Custom Routes",
        "Multiple Vehicles",
        "Event Planning",
        "Personalized Service",
        "Full Support",
      ],
      popular: false,
    },
  ];

  const cityOptions = ["Fatehabad", "Hisar", "Sirsa", "Delhi", "Adampur"];
  const purposeOptions = [
    "Wedding",
    "Birthday party",
    "Elections",
    "School tour",
    "Tour",
    "Event",
    "Other",
  ];

  const handleOpenBooking = () => {
    setOpenBookingModal(true);
    setActiveStep(0);
    setSuccess(false);
    setError("");
  };

  const handleCloseBooking = () => {
    setOpenBookingModal(false);
    setActiveStep(0);
    setSuccess(false);
    setError("");
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (
        !formData.source ||
        !formData.destination ||
        !formData.purpose ||
        !formData.travelDate
      ) {
        setError("Please fill in all required fields");
        return;
      }
      if (formData.tourType === "round trip" && !formData.returnDate) {
        setError("Please select return date for round trip");
        return;
      }
    }
    if (activeStep === 1) {
      if (
        !contactData.firstName ||
        !contactData.lastName ||
        !contactData.phone
      ) {
        setError("Please fill in all required fields");
        return;
      }
    }
    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await inquiryService.submitOutstationBusRental({
        name: `${contactData.firstName} ${contactData.lastName}`.trim(),
        email: contactData.email,
        phone: contactData.phone,
        fromCity: formData.source,
        toCity: formData.destination,
        startDate: formData.travelDate,
        endDate: formData.returnDate || formData.travelDate,
        passengers: parseInt(formData.passengers) || 1,
        notes:
          contactData.message ||
          `Purpose: ${formData.purpose}, Tour Type: ${formData.tourType}`,
      });

      if (response.success) {
        setSuccess(true);
        setError("");
        setTimeout(() => {
          handleCloseBooking();
        }, 2000);
      } else {
        setError(
          response.message || "Failed to submit inquiry. Please try again."
        );
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to submit inquiry. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Service Details", "Contact Information", "Confirmation"];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <Typography variant="h6" className="mb-4">
              Service Details
            </Typography>

            <FormControl component="fieldset" className="mb-4">
              <FormControlLabel
                control={
                  <Radio
                    checked={formData.tourType === "one way"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tourType: e.target.value,
                        returnDate: "",
                      })
                    }
                    value="one way"
                  />
                }
                label="One Way"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={formData.tourType === "round trip"}
                    onChange={(e) =>
                      setFormData({ ...formData, tourType: e.target.value })
                    }
                    value="round trip"
                  />
                }
                label="Round Trip"
              />
            </FormControl>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>From City</InputLabel>
                <Select
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  label="From City"
                >
                  {cityOptions.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>To City</InputLabel>
                <Select
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  label="To City"
                >
                  {cityOptions.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <FormControl fullWidth>
              <InputLabel>Purpose</InputLabel>
              <Select
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                label="Purpose"
              >
                {purposeOptions.map((purpose) => (
                  <MenuItem key={purpose} value={purpose}>
                    {purpose}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                type="date"
                label="Travel Date"
                value={formData.travelDate}
                onChange={(e) =>
                  setFormData({ ...formData, travelDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />

              {formData.tourType === "round trip" && (
                <TextField
                  fullWidth
                  type="date"
                  label="Return Date"
                  value={formData.returnDate}
                  onChange={(e) =>
                    setFormData({ ...formData, returnDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </div>

            <TextField
              fullWidth
              type="number"
              label="Number of Passengers"
              value={formData.passengers}
              onChange={(e) =>
                setFormData({ ...formData, passengers: e.target.value })
              }
              inputProps={{ min: 1, max: 50 }}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Typography variant="h6" className="mb-4">
              Contact Information
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="First Name"
                value={contactData.firstName}
                onChange={(e) =>
                  setContactData({ ...contactData, firstName: e.target.value })
                }
                required
              />

              <TextField
                fullWidth
                label="Last Name"
                value={contactData.lastName}
                onChange={(e) =>
                  setContactData({ ...contactData, lastName: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                type="email"
                label="Email Address"
                value={contactData.email}
                onChange={(e) =>
                  setContactData({ ...contactData, email: e.target.value })
                }
              />

              <TextField
                fullWidth
                type="tel"
                label="Phone Number"
                value={contactData.phone}
                onChange={(e) =>
                  setContactData({ ...contactData, phone: e.target.value })
                }
                required
              />
            </div>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Message"
              value={contactData.message}
              onChange={(e) =>
                setContactData({ ...contactData, message: e.target.value })
              }
              placeholder="Any special requirements or additional information..."
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Typography variant="h6" className="mb-4">
              Booking Summary
            </Typography>

            <Card variant="outlined" className="p-4">
              <Typography variant="subtitle1" className="font-semibold mb-2">
                Service Details
              </Typography>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>From:</strong> {formData.source}
                </div>
                <div>
                  <strong>To:</strong> {formData.destination}
                </div>
                <div>
                  <strong>Purpose:</strong> {formData.purpose}
                </div>
                <div>
                  <strong>Tour Type:</strong> {formData.tourType}
                </div>
                <div>
                  <strong>Travel Date:</strong> {formData.travelDate}
                </div>
                {formData.returnDate && (
                  <div>
                    <strong>Return Date:</strong> {formData.returnDate}
                  </div>
                )}
                <div>
                  <strong>Passengers:</strong> {formData.passengers}
                </div>
              </div>
            </Card>

            <Card variant="outlined" className="p-4">
              <Typography variant="subtitle1" className="font-semibold mb-2">
                Contact Information
              </Typography>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {contactData.firstName}{" "}
                  {contactData.lastName}
                </div>
                <div>
                  <strong>Email:</strong> {contactData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {contactData.phone}
                </div>
                {contactData.message && (
                  <div>
                    <strong>Message:</strong> {contactData.message}
                  </div>
                )}
              </div>
            </Card>

            {success && (
              <Alert severity="success">
                Booking submitted successfully! We&apos;ll contact you soon.
              </Alert>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5"></div>
        <div className="absolute inset-0 bg-[url('/images/public/carosuel/dc86d586f2471430f899b6694f037b33.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <DirectionsBus className="text-lg" />
            Outstation Bus Rental Services
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 font-primary">
            Luxury Travel Beyond Borders
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            Experience premium outstation travel with our luxury coaches and
            professional service. Perfect for tours, corporate events, and group
            travel across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="contained"
              size="large"
              onClick={handleOpenBooking}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📞 Book Now
            </Button>
            <Link
              href="#pricing"
              className="border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 font-primary">
              Why Choose Our Outstation Services?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              We provide luxury, comfort, and reliability for all your
              long-distance travel needs
            </p>
          </div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 6,
            }}
          >
            {features.map((feature, index) => (
              <Box key={index} className="text-center group">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-500 text-2xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3 font-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Box>
            ))}
          </Box>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-text-primary mb-6 font-primary">
                Premium Outstation Travel
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed text-lg">
                Our outstation bus rental services are designed for luxury and
                comfort on long-distance journeys. Whether you&apos;re planning
                a religious tour, corporate event, or family vacation, we
                provide premium transportation solutions.
              </p>
              <p className="text-text-secondary mb-8 leading-relaxed text-lg">
                Our fleet includes luxury Volvo coaches and premium buses
                equipped with modern amenities. We offer comprehensive tour
                packages with professional drivers, route planning, and
                accommodation coordination for multi-day trips.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {amenities.slice(0, 6).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="text-success-500 text-sm" />
                    <span className="text-text-secondary text-sm">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/public/carosuel/dc86d586f2471430f899b6694f037b33.jpg"
                  alt="Luxury Bus Service"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-500 text-white p-2 rounded-full">
                    <Shield className="text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">100% Safe</p>
                    <p className="text-sm text-text-secondary">
                      Travel Guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 px-4 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 font-primary">
              Popular Destinations
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Explore our most requested destinations with premium bus services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">
                      {destination.name}
                    </h3>
                    <p className="text-sm opacity-90">Popular Destination</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 font-primary">
              Transparent Pricing
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Choose the perfect plan for your outstation travel needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-2xl transition-all duration-500 ${
                  plan.popular ? "ring-2 ring-primary-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-text-primary mb-2 font-primary">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-500">
                      {plan.price}
                    </span>
                    <span className="text-text-secondary text-sm ml-2">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-6 text-sm">
                    {plan.description}
                  </p>
                  <p className="text-text-secondary text-sm mb-6">
                    {plan.note}
                  </p>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-text-secondary"
                      >
                        <CheckCircle className="text-success-500 mr-3 text-sm" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleOpenBooking}
                    className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-full font-semibold transition-colors"
                  >
                    {plan.name === "Custom Tour" ? "Contact Us" : "Book Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-md animate-pulse delay-500"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>

        <div className="relative container mx-auto max-w-5xl text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <DirectionsBus className="text-white text-3xl" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-primary text-white drop-shadow-lg">
            Ready to Start Your Journey?
          </h2>

          <p className="text-xl md:text-2xl mb-10 opacity-95 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Experience luxury travel with our premium outstation bus rental
            services. Professional drivers, comfortable amenities, and
            unforgettable adventures await.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="tel:+919511547154"
              className="group bg-white text-primary-600 hover:bg-neutral-50 px-10 py-5 rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3 min-w-[280px] justify-center"
            >
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <Phone className="text-white text-sm" />
              </div>
              Call +91 9511547154
            </Link>

            <Link
              href="/services"
              className="group border-2 border-white/80 text-white hover:bg-white hover:text-primary-600 px-10 py-5 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-none flex items-center gap-3 min-w-[280px] justify-center"
            >
              <ArrowForward className="text-white group-hover:text-primary-600 transition-colors" />
              View All Services
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" />
              <span className="text-sm">Professional Drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" />
              <span className="text-sm">Luxury Amenities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Modal
        open={openBookingModal}
        onClose={handleCloseBooking}
        className="flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Typography variant="h5" className="font-semibold">
                Book Outstation Bus Service
              </Typography>
              <Button
                onClick={handleCloseBooking}
                className="text-gray-500 hover:text-gray-700"
              >
                <Close />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <Stepper activeStep={activeStep} className="mb-6">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}

            <div className="min-h-[400px]">{renderStepContent(activeStep)}</div>

            <div className="flex justify-between mt-6">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              <div className="flex gap-2">
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Submit Booking"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OutstationBusRentalPage;
