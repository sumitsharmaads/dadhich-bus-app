"use client";

import React, { useState } from "react";
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
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Phone,
  Wc,
  Security,
  Save,
  ArrowBack,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { adminService } from "@/lib/api/services/admin.service";
import { CreateUserData } from "@/lib/api/types/admin.types";

const roleTypes = [
  { value: 0, label: "Admin", description: "Full system access" },
  { value: 1, label: "Normal User", description: "Standard user access" },
  { value: 2, label: "Captain", description: "Bus captain access" },
];

const AdminAddUser: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<CreateUserData>({
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    roleType: 1,
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validatePassword = (password: string) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,15}$/;
    return pattern.test(password);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!user.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!user.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(user.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!user.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(user.password)) {
      newErrors.password =
        "Password must be 8-15 characters, including uppercase, lowercase, number & special char.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await adminService.createUser(user);
      router.push("/admin/users");
    } catch (error: any) {
      console.error("Error saving user", error);
      // Handle specific API errors
      if (error?.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: "Failed to create user. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

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
            Add New User
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Create a new user account with appropriate role and permissions
        </Typography>
      </Box>

      {/* Error Alert */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
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

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 3,
                mb: 3,
              }}
            >
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

              <TextField
                label="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />

              <TextField
                label="Phone Number"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                fullWidth
                error={Boolean(errors.phone)}
                helperText={errors.phone || "10-digit phone number"}
                required
              />

              <FormControl fullWidth error={Boolean(errors.gender)}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={user.gender}
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
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Lock /> Security
            </Typography>

            <Box sx={{ maxWidth: "400px" }}>
              <TextField
                name="password"
                type="password"
                label="Password"
                fullWidth
                value={user.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={
                  errors.password ||
                  "8-15 characters, including uppercase, lowercase, number & special char."
                }
                required
              />
            </Box>
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
          {loading ? "Creating..." : "Create User"}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminAddUser;
