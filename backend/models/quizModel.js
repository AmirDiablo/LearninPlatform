const mongoose = require("mongoose")

const QuizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  questions: [{ question: String, options: [String], answer: String }],
  time: {
    type: Number,
    required: true
  }
});

const Quiz = mongoose.model("Quiz", QuizSchema)

module.exports = Quiz