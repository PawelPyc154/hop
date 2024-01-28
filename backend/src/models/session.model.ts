import { model, Schema, Document } from 'mongoose';
import { Session } from 'inspector';

const SessionSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    active_expires: {
      type: Number,
      required: true,
    },
    idle_expires: {
      type: Number,
      required: true,
    },
  } as const,
  { _id: false },
);

export const SessionModel = model<Session & Document>('Session', SessionSchema);
