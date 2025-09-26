const mongoose = require("mongoose")
const Account = require("../models/accountModel")
const Course = require("../models/courseModel")
const Quiz = require("../models/quizModel")
const Enrollment = require("../models/enrollmentsModel")
const Answer = require("../models/AnswerModel")

const createQuiz = async(req, res) => {
    const userId = req.user._id.toString()
    const {questions, courseId, time} = req.body

    const isTeacher = await Account.findOne({_id: userId, roles: "teacher"})
    if(!isTeacher) {
        throw new Error("You should be a teacher to do this action")
    }

    if(!questions || !time || !courseId) {
        throw new Error("Questions, course and time are required!")
    }

    const secFromat = 30 * 60

    const createQuiz = await Quiz.create({courseId, time: secFromat, questions})

    res.status(200).json(createQuiz)
}

const teacherQuizes = async(req, res) => {
    try{
        const userId = req.user._id.toString()

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("the Object id is not valid")
        }

        const isTeacher = await Account.findOne({_id: userId, roles: "teacher"})
        if(!isTeacher) {
            throw new Error("Only teachers can get this data")
        }
        
        const courses = await Course.find({userId})

        const courseIds = courses.map(course => course._id);

        const quizes = await Quiz.find({ courseId: { $in: courseIds } }).populate("courseId")

        res.status(200).json(quizes)
    }
    catch(error) {
        res.status(400).json({message: error.message})
    }
}

const AllQuizes = async (req, res) => {
    try {
    const studentId = req.user._id; // از توکن JWT

    // 1. پیدا کردن دوره‌های ثبت‌نام‌شده توسط دانشجو
    const enrollments = await Enrollment.find({ studentId }).select('courseId');
    const courseIds = enrollments.map(enrollment => enrollment.courseId);

    // 2. پیدا کردن تمام quizzes مرتبط با دوره‌های ثبت‌نام‌شده
    const allQuizzes = await Quiz.find({ courseId: { $in: courseIds } }).select('_id time questions title courseId').populate("courseId");

    if (!allQuizzes.length) {
      return res.status(200).json({
        message: 'هیچ کوییزی یافت نشد',
        participated: [],
        notParticipated: [],
      });
    }

    // 3. پیدا کردن quizzes که دانشجو شرکت کرده (بر اساس Answer)
    const answeredQuizzes = await Answer.find({ studentId }).select('quizId');
    const answeredQuizIds = answeredQuizzes.map(answer => answer.quizId.toString());

    // 4. جداسازی quizzes شرکت‌کرده و شرکت‌نکرده
    const participated = allQuizzes.filter(quiz => answeredQuizIds.includes(quiz._id.toString()));
    const notParticipated = allQuizzes.filter(quiz => !answeredQuizIds.includes(quiz._id.toString()));

    console.log("participated: "+participated)

    res.status(200).json({
      message: 'لیست کوییزها',
      participated,
      notParticipated,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'خطا در سرور', error: error.message });
  }
};


const getQuiz = async (req, res) => {
    try{
        const userId = req.user._id.toString()
        const {quizId} = req.query

        const isPayed = await Enrollment.findOne({studentId: userId})
        if(!isPayed) {
            throw new Error("You should pay first")
        }

        const isParticipated = await Answer.findOne({studentId: userId, quizId: quizId, isFinished: true})
        if(isParticipated) {
            throw new Error("you can only participate one time")
        }

        const isExist = await Answer.findOne({studentId: userId, quizId, isFinished: false})

        const quiz = await Quiz.findOne({_id: quizId})

        let remained;

        if(!isExist) {
            const participation = await Answer.create({quizId, studentId: userId, isFinished: false})
            remained = quiz.time
        }else{
            //this part is for the situation that a user come back and continue the quiz
            const startTime = isExist.createdAt
            const time = new Date(startTime);
            const endTime = new Date(time.getTime() + quiz.time * 1000);
            const currentTime = new Date()
            const remainingMilliseconds = endTime.getTime() - currentTime.getTime();
            const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
            remained = remainingSeconds
        }

        
        res.status(200).json({quiz, remained: remained })
    }
    catch(error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}

const submitQuiz = async (req, res)=> {
    try{
        const userId = req.user._id.toString()
        const {quizId, answers} = req.body

        const DuplicateCheck = await Answer.findOne({quizId, studentId: userId, isFinished: true})
        if(DuplicateCheck) {
            throw new Error("you submited it before")
        }

        const quiz = await Quiz.findOne({_id: quizId})

        let corrects = 0;
        Object.keys(answers).map(item=> { if(answers[item] == quiz.questions[Number(item)].answer) {corrects = corrects + 1} } )

        const percent = corrects * 100 / quiz.questions.length

        console.log(corrects, percent)


        const submit = await Answer.findOneAndUpdate({quizId: quizId, studentId: userId}, {$set: {answers: answers, isFinished: true, score: percent}})
        res.status(200).json(submit)
    }
    catch(error) {
        res.status(400).json({message: error.message})
    }
}

const quizResult = async (req, res) => {
    const userId = req.user._id.toString()
    const {quizId} = req.query

    const userAnswers = await Answer.findOne({studentId: userId, quizId}).populate("studentId")
    const quiz = await Quiz.findOne({_id: quizId})

    res.status(200).json({answer: userAnswers, quiz})
}

const quizStatics = async (req, res) => {
    const {quizId} = req.query

    const findQuiz = await Quiz.findOne({_id: quizId})
    const particiapteCount = await Answer.countDocuments({quizId: quizId})
    const enrollment = await Enrollment.countDocuments({courseId: findQuiz.courseId})

    const group = await Answer.aggregate([
        { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
        { $addFields: { numericScore: { $toInt: "$score" } } }, // تبدیل رشته به عدد
        {
            $facet: {
            highScores: [
                { $match: { numericScore: { $gte: 80, $lte: 100 } } },
                { $count: "count" }
            ],
            midScores: [
                { $match: { numericScore: { $gte: 60, $lt: 80 } } },
                { $count: "count" }
            ],
            lowScores: [
                { $match: { numericScore: { $lt: 60 } } },
                { $count: "count" }
            ]
            }
        }
    ]);

    const response = {
        particiapteCount: particiapteCount,
        enrollment: enrollment,
        levels: [
            {level: "High Score", count: group[0].highScores[0]?.count || 0},
            {level: "Middle Score", count: group[0].midScores[0]?.count || 0},
            {level: "Low Score", count: group[0].lowScores[0]?.count || 0}
        ]
    }

    res.status(200).json([response])

}

module.exports = {createQuiz, teacherQuizes, AllQuizes, getQuiz, submitQuiz, quizResult, quizStatics}