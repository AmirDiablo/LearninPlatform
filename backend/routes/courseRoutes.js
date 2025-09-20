const express = require('express');
const uploadThumbnail = require("../uploadThumbnail")
const uploadLessons = require("../uploadLessons")
const userAuth = require("../middlewares/userAuth")
const {createCourse, validCategories, addCurriculm, teacherCourses, addLesson, deleteLesson, editLesson, allCourses, findCourses, courseDetails, playLesson, rate, reviews, enrollmentStatics, createLessons, bought} = require("../contollers/courseController")
const router = express.Router();

router.post("/", uploadThumbnail.single('thumbnail'), createCourse)
router.post("/addLessons", uploadLessons.array("lesson"), addCurriculm)
router.get("/categories", validCategories)
router.get('/teacherCourses', teacherCourses)
router.patch("/addLesson",  userAuth, uploadLessons.single("lessonFile"), addLesson)
router.patch("/deleteLesson", userAuth, deleteLesson)
router.patch("/editLesson", userAuth, editLesson)
router.get("/allCourses", allCourses)
router.post("/filter", findCourses)
router.get("/courseDetails", courseDetails)
router.post("/playLesson", userAuth, playLesson)
router.patch("/rating", userAuth, rate)
router.get("/reviews", reviews)
router.get("/enrollmentStatics", userAuth, enrollmentStatics)
router.post("/createLessons", uploadLessons.any(), createLessons)
router.get("/bought", userAuth, bought)

module.exports = router