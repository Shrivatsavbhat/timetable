
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();






router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === 'cr@123' && password === 'admin123') {
        req.session.user = {
            name: 'Class Representative',
            email: 'cr@123',
            role: 'CR',
            semester: 'I MCA-A'
        };
        return res.json({ success: true, user: req.session.user });
    }
    return res.status(401).json({ success: false, message: 'Invalid Class Representative credentials' });
});


router.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ success: true, user: req.session.user });
    }
    return res.status(401).json({ success: false, message: 'Not authenticated' });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: 'Logged out successfully' });
    });
});


module.exports = router;
