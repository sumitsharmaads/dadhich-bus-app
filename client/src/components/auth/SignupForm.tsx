"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Container,
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  PersonAdd,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContextProvider";
import { useLoader } from "@/contexts/LoaderContext";
import { authService } from "@/lib/api";
import { RegisterRequest } from "@/lib/api/types/auth.types";
import { PublicRoutes } from "@/constants/routes";

const SignupForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { setLoading } = useLoader();

  const [formData, setFormData] = useState<RegisterRequest>({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterRequest>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const handleInputChange =
    (field: keyof RegisterRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }

      // Clear API error
      if (apiError) setApiError("");
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterRequest> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 10) {
      newErrors.password = "Password must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const response = await authService.register(formData);

      if (response.success) {
        // Redirect to login page after successful registration
        router.push(PublicRoutes.LOGIN);
      } else {
        setApiError(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error: any) {
      setApiError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
            <PersonAdd
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
              Create Account
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ color: "var(--color-text-secondary)" }}
            >
              Join us to start your journey
            </Typography>
          </Box>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullname}
                onChange={handleInputChange("fullname")}
                error={!!errors.fullname}
                helperText={errors.fullname}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "var(--color-primary-500)" }} />
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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: { xs: "1", sm: "0 0 calc(50% - 8px)" } }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
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
                </Box>
                <Box sx={{ flex: { xs: "1", sm: "0 0 calc(50% - 8px)" } }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: "var(--color-primary-500)" }} />
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
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                error={!!errors.password}
                helperText={errors.password}
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
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
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
              >
                Create Account
              </Button>
            </Stack>
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
              Already have an account?{" "}
              <Link
                href={PublicRoutes.LOGIN}
                style={{
                  color: "var(--color-primary-500)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignupForm;
