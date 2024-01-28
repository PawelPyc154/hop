import { model, Schema, Document } from 'mongoose';
import { Service } from '../interfaces/service.interface';

const ServiceSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    trim: true,
  },
  place: { type: Schema.Types.ObjectId, ref: 'Place' },
});

export const ServiceModel = model<Service & Document>('Service', ServiceSchema);
