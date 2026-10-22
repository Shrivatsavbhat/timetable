const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, default: 'Royston Menezes' },
    email: { type: String, default: 'royston@rescheduled.edu' },
    studentId: { type: String, default: 'MCA202401' },
    role: { type: String, enum: ['Student', 'CR'], default: 'CR' },
    department: { type: String, default: 'MCA' },
    semester: { type: String, default: 'I MCA-A' },
    batch: { type: String, default: '2024-2026' },
    theme: { type: String, default: 'light' },
    emailAlerts: { type: Boolean, default: true },
    inAppAlerts: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
