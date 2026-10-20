const mongoose = require('mongoose');

const overrideSchema = new mongoose.Schema({
    overrideId: {
        type: String,
        required: true,
        unique: true
    },

    semester: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    slot: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true,
        enum: [
            'CANCELLED',
            'RESCHEDULED',
            'SUBSTITUTE',
            'SWAPPED'
        ]
    },

    newSlot: {
        type: String,
        default: null
    },

    newRoom: {
        type: String,
        default: null
    },

    substituteFaculty: {
        type: String,
        default: null
    },

    reason: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

overrideSchema.index(
    { semester: 1, date: 1, slot: 1 },
    { unique: true }, { expireAfterSeconds: 604800 }
);

module.exports = mongoose.model('Override', overrideSchema);