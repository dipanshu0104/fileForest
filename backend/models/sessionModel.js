// models/Session.js

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4
    },
    ipAddress: {
        type: String,
    },
    device: {
        type: String, // e.g., "Windows Chrome", "iPhone Safari"
    },
    os: {
        type: String,
    },
    browser: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d', // optional: auto-delete sessions after 30 days
    },
});

module.exports = mongoose.model('Session', sessionSchema);
