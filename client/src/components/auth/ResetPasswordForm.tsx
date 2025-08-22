"use client";

import React, { useState, useMemo } from "react";
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
  Lock,
  Security,
} from "@mui/icons-material";

interface ResetPasswordFormProps {
  onResetPassword: (password: string, confirmPassword: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onResetPassword,
  loading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleBlur = (field: "password" | "confirmPassword") => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const validateForm = useMemo(() => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    // Password validation (8-15 characters, including uppercase, lowercase, number, and special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8-15 characters, including uppercase, lowercase, a number, and a special character.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ password: true, confirmPassword: true });

    if (!validateForm) return;

    try {
      await onResetPassword(formData.password, formData.confirmPassword);
    } catch (error) {
      // Error handling is done in the parent component
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
              Set a New Password
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ color: "var(--color-text-secondary)" }}
            >
              Your previous password has been reset. Please set a new password for your account.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                onBlur={() => handleBlur("password")}
                error={!!(errors.password && touched.password)}
                helperText={
                  errors.password && touched.password
                    ? errors.password
                    : "Password must be 8-15 characters, including uppercase, lowercase, a number, and a special character."
                }
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

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                onBlur={() => handleBlur("confirmPassword")}
                error={!!(errors.confirmPassword && touched.confirmPassword)}
                helperText={
                  errors.confirmPassword && touched.confirmPassword
                    ? errors.confirmPassword
                    : ""
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "var(--color-primary-500)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                disabled={!validateForm || loading}
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
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResetPasswordForm;
