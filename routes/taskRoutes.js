const express = require('express');
const Task = require('../models/Task');
const requireCR = require('./requireCR');

const router = express.Router();


// GET all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
            .sort({ date: 1, createdAt: -1 });

        res.json({
            success: true,
            tasks
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tasks',
            error: err.message
        });
    }
});


// GET task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            task
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Failed to fetch task',
            error: err.message
        });
    }
});


// CREATE task
router.post('/', requireCR, async (req, res) => {
    try {
        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            task
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Failed to create task',
            error: err.message
        });
    }
});


// UPDATE task
router.put('/:id', requireCR, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            task
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Failed to update task',
            error: err.message
        });
    }
});


// DELETE task
router.delete('/:id', requireCR, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete task',
            error: err.message
        });
    }
});


module.exports = router;