const Course = require("../models/courseModel")
const Account = require("../models/accountModel")
const teacherProfile = require("../models/teacherModel")
const Enrollment = require("../models/enrollmentsModel")
const Payment = require("../models/paymentModel")
const Review = require('../models/reviewModel')
const mongoose = require("mongoose")
const Teacher = require("../models/teacherModel")
const qs = require("qs")
const path = require("path")

const valid = ["Web development", "JS", "React", "HTML", "CSS", "Python", "Java", "Cyber security", "PHP", "Swift", "Web design", "Mobile development", "C++", "C#", "Redis", "MongoDB", "SQL", "React Native", "Flutter", "Git"]

const createCourse = async(req, res)=> {
    const {title, description, price, discount, level, category, userId} = req.body
    const categories = category.split(',')
    const thumbnail = req.file
    const thumbnailFile = thumbnail.filename

    const user = await Account.findById({_id: userId})
    if(!user || !user.roles == "teacher") {
      return res.status(403).json({message: "you must be teacher to do this!"})
    }

    const profile = await teacherProfile.findOne({userId})
    if(!profile || !profile.status == "approved") {
      return res.status(403).json({message: "teacher's profile is not approved"})
    }

    if(!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({message: "you should choose one category at least"})
    }

    if(!categories.every(cat=> valid.includes(cat))) {
      return res.status(400).json({message: "one or some of the categories is not valid"})
    }

    if(!title || !description) {
      return res.status(400).json({message: "title and description is required"})
    }


    const course = await Course.create({title, userId, description, price, discount, level, category: categories, thumbnail: thumbnailFile})

    res.status(200).json(course)
}

const addCurriculm = async (req, res) => {
    const {curriculm, courseId, lessonNames} = req.body
    const files = req.files

    if(!curriculm || !lessonNames.every(name=> name.length !== 0)) {
      return res.status(403).json({message: "curriculum and lesson names should be filled"})
    }

    let compeleteCurriculm = {
    sectionTitle: curriculm,
      lessons: lessonNames.map((name, i) => ({
          title: name,
          videoURL: files[i]?.filename
      }))
    }

    const course = await Course.findOneAndUpdate({_id: courseId}, {$push: {curriculm: compeleteCurriculm}})

    res.status(200).json(course)
}

const addLesson = async (req, res)=> {
    
    try {
        const {courseId, lessonName, curriculmId} = req.body
        
        const userId = req.user._id.toString()
        console.log(userId)
        const file = req.file
        const videoURL = file?.filename

        console.log(videoURL)

        // 1. اعتبارسنجی نقش استاد
        const user = await Account.findById(userId);
        if (!user || !user.roles == 'teacher') {
        return res.status(403).json({ message: 'دسترسی غیرمجاز: فقط اساتید می‌توانند درس اضافه کنند' });
        }

        // 2. بررسی پروفایل استاد
        const instructorProfile = await teacherProfile.findOne({ userId: userId });
        if (!instructorProfile || instructorProfile.status !== 'approved') {
        return res.status(403).json({ message: 'پروفایل استاد تأیید نشده است' });
        }

        // 3. پیدا کردن دوره
        const course = await Course.findById(courseId);
        if (!course) {
        return res.status(404).json({ message: 'دوره یافت نشد' });
        }

        // 4. بررسی مالکیت دوره
        if (course.userId.toString() !== userId) {
        return res.status(403).json({ message: 'شما اجازه ویرایش این دوره را ندارید' });
        }

        // 5. پیدا کردن فصل (section) در curriculum
        const section = course.curriculm.id(curriculmId);
        if (!section) {
        return res.status(404).json({ message: 'فصل یافت نشد' });
        }

        // 6. اعتبارسنجی داده‌های درس
        if (!lessonName) {
        return res.status(400).json({ message: 'عنوان درس الزامی است' });
        }

        // 7. اضافه کردن درس جدید به فصل
        section.lessons.push({
        title: lessonName,
        videoURL: videoURL || '',
        /* isFree: isFree || false, */
        });

        // 8. ذخیره تغییرات در دیتابیس
        await course.save();

        // 9. پاسخ به کاربر
        res.status(200).json({
        message: 'درس با موفقیت به فصل اضافه شد',
        course,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطا در سرور', error: error.message });
    }
};

const createLessons = async (req, res)=> {
     try {
    const parsedBody = qs.parse(req.body);

    console.log("titles: ", parsedBody.chapters[0].lessons[0].title)

    console.log("parsedBody: ", parsedBody)

    console.log("req.files: ", req.files)

    

    const courseId = parsedBody.courseId;
    if (!courseId) {
      return res.status(400).json({ error: "courseId ارسال نشده است" });
    }
    
    let currentLessonIndex = 0;
    let curriculums = []
    for(let i=0; i<parsedBody.chapters.length; i++) {
      let curriculum = {
        sectionTitle: parsedBody.chapters[i].title,
        lessons: []
      }
      for(let j=0; j<parsedBody.chapters[i].lessons.length; j++) {
        console.log(req.files[currentLessonIndex])
        curriculum.lessons.push({
          title: parsedBody.chapters[i].lessons[j].title,
          videoURL: req.files[currentLessonIndex].filename,
          isFree: false
        })
        currentLessonIndex = currentLessonIndex + 1
      }

      curriculums.push(curriculum)
    }

    console.log(curriculums)

    // به‌روزرسانی دوره در دیتابیس
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { curriculm: curriculums }, // اگر نام فیلد curriculum است، آن را تغییر دهید
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "دوره پیدا نشد" });
    }

    res.json({ message: "دوره با موفقیت به‌روزرسانی شد", course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطا در سرور" });
  }
}

const validCategories = async (req, res)=> {
    res.status(200).json(valid)
}

const teacherCourses = async(req, res) => {
    try{
      const {q} = req.query
      const courses = await Course.find({userId: q}).populate("userId")
      res.status(200).json(courses)
    }
    catch(error) {
      res.status(500).json({message: error.message})
    }
}

const deleteLesson = async (req, res) => {
    const {courseId, curriculmId, lessonId, userId} = req.body
    console.log(userId)
    
    const user = await Account.findById(userId);
    if (!user || !user.roles == "teacher") {
      return res.status(403).json({ message: 'دسترسی غیرمجاز: فقط اساتید می‌توانند درس حذف کنند' });
    }

    // 2. بررسی پروفایل استاد
    const instructorProfile = await teacherProfile.findOne({ userId: userId });
    if (!instructorProfile || instructorProfile.status !== 'approved') {
      return res.status(403).json({ message: 'پروفایل استاد تأیید نشده است' });
    }

    // 3. پیدا کردن دوره
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'دوره یافت نشد' });
    }

    // 4. بررسی مالکیت دوره
    if (course.userId.toString() !== userId) {
      return res.status(403).json({ message: 'شما اجازه ویرایش این دوره را ندارید' });
    }

    // 5. پیدا کردن فصل (section) در curriculum
    const section = course.curriculm.id(curriculmId);
    if (!section) {
      return res.status(404).json({ message: 'فصل یافت نشد' });
    }

    // 6. پیدا کردن و حذف درس
    const lessonIndex = section.lessons.findIndex(lesson => lesson._id.toString() === lessonId);
    if (lessonIndex === -1) {
      return res.status(404).json({ message: 'درس یافت نشد' });
    }

    // حذف درس از آرایه lessons
    section.lessons.splice(lessonIndex, 1);

    // 7. ذخیره تغییرات در دیتابیس
    await course.save();

    // 8. پاسخ به کاربر
    res.status(200).json({
      message: 'درس با موفقیت حذف شد',
      course,
    });
}

const editLesson = async(req, res) => {
    const {courseId, lessonId, curriculmId, title} = req.body
    const userId = req.user._id.toString()
    console.log(courseId, lessonId, curriculmId)

    const user = await Account.findById(userId);
    if (!user || !user.roles == "teacher") {
      return res.status(403).json({ message: 'دسترسی غیرمجاز: فقط اساتید می‌توانند درس حذف کنند' });
    }

    // 2. بررسی پروفایل استاد
    const instructorProfile = await teacherProfile.findOne({ userId: userId });
    if (!instructorProfile || instructorProfile.status !== 'approved') {
      return res.status(403).json({ message: 'پروفایل استاد تأیید نشده است' });
    }

    // 3. پیدا کردن دوره
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'دوره یافت نشد' });
    }

    // 4. بررسی مالکیت دوره
    if (course.userId.toString() !== userId) {
      return res.status(403).json({ message: 'شما اجازه ویرایش این دوره را ندارید' });
    }

    // 5. پیدا کردن فصل (section) در curriculum
    const section = course.curriculm.id(curriculmId);
    if (!section) {
      return res.status(404).json({ message: 'فصل یافت نشد' });
    }

    // 6. پیدا کردن و ویرایش درس
    const lesson = section.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'درس یافت نشد' });
    }

    if(!title || !title.trim() === '') {
        return res.status(400).json({message: "عنوان جدید درس الزامی است"})
    }

    lesson.title = title.trim()

    // 7. ذخیره تغییرات در دیتابیس
    await course.save();

    // 8. پاسخ به کاربر
    res.status(200).json({
      message: 'درس با موفقیت حذف شد',
      course,
    });
}

const allCourses = async (req, res) => {
  const page = Number(req.query.page) || 1
  const countPerPage = 10
  const skip =( page - 1 )* countPerPage

  try{
    const courseCount = await Course.countDocuments({})
    const pageCount = Math.ceil(courseCount / countPerPage)
    const courses = await Course.find({}).skip(skip).limit(10).populate('userId')
    res.status(200).json({courses, pageCount})
  }
  catch(error) {
    res.status(400).json(error)
  }
}

const findCourses = async (req, res)=> {
  const {search, rating, price, category, level} = req.body
  
  let query;
  if(search || search !== "") {
    query = {$text: { $search: search }}
  }else{
    query = {}
  }

  if(price !== undefined) {
    query.price = {$lte: price}
  }

  if(category !== "all") {
    query.category = category
  }

  if(level !== "all") {
    query.level = level
  }

  query.rating = rating

  const countPerPage = 10

  let searchCourse;
  let searchTeacher;
  if(search) {
    searchCourse = await Course.find({$and: [query]}, {
      score: { $meta: "textScore" }
    }).sort({ score: { $meta: "textScore" } }).populate("userId")

    searchTeacher = await Account.find({username: {$regex: search, $options: 'i'}})
  }else{
    searchCourse = await Course.find({$and: [query]}).populate("userId")
  }

  const courseCount = searchCourse.length
  const pageCount = Math.ceil(courseCount / countPerPage)

  res.status(200).json({courses:searchCourse, pageCount: pageCount, teachers: searchTeacher})
}

const courseDetails = async (req, res)=> {
  const {id} = req.query
  
  try{
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("this is not a valid Id")
    }

    const check = await Course.findOne({_id: id}).populate("userId")

    if(!check) {
      throw new Error("result not found!")
    }

    res.status(200).json([check])
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

const playLesson = async (req, res) => {
  
  try {
  const { courseId, sectionId, lessonId } = req.body;
  const userId = req.user._id.toString(); // فرضاً از JWT برای احراز هویت

  // 1. اعتبارسنجی نقش کاربر
  const user = await Account.findById(userId);
  if (!user || !user.roles == 'student') {
    return res.status(403).json({ message: 'دسترسی غیرمجاز: فقط دانشجویان می‌توانند درس را مشاهده کنند' });
  }

  // 2. بررسی ثبت‌نام در دوره
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
  });
  if (!enrollment) {
    return res.status(403).json({ message: 'شما در این دوره ثبت‌نام نکرده‌اید' });
  }

  // 3. بررسی پرداخت موفق
  const payment = await Payment.findOne({
    userId,
    courseId,
    status: 'success',
  });
  if (!payment) {
    return res.status(403).json({ message: 'پرداخت برای این دوره انجام نشده است' });
  }

  // 4. پیدا کردن دوره
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'دوره یافت نشد' });
  }

  // 5. پیدا کردن فصل (section) در curriculum
  const section = course.curriculm.id(sectionId);
  if (!section) {
    return res.status(404).json({ message: 'فصل یافت نشد' });
  }

  // 6. پیدا کردن درس
  const lesson = section.lessons.id(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: 'درس یافت نشد' });
  }

  // 7. بررسی درس رایگان (اختیاری)
  // اگر درس رایگان است، نیازی به ثبت‌نام یا پرداخت نیست
  if (lesson.isFree) {
    return res.status(200).json({
      message: 'دسترسی به درس آزاد است',
      videoURL: lesson.videoURL,
    });
  }

  // 8. ارائه دسترسی به درس
  res.status(200).json({
    message: 'دسترسی به درس تأیید شد',
    videoURL: lesson.videoURL,
    lessonTitle: lesson.title,
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در سرور', error: error.message });
  }

}

const rate = async (req, res) => {
  try{
    const {rate, courseId, comment, teacherId} = req.body
    const userId = req.user._id.toString()

    if(!comment || comment == "") {
      throw new Error("please fill the comment input")
    }

    const isExist = await Review.findOne({userId, courseId})

    if(isExist) {
      throw new Error("each user can only rate a course one time")
    }

    const preCount = await Review.countDocuments({courseId})
    const preSum = await Review.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: "$courseId",
          totalRating: { $sum: "$rating" }
        }
      }
    ])

    const preSumNumber = preSum[0]?.totalRating == undefined ? 0 : preSum[0]?.totalRating

    const rating = await Review.create({userId, courseId, rating: rate, comment})
    const count = preCount+1
    const sum = Number(preSumNumber)+Number(rate)  
    const avg = sum / count
    const updateRating = await Course.findOneAndUpdate({_id: courseId}, {rating: avg})
    const courses = await Course.find({userId: teacherId})
    console.log(courses)
    const rates = courses.map(course=> course.rating)
    console.log(rates)
    let rateSum = 0
    const rateCount = rates.length;
    console.log(rateCount)
    rates.map(rate=> rateSum = rate+rateSum)
    console.log(rateSum)
    const avgRate = rateSum / rateCount
    console.log(avgRate)
    const teacherRating = await Teacher.findOneAndUpdate({userId: teacherId}, {$set: {rating: avgRate}})
    res.status(200).json(rating)
  }
  catch(error) {
    res.status(400).json({message: error.message})
  }
}

const reviews = async(req, res)=> {
  const {courseId, page} = req.query
  const pageNumber = Number(page)
  const perPage = 10
  const skip = (pageNumber - 1) * perPage

  const review = await Review.find({courseId}).skip(skip).limit(perPage).populate("userId")
  res.status(200).json(review)
}

const enrollmentStatics = async (req, res) => {
    const teacherId = req.user._id.toString()

    const courses = (await Course.find({userId: teacherId}, {_id: 1}))
    let coursesIds = []
    courses.forEach(item=> coursesIds.push(item._id.toString()))
}

const bought = async (req, res)=> {
  try{
    const userId = req.user._id.toString()

    const isStudent = await Account.findOne({_id: userId, roles: "student"})
    if(!isStudent) {
      throw new Error("Only students can visit this page")
    }

    const courses = await Enrollment.find({studentId: userId})
    .populate({
        path: "courseId",
        populate: {
            path: "userId"
        }
    })

    res.status(200).json(courses)
  }
  catch(error) {
    res.status(500).json({message: error.message})
  }


    


}

const changeDiscount = async(req, res)=> {
    const teacherId = req.user._id.toString()
    const {courseId, discount} = req.body

    const isTeacher = await Teacher.findOne({userId: teacherId})
    if(!isTeacher) {
      res.status(401).json({message: "only teachers can do this action"})
    }

    const isOwner = await Course.findOne({userId: teacherId, _id: courseId})
    if(!isOwner) {
      res.status(401).json({message: "only the owner of this course can change the course infos"})
    }

    const change = await Course.findOneAndUpdate({_id: courseId}, {$set: {discount: discount}})
    res.status(200).json({message: "discount submitted successfully"})
}


module.exports = {createCourse, validCategories, addCurriculm, teacherCourses, addLesson, deleteLesson, editLesson, allCourses, findCourses, courseDetails, playLesson, rate, reviews, enrollmentStatics, createLessons, bought, changeDiscount}