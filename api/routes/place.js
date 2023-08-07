// Handling of user's places.

const express = require('express');
const Place = require('../models/Place.js');
const mongoose = require('mongoose');


const path = require('path');
const multer = require('multer');
const fs = require('fs');
const imageDownloader = require('image-downloader');

const jwt = require('jsonwebtoken');
const jwtSecret = "asdasdbfyhcmiqwuhe";
const bucket = 'riches-booking-app';
const mime = require('mime-types');

const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')

const router = express.Router();

async function uploadToAWS(path, originalFilename, mimeType) {
  const client = new S3Client({
    region: 'us-west-2',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  })
  // Parts is the array of originalFilename parts.
  const parts = originalFilename.split('.');
  
  // Grab the file extension.
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;
  const data = await client.send(new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimeType,
    ACL: 'public-read',
  }));

  return `http://${bucket}.s3.amazonaws.com/${newFilename}`;
}

// Endpoint for uploading an image by a link. 
// TODO: Make sure the link is valid.
router.post('/upload-by-link', async (req, res) => {  
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    // TODO: Make sure the link is valid.
    url: link,
    dest: '/tmp/'+ newName,
  });
  const url = await uploadToAWS('/tmp/'+ newName, newName, mime.lookup('/tmp/'+ newName));
  res.json(url);
});

// Endpoint for uploading an image from a device.
// Uses Multer middleware.
const photosMiddleware = multer({ dest: '/tmp' });
router.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  // Keep track of the number of files uploaded.
  const uploadedFiles = [];

  // Loop through all the files in the request.
  for (let i = 0; i < req.files.length; i++) {

    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToAWS(path, originalname, mimetype);
    uploadedFiles.push(url);
  }

  res.json(uploadedFiles);
});

// Endpoint for creating a new place.
router.post('/places', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  
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
  mongoose.connect(process.env.MONGO_URL);
  
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
  mongoose.connect(process.env.MONGO_URL);
  
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// Endpoint for updating a place.
router.put('/places/', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  
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
  mongoose.connect(process.env.MONGO_URL);
  
  res.json(await Place.find());
});
module.exports = router;
