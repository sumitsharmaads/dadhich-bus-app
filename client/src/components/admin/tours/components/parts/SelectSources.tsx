"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, ExpandMore, Add, Save } from "@mui/icons-material";
import { post } from "@/lib/service";
import { debounce } from "lodash";

interface Location {
  _id: string;
  name: string;
  state: string;
}
export interface SourceItem {
  location: Location | null;
  fare: number;
  onBoarding: string[];
}

interface Props {
  value: SourceItem[];
  onSave: (sources: SourceItem[]) => void;
}

const SelectSourcesDynamic: React.FC<Props> = ({ value, onSave }) => {
  const [sources, setSources] = useState<SourceItem[]>(value);
  const [cityOptions, setCityOptions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [expanded, setExpanded] = useState<number | false>(false);
  const [boardingInputs, setBoardingInputs] = useState<Record<number, string>>(
    {}
  );

  const fetchCities = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) return;
        setLoading(true);
        try {
          const res = await post<{ result: { result: Location[] } }>(
            "places/cities",
            { condition: { search: { name: query } } }
          );
          setCityOptions(res.data?.result?.result || []);
        } catch (err) {
          console.error("Failed to fetch cities", err);
        } finally {
          setLoading(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    fetchCities(searchText);
    return () => fetchCities.cancel();
  }, [searchText, fetchCities]);

  const handleAddSource = () => {
    const defaultFare = (window as any)?.__TOUR_MIN_FARE__ ?? 0;
    const newSources = [
      ...sources,
      { location: null, fare: defaultFare, onBoarding: [] },
    ];
    setSources(newSources);
    setExpanded(newSources.length - 1);
  };

  const handleRemoveSource = (index: number) => {
    const updated = sources.filter((_, i) => i !== index);
    setSources(updated);
    if (expanded === index) setExpanded(false);
  };

  const handleLocationChange = (index: number, location: Location | null) => {
    const updated = [...sources];
    updated[index].location = location;
    setSources(updated);
    setSearchText("");
  };

  const handleFareChange = (index: number, fare: number) => {
    const updated = [...sources];
    updated[index].fare = fare;
    setSources(updated);
  };

  const handleAddBoarding = (index: number, value: string) => {
    if (!value.trim()) return;
    const updated = [...sources];
    if (!updated[index].onBoarding.includes(value.trim())) {
      updated[index].onBoarding.push(value.trim());
      setSources(updated);
    }
    setBoardingInputs((prev) => ({ ...prev, [index]: "" }));
  };

  const handleRemoveBoarding = (index: number, bIndex: number) => {
    const updated = [...sources];
    updated[index].onBoarding.splice(bIndex, 1);
    setSources(updated);
  };

  const handleSaveAll = () => onSave(sources);

  return (
    <Box bgcolor="#fff">
      <Typography variant="subtitle1" mb={2}>
        <b>Source Locations (*)</b>
      </Typography>
      {sources.map((source, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={() => setExpanded(expanded === index ? false : index)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography fontWeight={600}>
                {source.location
                  ? `${source.location.name}, ${source.location.state}`
                  : `Source #${index + 1}`}
              </Typography>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSource(index);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Autocomplete
              options={cityOptions}
              getOptionLabel={(option) => `${option.name}, ${option.state}`}
              isOptionEqualToValue={(o, v) => o._id === v._id}
              onInputChange={(_, value) => setSearchText(value)}
              onChange={(_, value) => handleLocationChange(index, value)}
              value={source.location}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  variant="outlined"
                  margin="dense"
                  size="small"
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
            <TextField
              fullWidth
              label="Fare"
              type="number"
              value={source.fare == 0 ? "" : source.fare}
              onChange={(e) =>
                handleFareChange(
                  index,
                  e.target.value ? parseFloat(e.target.value) : 0
                )
              }
              variant="outlined"
              margin="dense"
              size="small"
              sx={{ mt: 1 }}
            />
            <TextField
              fullWidth
              label="Add Boarding Point"
              value={boardingInputs[index] || ""}
              onChange={(e) =>
                setBoardingInputs((prev) => ({
                  ...prev,
                  [index]: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddBoarding(index, boardingInputs[index] || "");
                }
              }}
              variant="outlined"
              margin="dense"
              size="small"
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Enter ↵</InputAdornment>
                ),
              }}
            />
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              {source.onBoarding.map((bp, bIndex) => (
                <Chip
                  key={bIndex}
                  label={bp}
                  onDelete={() => handleRemoveBoarding(index, bIndex)}
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      <Box display="flex" gap={2} justifyContent="flex-end" mt={2} mb={2}>
        <Button
          startIcon={<Add />}
          onClick={handleAddSource}
          variant="outlined"
          size="small"
        >
          Add Source
        </Button>
        <Button
          startIcon={<Save />}
          onClick={handleSaveAll}
          variant="contained"
          color="primary"
          size="small"
        >
          Save Sources
        </Button>
      </Box>
    </Box>
  );
};

export default SelectSourcesDynamic;
