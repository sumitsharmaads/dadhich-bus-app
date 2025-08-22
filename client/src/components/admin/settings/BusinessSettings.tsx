"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Save, Edit } from "@mui/icons-material";

const BusinessSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    companyName: "",
    registrationNumber: "",
    supportHours: "",
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        companyName: settings.business?.companyName || "",
        registrationNumber: settings.business?.registrationNumber || "",
        supportHours: settings.business?.supportHours || "",
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = () => {
    onSave({
      business: {
        companyName: form.companyName,
        registrationNumber: form.registrationNumber,
        supportHours: form.supportHours,
      },
    } as any);
    setEditing(false);
  };

  const cancel = () => {
    setForm({
      companyName: settings.business?.companyName || "",
      registrationNumber: settings.business?.registrationNumber || "",
      supportHours: settings.business?.supportHours || "",
    });
    setEditing(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1">Business Information</Typography>
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
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Registration Number"
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="GST/VAT Number"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Support Hours"
            name="supportHours"
            value={form.supportHours}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="e.g., Mon-Fri 9AM-6PM, Sat 9AM-1PM"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessSettings;
