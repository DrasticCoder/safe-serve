import { Request, Response } from 'express';
import Hotel from '../models/Hotel';
import qr from 'qr-image';
import path from 'path';
import fs from 'fs';

// List all hotels with analytics
export const listHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find();
    res.render('hotels/list', { hotels });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching hotels' });
  }
};

// Register a new hotel
export const registerHotel = async (req: Request, res: Response) => {
  const { name, fssaiDocument, ratingRange, location } = req.body;
  try {
    const newHotel = new Hotel({ name, fssaiDocument, ratingRange, location });
    await newHotel.save();
    // res.status(201).json(newHotel);
    res.redirect('/hotels');
  } catch (error) {
    res.status(400).json({ error: 'Error registering hotel' });
  }
};

export const getHotelScore = async(req: Request, res: Response) => {
  const { hotelId } = req.params;

  // Calculate score
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }
  // const ratingRangeParts = hotel.ratingRange.split('-');
  // const minRating = parseFloat(ratingRangeParts[0]);
  // const maxRating = parseFloat(ratingRangeParts[1]);
  // const randomRating = Math.random() * (maxRating - minRating) + minRating;
  // const score = parseFloat(randomRating.toFixed(1));

  const minRating = 7;
  const maxRating = 9;
  const randomRating = Math.random() * (maxRating - minRating) + minRating;
  const score = parseFloat(randomRating.toFixed(1));

hotel.visitorCount = (hotel.visitorCount || 0) + 1;

  res.render('hotels/score', { hotel, score });
}

export const getRegsiter = (req: Request, res: Response) => {
  res.render('hotels/register');
}

// Generate QR code for a hotel
export const generateQR = async (req: Request, res: Response) => {
  const { hotelId } = req.params;
  // try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const qrData = `${req.protocol}://${req.get('host')}/hotels/score/${hotelId}`;
    const qrImage = qr.imageSync(qrData, { type: 'png' });

    // Store QR as Base64 in MongoDB
    hotel.qrLink = `data:image/png;base64,${qrImage.toString('base64')}`;

    // Or store QR locally on server
    const qrPath = path.join(__dirname, '..', 'public', 'qr', `${hotelId}.png`);
    fs.writeFileSync(qrPath, qrImage);
    hotel.qrLink = `/qr/${hotelId}.png`;

    await hotel.save();
    // res.json({ message: 'QR code generated', qrLink: hotel.qrLink }).redirect('/hotels');
    res.redirect(`/hotels/${hotelId}`);
  // } catch (error) {
  //   res.status(500).json({ error: 'Error generating QR code' });
  // }
};

// Get hotel information by QR code
export const getHotelInfo = async (req: Request, res: Response) => {
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
