const mongoose = require("mongoose")
const Account = require("../models/accountModel")
const Course = require("../models/courseModel")
const Quiz = require("../models/quizModel")
const Enrollment = require("../models/enrollmentsModel")

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
    const quizes = await Quiz.find({courseId: {$in: coursesIds}})
    res.status(200).json(quizes)
}

module.exports = {createQuiz, teacherQuizes, AllQuizes}