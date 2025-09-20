const mongoose = require("mongoose")

const EnrollmentSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Account', 
    required: true 
  }, // لینک به دانشجو
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  }, // لینک به دوره
  enrollmentDate: { type: Date, default: Date.now }, // تاریخ ثبت‌نام
  progress: { type: Number, default: 0 }, // درصد پیشرفت (0-100)
  completed: { type: Boolean, default: false }, // آیا دوره تکمیل شده؟
  certificateIssued: { type: Boolean, default: false } // آیا گواهی صادر شده؟
});

// Indexها (برای جلوگیری از ثبت‌نام تکراری)
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema)

module.exports = Enrollment