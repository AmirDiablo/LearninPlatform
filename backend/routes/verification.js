const express = require('express');
const router = express.Router();
const Verification = require('../models/verificationModel');
const Account = require("../models/accountModel")
const bcrypt = require("bcryptjs")
const sendEmail = require("../emailSender");

// ارسال کد تأیید
router.post('/send-code', async (req, res) => {
    const { email } = req.body;
    
    try {
        const check = await Account.findOne({email: email})

        if(check) {
            throw new Error("this email is already in use")
        }

        // حذف کدهای قبلی برای این ایمیل
        await Verification.deleteMany({ email });

        // تولید کد 6 رقمی
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = await bcrypt.hash(code, 10);

        // ذخیره در دیتابیس (5 دقیقه اعتبار)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const verification = new Verification({
            email,
            code: hashedCode,
            expiresAt
        });

        await verification.save();

        // ارسال ایمیل
        await sendEmail({
            to: email,
            subject: 'کد تأیید شما',
            text: `کد تأیید شما: ${code}\nاین کد تا 5 دقیقه معتبر است.`
        });

        res.status(200).json({ message: 'کد تأیید ارسال شد' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// تأیید کد
router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    
    try {
        const verification = await Verification.findOne({ email });
        console.log(verification)
        if (!verification) {
            return res.status(400).json({ error: 'کد منقضی شده یا وجود ندارد' });
        }

        const isMatch = await bcrypt.compare(code, verification.code);
        if (!isMatch) {
            return res.status(400).json({ error: 'کد وارد شده صحیح نیست' });
        }

        // حذف کد پس از تأیید موفق
        await Verification.deleteOne({ email });

        res.status(200).json({ message: 'ایمیل با موفقیت تأیید شد' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'خطا در تأیید کد' });
    }
});

module.exports = router;