import { placeCategories } from "types";

import mongoose, { Schema } from "mongoose";

const PlaceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Nazwa jest wymagana"],
    max: [50, "Zbyt długa nazwa"],
  },
  description: {
    type: String,
    trim: true,
    max: [500, "Zbyt długi opis"],
  },
  category: {
    type: String,
    enum: placeCategories,
    default: "barber",
  },
  image: {
    type: String,
    required: true,
  },
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
});

export const Place = mongoose.model("Place", PlaceSchema);
