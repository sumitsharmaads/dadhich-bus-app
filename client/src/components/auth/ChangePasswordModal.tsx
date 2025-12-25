"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { authService } from "@/lib/api/services/auth.service";
import { successPopup, errorPopup } from "@/utils/errors/alerts";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState<ChangePasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  const handleInputChange = (
    field: keyof ChangePasswordData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordStrengthChange = (strength: any) => {
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      errorPopup("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errorPopup("New passwords do not match");
      return;
    }

    if (passwordStrength && !passwordStrength.isValid) {
      errorPopup("Password does not meet security requirements");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      errorPopup("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength(null);

      // Close modal
      onClose();

      successPopup(
        "Password changed successfully! Please log in again on other devices."
      );
    } catch (error: any) {
      errorPopup(
        error.message || "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: "var(--color-surface-primary)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LockIcon sx={{ mr: 1, color: "var(--color-primary-500)" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            Change Password
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          size="small"
          sx={{
            color: "var(--color-text-secondary)",
            "&:hover": {
              backgroundColor: "var(--color-neutral-100)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Alert
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: "var(--color-info-50)",
            borderColor: "var(--color-info-200)",
          }}
        >
          <Typography variant="body2">
            <strong>Security Notice:</strong> Changing your password will log
            you out of all other devices for security reasons.
          </Typography>
        </Alert>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Current Password */}
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.old ? "text" : "password"}
              value={formData.oldPassword}
              onChange={(e) => handleInputChange("oldPassword", e.target.value)}
              disabled={isLoading}
              required
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "var(--color-primary-500)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("old")}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPasswords.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* New Password */}
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              disabled={isLoading}
              required
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "var(--color-primary-500)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("new")}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Meter */}
            {formData.newPassword && (
              <PasswordStrengthMeter
                password={formData.newPassword}
                onStrengthChange={handlePasswordStrengthChange}
              />
            )}

            {/* Confirm New Password */}
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              disabled={isLoading}
              required
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "var(--color-primary-500)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("confirm")}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPasswords.confirm ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            color: "var(--color-text-secondary)",
            "&:hover": {
              backgroundColor: "var(--color-neutral-100)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            isLoading ||
            !formData.oldPassword ||
            !formData.newPassword ||
            !formData.confirmPassword ||
            (passwordStrength && !passwordStrength.isValid)
          }
          sx={{
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
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;
