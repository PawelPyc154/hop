export const PlaceCategory = {
  hairdresser: "hairdresser",
  barber: "barber",
  beauty: "beauty-studio",
  nails: "nails",
  massage: "massage",
  pets: "pets",
  physiotherapy: "physiotherapy",
  dentist: "dentist",
} as const;

export type PlaceCategory = (typeof placeCategories)[number];

export const placeCategories = Object.values(PlaceCategory);
