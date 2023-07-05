// Import the Mongoose library.
const mongoose = require('mongoose');

// Create a schema.
const bookingSchema = new mongoose.Schema({
    place: {type: mongoose.Schema.Types.ObjectId, required:true, ref: 'Place'}, 
    user: {type: mongoose.Schema.Types.ObjectId, required:true}, 
    checkIn: {type: Date, required:true}, 
    checkOut: {type: Date, required:true}, 
    name: {type: String, required:true}, 
    mobile: {type: String, required:true}, 
    numOfGuests: {type: Number, required:true},
    price: Number,
});

// Create a model from this schema.S
const BookingModel = mongoose.model('Booking', bookingSchema);

// Exports the model to be used in other parts of the application.
module.exports = BookingModel;