export type Itenary = {
  _id?: string;
  title: string;
  shortDescription?: string;
  toggles: string[];
  sightseeing?: string[];
  order?: number;
};

export interface Location {
  _id: string;
  name: string;
  state: string;
}

export interface SourceItem {
  location: Location | null;
  fare: number;
  onBoarding: string[];
}

export type TourBus = {
  _id: string;
  busNumber: string;
  busType: string;
  seatingCapacity: number;
  facilities: [];
};

export type Captin = {
  _id: string;
  fullname: string;
  phone: string;
};

export type BasicTourInterface = {
  _id?: string;
  tourname: string;
  image?: { url: string; id: string };
  description?: string;
  status?: number;
  startDate: string | null;
  endDate: string | null;
  minfair: number;
  inclusive: string[];
  type: string[];
  capacity: number;
  days?: number;
  night?: number;
};

export type SourceType = { source: SourceItem[]; places: Location[] };
export type ItenaryTourInterface = { itenary: Itenary[] };
export type TourBusType = { bus?: TourBus };
export type CaptinType = { captin?: Captin };
export type SEOInformtionType = {
  seo?: {
    _id?: string;
    description?: string;
    title?: string;
    keywords?: string;
  };
};

export type TourTravelType = {
  tours: Partial<
    BasicTourInterface &
      ItenaryTourInterface &
      SourceType &
      TourBusType &
      CaptinType &
      SEOInformtionType
  > | null;
  steps: number;
};

export enum TourTravelsActionsType {
  NEXT = "NEXT_STEP",
  BACK = "BACK_STEP",
  BASIC_DETAILS = "BASIC_DETAILS",
  SOURCE_DETAILS = "SOURCE",
  ITENARY = "ITENARY",
  BUS_CAPTIN = "BUS_CAPTIN",
  SEO = "SEO",
  GET_TOURS = "GET",
  UPDATE_ID = "id",
}
