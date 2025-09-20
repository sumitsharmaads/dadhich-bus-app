"use client";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Typography, Button, Card, CardContent, Box } from "@mui/material";
import {
  DirectionsBus,
  AccessTime,
  LocationOn,
  Phone,
  CheckCircle,
  Star,
  Shield,
  TrendingUp,
  Group,
  Route,
  ArrowForward,
} from "@mui/icons-material";
import { useWebsite } from "@/contexts/WebsiteProvider";

const ServicesClient = () => {
  const { websiteInfo } = useWebsite();
  const services = [
    {
      title: "Local Bus Rental",
      description:
        "Perfect for city travel, corporate events, and local transportation needs",
      startingPrice: "₹2,500",
      pricingNote: "Price varies based on distance, hours, and passenger count",
      features: [
        "Mini buses available",
        "Hourly & daily rental",
        "City-wide coverage",
        "Professional drivers",
      ],
      link: "/local-bus-rental",
      icon: <DirectionsBus />,
      color: "from-primary-500 to-primary-600",
    },
    {
      title: "Outstation Bus Rental",
      description: "Luxury coaches for long-distance travel and tour packages",
      startingPrice: "₹15,000",
      pricingNote:
        "Price depends on distance, route difficulty, and group size",
      features: [
        "Luxury coaches",
        "Multi-day packages",
        "Tour planning",
        "All amenities included",
      ],
      link: "/outstation-bus-rental",
      icon: <LocationOn />,
      color: "from-secondary-500 to-secondary-600",
    },
  ];

  const features = [
    {
      icon: <Shield />,
      title: "Safe & Reliable",
      description: "Well-maintained vehicles with experienced drivers",
    },
    {
      icon: <Star />,
      title: "Premium Service",
      description: "Luxury amenities and professional support",
    },
    {
      icon: <TrendingUp />,
      title: "Best Rates",
      description: "Competitive pricing with no hidden charges",
    },
    {
      icon: <Phone />,
      title: "24/7 Support",
      description: "Round the clock customer assistance",
    },
  ];

  const pricingFactors = [
    {
      icon: <Route />,
      title: "Distance",
      description: "Longer distances = higher costs",
    },
    {
      icon: <Group />,
      title: "Passenger Count",
      description: "More passengers = larger vehicle needed",
    },
    {
      icon: <AccessTime />,
      title: "Duration",
      description: "Multi-day trips cost more per day",
    },
    {
      icon: <LocationOn />,
      title: "Route Difficulty",
      description: "Remote areas may have additional charges",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5"></div>
        <div className="absolute inset-0 bg-[url('/images/heroImage.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <DirectionsBus className="text-lg" />
            Premium Bus Rental Services
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 font-primary">
            Luxury Travel Solutions
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            Experience premium transportation with our comprehensive bus rental
            solutions. From local city tours to outstation adventures, we
            provide luxury travel experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`tel:${websiteInfo?.contact?.phone}`}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📞 Call Now
            </Link>
            <Link
              href="#services"
              className="border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 font-primary">
              Our Premium Services
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Choose from our range of luxury bus rental services designed for
              every travel requirement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg"
              >
                <div
                  className={`bg-gradient-to-r ${service.color} p-8 text-white`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-primary text-white/90">
                        {service.title}
                      </h3>
                      <p className="text-white/90 text-base leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="mb-8">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-4xl font-bold text-primary-500">
                        {service.startingPrice}
                      </span>
                      <span className="text-text-secondary text-base">
                        starting from
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary italic leading-relaxed">
                      {service.pricingNote}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-base text-text-secondary"
                      >
                        <CheckCircle className="text-success-500 mr-3 text-lg" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={service.link}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 px-8 rounded-full text-center font-semibold transition-all duration-300 block shadow-lg hover:shadow-xl"
                  >
                    Learn More
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Factors Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 font-primary">
              Transparent Pricing Factors
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Our pricing is transparent and based on actual factors that affect
              your journey cost
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
              gap: 8,
            }}
          >
            {pricingFactors.map((factor, index) => (
              <Box key={index} className="text-center group">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-500 text-3xl">{factor.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4 font-primary">
                  {factor.title}
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  {factor.description}
                </p>
              </Box>
            ))}
          </Box>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 font-primary">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              We provide exceptional service with a focus on safety, comfort,
              and reliability for all your travel needs
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
              gap: 8,
            }}
          >
            {features.map((feature, index) => (
              <Box key={index} className="text-center group">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-500 text-3xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4 font-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  {feature.description}
                </p>
              </Box>
            ))}
          </Box>
        </div>
      </section>

      {/* How to Book Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 font-primary">
              How to Book Your Service
            </h2>
            <p className="text-lg text-text-secondary">
              Simple steps to get your premium bus rental service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Contact Us",
                description: `Call us at ${websiteInfo?.contact?.phone} or fill our online booking form`,
              },
              {
                step: "02",
                title: "Get Quote",
                description:
                  "We'll provide a customized quote based on your specific requirements",
              },
              {
                step: "03",
                title: "Confirm Booking",
                description:
                  "Confirm your booking and we'll arrange everything for your journey",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4 font-primary">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
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
            Experience premium bus rental services with professional drivers and
            comfortable amenities. Choose from our local and outstation services
            for all your transportation needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href={`tel:${websiteInfo?.contact?.phone}`}
              className="group bg-white text-primary-600 hover:bg-neutral-50 px-10 py-5 rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3 min-w-[280px] justify-center"
            >
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <Phone className="text-white text-sm" />
              </div>
              Call {websiteInfo?.contact?.phone}
            </Link>

            <Link
              href="/local-bus-rental"
              className="group border-2 border-white/80 text-white hover:bg-white hover:text-primary-600 px-10 py-5 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-none flex items-center gap-3 min-w-[280px] justify-center"
            >
              <ArrowForward className="text-white group-hover:text-primary-600 transition-colors" />
              Local Bus Rental
            </Link>

            <Link
              href="/outstation-bus-rental"
              className="group border-2 border-white/80 text-white hover:bg-white hover:text-primary-600 px-10 py-5 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-none flex items-center gap-3 min-w-[280px] justify-center"
            >
              <ArrowForward className="text-white group-hover:text-primary-600 transition-colors" />
              Outstation Bus Rental
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" />
              <span className="text-sm">Premium Service</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" />
              <span className="text-sm">Professional Drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesClient;
