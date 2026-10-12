const mongoose = require('mongoose');

const overrideSchema = new mongoose.Schema({
    overrideId: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['RESCHEDULED', 'CANCELLED', 'SUBSTITUTE']
    },
    newTime: { type: String, default: null },
    newRoom: { type: String, default: null },
    substituteFaculty: { type: String, default: null },
    reason: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Override', overrideSchema);
