import {
  BasicTourInterface,
  Captin,
  CaptinType,
  ItenaryTourInterface,
  SEOInformtionType,
  SourceType,
  TourBus,
  TourBusType,
  TourTravelsActionsType,
  TourTravelType,
} from "@/types/tour.types";

export const initialToursState: TourTravelType = {
  tours: null,
  steps: 0,
};

export type TourTravelProviderActions =
  | { type: TourTravelsActionsType.BASIC_DETAILS; payload: BasicTourInterface }
  | { type: TourTravelsActionsType.SOURCE_DETAILS; payload: SourceType }
  | { type: TourTravelsActionsType.ITENARY; payload: ItenaryTourInterface }
  | {
      type: TourTravelsActionsType.BUS_CAPTIN;
      payload: { bus?: TourBus; captin?: Captin };
    }
  | { type: TourTravelsActionsType.SEO; payload: SEOInformtionType }
  | { type: TourTravelsActionsType.BACK }
  | { type: TourTravelsActionsType.NEXT }
  | { type: TourTravelsActionsType.GET_TOURS; payload: TourTravelType["tours"] }
  | { type: TourTravelsActionsType.UPDATE_ID; payload?: string };

export function createToursReducer(
  state: TourTravelType,
  actions: TourTravelProviderActions
): TourTravelType {
  switch (actions.type) {
    case TourTravelsActionsType.BASIC_DETAILS: {
      const { steps, tours } = state;
      return {
        tours: { ...(tours || {}), ...actions.payload },
        steps: steps + 1,
      };
    }
    case TourTravelsActionsType.BACK: {
      return { ...state, steps: Math.max(0, state.steps - 1) };
    }
    case TourTravelsActionsType.SOURCE_DETAILS: {
      const { steps, tours } = state;
      return {
        tours: { ...(tours || {}), ...actions.payload },
        steps: steps + 1,
      };
    }
    case TourTravelsActionsType.ITENARY: {
      const { steps, tours } = state;
      return {
        tours: { ...(tours || {}), ...actions.payload },
        steps: steps + 1,
      };
    }
    case TourTravelsActionsType.BUS_CAPTIN: {
      const { steps, tours } = state;
      return {
        tours: { ...(tours || {}), ...actions.payload },
        steps: steps + 1,
      };
    }
    case TourTravelsActionsType.SEO: {
      const { steps, tours } = state;
      return {
        tours: { ...(tours || {}), ...actions.payload },
        steps: steps + 1,
      };
    }
    case TourTravelsActionsType.NEXT: {
      return { ...state, steps: state.steps + 1 };
    }
    case TourTravelsActionsType.GET_TOURS: {
      return { ...state, tours: actions.payload || null };
    }
    case TourTravelsActionsType.UPDATE_ID: {
      return {
        ...state,
        tours: { ...(state.tours || {}), _id: actions.payload },
      };
    }
    default:
      return state;
  }
}
