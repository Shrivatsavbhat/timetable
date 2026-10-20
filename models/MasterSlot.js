const mongoose = require('mongoose');

const masterSlotSchema = new mongoose.Schema({
    semester: { type: String, required: true },
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    slot: { type: String, required: true },
    time: { type: String, required: true },
    subject: { type: String, required: true },
    code: { type: String, required: true },
    room: { type: String, required: true },
    faculty: { type: String, required: true },
    isLab: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MasterSlot', masterSlotSchema);
