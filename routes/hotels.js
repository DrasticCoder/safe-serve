import { Router } from "express";
import {
  listHotels,
  registerHotel,
  generateQR,
  getHotelInfo,
  getHotelScore,
  getRegsiter,
  addReview
} from "../controllers/hotelController.js";

const router = Router();

// List all hotels with analytics
router.get("/", listHotels);

// Register a new hotel
router.route("/register")
.get(getRegsiter).post(registerHotel);

// Generate QR code for a hotel
router.post("/generate-qr/:hotelId", generateQR);

router.get("/score/:hotelId",getHotelScore)

router.post("/review/:hotelId",addReview);

// Get hotel information by QR code
router.get("/:hotelId", getHotelInfo);


export default router;
