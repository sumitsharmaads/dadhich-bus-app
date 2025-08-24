"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
  Alert,
} from "@mui/material";
import { Security, ArrowBack } from "@mui/icons-material";

interface OTPFormProps {
  onOTPSubmit: (otp: number) => Promise<void>;
  onBack?: () => void;
  title?: string;
  description?: string;
  error?: string;
  loading?: boolean;
}

const OTPForm: React.FC<OTPFormProps> = ({
  onOTPSubmit,
  onBack,
  title = "Verify OTP",
  description = "An authentication code has been sent to your email.",
  error,
  loading = false,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [apiError, setApiError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      if (typeof document !== "undefined") {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      if (typeof document !== "undefined") {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput?.focus();
      }
    }
  };

  const validateOTP = useMemo((): boolean => {
    return otp.every(
      (d) => d && d.toString().length === 1 && !isNaN(Number(d))
    );
  }, [otp]);

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOTP) return;

    try {
      setApiError("");
      await onOTPSubmit(Number(otp.join("").trim()));
    } catch (error: any) {
      setApiError(error.message || "Failed to verify OTP. Please try again.");
    }
  };

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
            <Security
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
              {title}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ color: "var(--color-text-secondary)" }}
            >
              {description}
            </Typography>
          </Box>

          {(error || apiError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleOTPSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: "var(--color-text-secondary)",
                    textAlign: "center",
                  }}
                >
                  Enter the 6-digit code
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {otp.map((digit, index) => (
                    <TextField
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center" },
                      }}
                      value={digit}
                      onChange={(e) => handleInputChange(e, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      sx={{
                        width: "50px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
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
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "var(--color-text-secondary)",
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    color: "var(--color-primary-500)",
                  },
                }}
              >
                Didn&apos;t receive a code?{" "}
                <span style={{ textDecoration: "underline" }}>Resend</span>
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!validateOTP || loading}
                sx={{
                  backgroundColor: "var(--color-primary-500)",
                  "&:hover": {
                    backgroundColor: "var(--color-primary-600)",
                  },
                  "&:disabled": {
                    backgroundColor: "var(--color-neutral-300)",
                    color: "var(--color-text-secondary)",
                  },
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              {onBack && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={onBack}
                  startIcon={<ArrowBack />}
                  sx={{
                    borderColor: "var(--color-neutral-300)",
                    color: "var(--color-text-primary)",
                    "&:hover": {
                      borderColor: "var(--color-primary-500)",
                      color: "var(--color-primary-500)",
                    },
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Go Back
                </Button>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OTPForm;
