import mongodb from "mongoose";

const SessionSchema = new mongodb.Schema(
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
  { _id: false }
);

export const Session = mongodb.model("Session", SessionSchema);
