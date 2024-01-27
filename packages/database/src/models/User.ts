import mongodb from "mongoose";

const UserSchema = new mongodb.Schema(
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
  { _id: false }
);

export const User = mongodb.model("User", UserSchema);
