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
    },
    expiresAt: {
        type: Date,
        default: function () {
            const d = new Date(this.date + 'T23:59:59');
            d.setDate(d.getDate() + 7);
            return d;
        }
    }
}, {
    timestamps: true
});

overrideSchema.index({ semester: 1, date: 1, slot: 1 }, { unique: true });
overrideSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('Override', overrideSchema);