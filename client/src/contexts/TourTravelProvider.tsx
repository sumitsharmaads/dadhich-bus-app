"use client";

import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { TourTravelsActionsType, TourTravelType } from "@/types/tour.types";
import {
  createToursReducer,
  initialToursState,
  TourTravelProviderActions,
} from "@/contexts/TourTravelProviderReducer";
import { useParams } from "next/navigation";
import { get } from "@/lib/service";

export type CreateTourContextProps = {
  state: TourTravelType;
  dispatch: Dispatch<TourTravelProviderActions>;
  isEdit: boolean;
  isPusblished: boolean;
  fetchTour?: () => Promise<void>;
  isLoading?: boolean;
};

const TourTravelContext = createContext<CreateTourContextProps>({
  state: initialToursState,
  dispatch: () => undefined,
  isEdit: false,
  isPusblished: false,
  fetchTour: async () => undefined,
  isLoading: false,
});

export const TourTravelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const params = useParams();
  const id = (params as any)?.id as string | undefined;
  const [state, dispatch] = useReducer(
    createToursReducer,
    initialToursState
  ) as [TourTravelType, Dispatch<TourTravelProviderActions>];
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchTour = async () => {
    setIsLoading(true);
    try {
      const response = await get<{ result: TourTravelType["tours"] }>(
        `tours/${id || state?.tours?._id}`
      );
      if (response?.data?.result) {
        dispatch({
          type: TourTravelsActionsType.GET_TOURS,
          payload: { ...response.data.result },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id && id.length > 9) {
      void fetchTour();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isEdit = useMemo(() => Boolean(state.tours?._id), [state?.tours?._id]);
  const isPusblished = useMemo(() => Boolean(), []);

  return (
    <TourTravelContext.Provider
      value={{ state, dispatch, isEdit, isPusblished, fetchTour, isLoading }}
    >
      {children}
    </TourTravelContext.Provider>
  );
};

export const useCreateTours = () => useContext(TourTravelContext);
