const express = require('express');
const userAuth = require("../middlewares/userAuth")
const router = express.Router();
const {createQuiz, teacherQuizes, AllQuizes, getQuiz, submitQuiz, quizResult} = require("../contollers/quizController")

router.post("/", userAuth, createQuiz)
router.get("/teacherQuizes", userAuth, teacherQuizes)
router.get("/AllQuizes", userAuth, AllQuizes)
router.get("/participate", userAuth, getQuiz)
router.patch("/submitQuiz", userAuth, submitQuiz)
router.get("/quizResult", userAuth, quizResult)

module.exports = router