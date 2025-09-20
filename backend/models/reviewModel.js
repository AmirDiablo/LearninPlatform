const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String }
}, {timestamps: true});

const Review = mongoose.model("Review", ReviewSchema)

module.exports = Review