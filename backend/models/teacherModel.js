const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
    resume: {
        type: String
    },
    linkedin: {
        type: String
    },
    youtube: {
        type: String
    },
    instagram: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rating: {
        type: Number,
        default: 0
    },
    studentCount: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

teacherSchema.index({userId: 1})
teacherSchema.index({status: 1})

const Teacher = mongoose.model("Teacher", teacherSchema)

module.exports = Teacher