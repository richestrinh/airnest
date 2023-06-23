const express = require('express');
const cors = require('cors');
const app = express();

// Use the body-parser middleware
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGODB_URL);
app.get('/test', (req, res) => {
    res.json('test ok');
});

// 9yikg5fFbbRF9Tpi
app.post('/register', (req, res) => {
    // Grab all information from the request body.
    const {name, email, password} = req.body;

    // Respond with json with all the information we are sending.
    res.json({name, email, password});
});

app.listen(4000);