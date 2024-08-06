import mongoose, { Document, Schema } from "mongoose";

export interface IHotel extends Document {
  name: string;
  fssaiDocument: string;
  ratingRange: string;
  location: string;
  qrLink?: string;
  visitorCount?: number;
}

const HotelSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
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

const Hotel = mongoose.model<IHotel>("Hotel", HotelSchema);
export default Hotel;
