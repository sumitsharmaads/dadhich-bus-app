"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { Button, Grid, TextField, Box } from "@mui/material";
import { ArrowBack, ArrowForward, Save } from "@mui/icons-material";
import { SEOInformtionType, TourTravelsActionsType } from "@/types/tour.types";
import { useCreateTours } from "@/contexts/TourTravelProvider";

const AddSEODetails: React.FC = () => {
  const { state, dispatch } = useCreateTours();
  const [seo, setSeo] = useState<SEOInformtionType["seo"]>(
    ((state.tours as any)?.seo as any) || { title: "" }
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSeo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isDisable = useMemo(
    () => !(seo?.title && seo?.keywords && seo?.description),
    [seo]
  );

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Add or Edit SEO Details
      </h1>
      <div className="grid gap-6">
        <section className="p-6 rounded-lg shadow-md">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={seo?.title || ""}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={seo?.description || ""}
                onChange={handleChange}
                variant="outlined"
                size="small"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Keywords"
                name="keywords"
                value={seo?.keywords || ""}
                onChange={handleChange}
                variant="outlined"
                size="small"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
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
              <Button
                startIcon={<Save />}
                variant="contained"
                color="success"
                size="small"
                onClick={() => dispatch({ type: TourTravelsActionsType.NEXT })}
              >
                SKIP
              </Button>
              <Button
                endIcon={<ArrowForward />}
                variant="outlined"
                size="small"
                onClick={() =>
                  dispatch({
                    type: TourTravelsActionsType.SEO,
                    payload: { seo },
                  })
                }
                disabled={isDisable}
              >
                Next
              </Button>
            </Box>
          </Box>
        </section>
      </div>
    </div>
  );
};

export default AddSEODetails;
