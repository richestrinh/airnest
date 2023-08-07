const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParaser = require('cookie-parser');

require('dotenv').config();
const app = express();

// Use the body-parser middleware
app.use(express.json());
app.use(cookieParaser());
// Display photos in the browser.
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

// Start refactoring api.
const userRoute = require('./routes/user.js');
const placeRoute = require('./routes/place.js');
const bookingRoute = require('./routes/booking.js');

// Handling of user's account.
app.use(userRoute);

// Handling of user's places.
app.use(placeRoute);

// Handling of user's bookings.
app.use(bookingRoute);

app.get('/test', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});

app.listen(4000);