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
import { Phone, Email, LocationOn } from "@mui/icons-material";
import { inquiryService } from "@/lib/api/services/inquiry.service";

interface ContactFormState {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  message?: string;
}

interface ContactFormTouched {
  firstname: boolean;
  lastname: boolean;
  email: boolean;
  phone: boolean;
  message: boolean;
}

const ContactPage = () => {
  const [formState, setFormState] = useState<ContactFormState>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  });

  const [touched, setTouched] = useState<ContactFormTouched>({
    firstname: false,
    lastname: false,
    email: false,
    phone: false,
    message: false,
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

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

  const handleBlur = useCallback((field: keyof ContactFormState) => {
    setTouched((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  }, []);

  const validateState = useMemo(() => {
    const wordCount = (formState?.message || " ")?.trim()?.split(/\s+/).length;
    let emailError = "";
    let messageError = "";
    let firstNameError = "";
    let lastNameError = "";
    let phoneError = "";

    if (!nameRegex.test(formState.firstname || "")) {
      firstNameError = "Please enter a valid name.";
    }
    if (!nameRegex.test(formState.lastname || "")) {
      lastNameError = "Please enter a valid name.";
    }
    if (!emailRegex.test(formState?.email || "")) {
      emailError = "Please enter a valid email address.";
    }
    if (wordCount < 5 || wordCount > 200) {
      messageError = "Your message should be between 5 and 200 words.";
    }
    if (!phoneRegex.test((formState.phone || "").toString())) {
      phoneError = "Enter a valid phone number with 10 digits";
    }

    setErrors({
      email: emailError,
      phone: phoneError,
      firstname: firstNameError,
      lastname: lastNameError,
      message: messageError,
    });

    return (
      !emailError &&
      !messageError &&
      !phoneError &&
      !firstNameError &&
      !lastNameError
    );
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      firstname: true,
      email: true,
      phone: true,
      lastname: true,
      message: true,
    });

    if (validateState) {
      setLoading(true);
      try {
        const response = await inquiryService.submitContactUs({
          name: `${formState.firstname} ${formState.lastname}`.trim(),
          email: formState.email,
          phone: formState.phone,
          message: formState.message,
        });

        if (response.success) {
          setSuccess(true);
          setSubmitError("");
          setFormState({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            message: "",
          });
          setTouched({
            firstname: false,
            lastname: false,
            email: false,
            phone: false,
            message: false,
          });
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setSubmitError(
            response.message || "Failed to submit message. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error submitting form:", error);
        setSubmitError(
          error.response?.data?.message ||
            "Failed to submit message. Please check your connection and try again."
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
            <Phone className="text-lg" />
            Contact Us
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 font-primary">
            Get in Touch
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            Questions, comments, or suggestions? Simply fill in the form and
            we&apos;ll be in touch shortly.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-text-primary mb-6 font-primary">
                  Let&apos;s talk with us
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Questions, comments, or suggestions? Simply fill in the form
                  and we&apos;ll be in touch shortly.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-500 text-white p-3 rounded-full">
                    <LocationOn className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2 font-primary">
                      Address
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      Tau Devi Lal Market Near Bansal Hospital
                      <br />
                      Fatehabad, Haryana - 125050
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-500 text-white p-3 rounded-full">
                    <Phone className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2 font-primary">
                      Phone
                    </h3>
                    <a
                      href="tel:+919511547154"
                      className="text-text-secondary hover:text-primary-500 transition-colors"
                    >
                      +91 9511547154
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-500 text-white p-3 rounded-full">
                    <Email className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2 font-primary">
                      Email
                    </h3>
                    <a
                      href="mailto:dadhichbus@gmail.com"
                      className="text-text-secondary hover:text-primary-500 transition-colors"
                    >
                      dadhichbus@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  {success && (
                    <Alert severity="success" className="mb-6">
                      Thank you! Your message has been sent successfully.
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
                        label="First Name"
                        name="firstname"
                        value={formState.firstname}
                        onChange={handleChange}
                        onBlur={() => handleBlur("firstname")}
                        error={!!errors.firstname && touched.firstname}
                        helperText={
                          errors.firstname && touched.firstname
                            ? errors.firstname
                            : ""
                        }
                        required
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastname"
                        value={formState.lastname}
                        onChange={handleChange}
                        onBlur={() => handleBlur("lastname")}
                        error={!!errors.lastname && touched.lastname}
                        helperText={
                          errors.lastname && touched.lastname
                            ? errors.lastname
                            : ""
                        }
                        required
                      />
                    </div>

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

                    <TextField
                      fullWidth
                      type="tel"
                      label="Contact Number"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur("phone")}
                      error={!!errors.phone && touched.phone}
                      helperText={
                        errors.phone && touched.phone ? errors.phone : ""
                      }
                      inputProps={{ maxLength: 10 }}
                      required
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label="Your Message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      onBlur={() => handleBlur("message")}
                      error={!!errors.message && touched.message}
                      helperText={
                        errors.message && touched.message ? errors.message : ""
                      }
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
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
