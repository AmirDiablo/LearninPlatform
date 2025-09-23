const cron = require("node-cron")
const Answer = require("./models/AnswerModel")
const Quiz = require("./models/quizModel")

function startSchedule() {
    //runs every 30 sec
    cron.schedule('*/30 * * * * *', async()=> {
        try{
            const currentTime = new Date()
            let answers = await Answer.find({isFinished: false})
            answers.forEach(async(item)=> {
                const quiz = await Quiz.findOne({_id: item.quizId})
                const start = item.createdAt
                const time = new Date(start);
                const end = new Date(time.getTime() + quiz.time * 1000);
                
                if(currentTime >= end) {
                    const change = await Answer.findOneAndUpdate({_id: item._id}, {$set: {isFinished: true}})
                }
            })
        }catch (error) {
            console.log(error)
        }
    })
}

module.exports = startSchedule