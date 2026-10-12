const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    priority: {
        type: String,
        required: true,
        enum: ['Urgent', 'High', 'Schedule Shift', 'General'],
        default: 'General'
    },
    date: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
