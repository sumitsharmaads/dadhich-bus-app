"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Help, Send } from "@mui/icons-material";
import { inquiryService } from "@/lib/api/services/inquiry.service";

interface InquiryFormState {
  name: string;
  email: string;
  message: string;
}

interface InquiryFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface InquiryFormTouched {
  name: boolean;
  email: boolean;
  message: boolean;
}

const InquiryPage = () => {
  const [formState, setFormState] = useState<InquiryFormState>({
    name: "",
    email: "",
    message: "",
  });

  const [touched, setTouched] = useState<InquiryFormTouched>({
    name: false,
    email: false,
    message: false,
  });

  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleBlur = useCallback((field: keyof InquiryFormState) => {
    setTouched((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  }, []);

  const validateState = useMemo(() => {
    const wordCount = (formState?.message || " ")?.trim()?.split(/\s+/).length;
    let emailError = "";
    let messageError = "";
    let nameError = "";

    if (!nameRegex.test(formState.name || "")) {
      nameError = "Please enter a valid name.";
    }
    if (!emailRegex.test(formState?.email || "")) {
      emailError = "Please enter a valid email address.";
    }
    if (wordCount < 2 || wordCount > 200) {
      messageError = "Your message should be between 10 and 200 words.";
    }

    setErrors({ email: emailError, message: messageError, name: nameError });
    return !emailError && !messageError && !nameError;
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (validateState) {
      setLoading(true);
      try {
        const response = await inquiryService.submitGeneralInquiry({
          name: formState.name,
          email: formState.email,
          subject: "General Inquiry",
          message: formState.message,
        });

        if (response.success) {
          setSuccess(true);
          setSubmitError("");
          setFormState({
            name: "",
            email: "",
            message: "",
          });
          setTouched({
            name: false,
            email: false,
            message: false,
          });
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setSubmitError(
            response.message || "Failed to submit inquiry. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error submitting inquiry:", error);
        setSubmitError(
          error.response?.data?.message ||
            "Failed to submit inquiry. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5"></div>
        <div className="absolute inset-0 bg-[url('/images/heroImage.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Help className="text-lg" />
            Quick Inquiry
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 font-primary">
            Have Questions?
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            Need information about our services, pricing, or availability? Send
            us a quick inquiry and we&apos;ll respond promptly.
          </p>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center">
            <Card className="shadow-2xl border-0 w-full max-w-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="bg-primary-500 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Send className="text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary mb-4 font-primary">
                    Quick Inquiry Form
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    Tell us about your requirements and we&apos;ll get back to
                    you with detailed information and pricing.
                  </p>
                </div>

                {success && (
                  <Alert severity="success" className="mb-6">
                    Thank you! Your inquiry has been submitted successfully.
                    We&apos;ll get back to you soon.
                  </Alert>
                )}

                {submitError && (
                  <Alert severity="error" className="mb-6">
                    {submitError}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      error={!!errors.name && touched.name}
                      helperText={
                        errors.name && touched.name ? errors.name : ""
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      type="email"
                      label="Email Address"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      error={!!errors.email && touched.email}
                      helperText={
                        errors.email && touched.email ? errors.email : ""
                      }
                      required
                    />
                  </div>

                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Your Message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur("message")}
                    error={!!errors.message && touched.message}
                    helperText={
                      errors.message && touched.message ? errors.message : ""
                    }
                    placeholder="Please describe your requirements, travel plans, or any specific questions you have..."
                    required
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    className="bg-primary-500 hover:bg-primary-600 text-white py-4 px-8 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit Inquiry"
                    )}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-text-primary mb-2 font-primary">
                      Need Immediate Assistance?
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Call us directly for urgent inquiries
                    </p>
                    <a
                      href="tel:+919511547154"
                      className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <span>📞</span>
                      Call +91 9511547154
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InquiryPage;
