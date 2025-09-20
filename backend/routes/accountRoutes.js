const express = require('express');
const router = express.Router();
const uplaodProfile = require("../uploadProfile")
const uploadResume = require("../uploadResume")
const userAuth = require("../middlewares/userAuth")
const {signup, userLogin, userInfo, continueWithGoogle, completeTeachersSignup, editProfile, teacherInfo, Studentinfos, studentEditProfile} = require("../contollers/userController")

router.post("/signup", uplaodProfile.single("profile"),signup)
router.post("/login", userLogin)
router.get('/userInfo', userInfo)
router.post('/googleSign', continueWithGoogle)
router.post("/teacherProfile", uploadResume.single("resume"), completeTeachersSignup)
router.patch("/editProfile", uplaodProfile.fields([{name: "name", maxCount: 1}, {name: "profile", maxCount: 1}, {name: "id", maxCount: 1}]), userAuth, editProfile)
router.get("/teacherInfo", teacherInfo)
router.get("/infos", userAuth, Studentinfos)
router.patch("/editStudentProfile", uplaodProfile.single("profile"), userAuth, studentEditProfile)

module.exports = router