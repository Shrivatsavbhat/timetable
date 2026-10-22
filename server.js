require('dotenv').config(); // Loads .env
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');


const authRoutes = require('./routes/auth');

const MasterSlot = require('./models/MasterSlot');
const Override = require('./models/Override');
const Notice = require('./models/Notice');
const masterRouter = require('./routes/master');
const timetableRoutes = require('./routes/timetable');
const Task = require("./models/Task");
const taskRoutes = require('./routes/taskRoutes');
const overrideRoutes = require('./routes/overrideRoutes');
const masterSlotRoutes = require('./routes/masterSlotRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
    secret: 'rescheduled_college_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

app.use(express.static('public'));
app.use('/api/master', masterRouter);
app.use('/api/tasks', taskRoutes);
app.use('/api/overrides', overrideRoutes);
app.use('/api/master-slots', masterSlotRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || 'test' })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/health', (req, res) => {
    return res.send('ok');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/timetable', timetableRoutes);




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
            // const [hr, min] = [12, 0]; // your test time
            const [hr, min] = currentTimeStr.split(":").map(Number);

            const [starthr, startmin] = startTime.split(":").map(Number);
            const [endhr, endmin] = endTime.split(":").map(Number);
            if (hr >= starthr && hr <= endhr) {
                if (hr === starthr && min < startmin) continue;
                if (hr === endhr && min > endmin) continue;

                // 1. Check if this slot has an override today
                const today = new Date().toISOString().split('T')[0];
                const override = await Override.findOne({ date: today, slot: slot.slot });
                console.log("override", { override })

                if (override) {
                    if (override.status === 'CANCELLED') {
                        return res.json({ success: true, happeningNow: { subject: "Cancelled", room: "----" } });
                    }
                    if (override.status === 'SWAPPED') {
                        return res.json({ success: true, happeningNow: { subject: slot.subject, room: slot.room } });
                    }
                    if (override.status === 'SUBSTITUTE') {
                        return res.json({ success: true, happeningNow: { subject: slot.subject, room: slot.room } });
                    }
                }

                // 2. Otherwise return regular subject
                return res.json({ success: true, happeningNow: { subject: slot.subject, room: slot.room } });
            }
        }

        if (currentHour >= 20 || currentHour < 6) {
            return res.json({ success: true, happeningNow: { subject: "College is sleeping", room: "----" } });
        }
        return res.json({ success: true, happeningNow: { subject: "Nothing for now", room: "----" } });


    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch happening now', error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
