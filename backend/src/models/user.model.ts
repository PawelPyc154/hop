import { model, Schema, Document } from 'mongoose';
import { User } from '../interfaces/users.interface';

const UserSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  } as const,
  { _id: false },
);

export const UserModel = model('User', UserSchema);
