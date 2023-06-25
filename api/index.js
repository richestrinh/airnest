const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const cookieParaser = require('cookie-parser');
require('dotenv').config();
const app = express();

// Generate salt.
const bcryptSalt = bcrypt.genSaltSync(10);

const jwtSecret = "asdasdbfyhcmiqwuhe";

// Use the body-parser middleware
app.use(express.json());
app.use(cookieParaser());
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

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    // Find user by email.
    const userDoc = await User.findOne({email:email});
    if (userDoc) {
        // Check if password is correct.
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            // Create a token with the user's email and id.
            jwt.sign({
                email:userDoc.email, 
                id:userDoc._id, 
            }, jwtSecret, {}, (err, token) => {
                if(err) throw err;
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
    const {token} = req.cookies;
    
    // If the token is valid, we can get the user from the token with our salt key.
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            
            // Grab name, email and ID from the token.
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id});
        });
    } // 401 is the HTTP status code for unauthorized.
    else {
        res.status(401).json('no token');
    }
});


app.listen(4000);