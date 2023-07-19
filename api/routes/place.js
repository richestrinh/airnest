// Handling of user's places.

const express = require('express');
const Place = require('../models/Place.js');

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const imageDownloader = require('image-downloader');

const jwt = require('jsonwebtoken');
const jwtSecret = "asdasdbfyhcmiqwuhe";


const router = express.Router();

// Endpoint for uploading an image by a link. 
// TODO: Make sure the link is valid.
router.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    // TODO: Make sure the link is valid.
    url: link,
    // Add full path to directory, go up 1 directory so we reach api/uploads.
    dest: path.join(__dirname, "../") + '/uploads/' + newName,
    // dest: __dirname + '/uploads/' + newName,
  });
  res.json(newName);
});

// Endpoint for uploading an image from a device.
// Uses Multer middleware.
const photosMiddleware = multer({ dest: 'uploads/' });
router.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  // Keep track of the number of files uploaded.
  const uploadedFiles = [];

  // Loop through all the files in the request.
  for (let i = 0; i < req.files.length; i++) {
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
    uploadedFiles.push(newPath.replace('uploads/', ''));
  }

  res.json(uploadedFiles);
});

// Endpoint for creating a new place.
router.post('/places', (req, res) => {
  const { token } = req.cookies;
  const { title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title: title,
      address: address,
      photos: addedPhotos,
      description: description,
      perks: perks,
      extraInfo: extraInfo,
      checkIn: checkIn,
      checkOut: checkOut,
      maxGuests: maxGuests,
      price: price,
    });
    res.json(placeDoc);
  });
});

// Endpoint for getting all places owned by the user.
router.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    // if (err) throw err;
    // userData dcrypted data.
    const { id } = userData;
    // Find all places owned by the user.
    res.json(await Place.find({ owner: id }))
  });
});

// Endpoint for getting a place by id.
// Used to set owner ObjectID in MongoDB.
router.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// Endpoint for updating a place.
router.put('/places/', async (req, res) => {
  const { token } = req.cookies;
  const { id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const placeDoc = await Place.findById(id);
    // Check if the user owns the place. (check if id's match)
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title: title,
        address: address,
        photos: addedPhotos,
        description: description,
        perks: perks,
        extraInfo: extraInfo,
        checkIn: checkIn,
        checkOut: checkOut,
        maxGuests: maxGuests,
        price: price,
      })
      placeDoc.save();
      res.json('saved edit!');
    }
  });
});

// Endpoint for getting all places for displaying on main page.
router.get('/places', async (req, res) => {
  res.json(await Place.find());
});
module.exports = router;
