const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // e.g., 'DAA Quiz 1' or 'WT Lab Assignment 3'
    },
    type: {
        type: String,
        required: true,
        enum: ['Assignment', 'Quiz', 'Lab Submission', 'Project', 'Other'],
        default: 'Assignment'
    },
    date: {
        type: String, // Due date (e.g., '2026-10-25')
        required: true
    },
    room: {
        type: String, // Optional (e.g., 'LH-204' for offline quiz, or blank for online submission)
        required: false,
        default: ''
    },
    description: {
        type: String, // Optional submission notes or syllabus topics
        required: false,
        default: ''
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);