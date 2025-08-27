"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Grid, TextField } from "@mui/material";

const GeneralSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    brandName: "",
    phone: "",
    address: {
      city: "",
      state: "",
      country: "",
      pincode: "",
      address1: "",
      address2: "",
    },
  });

  useEffect(() => {
    if (settings) {
      setForm({
        brandName: settings.branding?.brandName || "",
        phone: settings.contact?.phone || "",
        address: {
          city: settings.contact?.address?.city ?? "",
          state: settings.contact?.address?.state ?? "",
          country: settings.contact?.address?.country ?? "",
          pincode: settings.contact?.address?.pincode ?? "",
          address1: settings.contact?.address?.address1 ?? "",
          address2: settings.contact?.address?.address2 ?? "",
        },
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1] as keyof typeof form.address;
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value } as any));
    }
  };

  const save = () =>
    onSave({
      branding: { brandName: form.brandName },
      contact: { phone: form.phone, address: form.address },
    } as any);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Brand Name"
            name="brandName"
            value={form.brandName}
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
            name="address.city"
            value={form.address.city}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="State"
            name="address.state"
            value={form.address.state}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            name="address.country"
            value={form.address.country}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Pincode"
            name="address.pincode"
            value={form.address.pincode}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address Line 1"
            name="address.address1"
            value={form.address.address1}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address Line 2"
            name="address.address2"
            value={form.address.address2}
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
