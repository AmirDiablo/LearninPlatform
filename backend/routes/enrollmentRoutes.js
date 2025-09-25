const express = require('express');
const userAuth = require("../middlewares/userAuth")
const Enrollment = require("../models/enrollmentsModel")
const {attendance} = require("../contollers/enrollmentController")
const router = express.Router();

router.patch("/attendance", userAuth, attendance)

module.exports = router