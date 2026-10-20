const express = require('express');
const MasterSlot = require('../models/MasterSlot');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const slots = await MasterSlot.find().sort({
            semester: 1,
            day: 1,
            slot: 1
        });

        res.json({
            success: true,
            slots
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch master slots',
            error: err.message
        });
    }
});

module.exports = router;