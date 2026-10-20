require('dotenv').config(); // Loads .env
const express = require('express');
const mongoose = require('mongoose');

const MasterSlot = require('./models/MasterSlot');
const Override = require('./models/Override');
const Notice = require('./models/Notice');
const masterRouter = require('./routes/master');
const timetableRoutes = require('./routes/timetable');

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
app.use('/api/timetable', timetableRoutes);
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


//get happening now
app.get('/api/happening-now', async (req, res) => {
    try {
        const currentTime = new Date();
        const currentDay = currentTime.toLocaleString('en-US', { weekday: 'long' });

        // Get current time as HH:mm string for comparison
        const currentHour = currentTime.getHours().toString().padStart(2, '0');
        const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
        const currentTimeStr = `${currentHour}:${currentMinute}`;

        // Fetch slots for today
        let slots = await MasterSlot.find({ day: currentDay });
        console.log({ currentDay, currentTimeStr })

        for (const slot of slots) {
            const [startTime, endTime] = slot.time.split('-');
            const [hr, min] = currentTimeStr.split(":").map(Number);
            // const [hr, min] = [9, 0];

            const [starthr, startmin] = startTime.split(":").map(Number);
            const [endhr, endmin] = endTime.split(":").map(Number);
            if (hr >= starthr && hr <= endhr) {
                if (hr === starthr && min < startmin) continue;
                if (hr === endhr && min > endmin) continue;
                console.log("sdskdks", slot)
                return res.json({ success: true, happeningNow: slot.subject })

            }
        }


        res.json({ success: true, happeningNow: "Free Slot / Lunch Break" });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch happening now', error: err.message });
    }
});

//get all the slots for today
app.get('/api/slots-today', async (req, res) => {
    try {
        const currentTime = new Date();
        const currentDay = currentTime.toLocaleString('en-US', { weekday: 'long' });

        let slots = await MasterSlot.find({ day: currentDay });

        res.json({ success: true, slots });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch happening now', error: err.message });
    }
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
