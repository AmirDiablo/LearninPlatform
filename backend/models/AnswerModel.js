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
    answers: mongoose.Schema.Types.Mixed,
    score: {
        type: Number
    },
    isFinished: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Answer = mongoose.model("Answer", AnswerSchema)

module.exports = Answer