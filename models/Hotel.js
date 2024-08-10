import mongoose, { Document, Schema } from "mongoose";

const HotelSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false},
    location: { type: String, required: true },
    qrLink: { type: String },
    visitorCount: { type: Number, default: 0 },
    reviews: [
      {
        name: { type: String, required: false },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      },
    ],
    hygieneScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", HotelSchema);
export default Hotel;
