// Import the Mongoose library.
const mongoose = require('mongoose');

// Create a schema.
const placeSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
});

// Create a model from this schema.
const PlaceModel = mongoose.model('Place', placeSchema);

// Exports the model to be used in other parts of the application.
module.exports = PlaceModel;