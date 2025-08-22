"use client";

import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import {
  Add,
  ArrowBack,
  ArrowForward,
  ExpandMore,
  Save,
} from "@mui/icons-material";
import {
  Itenary,
  ItenaryTourInterface,
  TourTravelsActionsType,
} from "@/types/tour.types";
import { useCreateTours } from "@/contexts/TourTravelProvider";

type EditableItenaryField = "title" | "shortDescription" | "order";

export const ItenarySections: React.FC = () => {
  const { state, dispatch, isEdit } = useCreateTours();
  const [itenaries, setItenaries] = useState<ItenaryTourInterface["itenary"]>(
    (state.tours as any)?.itenary || []
  );
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false);
  const [sightseeingInputs, setSightseeingInputs] = useState<
    Record<number, string>
  >({});

  const handleAccordionChange = (index: number) => {
    setExpandedIndex(expandedIndex === index ? false : index);
  };

  const handleAddItenary = () => {
    const order = itenaries?.length;
    const lastIndex =
      typeof expandedIndex === "number" ? expandedIndex : itenaries.length - 1;
    const copyFrom = lastIndex >= 0 ? itenaries[lastIndex] : undefined;
    if (copyFrom && copyFrom.title && copyFrom.shortDescription) {
      setItenaries([...itenaries, { ...copyFrom, order: order + 1 }]);
    } else {
      setItenaries([
        ...itenaries,
        {
          title: "",
          shortDescription: "",
          toggles: [],
          sightseeing: [],
          order: order + 1,
        },
      ]);
    }
  };

  const handleChange = <K extends EditableItenaryField>(
    index: number,
    field: K,
    value: Itenary[K]
  ) => {
    const updated = [...itenaries];
    (updated[index] as any)[field] = value as any;
    setItenaries(updated);
  };

  const handleToggleChange = (index: number, value: string) => {
    setItenaries((prev) =>
      prev.map((itenary, i) => {
        if (i !== index) return itenary;
        const toggles = itenary.toggles.includes(value)
          ? itenary.toggles.filter((v) => v !== value)
          : [...itenary.toggles, value];
        return { ...itenary, toggles };
      })
    );
  };

  const handleAddSightseeing = (index: number) => {
    const value = sightseeingInputs[index]?.trim();
    if (!value) return;
    const updated = [...itenaries];
    if (!(updated[index].sightseeing || []).includes(value)) {
      updated[index].sightseeing = [
        ...(updated[index].sightseeing || []),
        value,
      ];
      setItenaries(updated);
    }
    setSightseeingInputs((prev) => ({ ...prev, [index]: "" }));
  };

  const handleRemoveSightseeing = (index: number, sIndex: number) => {
    const updated = [...itenaries];
    const list = updated[index].sightseeing || [];
    updated[index].sightseeing = [
      ...list.slice(0, sIndex),
      ...list.slice(sIndex + 1),
    ];
    setItenaries(updated);
  };

  const disableBtn = useMemo(() => {
    const expected = (state.tours as any)?.days || 1;
    if (itenaries.length !== expected) return true;
    return itenaries.some(
      (it) => !it.title || !(it.shortDescription && it.shortDescription.trim())
    );
  }, [itenaries, state.tours]);

  return (
    <div>
      <Typography variant="subtitle2" color="textSecondary" mb={1}>
        Based on your selection of{" "}
        <b>
          {(state.tours as any)?.days || 1} Days /{" "}
          {(state.tours as any)?.night || 0} Night
        </b>
        , please add itinerary details for each day of the tour.
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle2">
          <b>Itinerary (*) </b>
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAddItenary}
          size="small"
          disabled={itenaries.length >= ((state.tours as any)?.days || 1)}
        >
          Add Itinerary
        </Button>
      </Box>

      {itenaries.map((itenary, index) => (
        <Accordion
          key={index}
          expanded={expandedIndex === index}
          onChange={() => handleAccordionChange(index)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">Day {index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  size="small"
                  value={itenary.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  value={itenary.shortDescription ?? ""}
                  onChange={(e) =>
                    handleChange(index, "shortDescription", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  <b>Select Facilities</b>
                </Typography>
                {[
                  "Transfer",
                  "Meals",
                  "Sightseeing",
                  "Stay",
                  "Photography",
                ].map((f) => (
                  <FormControlLabel
                    key={f}
                    control={
                      <Checkbox
                        size="small"
                        checked={itenary.toggles.includes(f)}
                        onChange={() => handleToggleChange(index, f)}
                      />
                    }
                    label={f}
                  />
                ))}
              </Grid>
              {itenary.toggles.includes("Sightseeing") && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    <b>Sightseeing Points</b>
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <TextField
                      size="small"
                      label="Enter sightseeing"
                      fullWidth
                      value={sightseeingInputs[index] || ""}
                      onChange={(e) =>
                        setSightseeingInputs((prev) => ({
                          ...prev,
                          [index]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSightseeing(index);
                        }
                      }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAddSightseeing(index)}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box mt={1}>
                    {(itenary?.sightseeing || []).map((s, sIndex) => (
                      <Box
                        key={sIndex}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        bgcolor="#f1f1f1"
                        p={1}
                        borderRadius={1}
                        mb={1}
                      >
                        <Typography>{s}</Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveSightseeing(index, sIndex)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          size="small"
          onClick={() => dispatch({ type: TourTravelsActionsType.BACK })}
        >
          Back
        </Button>
        <Box display="flex" gap={1}>
          {isEdit && (
            <Button
              startIcon={<Save />}
              variant="contained"
              color="success"
              size="small"
              onClick={() => dispatch({ type: TourTravelsActionsType.NEXT })}
            >
              SKIP
            </Button>
          )}
          <Button
            endIcon={<ArrowForward />}
            variant="outlined"
            size="small"
            onClick={() =>
              dispatch({
                type: TourTravelsActionsType.ITENARY,
                payload: { itenary: itenaries },
              })
            }
            disabled={disableBtn}
          >
            Next
          </Button>
        </Box>
      </Box>
    </div>
  );
};
