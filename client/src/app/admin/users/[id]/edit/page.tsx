"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  Divider,
  CircularProgress,
  Switch,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Person, Lock, Save, ArrowBack, Security } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { adminService } from "@/lib/api/services/admin.service";
import { AdminUser, UpdateUserData } from "@/lib/api/types/admin.types";

const roleTypes = [
  { value: 0, label: "Admin", description: "Full system access" },
  { value: 1, label: "Normal User", description: "Standard user access" },
  { value: 2, label: "Captain", description: "Bus captain access" },
];

const accessTypes = [
  {
    value: -1,
    label: "Frozen",
    description: "Account is frozen and cannot access the system",
  },
  {
    value: 0,
    label: "Active",
    description: "Account is active and can access the system",
  },
  {
    value: 1,
    label: "Awaiting email activation",
    description: "Email verification required",
  },
  {
    value: 2,
    label: "Requires password reset",
    description: "Password reset required",
  },
];

const AdminEditUser: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<AdminUser | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUser();
    } else {
      setFetching(false);
      setErrors({ fetch: "Invalid user ID" });
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await adminService.getUser(userId);

      if (response) {
        setUser(response);
      } else {
        setErrors({ fetch: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setErrors({ fetch: "Failed to load user data" });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    if (user) {
      setUser({ ...user, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!user?.fullname?.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!user?.phone?.toString().trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(user.phone.toString())) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!user?.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) {
      return;
    }

    setLoading(true);
    try {
      const updateData: UpdateUserData = {
        fullname: user.fullname,
        phone: user.phone?.toString(),
        gender: user.gender,
        roleType: user.roleType,
        isActive: user.isActive,
        access: user.access,
      };

      await adminService.updateUser(userId, updateData);
      router.push("/admin/users");
    } catch (error: any) {
      console.error("Error updating user", error);
      // Handle specific API errors
      if (error?.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: "Failed to update user. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Alert severity="error">User not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/admin/users")}
            sx={{ minWidth: "auto" }}
          />
          <Typography variant="h4" fontWeight={600}>
            Edit User
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Update user information and role permissions
        </Typography>
      </Box>

      {/* Error Alert */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      {errors.fetch && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.fetch}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Person /> User Information
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(errors.fullname)}
                  helperText={errors.fullname}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={user.email}
                  fullWidth
                  disabled
                  InputProps={{ readOnly: true }}
                  helperText="Email cannot be changed"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username"
                  name="username"
                  value={user.username}
                  fullWidth
                  disabled
                  InputProps={{ readOnly: true }}
                  helperText="Username cannot be changed"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(errors.phone)}
                  helperText={errors.phone || "10-digit phone number"}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(errors.gender)}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={user.gender || ""}
                    onChange={handleSelectChange}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.5 }}
                    >
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role Type</InputLabel>
                  <Select
                    name="roleType"
                    value={user.roleType}
                    onChange={handleSelectChange}
                    label="Role Type"
                  >
                    {roleTypes.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box>
                          <Typography variant="body2">{role.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Security /> Access Control
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.isActive}
                      onChange={(e) =>
                        handleSwitchChange("isActive", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Account Active"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Access Status</InputLabel>
                  <Select
                    name="access"
                    value={user.access}
                    onChange={handleSelectChange}
                    label="Access Status"
                  >
                    {accessTypes.map((access) => (
                      <MenuItem key={access.value} value={access.value}>
                        <Box>
                          <Typography variant="body2">
                            {access.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {access.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Lock /> Security Note
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              Email and username cannot be modified for security reasons.
              Contact the system administrator if these need to be changed.
            </Alert>

            <Alert severity="warning">
              Password changes are not available in this interface. Users can
              reset their password through the login page.
            </Alert>
          </CardContent>
        </Card>
      </Paper>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => router.push("/admin/users")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update User"}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminEditUser;
