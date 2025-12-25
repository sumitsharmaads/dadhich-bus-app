"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Container,
} from "@mui/material";
import { Email, ArrowBack } from "@mui/icons-material";
import { authService } from "@/lib/api";

const ResendVerificationClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authService.resendVerificationEmail(email);
      setMessage(response.message || "Verification email sent successfully!");
      setIsSuccess(true);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to send verification email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-surface-primary">
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
                Resend Verification Email
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "var(--color-text-secondary)",
                }}
              >
                Enter your email address to receive a new verification link
              </Typography>
            </Box>

            {isSuccess ? (
              <Box sx={{ textAlign: "center" }}>
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    textAlign: "left",
                    backgroundColor: "var(--color-success-50)",
                    borderColor: "var(--color-success-200)",
                  }}
                >
                  <Typography variant="body2">
                    <strong>Verification email sent!</strong>
                    <br />
                    Please check your inbox and click the verification link to
                    activate your account. The link will expire in 24 hours.
                  </Typography>
                </Alert>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={() => {
                      setEmail("");
                      setIsSuccess(false);
                      setMessage("");
                    }}
                    sx={{
                      borderColor: "var(--color-primary-500)",
                      color: "var(--color-primary-500)",
                      "&:hover": {
                        borderColor: "var(--color-primary-600)",
                        backgroundColor: "var(--color-primary-50)",
                      },
                    }}
                  >
                    Send Another Email
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleGoToLogin}
                    sx={{
                      backgroundColor: "var(--color-primary-500)",
                      "&:hover": {
                        backgroundColor: "var(--color-primary-600)",
                      },
                    }}
                  >
                    Go to Login
                  </Button>
                </Box>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  sx={{
                    mb: 3,
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "var(--color-primary-500)" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      backgroundColor: "var(--color-error-50)",
                      borderColor: "var(--color-error-200)",
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {message && !isSuccess && (
                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                      backgroundColor: "var(--color-info-50)",
                      borderColor: "var(--color-info-200)",
                    }}
                  >
                    {message}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading || !email}
                  sx={{
                    mb: 2,
                    backgroundColor: "var(--color-primary-500)",
                    "&:hover": {
                      backgroundColor: "var(--color-primary-600)",
                    },
                    "&:disabled": {
                      backgroundColor: "var(--color-neutral-300)",
                    },
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={20}
                        sx={{ mr: 1, color: "white" }}
                      />
                      Sending...
                    </>
                  ) : (
                    "Send Verification Email"
                  )}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Link href="/login" style={{ textDecoration: "none" }}>
                    <Button
                      startIcon={<ArrowBack />}
                      sx={{
                        color: "var(--color-text-secondary)",
                        "&:hover": {
                          backgroundColor: "var(--color-neutral-100)",
                        },
                      }}
                    >
                      Back to Login
                    </Button>
                  </Link>
                </Box>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ResendVerificationClient;
