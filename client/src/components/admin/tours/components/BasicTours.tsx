"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BasicTourInterface, TourTravelsActionsType } from "@/types/tour.types";
import { useCreateTours } from "@/contexts/TourTravelProvider";
import { post } from "@/lib/service";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { getTourDayNight } from "@/utils/common";
import { ArrowForward, Save } from "@mui/icons-material";

import { NumberTextField } from "@/components/common";
import { formatDate, formatTime, formatDateTime } from "@/utils/dateFormat";
const getBasicDefaults = (
  input?: Partial<BasicTourInterface>
): BasicTourInterface => ({
  tourname: input?.tourname ?? "",
  minfair: input?.minfair ?? 0,
  startDate: input?.startDate ?? null,
  endDate: input?.endDate ?? null,
  capacity: input?.capacity ?? 0,
  inclusive: input?.inclusive ?? [],
  type: input?.type ?? [],
  days: input?.days,
  night: input?.night,
  description: input?.description,
});

export const BasicTour: React.FC = () => {
  const { state, dispatch, isEdit } = useCreateTours();
  const [basicDetails, setBasicDetails] = useState<BasicTourInterface>(
    getBasicDefaults(state.tours || {})
  );

  useEffect(() => {
    setBasicDetails(getBasicDefaults(state.tours || {}));
  }, [state]);

  useEffect(() => {
    if (basicDetails.startDate && basicDetails.endDate) {
      const { days, nights } = getTourDayNight(
        basicDetails.startDate,
        basicDetails.endDate
      );
      setBasicDetails((prev) => ({ ...prev, days, night: nights }));
    }
  }, [basicDetails.startDate, basicDetails.endDate]);

  const handleOnchange = useCallback(
    (name: keyof BasicTourInterface, value: any) => {
      setBasicDetails((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("image", file);
        const response = await post<any>("images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if ((response as any).data?.data) {
          setBasicDetails((prev) => ({
            ...prev,
            image: {
              url: (response as any).data.data?.secure_url,
              id: (response as any).data.data?.public_id,
            },
          }));
        }
      } catch {}
    },
    []
  );

  const calculateDaysNights = useMemo(() => {
    if (basicDetails.startDate && basicDetails.endDate) {
      const { label } = getTourDayNight(
        basicDetails.startDate,
        basicDetails.endDate
      );
      return label;
    }
    return "0 Days / 0 Nights";
  }, [basicDetails.startDate, basicDetails.endDate]);

  const handleToggleChange = (
    index: number,
    value: string,
    key: "inclusive" | "type"
  ) => {
    const data = basicDetails[key];
    const tempData = data.includes(value)
      ? data.filter((v) => v !== value)
      : [...data, value];
    setBasicDetails((prev) => ({ ...prev, [key]: tempData }));
  };

  const onNext = () => {
    dispatch({
      type: TourTravelsActionsType.BASIC_DETAILS,
      payload: basicDetails,
    });
  };

  const disableBtn = useMemo(() => {
    const { tourname, minfair, capacity, startDate, endDate, inclusive, type } =
      basicDetails;
    return !(
      tourname &&
      minfair &&
      capacity &&
      startDate &&
      endDate &&
      inclusive?.length > 0 &&
      type?.length > 0
    );
  }, [basicDetails]);

  return (
    <div className="container mx-auto p-6">
      <section className="bg-white p-6 rounded-lg shadow-md mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <TextField
              label="Tour Name (*)"
              fullWidth
              value={basicDetails.tourname}
              onChange={(e) => handleOnchange("tourname", e.target.value)}
              size="small"
            />
          </div>
          <div>
            <NumberTextField
                label="Capacity (*)"
              
              fullWidth
              size="small"
              value={basicDetails.capacity}
              onChange={(e) =>
                handleOnchange("capacity", Number(e.target.value))
              }
            />
          </div>
          <div>
            <NumberTextField
                label="Minimum Fare (*)"
              fullWidth
              size="small"
              value={basicDetails.minfair}
              onChange={(e) =>
                handleOnchange("minfair", Number(e.target.value))
              }
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block font-semibold mb-1">Upload Logo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {basicDetails.image?.url && (
              <div className="mt-4">
                <img
                  src={basicDetails.image.url}
                  alt="Tour Logo"
                  className="w-32 h-32 object-cover rounded-md border"
                  crossOrigin="anonymous"
                />
              </div>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <TextField
              label="Description (*)"
              fullWidth
              multiline
              minRows={4}
              value={basicDetails.description || ""}
              onChange={(e) => handleOnchange("description", e.target.value)}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <Typography variant="subtitle2" gutterBottom>
              <b> Select Inclusive (*)</b>
            </Typography>
            {[
              "Transfer",
              "Flight",
              "Sightseeing",
              "Hotel",
              "Meal",
              "Bus",
              "Guide",
            ].map((facility, index) => (
              <FormControlLabel
                key={facility}
                control={
                  <Checkbox
                    checked={basicDetails.inclusive.includes(facility)}
                    onChange={(e) =>
                      handleToggleChange(index, e.target.value, "inclusive")
                    }
                    value={facility}
                    size="small"
                  />
                }
                label={facility}
              />
            ))}
          </div>
          <div className="col-span-1 md:col-span-2">
            <Typography variant="subtitle2" gutterBottom>
              <b> Tour Type (*)</b>
            </Typography>
            {[
              "Family",
              "Adventure",
              "Devotional",
              "Group",
              "Hills",
              "Budget",
            ].map((facility, index) => (
              <FormControlLabel
                key={facility}
                control={
                  <Checkbox
                    checked={basicDetails.type.includes(facility)}
                    onChange={(e) =>
                      handleToggleChange(index, e.target.value, "type")
                    }
                    value={facility}
                    size="small"
                  />
                }
                label={facility}
              />
            ))}
          </div>
          <div>
            <TextField
              type="datetime-local"
              label="Start Date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={
                basicDetails.startDate
                  ? new Date(basicDetails.startDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => handleOnchange("startDate", e.target.value)}
            />
          </div>
          <div>
            <TextField
              type="datetime-local"
              label="Return Date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={
                basicDetails.endDate
                  ? new Date(basicDetails.endDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => handleOnchange("endDate", e.target.value)}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block font-semibold mb-1">Duration</label>
            <p>{calculateDaysNights}</p>
          </div>
        </div>
        <Box display="flex" justifyContent="space-between" mt={3}>
          <div />
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
              onClick={onNext}
              disabled={disableBtn}
            >
              Next
            </Button>
          </Box>
        </Box>
      </section>
    </div>
  );
};
