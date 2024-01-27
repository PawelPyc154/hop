export const PlaceCategory = {
  hairdresser: 'hairdresser' as const,
  barber: 'barber' as const,
  beauty: 'beauty-studio' as const,
  nails: 'nails' as const,
  massage: 'massage' as const,
  pets: 'pets' as const,
  physiotherapy: 'physiotherapy' as const,
  dentist: 'dentist' as const,
};

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
