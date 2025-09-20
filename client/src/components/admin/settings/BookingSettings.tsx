"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Grid, TextField, Typography, Switch, FormControlLabel } from "@mui/material";
import { Save, Edit } from "@mui/icons-material";

import { NumberTextField } from "@/components/common";
import { formatDate, formatTime, formatDateTime } from "@/utils/dateFormat";
const BookingSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    currencyCode: "INR",
    currencySymbol: "₹",
    taxPercent: 0,
    taxRegistration: "",
    cancellationPolicy: "",
    advancePaymentPercent: 0,
    allowGuestCheckout: true,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        currencyCode: settings.booking?.currencyCode || "INR",
        currencySymbol: settings.booking?.currencySymbol || "₹",
        taxPercent: settings.booking?.taxPercent || 0,
        taxRegistration: settings.booking?.taxRegistration || "",
        cancellationPolicy: settings.booking?.cancellationPolicy || "",
        advancePaymentPercent: settings.booking?.advancePaymentPercent || 0,
        allowGuestCheckout: settings.booking?.allowGuestCheckout ?? true,
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [name]: event.target.checked }));
  };

  const save = () => {
    onSave({
      booking: {
        currencyCode: form.currencyCode,
        currencySymbol: form.currencySymbol,
        taxPercent: form.taxPercent,
        taxRegistration: form.taxRegistration,
        cancellationPolicy: form.cancellationPolicy,
        advancePaymentPercent: form.advancePaymentPercent,
        allowGuestCheckout: form.allowGuestCheckout,
      },
    } as any);
    setEditing(false);
  };

  const cancel = () => {
    setForm({
      currencyCode: settings.booking?.currencyCode || "INR",
      currencySymbol: settings.booking?.currencySymbol || "₹",
      taxPercent: settings.booking?.taxPercent || 0,
      taxRegistration: settings.booking?.taxRegistration || "",
      cancellationPolicy: settings.booking?.cancellationPolicy || "",
      advancePaymentPercent: settings.booking?.advancePaymentPercent || 0,
      allowGuestCheckout: settings.booking?.allowGuestCheckout ?? true,
    });
    setEditing(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1">Booking & Payment Settings</Typography>
        {!editing ? (
          <Button startIcon={<Edit />} onClick={() => setEditing(true)} size="small">
            Edit
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={cancel} size="small">
              Cancel
            </Button>
            <Button startIcon={<Save />} onClick={save} variant="contained" size="small">
              Save
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Currency Code"
            name="currencyCode"
            value={form.currencyCode}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="INR, USD, EUR"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Currency Symbol"
            name="currencySymbol"
            value={form.currencySymbol}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="₹, $, €"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <NumberTextField
                label="Tax Percentage"
            name="taxPercent"
            
            value={form.taxPercent}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tax Registration"
            name="taxRegistration"
            value={form.taxRegistration}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="GST Number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <NumberTextField
                label="Advance Payment %"
            name="advancePaymentPercent"
            
            value={form.advancePaymentPercent}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            inputProps={{ min: 0, max: 100, step: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={form.allowGuestCheckout}
                onChange={handleSwitchChange("allowGuestCheckout")}
                disabled={!editing}
              />
            }
            label="Allow Guest Checkout"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cancellation Policy"
            name="cancellationPolicy"
            value={form.cancellationPolicy}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            multiline
            rows={3}
            placeholder="Enter your cancellation policy..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingSettings;
