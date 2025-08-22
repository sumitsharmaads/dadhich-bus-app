"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Container,
  Stack,
} from "@mui/material";
import { Email, Send } from "@mui/icons-material";
import { useLoader } from "@/contexts/LoaderContext";
import { post } from "@/lib/service";
import { PublicRoutes } from "@/constants/routes";
import OTPForm from "./OTPForm";
import ResetPasswordForm from "./ResetPasswordForm";

interface ForgotPasswordFormData {
  email: string;
}

type Step = "email" | "otp" | "reset";

const ForgotPasswordForm: React.FC = () => {
  const { setLoading } = useLoader();

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [step, setStep] = useState<Step>("email");
  const [forgotEmail, setForgotEmail] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      email: value,
    }));

    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }

    // Clear API error and success message
    if (apiError) setApiError("");
    if (successMessage) setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await post("auth/forgot-password", { username: formData.email });
      setForgotEmail(formData.email);
      setStep("otp");
    } catch (error: any) {
      setApiError(error.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (otp: number) => {
    setLoading(true);
    setApiError("");

    try {
      // Verify OTP for forgot password
      await post("auth/verify-otp", {
        username: forgotEmail,
        otp: otp,
      });

      // If successful, move to reset password step
      setStep("reset");
    } catch (error: any) {
      setApiError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (password: string, confirmPassword: string) => {
    setLoading(true);
    setApiError("");

    try {
      await post("auth/reset-password", {
        username: forgotEmail,
        password: password,
      });

      setSuccessMessage("Password has been reset successfully!");
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = PublicRoutes.LOGIN;
      }, 2000);
    } catch (error: any) {
      setApiError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setApiError("");
  };

  const handleBackToOTP = () => {
    setStep("otp");
    setApiError("");
  };

  if (step === "otp") {
    return (
      <OTPForm
        onOTPSubmit={handleOTPSubmit}
        onBack={handleBackToEmail}
        title="Verify OTP"
        description={`An authentication code has been sent to ${forgotEmail}`}
        error={apiError}
        loading={false}
      />
    );
  }

  if (step === "reset") {
    return (
      <ResetPasswordForm
        onResetPassword={handleResetPassword}
        loading={false}
        error={apiError}
      />
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card
        elevation={3}
        sx={{
          borderRadius: 2,
          background: "var(--color-surface-primary)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <Email
              sx={{
                fontSize: 48,
                color: "var(--color-primary-500)",
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              Forgot Password?
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ color: "var(--color-text-secondary)" }}
            >
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </Typography>
          </Box>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleEmailSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "var(--color-primary-500)" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--color-neutral-300)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--color-primary-500)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-primary-500)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--color-text-secondary)",
                    "&.Mui-focused": {
                      color: "var(--color-primary-500)",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "var(--color-primary-500)",
                  "&:hover": {
                    backgroundColor: "var(--color-primary-600)",
                  },
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
                startIcon={<Send />}
              >
                Send Reset Instructions
              </Button>
            </Stack>
          </Box>

          <Box mt={3} textAlign="center">
            <Link
              href={PublicRoutes.LOGIN}
              style={{
                color: "var(--color-primary-500)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Back to Sign In
            </Link>
          </Box>

          <Box
            mt={4}
            pt={3}
            borderTop="1px solid var(--color-neutral-200)"
            textAlign="center"
          >
            <Typography
              variant="body2"
              sx={{ color: "var(--color-text-secondary)" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href={PublicRoutes.SIGNUP}
                style={{
                  color: "var(--color-primary-500)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ForgotPasswordForm;
