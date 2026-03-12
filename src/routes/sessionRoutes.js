const express = require('express');
const sessionRouter = express.Router();

const Session = require('../models/session');
const { auth } = require('../middlewares/auth');

// Create a new session
sessionRouter.post('/session', auth, async (req, res) => {
    try {
        const { chatHistory, code } = req.body;

        const session = new Session({
            userId: req.user.id,
            chatHistory: chatHistory || [],
            code: code || {}
        });

        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ msg: 'Failed to create session', error: error.message });
    }
});

// Get all sessions of the authenticated user
sessionRouter.get('/session', auth, async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.id });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ msg: 'Failed to fetch sessions', error: error.message });
    }
});

// Get a specific session by ID
sessionRouter.get('/session/:id', auth, async (req, res) => {
    try {
        const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });

        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({ msg: 'Failed to fetch session', error: error.message });
    }
});

// Update chatHistory and/or code of a session
sessionRouter.patch('/session/:id', auth, async (req, res) => {
    try {
        const updates = {};
        if (req.body.chatHistory) updates.chatHistory = req.body.chatHistory;
        if (req.body.code) updates.code = req.body.code;

        const session = await Session.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updates,
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ msg: 'Session not found or unauthorized' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({ msg: 'Failed to update session', error: error.message });
    }
});

module.exports = sessionRouter;
