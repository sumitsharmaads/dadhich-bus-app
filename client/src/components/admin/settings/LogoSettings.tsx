"use client";

import React, { useEffect } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { settingsService } from "@/lib/api/services/settings.service";

const LogoSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [logo, setLogo] = React.useState(settings.logo || { id: "", url: "" });
  const [preLogo, setPreLogo] = React.useState(
    settings.preLogo || { id: "", url: "" }
  );

  const save = () => onSave({ logo, preLogo } as any);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "logo" | "preLogo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await settingsService.uploadImage({ image: file });
      if (res.success && res.data?.secure_url && res.data?.public_id) {
        if (kind === "logo") {
          setLogo({ id: res.data.public_id, url: res.data.secure_url });
        } else {
          setPreLogo({ id: res.data.public_id, url: res.data.secure_url });
        }
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      e.target.value = "";
    }
  };

  useEffect(() => {
    setLogo(settings.logo || { id: "", url: "" });
    setPreLogo(settings.preLogo || { id: "", url: "" });
  }, [settings]);
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
