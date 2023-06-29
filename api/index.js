const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const cookieParaser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();

// Generate salt.
const bcryptSalt = bcrypt.genSaltSync(10);

const jwtSecret = "asdasdbfyhcmiqwuhe";

// Use the body-parser middleware
app.use(express.json());
app.use(cookieParaser());
// Display photos in the browser.
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/profile', (req, res) => {
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

app.post('/logout', (req, res) => {
    // res.clearCookie('token');
    res.cookie('token', '').json(true);
});

// Endpoint for uploading an image by a link. 
app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        // Add full path to directory.
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
});

// Endpoint for uploading an image from a device.
// Uses Multer middleware.
const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    // Keep track of the number of files uploaded.
    const uploadedFiles = [];

    // Loop through all the files in the request.
    for(let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        // Parts is the array of originalname parts.
        const parts = originalname.split('.');

        // Grab the file extension.
        const ext = parts[parts.length - 1];

        // Append ext.
        const newPath = path + '.' + ext;

        // Rename file.
        fs.renameSync(path, newPath);

        // Push the new path to the array. (Remove the 'uploads/')
        uploadedFiles.push(newPath. replace('uploads/', ''));
    }

    res.json(uploadedFiles);
});

// Endpoint for creating a new place.
app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, 
    perks, extraInfo, checkIn, checkOut, maxGuest } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner: userData.id,
        title: title,
        address: address,
        addedPhotos: addedPhotos,
        description: description,
        perks: perks,
        extraInfo: extraInfo,
        checkIn: checkIn,
        checkOut: checkOut,
        maxGuest: maxGuest,    
      });
      res.json(placeDoc);
  });
  
});

app.listen(4000);