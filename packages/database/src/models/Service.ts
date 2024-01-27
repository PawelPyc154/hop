import mongoose, { Schema } from "mongoose";

const ServiceSchema = new mongoose.Schema({
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
  price: {
    type: String,
    trim: true,
    max: [100000, "Zbyt długi opis"],
  },
  place: { type: Schema.Types.ObjectId, ref: "Place" },
});

export const Service = mongoose.model("Service", ServiceSchema);
