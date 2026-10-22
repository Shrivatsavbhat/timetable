const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        let user = await User.findOne();
        if (!user) user = await User.create({});
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let user = await User.findOne();
        if (user) {
            user = await User.findByIdAndUpdate(user._id, req.body, { returnDocument: 'after' });
        } else {
            user = await User.create(req.body);
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
