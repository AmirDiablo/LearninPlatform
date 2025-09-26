const validator = require("validator")
const jwt = require("jsonwebtoken")
const Account = require("../models/accountModel")
const Teacher = require("../models/teacherModel")
const Course = require("../models/courseModel")
const Enrollment = require("../models/enrollmentsModel")
const mongoose = require("mongoose")
const Payment = require("../models/paymentModel")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const path = require("path")

const createToken = (_id)=> {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: "10d" })
}

const trimer = (value)=> {
    return validator.trim(validator.escape(value).replace(" ", ""))
}

const signup = async (req, res)=> {
    const {username, email, password, role} = req.body
    const profile = req.file
    const profileName = profile.filename
    const newUsername = validator.trim(username)
    const newEmail = trimer(email)
    const newPassword = trimer(password)

    try{
        const account = await Account.signup(newUsername, newEmail, newPassword, role, profileName)
        const token = createToken(account._id)
        res.status(200).json({id: account._id , token})
    }catch(error){
        res.status(400).json({ error: error.message })
    }
}

const completeTeachersSignup = async (req, res) => {
    const {bio, website, linkedIn, userId} = req.body
    const resume = req.file
    const resumeFile = resume.filename

    const check = await Account.findOne({userId})
    if(!userId) {
        return res.status(404).json({message: "user not found"})
    }

    console.log(bio)

    if(!bio || !resumeFile) {
        throw new Error("bio and resume should be filled")
    }

    const TeacherProfile = await Teacher.create({userId, bio, resume: resumeFile, linkedIn, website})

    res.status(200).json(TeacherProfile)
}

const userLogin = async(req, res)=> {
    const { email, password } = req.body
    const newEmail = trimer(email)
    const newPassword = trimer(password)

    try{
        const account = await Account.login(newEmail, newPassword)

        const token = createToken(account._id)

        res.status(200).json({id: account._id, token})
    }catch(error){
        res.status(400).json({ error: error.message })
    }
}

const userInfo = async(req, res)=> {
    const id = req.query.q
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("No such user")
        }

        const userInfo = await Account.find({_id: id})
        res.status(200).json(userInfo)
    }
    catch(err) {
        res.status(404).json({error: err.message})
    }
}

const teacherInfo = async(req, res) => {
    const id = req.query.q

    const userInfo = await Teacher.find({userId: id}).populate("userId")

    res.status(200).json(userInfo)
}

const teacherStatics = async(req, res) => {
    try{
        const userId = req.user._id.toString()

        const isTeacher = await Teacher.findOne({userId})
        if(!isTeacher) {
            throw new Error("only teachers have access to these datas")
        }

        const courses = await Course.find({userId})
        const courseCount = courses.length

        //get teacher neccesary information
        const teacher = await Teacher.findOne({userId}).populate({path: "userId", select: 'username profile'}).select({userId: 1, rating: 1, studentCount: 1})

        //make a list of all teacher's course ids
        let coursesIds = []
        courses.forEach(item=> coursesIds.push(item._id))

        const payments = await Payment.find({courseId: {$in: coursesIds}})
        let totalIncome = 0;
        payments.map(item=> totalIncome = totalIncome + item.amount)

        const enrollmentCounts = await Enrollment.aggregate([
            { $match: { courseId: { $in: coursesIds } } },
            { $group: {
                _id: "$courseId",
                count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                from: "courses", // نام کالکشن دوره‌ها
                localField: "_id", // courseId از Enrollment
                foreignField: "_id", // _id از Course
                as: "course"
                }
            },
            {
                $unwind: "$course" // چون lookup یک آرایه برمی‌گردونه
            },
            {
                $project: {
                _id: 0,
                courseId: "$_id",
                courseTitle: "$course.title", // یا هر فیلدی که اسم دوره رو نگه می‌داره
                count: 1
                }
            }
        ]);

        let totalEnrollment = 0;
        enrollmentCounts.map(item=> totalEnrollment = totalEnrollment + item.count)

        const finishedCount = await Enrollment.countDocuments({courseId: {$in: coursesIds}, completed: true})

        const response = {
            id: teacher.userId._id,
            username: teacher.userId.username,
            profile: teacher.userId.profile,
            rating: teacher.rating,
            studentCount: teacher.studentCount,
            courseCount: courseCount,
            income: totalIncome,
            enrollmentCounts,
            totalEnrollment,
            finishedCount
        }

        res.status(200).json([response])
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }

}

const liveSearch = async(req, res)=> {
    try{
        const q = req.query.q || ''
        console.log(q)
        if(!q) {
            return res.status(200).json([])
        }

        const results = await Account.find({username: {$regex: q, $options: 'i'}}).limit(10)
        res.status(200).json(results)
    }catch (error) {
        res.status(500).send("Server error")
    }
}

const editProfile = async(req, res)=> {

     try {
        const id = req.user._id.toString()
        const uploadedFile = req.files.profile[0].filename;
        const { name, bio, instagram, linkedIn, youtube } = req.body;
        const newName = validator.escape(name)
        const newBio = validator.escape(bio)

        const currentProfile = await Account.find({ _id: id }, { profile: 1, _id: 0 });
        
        if(uploadedFile) {
            // ابتدا آپدیت را انجام دهید
            const profilePhoto = await Account.findOneAndUpdate(
                { _id: id },
                { $set: { profile: uploadedFile, username: newName } },
                { new: true } // این گزینه باعث می‌شود سند آپدیت شده برگردانده شود
            );

            // سپس فایل قدیمی را حذف کنید
            if(currentProfile[0].profile) {
                const oldProfilePath = path.join(__dirname, "..", "uploads", "profiles", currentProfile[0].profile);
                console.log("Old profile path:", oldProfilePath);

                if (fs.existsSync(oldProfilePath)) {
                    fs.unlink(oldProfilePath, (err) => {
                        if (err) console.log("Error deleting old profile:", err);
                        else console.log("Old profile deleted successfully");
                    });
                }
            }else{
                console.log("not exists")
            }

        }else{
            const profilePhoto = await Account.findOneAndUpdate(
                { _id: id },
                { $set: { username: newName } },
                { new: true } // این گزینه باعث می‌شود سند آپدیت شده برگردانده شود
            );
        }
        
        const updateTeacher = await Teacher.findOneAndUpdate({userId: id}, {bio: newBio, instagram, linkedin: linkedIn, youtube: youtube})

        res.json("submited");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
    
}

const continueWithGoogle = async(req, res)=> {
    const {googleId, username, email} = req.body
    const check = await Account.findOne({email})
    let user;

    try{
        //login
        if(check) {
            user = check
        }else{
            const account = await Account.create({username, email, googleId, isArtist: false}) 
            user = account
        }

        const token = createToken(user._id)
        res.status(200).json({id: user._id, token})
    }catch(err) {
        res.status(500).json({error: err.message})
    }
}

const changePass = async(req, res)=> {
    const {currentPass, newPass, id} = req.body
    const user = await Account.findOne({_id: id})
    const match = await bcrypt.compare(currentPass, user.password)

    try{
        if(!match) {
            console.log("false")
            throw new Error("the password you entered is not match with the one that exist in database")
        }

        console.log('true')
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPass, salt)
        const change = await Account.updateOne({_id: id}, {password: hash})
        res.status(200).json("sumbited")
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
 
}

const setPass = async(req, res)=> {
    const {newPass, id} = req.body
    
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPass, salt)
        const setPass = await Account.updateOne({_id: id}, {password: hash})
        res.status(200).json(setPass)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const Studentinfos = async (req, res)=> {
    const userId = req.user._id.toString()

    let account = await Account.findOne({_id: userId, roles: "student"})

    if(!account) {
        throw new Error("only students can visit this page")
    }

    const studentEnrollments = await Enrollment.find({studentId: userId}, {courseId: 1, progress: 1, _id: 0})
    const coursesIds = studentEnrollments.map(item=> item.courseId)
    const findCourse = await Course.find({_id: {$in: coursesIds}})
    const courses = [];
    for(let i=0; i<findCourse.length; i++) {
        courses.push({course: findCourse[i], progress: studentEnrollments[i].progress})
    }

    const categories = findCourse.map(item=> item.category)
    const allCategories = []
    for(let i=0; i<categories.length; i++) {
        for(let j=0; j<categories[i].length; j++) {
            allCategories.push(categories[i][j])
        }
    } 

    const uniqueCategories = [...new Set(allCategories)];
    
    const Recommended = await Course.find({category: {$in: uniqueCategories}, _id: {$nin: coursesIds}})

    console.log(Recommended)
    
    const response = {
        _id: account._id,
        username: account.username,
        profile: account.profile,
        courses: courses,
        recommended: Recommended
    }

    res.status(200).json(response)
    
}

const studentEditProfile = async(req, res) => {
    const userId = req.user._id.toString()
    const {name} = req.body
    const profile = req.file.filename

    const currentProfile = await Account.find({ _id: userId }, { profile: 1, _id: 0 });

    const profilePhoto = await Account.findOneAndUpdate(
        { _id: userId },
        { $set: { profile: profile, username: name } },
        { new: true } // این گزینه باعث می‌شود سند آپدیت شده برگردانده شود
    );

    // سپس فایل قدیمی را حذف کنید
    if(currentProfile[0].profile) {
        const oldProfilePath = path.join(__dirname, "..", "uploads", "profiles", currentProfile[0].profile);
        console.log("Old profile path:", oldProfilePath);

        if (fs.existsSync(oldProfilePath)) {
            fs.unlink(oldProfilePath, (err) => {
                if (err) console.log("Error deleting old profile:", err);
                else console.log("Old profile deleted successfully");
            });
        }
    }else{
        console.log("not exists")
    }

    res.status(200).json(profilePhoto)
}

module.exports = { signup, userInfo, liveSearch, userLogin, editProfile, continueWithGoogle, changePass, setPass, completeTeachersSignup, teacherInfo, Studentinfos, studentEditProfile, teacherStatics }