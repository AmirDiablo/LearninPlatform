const mongoose = require("mongoose")
const Enrollment = require("../models/enrollmentsModel")
const Course = require("../models/courseModel")
const {redisClient} = require("../redisClient")

const attendance = async (req, res) => {
    const {courseId, curriculumId, lessonId} = req.body
    const userId = req.user._id.toString()

    const course = await Course.findById(courseId);

    const getLessonIndex = ()=> {
        let index = 0;
        for (const section of course.curriculm) {
            for (const lesson of section.lessons) {
            if (lesson._id.toString() === lessonId.toString()) {
                return index + 1; // چون اندیس از صفر شروع میشه
            }
            index++;
            }
        }

        return -1; // اگر پیدا نشد
    }


    let lessonCount = 0;
    for (const section of course.curriculm) {
        for (const lesson of section.lessons) {
            lessonCount = lessonCount + 1
        }
    }
    

    const sessionNumber = getLessonIndex(course, lessonId);

    if (sessionNumber !== -1) {
        console.log(`این درس جلسه شماره ${sessionNumber} از کل دوره است.`);
    } else {
        console.log("درس مورد نظر پیدا نشد.");
    }

    const bitmapKey = `${userId}:${courseId}`
    const submitAttendance = await redisClient.SETBIT(bitmapKey, sessionNumber, 1)

    const countBitmap = await redisClient.BITCOUNT(bitmapKey)
    const percent = countBitmap * 100 / lessonCount

    console.log(lessonCount)

    const updateProgress = await Enrollment.findOneAndUpdate({studentId: userId, courseId}, {$set: {progress: percent}})

    res.status(200).json(sessionNumber)
}

module.exports = {attendance}