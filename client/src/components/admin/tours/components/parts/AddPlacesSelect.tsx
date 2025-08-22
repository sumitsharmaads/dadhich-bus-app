"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { post } from "@/lib/service";
import { debounce } from "lodash";

export interface Location {
  _id: string;
  name: string;
  state: string;
}

interface Props {
  value: Location[];
  onSave: (places: Location[]) => void;
}

const AddPlacesSelect: React.FC<Props> = ({ value, onSave }) => {
  const [selectedPlaces, setSelectedPlaces] = useState<Location[]>(value);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) return;
        try {
          setLoading(true);
          const res = await post<{ result: { result: Location[] } }>(
            "places/cities",
            { condition: { search: { name: query } } }
          );
          setOptions(res.data.result.result || []);
        } catch (error) {
          console.error("Failed to fetch places:", error);
        } finally {
          setLoading(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    fetchPlaces(inputValue);
    return () => fetchPlaces.cancel();
  }, [inputValue, fetchPlaces]);

  const handleSave = () => onSave(selectedPlaces);

  return (
    <Box>
      <Typography variant="subtitle1" mb={1}>
        <b>Select Places (*)</b>
      </Typography>
      <Autocomplete
        multiple
        options={options}
        value={selectedPlaces}
        onChange={(_, newValue) => setSelectedPlaces(newValue)}
        inputValue={inputValue}
        onInputChange={(_, newInput) => setInputValue(newInput)}
        getOptionLabel={(option) => `${option.name}, ${option.state}`}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        filterSelectedOptions
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search places"
            placeholder="Start typing..."
            fullWidth
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={18} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save Places
        </Button>
      </Box>
    </Box>
  );
};

export default AddPlacesSelect;
