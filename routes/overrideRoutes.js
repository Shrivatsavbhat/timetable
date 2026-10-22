const express = require('express');
const Override = require('../models/Override');
const MasterSlot = require('../models/MasterSlot');
const Notice = require('../models/Notice');
const requireCR = require('./requireCR');

const router = express.Router();


// GET overrides for a date
router.get('/date/:date', async (req, res) => {
    try {

        const overrides = await Override.find({
            date: req.params.date
        });

        res.json({
            success: true,
            overrides
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: 'Failed to fetch overrides',
            error: err.message
        });
    }
});


// GET all overrides
router.get('/', async (req, res) => {
    try {

        const overrides = await Override.find()
            .sort({ date: 1, slot: 1 });

        res.json({
            success: true,
            overrides
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: 'Failed to fetch overrides',
            error: err.message
        });
    }
});


// CREATE override
router.post('/', requireCR, async (req, res) => {

    try {

        const {
            overrideId,
            semester,
            date,
            slot,
            status,
            newSlot,
            newRoom,
            substituteFaculty,
            reason
        } = req.body;


        if (!semester || !date || !slot || !status || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing.'
            });
        }


        // Check original slot
        const original = await MasterSlot.findOne({
            semester,
            slot
        });

        if (!original) {
            return res.status(404).json({
                success: false,
                message: 'Original timetable slot not found.'
            });
        }


        // Prevent duplicate override
        const existing = await Override.findOne({
            semester,
            date,
            slot
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'This slot already has an override for this date.'
            });
        }


        // RESCHEDULED
        if (status === 'RESCHEDULED') {

            if (!newSlot || !newRoom) {
                return res.status(400).json({
                    success: false,
                    message: 'New slot and room are required.'
                });
            }

            if (newSlot === slot) {
                return res.status(400).json({
                    success: false,
                    message: 'New slot must be different.'
                });
            }

            const target = await MasterSlot.findOne({
                semester,
                slot: newSlot
            });

            if (!target) {
                return res.status(404).json({
                    success: false,
                    message: 'Selected new slot does not exist.'
                });
            }

            const occupied = await Override.findOne({
                semester,
                date,
                slot: newSlot
            });

            if (occupied) {
                return res.status(409).json({
                    success: false,
                    message: 'The selected slot already has an override.'
                });
            }
        }


        // SUBSTITUTE
        if (status === 'SUBSTITUTE') {

            if (!substituteFaculty) {
                return res.status(400).json({
                    success: false,
                    message: 'Substitute faculty is required.'
                });
            }
        }


        // SWAPPED
        if (status === 'SWAPPED') {

            if (!newSlot) {
                return res.status(400).json({
                    success: false,
                    message: 'Slot to swap with is required.'
                });
            }

            if (newSlot === slot) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot swap a slot with itself.'
                });
            }

            const target = await MasterSlot.findOne({
                semester,
                slot: newSlot
            });

            if (!target) {
                return res.status(404).json({
                    success: false,
                    message: 'Swap target slot does not exist.'
                });
            }

            const existingTarget = await Override.findOne({
                semester,
                date,
                slot: newSlot
            });

            if (existingTarget) {
                return res.status(409).json({
                    success: false,
                    message: 'The other slot already has an override.'
                });
            }

            const secondId =
                `${date}-${newSlot}-swap-${Date.now()}`;

            const first = await Override.create({
                overrideId,
                semester,
                date,
                slot,
                status: 'SWAPPED',
                newSlot,
                newRoom: newRoom || target.room,
                reason
            });

            try {

                await Override.create({
                    overrideId: secondId,
                    semester,
                    date,
                    slot: newSlot,
                    status: 'SWAPPED',
                    newSlot: slot,
                    newRoom: original.room,
                    reason
                });

            } catch (err) {

                await Override.findByIdAndDelete(first._id);
                throw err;
            }
            // Auto-create campus notice for swap
            await Notice.create({
                title: `Class Swap: ${original.subject} (${semester})`,
                priority: 'Schedule Shift',
                date,
                content: `Slot ${slot} (${original.subject}) has been swapped with Slot ${newSlot}. Reason: ${reason}`
            });

            return res.status(201).json({
                success: true,
                message: 'Slots swapped successfully.'
            });
        }


        // Normal override
        const override = await Override.create({
            overrideId,
            semester,
            date,
            slot,
            status,
            newSlot: status === 'RESCHEDULED'
                ? newSlot
                : null,
            newRoom: status === 'RESCHEDULED'
                ? newRoom
                : null,
            substituteFaculty:
                status === 'SUBSTITUTE'
                    ? substituteFaculty
                    : null,
            reason
        });
        // Auto-create campus notice for other overrides
        await Notice.create({
            title: `Class ${status}: ${original.subject} (${semester})`,
            priority: status === 'CANCELLED' ? 'Urgent' : 'Schedule Shift',
            date,
            content: `Slot ${slot} is ${status}. Reason: ${reason}` + (substituteFaculty ? ` (Substitute: ${substituteFaculty})` : '')
        });



        res.status(201).json({
            success: true,
            override
        });

    } catch (err) {

        console.error('Override creation error:', err);

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});


// DELETE override
router.delete('/:id', requireCR, async (req, res) => {

    try {

        const override =
            await Override.findByIdAndDelete(req.params.id);

        if (!override) {
            return res.status(404).json({
                success: false,
                message: 'Override not found.'
            });
        }

        // If this is a swap, delete its pair
        if (override.status === 'SWAPPED') {

            await Override.deleteOne({
                semester: override.semester,
                date: override.date,
                slot: override.newSlot,
                status: 'SWAPPED',
                newSlot: override.slot
            });
        }

        res.json({
            success: true,
            message: 'Override deleted successfully.'
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: 'Failed to delete override.',
            error: err.message
        });
    }
});




module.exports = router;