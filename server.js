require('dotenv').config(); // Loads .env
const express = require('express');
const mongoose = require('mongoose');

const MasterSlot = require('./models/MasterSlot');
const Override = require('./models/Override');
const Notice = require('./models/Notice');
const masterRouter = require('./routes/master');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api/master', masterRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || 'test' })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/health', (req, res) => {
    return res.send('ok');
});

//gets all the posts
app.get('/api/notices', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json({ success: true, notices });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch notices', error: err.message });
    }
});

//get the notice by id
app.get('/api/notices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await Notice.findById(id);
        res.json({ success: true, notice });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch notice', error: err.message });
    }
});

//create the notice
app.post('/api/notices', async (req, res) => {
    try {
        const notice = await Notice.create(req.body);
        res.status(201).json(notice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


//edit the notice by id
app.put('/api/notices/:id', async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(notice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//delete the post by id
app.delete('/api/notices/:id', async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
