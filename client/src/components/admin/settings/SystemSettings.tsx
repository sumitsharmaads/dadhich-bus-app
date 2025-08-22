"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { Save, Edit, Warning } from "@mui/icons-material";

const SystemSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    isMaintenanceMode: false,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        isMaintenanceMode: settings.flags?.isMaintenanceMode || false,
      });
    }
  }, [settings]);

  const handleSwitchChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [name]: event.target.checked }));
    };

  const save = () => {
    onSave({
      flags: {
        isMaintenanceMode: form.isMaintenanceMode,
      },
    } as any);
    setEditing(false);
  };

  const cancel = () => {
    setForm({
      isMaintenanceMode: settings.flags?.isMaintenanceMode || false,
    });
    setEditing(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1">System Settings</Typography>
        {!editing ? (
          <Button
            startIcon={<Edit />}
            onClick={() => setEditing(true)}
            size="small"
          >
            Edit
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={cancel} size="small">
              Cancel
            </Button>
            <Button
              startIcon={<Save />}
              onClick={save}
              variant="contained"
              size="small"
            >
              Save
            </Button>
          </Box>
        )}
      </Box>

      {form.isMaintenanceMode && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 2 }}>
          <strong>Maintenance Mode is Active!</strong> The website is currently
          in maintenance mode and may not be accessible to regular users.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={form.isMaintenanceMode}
                onChange={handleSwitchChange("isMaintenanceMode")}
                disabled={!editing}
                color="warning"
              />
            }
            label="Maintenance Mode"
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 4, mt: 1 }}
          >
            When enabled, the website will show a maintenance page to regular
            users. Admin users can still access the system normally.
          </Typography>
        </Grid>
      </Grid>

      {!editing && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {form.isMaintenanceMode
            ? "System is currently in maintenance mode."
            : "System is running normally."}
        </Typography>
      )}
    </Box>
  );
};

export default SystemSettings;
