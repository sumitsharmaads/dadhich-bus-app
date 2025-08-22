"use client";

import React from "react";
import { useParams } from "next/navigation";
import TourForm from "@/components/admin/tours/TourForm";

const EditTourPage: React.FC = () => {
  const params = useParams();
  const tourId = params.id as string;

  return <TourForm mode="edit" tourId={tourId} />;
};

export default EditTourPage;
