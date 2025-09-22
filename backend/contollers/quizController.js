const mongoose = require("mongoose")
const Account = require("../models/accountModel")
const Course = require("../models/courseModel")
const Quiz = require("../models/quizModel")
const Enrollment = require("../models/enrollmentsModel")
const Answer = require("../models/AnswerModel")

const createQuiz = async(req, res) => {
    const userId = req.user._id.toString()
    const {questions, courseId, time} = req.body

    const isTeacher = await Account.findOne({_id: userId, roles: "teacher"})
    if(!isTeacher) {
        throw new Error("You should be a teacher to do this action")
    }

    if(!questions || !time || !courseId) {
        throw new Error("Questions, course and time are required!")
    }

    const secFromat = 30 * 60

    const createQuiz = await Quiz.create({courseId, time: secFromat, questions})

    res.status(200).json(createQuiz)
}

const teacherQuizes = async(req, res) => {
    try{
        const userId = req.user._id.toString()

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("the Object id is not valid")
        }

        const isTeacher = await Account.findOne({_id: userId, roles: "teacher"})
        if(!isTeacher) {
            throw new Error("Only teachers can get this data")
        }
        
        const courses = await Course.find({userId})

        const courseIds = courses.map(course => course._id);

        const quizes = await Quiz.find({ courseId: { $in: courseIds } }).populate("courseId")

        res.status(200).json(quizes)
    }
    catch(error) {
        res.status(400).json({message: error.message})
    }
}

const AllQuizes = async (req, res)=> {
    const userId = req.user._id.toString()
    const courses = await Enrollment.find({studentId: userId}, {courseId: 1, _id: 0})
    const coursesIds = courses.map(course=> course.courseId.toString())
    const quizes = await Quiz.find({courseId: {$in: coursesIds}}).populate("courseId")
    res.status(200).json(quizes)
}

const getQuiz = async (req, res) => {
    try{
        const userId = req.user._id.toString()
        const {quizId} = req.query

        console.log(userId, quizId)

        const isPayed = await Enrollment.findOne({studentId: userId})
        if(!isPayed) {
            throw new Error("You should pay first")
        }

        const isParticipated = await Answer.findOne({studentId: userId, quizId: quizId})
        if(isParticipated) {
            throw new Error("you can only participate one time")
        }

        const quiz = await Quiz.findOne({_id: quizId})

        res.status(200).json([quiz])
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {createQuiz, teacherQuizes, AllQuizes, getQuiz}