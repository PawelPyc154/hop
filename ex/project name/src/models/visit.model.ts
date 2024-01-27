import { model, Schema, Document } from 'mongoose';
import { Visit, VisitStatus, visitStatuses } from '@/interfaces/visit.interface';

const VisitSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  visitDate: { type: Date, require: true },
  place: { type: Schema.Types.ObjectId, ref: 'Place', require: true },
  service: { type: Schema.Types.ObjectId, ref: 'Service', require: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  status: {
    type: String,
    enum: visitStatuses,
    default: VisitStatus.pending,
  },
});

export const VisitModel = model<Visit & Document>('Visits', VisitSchema);
