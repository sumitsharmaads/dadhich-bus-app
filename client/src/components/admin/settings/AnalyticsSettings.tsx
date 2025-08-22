"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Save, Edit } from "@mui/icons-material";

const AnalyticsSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    googleAnalyticsId: "",
    facebookPixelId: "",
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        googleAnalyticsId: settings.analytics?.googleAnalyticsId || "",
        facebookPixelId: settings.analytics?.facebookPixelId || "",
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = () => {
    onSave({
      analytics: {
        googleAnalyticsId: form.googleAnalyticsId,
        facebookPixelId: form.facebookPixelId,
      },
    } as any);
    setEditing(false);
  };

  const cancel = () => {
    setForm({
      googleAnalyticsId: settings.analytics?.googleAnalyticsId || "",
      facebookPixelId: settings.analytics?.facebookPixelId || "",
    });
    setEditing(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1">Analytics & Tracking</Typography>
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
            label="Google Analytics ID"
            name="googleAnalyticsId"
            value={form.googleAnalyticsId}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
            helperText="Enter your Google Analytics tracking ID"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Facebook Pixel ID"
            name="facebookPixelId"
            value={form.facebookPixelId}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="XXXXXXXXXX"
            helperText="Enter your Facebook Pixel ID"
          />
        </Grid>
      </Grid>

      {!editing && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {!form.googleAnalyticsId && !form.facebookPixelId 
            ? "No analytics configured. Add tracking IDs to monitor website performance."
            : "Analytics tracking is configured for this website."
          }
        </Typography>
      )}
    </Box>
  );
};

export default AnalyticsSettings;
