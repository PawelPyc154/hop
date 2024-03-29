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

export const placeCategories = Object.values(PlaceCategory);

export type PlaceCategory = (typeof placeCategories)[number];

export interface Place {
  _id?: string;
  username: string;
  title: string;
  description: string;
  category: PlaceCategory;
  image: string;
}
