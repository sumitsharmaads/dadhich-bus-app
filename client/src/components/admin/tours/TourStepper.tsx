"use client";

import React, { useMemo } from "react";
import { Box, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { useCreateTours } from "@/contexts/TourTravelProvider";
import DummyFallback from "@/components/common/DummyFallback";
import { BasicTour } from "./components/BasicTours";
import { ToursSourcePlaces } from "./components/ToursSourcePlaces";
import { ItenarySections } from "./components/ItenarySections";
import { AddCaptinBus } from "./components/AddCaptinBus";
import AddSEODetails from "./components/AddSEODetails";
import FinalizeTours from "./components/FinalizeTours";

const TourStepper: React.FC = () => {
  const { state, isLoading } = useCreateTours();

  const steps = useMemo(
    () => [
      { title: "Add needful Informations", component: <BasicTour /> },
      { title: "Add Basic Informations", component: <ToursSourcePlaces /> },
      { title: "Add Itenary", component: <ItenarySections /> },
      { title: "Add Bus or Captin", component: <AddCaptinBus /> },
      { title: "Add SEO", component: <AddSEODetails /> },
      { title: "Check and Save details", component: <FinalizeTours /> },
    ],
    []
  );

  if (isLoading) {
    return <DummyFallback message="Loading tour details..." />;
  }

  return (
    <Box>
      <Stepper activeStep={state.steps} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.title}>
            <StepLabel>{step.title}</StepLabel>
            <StepContent>{step.component}</StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default TourStepper;
