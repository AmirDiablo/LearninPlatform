const express = require('express');
const userAuth = require("../middlewares/userAuth")
const {pay, teacherPayments, studentPayments} = require("../contollers/paymentController")
const router = express.Router();

router.post("/", userAuth, pay)
router.get("/teacherPayments", userAuth, teacherPayments)
router.get("/studentPayments", userAuth, studentPayments)

module.exports = router