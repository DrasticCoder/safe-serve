import mongoose, { Document, Schema } from "mongoose";

const HotelSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false},
    fssaiDocument: { type: String, required: true },
    ratingRange: { type: String, required: true },
    location: { type: String, required: true },
    qrLink: { type: String },
    visitorCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", HotelSchema);
export default Hotel;
