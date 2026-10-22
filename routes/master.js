const express = require('express');
const router = express.Router();
const MasterSlot = require('../models/MasterSlot');

const editableFields = ['day', 'slot', 'time', 'code', 'subject', 'faculty', 'room'];
const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
};

function getStartTimeMinutes(time) {
    const match = String(time || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) return Number.MAX_SAFE_INTEGER;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3]?.toUpperCase();
    if (meridiem === 'AM' && hours === 12) hours = 0;
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    return hours * 60 + minutes;
}

// Get all master slots (filter by semester or day if passed in query)
router.get('/', async (req, res) => {
    try {
        const slots = await MasterSlot.find(req.query);
        slots.sort((first, second) =>
            (dayOrder[first.day] || Number.MAX_SAFE_INTEGER) - (dayOrder[second.day] || Number.MAX_SAFE_INTEGER) ||
            getStartTimeMinutes(first.time) - getStartTimeMinutes(second.time) ||
            String(first.slot).localeCompare(String(second.slot), undefined, { numeric: true })
        );
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

// Permanently update a master slot
router.put('/:id', async (req, res) => {
    try {
        const updates = Object.fromEntries(
            editableFields
                .filter((field) => req.body[field] !== undefined)
                .map((field) => [field, req.body[field]])
        );
        const slot = await MasterSlot.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { returnDocument: 'after', runValidators: true }
        );

        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        res.json(slot);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Exchange the schedule positions of two permanent slots.
router.post('/swap', async (req, res) => {
    const { firstId, secondId } = req.body;

    if (!firstId || !secondId || firstId === secondId) {
        return res.status(400).json({ error: 'Two different slot IDs are required' });
    }

    try {
        const [first, second] = await Promise.all([
            MasterSlot.findById(firstId),
            MasterSlot.findById(secondId)
        ]);

        if (!first || !second) {
            return res.status(404).json({ error: 'One or both slots were not found' });
        }

        if (first.semester && second.semester && first.semester !== second.semester) {
            return res.status(400).json({ error: 'Slots must belong to the same semester' });
        }

        const firstPosition = { day: first.day, slot: first.slot, time: first.time };
        const secondPosition = { day: second.day, slot: second.slot, time: second.time };

        await MasterSlot.bulkWrite([
            { updateOne: { filter: { _id: first._id }, update: { $set: secondPosition } } },
            { updateOne: { filter: { _id: second._id }, update: { $set: firstPosition } } }
        ]);

        const [updatedFirst, updatedSecond] = await Promise.all([
            MasterSlot.findById(first._id),
            MasterSlot.findById(second._id)
        ]);

        res.json({ first: updatedFirst, second: updatedSecond });
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
