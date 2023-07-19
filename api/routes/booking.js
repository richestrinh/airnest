// Handling of user's bookings.

const express = require('express');
const Booking = require('../models/Booking.js');

const jwt = require('jsonwebtoken');
const jwtSecret = "asdasdbfyhcmiqwuhe";


const router = express.Router();

// Returns a promise.
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

// Endpoint for saving a booking into the database.
router.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut, numOfGuests, name, mobile, price,
  } = req.body;

  Booking.create({
    place, checkIn, checkOut, numOfGuests, name, mobile, price,
    user: userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

// Endpoint used for displaying all bookings.
router.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({ user: userData.id }).populate('place'));
});

module.exports = router;
