"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Grid, TextField } from "@mui/material";

const SocialMediaSettings: React.FC<{
  socialLinks: WebsiteInfoType["socialLinks"];
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ socialLinks, onSave }) => {
  const [links, setLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    phone: "",
  });

  useEffect(() => {
    setLinks({
      facebook: socialLinks?.facebook || "",
      instagram: socialLinks?.instagram || "",
      twitter: socialLinks?.twitter || "",
      phone: socialLinks?.phone || "",
    });
  }, [socialLinks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Facebook"
            name="facebook"
            value={links.facebook}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Instagram"
            name="instagram"
            value={links.instagram}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Twitter"
            name="twitter"
            value={links.twitter}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            name="phone"
            value={links.phone}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => onSave({ socialLinks: links } as any)}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(SocialMediaSettings);
