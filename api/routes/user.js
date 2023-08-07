// Handling of user's account.

const express = require('express');
const User = require('../models/User.js');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
// Generate salt.
const bcryptSalt = bcrypt.genSaltSync(10);

const jwt = require('jsonwebtoken');
const jwtSecret = "asdasdbfyhcmiqwuhe";

const router = express.Router();

router.post('/register', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  // Grab all information from the request body.
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      // Generate and store hash in DB.
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    // Respond with json with all the information we are sending.
    res.json(userDoc);
  } catch (err) {
    // 422 is the HTTP status code for unprocessable entity.
    res.status(422).json(err);
  }
});

router.post('/login', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  
  const { email, password } = req.body;
  // Find user by email.
  const userDoc = await User.findOne({ email: email });
  if (userDoc) {
    // Check if password is correct.
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // Create a token with the user's email and id.
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id,
      }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        // Respond with token (a cookie) from callback function and returns userDoc
        res.cookie('token', token, 'none').json(userDoc);
      });
    }
    else {
      res.status(422).json('pass not ok');
    }
  }
  else {
    res.json('not found');
  }
});

router.get('/profile', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  
  // We need to get the token from the cookie.
  const { token } = req.cookies;

  // If the token is valid, we can get the user from the token with our salt key.
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;

      // Grab name, email and ID from the token.
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  }
  else {
    res.json(null);
  }
});

router.post('/logout', (req, res) => {
  // res.clearCookie('token');
  res.cookie('token', '').json(true);
});

module.exports = router;