import { Schema, model } from "mongoose";

// Esquema embebido para la ubicación (1:1)
const locationSchema = new Schema(
  {
    venue: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const eventSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    price: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "finished"],
      default: "scheduled",
    },
    location: { type: locationSchema, required: true },
    // Relación 1:N con User
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Relación N:M con Category
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Event = model("Event", eventSchema);
