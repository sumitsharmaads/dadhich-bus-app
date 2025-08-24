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
  Login as LoginIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContextProvider";
import { useLoader } from "@/contexts/LoaderContext";
import { authService } from "@/lib/api";
import { LoginRequest } from "@/lib/api/types/auth.types";
import { PublicRoutes } from "@/constants/routes";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { setLoading } = useLoader();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const handleInputChange =
    (field: keyof LoginRequest) =>
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
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const response = await authService.login(formData);

      if (response.success) {
        // Create user object with actual data from backend
        const userData = {
          id: response.data.id,
          _id: response.data.id, // MongoDB _id
          email: response.data.email,
          fullname: response.data.fullname,
          phone: response.data.phone,
          gender: response.data.gender,
          roleType: response.data.roleType,
          token: "", // Backend uses session-based auth, no token needed
          username: response.data.username,
        };

        // Call login function from auth context
        login(userData);

        // Navigation is handled in AuthContextProvider
      } else {
        setApiError(response.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      setApiError(error.message || "Login failed. Please try again.");
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
            <LoginIcon
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
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ color: "var(--color-text-secondary)" }}
            >
              Sign in to your account to continue
            </Typography>
          </Box>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLoginSubmit}>
            <Stack spacing={3}>
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
                Sign In
              </Button>
            </Stack>
          </Box>

          <Box mt={3} textAlign="center">
            <Link
              href={PublicRoutes.FORGOT_PASSWORD}
              style={{
                color: "var(--color-primary-500)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Forgot your password?
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

export default LoginForm;
