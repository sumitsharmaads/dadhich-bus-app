"use client";

import React, { useEffect, useState } from "react";
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
  IconButton,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import { authService } from "@/lib/api";
import { successPopup, errorPopup } from "@/utils/errors/alerts";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      errorPopup("Invalid reset link. Please request a new password reset.");
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const handlePasswordStrengthChange = (strength: any) => {
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      errorPopup("Invalid reset token. Please request a new password reset.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      errorPopup("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      errorPopup("Passwords do not match");
      return;
    }

    if (passwordStrength && !passwordStrength.isValid) {
      errorPopup("Password does not meet security requirements");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(token, newPassword);
      successPopup(response.message || "Password reset successfully!");
      setIsSuccess(true);
    } catch (error: any) {
      errorPopup(
        error.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  if (isSuccess) {
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
              <Box textAlign="center">
                <CheckCircle
                  sx={{
                    fontSize: 60,
                    color: "var(--color-success-500)",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: "var(--color-success-500)",
                  }}
                >
                  Password Reset Successful!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Your password has been successfully updated. You can now log
                  in with your new password.
                </Typography>
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    textAlign: "left",
                    backgroundColor: "var(--color-info-50)",
                    borderColor: "var(--color-info-200)",
                  }}
                >
                  <Typography variant="body2">
                    <strong>Security Notice:</strong> All your existing sessions
                    have been logged out for security reasons. You'll need to
                    log in again on all your devices.
                  </Typography>
                </Alert>
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
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

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
              <Lock
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
                Reset Your Password
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "var(--color-text-secondary)",
                }}
              >
                Enter your new password below
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                required
                sx={{
                  mb: 2,
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
                      <Lock sx={{ color: "var(--color-primary-500)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {newPassword && (
                <Box sx={{ mb: 2 }}>
                  <PasswordStrengthMeter
                    password={newPassword}
                    onStrengthChange={handlePasswordStrengthChange}
                  />
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                      <Lock sx={{ color: "var(--color-primary-500)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={
                  isLoading ||
                  !newPassword ||
                  !confirmPassword ||
                  (passwordStrength && !passwordStrength.isValid)
                }
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
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
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
