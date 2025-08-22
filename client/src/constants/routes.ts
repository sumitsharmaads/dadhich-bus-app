export const AdminRoutes = {
  DASHBOARD: "dashboard",
  USER: "users",
  USER_ADD: "add",
  USER_EDIT: ":id/edit",
  LOCATIONS: "locations",
  PROFILE: "profile",
  TOURS: "tours",
  ADD_TOUR: "add",
  EDIT_TOUR: ":id/edit",
  EDIT_BOOKING: "booking/:id/edit",
  SETTING: "setting",
  TERMS: "terms",
  FAQs: "FAQs",
  BUS: "bus",
  TOURISTPLACES: "touristplaces",
  ADD_OURISTPLACES: "touristplaces/add",
  EDIT_TOURISTPLACES: "touristplaces/:id/edit",
  SEO_LIST: "seo",
  ADD_SEO: "add",
  EDIT_SEO: ":id/edit",
} as const;

export const PublicRoutes = {
  PROFILE: "/profile",
  MY_BOOKINGS: "/user/bookings",
  HOME: "/",
  ABOUT_US: "/aboutus",
  CONTACT: "/contact",
  SERVICES: "/services",
  INQUERY_NOW: "/inquery",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  QUICK_INQUERY: "/inquery",
  TOUR_GUIDES: "/tour-guide",
  TOURS: "/tours",
  TOURS_DETAILS: "/tour/[id]", // Next.js dynamic route format
  FAQ: "/faq",
} as const;

export type PublicRoute = (typeof PublicRoutes)[keyof typeof PublicRoutes];
export type AdminRoute = (typeof AdminRoutes)[keyof typeof AdminRoutes];
