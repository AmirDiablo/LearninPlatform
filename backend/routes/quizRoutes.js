const express = require('express');
const userAuth = require("../middlewares/userAuth")
const router = express.Router();
const {createQuiz, teacherQuizes, AllQuizes} = require("../contollers/quizController")

router.post("/", userAuth, createQuiz)
router.get("/teacherQuizes", userAuth, teacherQuizes)
router.get("/AllQuizes", userAuth, AllQuizes)

module.exports = router