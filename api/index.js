const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
require('dotenv').config();
const app = express();

// Generate salt.
const bcryptSalt = bcrypt.genSaltSync(10);

// Use the body-parser middleware
app.use(express.json());
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
    const {name, email, password} = req.body;
    
    try {
        const userDoc = await User.create({
            name, 
            email, 
            // Generate and store hash in DB.
            password:bcrypt.hashSync(password, bcryptSalt),
        });
        // Respond with json with all the information we are sending.
        res.json(userDoc);
    } catch (err) {
        // 422 is the HTTP status code for unprocessable entity.
        res.status(422).json(err);
    }

    
});

app.listen(4000);