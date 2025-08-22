"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Grid, TextField } from "@mui/material";

const GeneralSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    brandname: "",
    phone: "",
    contactAddress: {
      city: "",
      state: "",
      pincode: "",
      address1: "",
      address2: "",
    },
  });

  useEffect(() => {
    if (settings) {
      setForm({
        brandname: settings.brandname || "",
        phone: settings.phone || "",
        contactAddress: settings.contactAddress || {
          city: "",
          state: "",
          pincode: "",
          address1: "",
          address2: "",
        },
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("contactAddress.")) {
      const key = name.split(".")[1] as keyof typeof form.contactAddress;
      setForm((prev) => ({
        ...prev,
        contactAddress: { ...prev.contactAddress, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value } as any));
    }
  };

  const save = () => onSave(form as any);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Brand Name"
            name="brandname"
            value={form.brandname}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            name="contactAddress.city"
            value={form.contactAddress.city}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="State"
            name="contactAddress.state"
            value={form.contactAddress.state}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Pincode"
            name="contactAddress.pincode"
            value={form.contactAddress.pincode}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Address Line 1"
            name="contactAddress.address1"
            value={form.contactAddress.address1}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address Line 2"
            name="contactAddress.address2"
            value={form.contactAddress.address2}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(GeneralSettings);
