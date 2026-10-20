const express = require('express');
const router = express.Router();
const MasterSlot = require('../models/MasterSlot');

// Get all master slots (filter by semester or day if passed in query)
router.get('/', async (req, res) => {
    try {
        const slots = await MasterSlot.find(req.query).sort({ day: 1, slot: 1 });
        res.json(slots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new master slot
router.post('/', async (req, res) => {
    try {
        const slot = await MasterSlot.create(req.body);
        res.status(201).json(slot);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a master slot
router.delete('/:id', async (req, res) => {
    try {
        await MasterSlot.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slot deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
