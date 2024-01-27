import { model, Schema, Document } from 'mongoose';
import { Place, placeCategories } from '@interfaces/place.interface';

const PlaceSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: placeCategories,
    default: 'barber',
  },
  image: {
    type: String,
    required: true,
  },
  services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
});

export const PlaceModel = model<Place & Document>('Place', PlaceSchema);
