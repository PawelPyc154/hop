import mongodb from "mongoose";

const KeySchema = new mongodb.Schema(
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
  { _id: false }
);

export const Key = mongodb.model("Key", KeySchema);
