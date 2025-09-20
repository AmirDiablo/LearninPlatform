require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const verificationRoutes = require("./routes/verification")
const userRoutes = require("./routes/accountRoutes")
const courseRoutes = require("./routes/courseRoutes")
const quizRoutes = require("./routes/quizRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const path = require("path")

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // اگر از کوکی یا header خاص استفاده می‌کنی
}));
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())
app.use("/uploads", express.static("uploads"))

//routes
app.use("/api/verification", verificationRoutes)
app.use("/api/user", userRoutes)
app.use("/api/course", courseRoutes)
app.use("/api/quiz", quizRoutes)
app.use("/api/payment", paymentRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    app.listen(process.env.PORT, ()=> {
        console.log("connected to DB and server start listen on port", process.env.PORT)
    })
})
.catch((err)=> {
    console.log(err)
})