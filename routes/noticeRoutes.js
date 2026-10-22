

const express = require('express');
const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const requireCR = require('./requireCR');

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json({ success: true, notices });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch notices', error: err.message });
    }
});

//get the notice by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await Notice.findById(id);
        res.json({ success: true, notice });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch notice', error: err.message });
    }
});

//create the notice
router.post('/', requireCR, async (req, res) => {
    try {
        const notice = await Notice.create(req.body);
        res.status(201).json(notice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


//edit the notice by id
router.put('/:id', requireCR, async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.json(notice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//delete the post by id
router.delete('/:id', requireCR, async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
