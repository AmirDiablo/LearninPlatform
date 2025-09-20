const mongoose = require("mongoose")
const Payment = require("../models/paymentModel");
const Course = require("../models/courseModel");
const Account = require("../models/accountModel");
const Teacher = require("../models/teacherModel")

const pay = async (req, res) => {
    const userId = req.user._id.toString()
    const date = new Date(Date.now());
    const {courseId, transactionId} = req.body

    const course = await Course.findOne({_id: courseId})
    const amount = course.price

    const payment = await Payment.create({userId, courseId, transactionId, paymentDate: date, amount, status: "success"})
    res.status(200).json(payment)
}

const teacherPayments = async(req, res)=> {
    const teacherId = req.user._id.toString()

    const isTeacher = await Teacher.findOne({userId: teacherId})
    if(!isTeacher) {
        res.status(401).json({message: "only teachers can access to these datas"})
    }

    const courses = await Course.find({userId: teacherId})
    const courseIds = courses.map(course=> course._id)

    const payments = await Payment.find({courseId: {$in: courseIds}}).populate("userId").populate("courseId")
    console.log(payments)
    res.status(200).json(payments)
}

studentPayments = async(req, res)=> {
    const userId = req.user._id.toString()
    const payment = await Payment.find({userId}).populate("userId").populate("courseId")

    res.status(200).json(payment)
}

module.exports = {pay, teacherPayments, studentPayments}