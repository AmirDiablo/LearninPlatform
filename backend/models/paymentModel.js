const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Account', 
    required: true 
  }, // لینک به کاربر (دانشجو)
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  }, // لینک به دوره
  amount: { type: Number, required: true }, // مبلغ پرداخت‌شده
  transactionId: { type: String, required: true, unique: true }, // شناسه تراکنش از درگاه
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' }, // وضعیت
  paymentDate: { type: Date, default: Date.now },
});

// Indexها
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ userId: 1, courseId: 1 });

const Payment = mongoose.model("PAyment", PaymentSchema)

module.exports = Payment