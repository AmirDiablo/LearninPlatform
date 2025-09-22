const mongoose = require("mongoose")

const AnswerSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Types.ObjectId, ref: "Quiz",
        required: true
    },
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
        required: true
    },
    answers: {
        type: String
    },
    score: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const Answer = mongoose.model("Answer", AnswerSchema)

module.exports = Answer