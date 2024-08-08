const mongoose = require('mongoose');
const User = require('./user');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    lettre: {
        type: String,
        required: true,
        maxlength: 1000  
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',                        
        required: true
    },
    targetType: {
        type: String,
        enum: ['user', 'ride', 'platform'],
        required: true,
        
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'targetType',
        required: false  
    },
    type: {
        type: String,
        required: true,
        enum: ["safety", "punctuality", "behavior", "cleanliness", "ux", "other"],
        default: "other"
    },
    status: {
        type: String,
        enum: ['under review', 'resolved', 'dismissed'],
        default: 'under review'  
    }
   
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema, 'Complaints');
module.exports = Complaint;
