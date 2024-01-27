import { visitStatutes } from "types";

import mongoose, { Schema } from "mongoose";

const VisitsSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  visitDate: { type: Date, require: true },
  place: { type: Schema.Types.ObjectId, ref: "Place", require: true },
  service: { type: Schema.Types.ObjectId, ref: "Service", require: true },
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  status: {
    type: String,
    enum: visitStatutes,
    default: "pending",
  },
});

export const Visit = mongoose.model("Visits", VisitsSchema);
