"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  CreateTourRequest,
  TourDiscount,
  TourGroupDiscount,
} from "@/lib/api/types/tour.types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { EXCLUSIVE_FEATURES } from "@/constants/tourConstants";

interface AmountSectionProps {
  form: CreateTourRequest;
  onFormChange: (field: keyof CreateTourRequest, value: any) => void;
  onNestedFormChange: (
    parentField: keyof CreateTourRequest,
    field: string,
    value: any
  ) => void;
  errors: Record<string, string>;
}

const AmountSection: React.FC<AmountSectionProps> = ({
  form,
  onFormChange,
  onNestedFormChange,
  errors,
}) => {
  const [editingDiscountIndex, setEditingDiscountIndex] = useState<
    number | null
  >(null);
  const [editingGroupDiscountIndex, setEditingGroupDiscountIndex] = useState<
    number | null
  >(null);
  const [newExclusive, setNewExclusive] = useState("");

  // Discount form state
  const [discountForm, setDiscountForm] = useState<Partial<TourDiscount>>({
    type: "percent",
    value: 0,
    validFrom: undefined,
    validTo: undefined,
    minAmount: 0,
    maxDiscount: 0,
    applicableOn: "",
  });

  // Group discount form state
  const [groupDiscountForm, setGroupDiscountForm] = useState<
    Partial<TourGroupDiscount>
  >({
    minMembers: 0,
    maxMembers: 0,
    type: "percent",
    value: 0,
    applicableOn: "",
    description: "",
  });

  const handleAddExclusive = () => {
    if (newExclusive.trim() && !form.exclusive?.includes(newExclusive.trim())) {
      onFormChange("exclusive", [
        ...(form.exclusive || []),
        newExclusive.trim(),
      ]);
      setNewExclusive("");
    }
  };

  const handleRemoveExclusive = (index: number) => {
    const updated = form.exclusive?.filter((_, i) => i !== index) || [];
    onFormChange("exclusive", updated);
  };

  const handleDiscountSubmit = () => {
    if (!discountForm.type || !discountForm.value) return;

    const newDiscount: TourDiscount = {
      type: discountForm.type,
      value: discountForm.value,
      validFrom: discountForm.validFrom,
      validTo: discountForm.validTo,
      minAmount: discountForm.minAmount || 0,
      maxDiscount: discountForm.maxDiscount || 0,
      applicableOn: discountForm.applicableOn || "",
    };

    onFormChange("discount", newDiscount);

    // Reset form
    setDiscountForm({
      type: "percent",
      value: 0,
      validFrom: undefined,
      validTo: undefined,
      minAmount: 0,
      maxDiscount: 0,
      applicableOn: "",
    });
  };

  const handleGroupDiscountSubmit = () => {
    if (
      !groupDiscountForm.minMembers ||
      !groupDiscountForm.type ||
      !groupDiscountForm.value
    )
      return;

    const newGroupDiscount: TourGroupDiscount = {
      minMembers: groupDiscountForm.minMembers,
      maxMembers: groupDiscountForm.maxMembers || 0,
      type: groupDiscountForm.type,
      value: groupDiscountForm.value,
      applicableOn: groupDiscountForm.applicableOn || "",
      description: groupDiscountForm.description || "",
    };

    if (editingGroupDiscountIndex !== null) {
      // Edit existing group discount
      const updatedGroupDiscounts = [...(form.groupDiscounts || [])];
      updatedGroupDiscounts[editingGroupDiscountIndex] = newGroupDiscount;
      onFormChange("groupDiscounts", updatedGroupDiscounts);
      setEditingGroupDiscountIndex(null);
    } else {
      // Add new group discount
      onFormChange("groupDiscounts", [
        ...(form.groupDiscounts || []),
        newGroupDiscount,
      ]);
    }

    // Reset form
    setGroupDiscountForm({
      minMembers: 0,
      maxMembers: 0,
      type: "percent",
      value: 0,
      applicableOn: "",
      description: "",
    });
  };

  const handleEditGroupDiscount = (index: number) => {
    const item = form.groupDiscounts?.[index];
    if (item) {
      setGroupDiscountForm({
        minMembers: item.minMembers,
        maxMembers: item.maxMembers || 0,
        type: item.type,
        value: item.value,
        applicableOn: item.applicableOn || "",
        description: item.description || "",
      });
      setEditingGroupDiscountIndex(index);
    }
  };

  const handleDeleteGroupDiscount = (index: number) => {
    const updatedGroupDiscounts =
      form.groupDiscounts?.filter((_, i) => i !== index) || [];
    onFormChange("groupDiscounts", updatedGroupDiscounts);
  };

  const handleCancelGroupDiscount = () => {
    setEditingGroupDiscountIndex(null);
    setGroupDiscountForm({
      minMembers: 0,
      maxMembers: 0,
      type: "percent",
      value: 0,
      applicableOn: "",
      description: "",
    });
  };

  const handleDateChange = (
    field: "validFrom" | "validTo",
    value: Dayjs | null
  ) => {
    setDiscountForm((prev) => ({
      ...prev,
      [field]: value ? value.toDate() : undefined,
    }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Section 5: Amount Related (Non-mandatory)
        </Typography>

        {/* Main Discount */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Main Discount
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type *</InputLabel>
                <Select
                  value={discountForm.type}
                  onChange={(e) =>
                    setDiscountForm((prev) => ({
                      ...prev,
                      type: e.target.value as "percent" | "amount",
                    }))
                  }
                  label="Discount Type *"
                >
                  <MenuItem value="percent">Percentage (%)</MenuItem>
                  <MenuItem value="amount">Fixed Amount (₹)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount Value *"
                type="number"
                value={discountForm.value}
                onChange={(e) =>
                  setDiscountForm((prev) => ({
                    ...prev,
                    value: Number(e.target.value),
                  }))
                }
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {discountForm.type === "percent" ? "%" : "₹"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Valid From"
                  value={
                    discountForm.validFrom
                      ? dayjs(discountForm.validFrom)
                      : null
                  }
                  onChange={(value: Dayjs | null) =>
                    handleDateChange("validFrom", value)
                  }
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Valid To"
                  value={
                    discountForm.validTo ? dayjs(discountForm.validTo) : null
                  }
                  onChange={(value: Dayjs | null) =>
                    handleDateChange("validTo", value)
                  }
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Amount"
                type="number"
                value={discountForm.minAmount}
                onChange={(e) =>
                  setDiscountForm((prev) => ({
                    ...prev,
                    minAmount: Number(e.target.value),
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Discount"
                type="number"
                value={discountForm.maxDiscount}
                onChange={(e) =>
                  setDiscountForm((prev) => ({
                    ...prev,
                    maxDiscount: Number(e.target.value),
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Applicable On"
                value={discountForm.applicableOn}
                onChange={(e) =>
                  setDiscountForm((prev) => ({
                    ...prev,
                    applicableOn: e.target.value,
                  }))
                }
                placeholder="e.g., total, fare, accommodation"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleDiscountSubmit}>
              {form.discount ? "Update" : "Set"} Main Discount
            </Button>
          </Box>

          {/* Current Discount Display */}
          {form.discount && (
            <Paper sx={{ mt: 2, p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Discount
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Type:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {form.discount.type === "percent"
                      ? "Percentage"
                      : "Fixed Amount"}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Value:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {form.discount.value}
                    {form.discount.type === "percent" ? "%" : "₹"}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Min Amount:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {form.discount.minAmount
                      ? `₹${form.discount.minAmount}`
                      : "None"}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Max Discount:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {form.discount.maxDiscount
                      ? `₹${form.discount.maxDiscount}`
                      : "None"}
                  </Typography>
                </Grid>
                {form.discount.applicableOn && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Applicable On:</strong>{" "}
                      {form.discount.applicableOn}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Group Discounts */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Group Discounts
          </Typography>

          <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Min Members *"
                  type="number"
                  value={groupDiscountForm.minMembers}
                  onChange={(e) =>
                    setGroupDiscountForm((prev) => ({
                      ...prev,
                      minMembers: Number(e.target.value),
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Max Members"
                  type="number"
                  value={groupDiscountForm.maxMembers}
                  onChange={(e) =>
                    setGroupDiscountForm((prev) => ({
                      ...prev,
                      maxMembers: Number(e.target.value),
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Type *</InputLabel>
                  <Select
                    value={groupDiscountForm.type}
                    onChange={(e) =>
                      setGroupDiscountForm((prev) => ({
                        ...prev,
                        type: e.target.value as "percent" | "amount",
                      }))
                    }
                    label="Type *"
                  >
                    <MenuItem value="percent">Percentage (%)</MenuItem>
                    <MenuItem value="amount">Fixed Amount (₹)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Value *"
                  type="number"
                  value={groupDiscountForm.value}
                  onChange={(e) =>
                    setGroupDiscountForm((prev) => ({
                      ...prev,
                      value: Number(e.target.value),
                    }))
                  }
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {groupDiscountForm.type === "percent" ? "%" : "₹"}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Applicable On"
                  value={groupDiscountForm.applicableOn}
                  onChange={(e) =>
                    setGroupDiscountForm((prev) => ({
                      ...prev,
                      applicableOn: e.target.value,
                    }))
                  }
                  placeholder="e.g., total, fare"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  value={groupDiscountForm.description}
                  onChange={(e) =>
                    setGroupDiscountForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={handleGroupDiscountSubmit}>
                {editingGroupDiscountIndex !== null ? "Update" : "Add"} Group
                Discount
              </Button>
              {editingGroupDiscountIndex !== null && (
                <Button variant="outlined" onClick={handleCancelGroupDiscount}>
                  Cancel
                </Button>
              )}
            </Box>
          </Box>

          {/* Group Discounts Table */}
          {form.groupDiscounts && form.groupDiscounts.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Members</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Applicable On</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.groupDiscounts.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.minMembers}
                        {item.maxMembers &&
                          item.maxMembers > item.minMembers &&
                          ` - ${item.maxMembers}`}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            item.type === "percent"
                              ? "Percentage"
                              : "Fixed Amount"
                          }
                          color={
                            item.type === "percent" ? "primary" : "secondary"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {item.value}
                        {item.type === "percent" ? "%" : "₹"}
                      </TableCell>
                      <TableCell>{item.applicableOn || "-"}</TableCell>
                      <TableCell>{item.description || "-"}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditGroupDiscount(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGroupDiscount(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
              No group discounts added yet.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Policies and Exclusive */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Policies & Exclusive Features
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cancellation Policy"
                value={form.cancellationPolicy || ""}
                onChange={(e) =>
                  onFormChange("cancellationPolicy", e.target.value)
                }
                multiline
                rows={3}
                placeholder="Enter cancellation policy details"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Refund Policy"
                value={form.refundPolicy || ""}
                onChange={(e) => onFormChange("refundPolicy", e.target.value)}
                multiline
                rows={3}
                placeholder="Enter refund policy details"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Exclusive Features
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Exclusive Feature</InputLabel>
                  <Select
                    value={newExclusive}
                    onChange={(e) => setNewExclusive(e.target.value)}
                    label="Select Exclusive Feature"
                  >
                    {EXCLUSIVE_FEATURES.map((feature) => (
                      <MenuItem key={feature} value={feature}>
                        {feature}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddExclusive}
                  disabled={!newExclusive}
                >
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {form.exclusive?.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() => handleRemoveExclusive(index)}
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AmountSection;
