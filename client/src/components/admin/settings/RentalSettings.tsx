"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { Save, Edit, Add } from "@mui/icons-material";

const RentalSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    serviceCities: [] as string[],
    minRentalHours: 0,
    maxPassengersDefault: 0,
  });
  const [newCity, setNewCity] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        serviceCities: settings.rental?.serviceCities || [],
        minRentalHours: settings.rental?.minRentalHours || 0,
        maxPassengersDefault: settings.rental?.maxPassengersDefault || 0,
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

  const addCity = () => {
    if (!newCity.trim() || form.serviceCities.includes(newCity.trim())) return;
    setForm((prev) => ({
      ...prev,
      serviceCities: [...prev.serviceCities, newCity.trim()],
    }));
    setNewCity("");
  };

  const removeCity = (cityToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      serviceCities: prev.serviceCities.filter((city) => city !== cityToRemove),
    }));
  };

  const save = () => {
    onSave({
      rental: {
        serviceCities: form.serviceCities,
        minRentalHours: form.minRentalHours,
        maxPassengersDefault: form.maxPassengersDefault,
      },
    } as any);
    setEditing(false);
  };

  const cancel = () => {
    setForm({
      serviceCities: settings.rental?.serviceCities || [],
      minRentalHours: settings.rental?.minRentalHours || 0,
      maxPassengersDefault: settings.rental?.maxPassengersDefault || 0,
    });
    setNewCity("");
    setEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCity();
    }
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
        <Typography variant="subtitle1">Rental Service Settings</Typography>
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

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Minimum Rental Hours"
            name="minRentalHours"
            type="number"
            value={form.minRentalHours}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            inputProps={{ min: 0, step: 1 }}
            helperText="Minimum hours required for rental"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Default Max Passengers"
            name="maxPassengersDefault"
            type="number"
            value={form.maxPassengersDefault}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            inputProps={{ min: 1, step: 1 }}
            helperText="Default maximum passengers for buses"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Service Cities
        </Typography>
        {editing && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Add city name"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              onKeyPress={handleKeyPress}
              helperText="Press Enter to add city"
            />
            <Button
              variant="contained"
              onClick={addCity}
              startIcon={<Add />}
              disabled={
                !newCity.trim() || form.serviceCities.includes(newCity.trim())
              }
            >
              Add
            </Button>
          </Stack>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {form.serviceCities.map((city, index) => (
            <Chip
              key={`${city}-${index}`}
              label={city}
              onDelete={editing ? () => removeCity(city) : undefined}
              color="primary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>

      {!editing && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {form.serviceCities.length === 0
            ? "No service cities configured. Add cities where rental services are available."
            : `Service available in ${form.serviceCities.length} cities.`}
        </Typography>
      )}
    </Box>
  );
};

export default RentalSettings;
