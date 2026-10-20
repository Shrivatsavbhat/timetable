const express = require('express');
const router = express.Router();
const MasterSlot = require('../models/MasterSlot');

// GET /api/timetable?day=Monday
router.get('/', async (req, res) => {
  try {
    const { day } = req.query;
    const filter = day ? { day: day } : {};
    const slots = await MasterSlot.find(filter).sort({ slot: 1 });
    res.json(slots);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Failed to fetch timetable slots' });
  }
});

module.exports = router;