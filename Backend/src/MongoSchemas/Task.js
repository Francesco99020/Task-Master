// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        default: null
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    completionDate: {
        type: Date,
        default: null
    },
    createdBy: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    comments: [
        {
            body: String,
            time: {
                type: Date,
                default: Date.now
            },
            commenter: String
        }
    ]
});

module.exports = mongoose.model('Task', taskSchema);