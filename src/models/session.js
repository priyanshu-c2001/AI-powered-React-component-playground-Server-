const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    chatHistory: [
        {
            sender: { 
                type: String, 
                enum: ['user', 'ai'], 
                required: true,
            },
            message: {
                type: String,
            }
        },
    ],
    code: {
        jsx: {
            type: String,
        },
        css: {
            type: String,
        }
    },
}, {timestamps: true});

const Session=mongoose.model('session', sessionSchema);

module.exports = Session;
