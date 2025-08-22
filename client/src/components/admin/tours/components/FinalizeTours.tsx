"use client";

import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCreateTours } from "@/contexts/TourTravelProvider";
import { ArrowBack, Save } from "@mui/icons-material";
import { TourTravelsActionsType, TourTravelType } from "@/types/tour.types";
import { post, put } from "@/lib/service";
import axiosInstance from "@/lib/api/axiosInstance";
import { successPopup } from "@/utils/errors/alerts";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const FinalizeTours: React.FC = () => {
  const { state, dispatch, isEdit, isPusblished } = useCreateTours();
  const router = useRouter();
  const tour = state.tours as TourTravelType["tours"];
  if (!tour) return null;

  const saveChanges = async () => {
    try {
      if (isEdit) {
        const response = await put<{
          success: boolean;
          result: TourTravelType["tours"];
        }>(`tours/${(state.tours as any)?._id}`, tour);
        if ((response as any).data?.success && (response as any).data?.result) {
          successPopup("Updated data sucessfully");
          router.push("/admin/tours");
        }
      } else {
        const response = await post<{
          success: boolean;
          result: TourTravelType["tours"];
        }>("tours", tour);
        if ((response as any).data?.success && (response as any).data?.result) {
          dispatch({
            type: TourTravelsActionsType.UPDATE_ID,
            payload: (response as any).data.result?._id,
          });
          successPopup("Saved data sucessfully");
          router.push("/admin/tours");
        }
      }
    } catch (error) {}
  };

  const deleteTour = async () => {
    const response = await axiosInstance.delete(
      `tours/${(state.tours as any)?._id}`
    );
    if ((response as any).data?.success) {
      successPopup("Tour deleted sucessfully, navigating back to tours");
      router.push("/admin/tours");
    }
  };

  return (
    <Box className="w-full" p={2}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>1. Basic Tour Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <b>Tour Name:</b> {tour.tourname}
            </Grid>
            <Grid item xs={12} sm={6}>
              <b>Fare:</b> ₹{tour.minfair}
            </Grid>
            <Grid item xs={12} sm={6}>
              <b>Capacity:</b> {tour.capacity}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <b>Dates:</b>{" "}
                {dayjs(tour.startDate as any).format("DD MMM YYYY")} to{" "}
                {dayjs(tour.endDate as any).format("DD MMM YYYY")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <b>Description:</b> {tour.description}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>2. Itinerary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(tour as any).itenary?.map((item: any, index: number) => (
            <Box key={index} mb={2}>
              <Typography fontWeight={600}>
                Day {index + 1}: {item.title}
              </Typography>
              <Typography>{item.shortDescription}</Typography>
              <Typography>Options: {item?.toggles?.join(", ")}</Typography>
              <Typography>
                Sightseeing: {item?.sightseeing?.join(", ")}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>3. Source & Destinations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography fontWeight={600}>Sources:</Typography>
          {(tour as any)?.source?.map((src: any, i: number) => (
            <Box key={i} mb={1}>
              <Typography>
                📍 {src.location?.name}, {src.location?.state}
              </Typography>
              <Typography>Fare: ₹{src.fare}</Typography>
              <Typography>
                Boarding Points: {src.onBoarding.join(", ")}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography fontWeight={600}>Places:</Typography>
          {(tour as any)?.places?.map((place: any, i: number) => (
            <Typography key={i}>
              🏞️ {place.name}, {place.state}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>4. Bus & Captain Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {(tour as any)?.bus && (
            <>
              <Typography>
                <b>Bus Number:</b> {(tour as any).bus.busNumber}
              </Typography>
              <Typography>
                <b>Type:</b> {(tour as any).bus.busType}
              </Typography>
              <Typography>
                <b>Capacity:</b> {(tour as any).bus.seatingCapacity}
              </Typography>
            </>
          )}
          {(tour as any)?.captin && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography>
                <b>Captain:</b> {(tour as any).captin.fullname} (
                {(tour as any).captin.phone})
              </Typography>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>5. SEO Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <b>Title:</b> {(tour as any).seo?.title}
          </Typography>
          <Typography>
            <b>Description:</b> {(tour as any).seo?.description}
          </Typography>
          <Typography>
            <b>Keywords:</b> {(tour as any).seo?.keywords}
          </Typography>
        </AccordionDetails>
      </Accordion>

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
            onClick={saveChanges}
          >
            {isEdit ? "Update Changes" : "Save Changes"}
          </Button>
          {isEdit && !isPusblished && (
            <Button
              startIcon={<Save />}
              variant="contained"
              color="secondary"
              size="small"
              onClick={deleteTour}
            >
              Delete Tour
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinalizeTours;
