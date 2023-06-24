// Import the Mongoose library.
const mongoose = require('mongoose');

const { Schema } = mongoose;

// This Schema defines the structure of the MongoDB collection.
const UserSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
});

// Create a model from this schema.
const UserModel = mongoose.model('User', UserSchema);

// Exports the model to be used in other parts of the application.
module.exports = UserModel;