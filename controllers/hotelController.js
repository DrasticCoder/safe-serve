import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Hotel from '../models/Hotel.js';
import qr from 'qr-image';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List all hotels with analytics
export const listHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.render('hotels/list', { hotels });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching hotels' });
  }
};

// Register a new hotel
export const registerHotel = async (req, res) => {
  const { name, ratingRange, location } = req.body;
  try {
    const newHotel = new Hotel({ name, ratingRange, location });
    await newHotel.save();
    res.redirect('/hotels');
  } catch (error) {
    res.status(400).json({ error: 'Error registering hotel' });
  }
};

export const getHotelScore = async (req, res) => {
  const { hotelId } = req.params;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }

  const minRating = 7;
  const maxRating = 9;
  const randomRating = Math.random() * (maxRating - minRating) + minRating;
  const score = parseFloat(randomRating.toFixed(1));

  hotel.visitorCount = (hotel.visitorCount || 0) + 1;

  res.render('hotels/score', { hotel, score });
};

export const getRegsiter = (req, res) => {
  res.render('hotels/register');
};

// Generate QR code for a hotel
export const generateQR = async (req, res) => {
  const { hotelId } = req.params;
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const qrData = `${req.protocol}://${req.get('host')}/hotels/score/${hotelId}`;
    const qrImage = qr.imageSync(qrData, { type: 'png' });

    // Store QR locally on server
    const qrPath = path.join(__dirname, '..', 'public', 'qr', `${hotelId}.png`);
    fs.writeFileSync(qrPath, qrImage);
    hotel.qrLink = `/qr/${hotelId}.png`;

    await hotel.save();
    res.redirect(`/hotels/${hotelId}`);
  } catch (error) {
    res.status(500).json({ error: 'Error generating QR code' });
  }
};

// Get hotel information by QR code
export const getHotelInfo = async (req, res) => {
  const { hotelId } = req.params;
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    hotel.visitorCount = (hotel.visitorCount || 0) + 1;
    await hotel.save();

    res.render('hotels/detail', { hotel });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching hotel info' });
  }
};

export const addReview = async (req, res) => {
  const { hotelId } = req.params;
  const { rating, comment } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    hotel.reviews.push({ rating, comment });
    await hotel.save();
    // res.redirect(`/hotels/${hotelId}`);
    res.json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding review' });
  }
}