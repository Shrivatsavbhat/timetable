require('dotenv').config(); // Loads .env
const express = require('express');
const mongoose = require('mongoose');

const MasterSlot = require('./models/MasterSlot');
const Override = require('./models/Override');
const Notice = require('./models/Notice');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' Connected to MongoDB'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/health', (req, res) => {
    return res.send('ok');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
