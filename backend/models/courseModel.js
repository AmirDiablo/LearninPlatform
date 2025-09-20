const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number
    },
    curriculm: [{
        sectionTitle: {type: String},
        lessons: [{
            title: {type: String},
            videoURL: {type: String},
            isFree: {type: Boolean, default: false}
        }]
    }],
    rating: {
        type: Number,
        default: 0
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', "published", "archieved"],
    }
}, {timestamps: true})

courseSchema.index({title: "text", description: "text"})

const Course = mongoose.model("Course", courseSchema)
/* Course.createIndexes({title: "text", description: "text"}) */

module.exports = Course