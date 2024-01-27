import { model, Schema, Document } from 'mongoose';
import { Key } from '@interfaces/key.interface';

const KeySchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    hashed_password: String,
  } as const,
  { _id: false },
);

export const KeyModel = model<Key & Document>('Key', KeySchema);
