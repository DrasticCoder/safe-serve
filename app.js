import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import hotelRoutes from "./routes/hotels.js";
import { configDotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

// Load environment variables
configDotenv();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || '', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});
app.use('/hotels', hotelRoutes);

export default app;
