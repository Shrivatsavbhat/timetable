const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

router.get('/notices', async (req, res) => {
    try {
        const notices = await Notice.find()
            .sort({ createdAt: -1 });

        res.json(notices);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notices' });
    }
});

module.exports = router;
