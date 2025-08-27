"use client";

import React, { useEffect } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axiosInstance from "@/lib/api/axiosInstance";

const LogoSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [logo, setLogo] = React.useState(
    settings.branding?.logo || { id: "", url: "" }
  );
  const [preLogo, setPreLogo] = React.useState(
    settings.branding?.preLogo || { id: "", url: "" }
  );

  const save = () => onSave({ branding: { logo, preLogo } } as any);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "logo" | "preLogo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Upload directly to Cloudinary through our media API - no temporary storage
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "logos");

      const response = await axiosInstance.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success && response.data.data) {
        // Store only the Cloudinary data - no temp files, no blob URLs
        const cloudinaryImage = {
          id: response.data.data.public_id,
          url: response.data.data.secure_url,
        };

        if (kind === "logo") {
          setLogo(cloudinaryImage);
        } else {
          setPreLogo(cloudinaryImage);
        }
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      e.target.value = "";
    }
  };

  useEffect(() => {
    setLogo(settings.branding?.logo || { id: "", url: "" });
    setPreLogo(settings.branding?.preLogo || { id: "", url: "" });
  }, [settings.branding]);

  return (
    <Box>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle1">Logo URL</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              size="small"
              fullWidth
              value={logo?.url || ""}
              onChange={(e) => setLogo({ ...logo, url: e.target.value })}
            />
            <Button component="label" variant="outlined">
              Upload
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "logo")}
              />
            </Button>
          </Stack>
        </Box>
        <Box>
          <Typography variant="subtitle1">Preloader Logo URL</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              size="small"
              fullWidth
              disabled
              value={preLogo?.url || ""}
              onChange={(e) => setPreLogo({ ...preLogo, url: e.target.value })}
            />
            {/* <Button component="label" variant="outlined">
              Upload
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "preLogo")}
              />
            </Button> */}
          </Stack>
        </Box>
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(LogoSettings);
