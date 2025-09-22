const express = require('express');
const userAuth = require("../middlewares/userAuth")
const router = express.Router();
const {createQuiz, teacherQuizes, AllQuizes, getQuiz} = require("../contollers/quizController")

router.post("/", userAuth, createQuiz)
router.get("/teacherQuizes", userAuth, teacherQuizes)
router.get("/AllQuizes", userAuth, AllQuizes)
router.get("/participate", userAuth, getQuiz)

module.exports = router