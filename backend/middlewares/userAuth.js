const jwt = require("jsonwebtoken")
const Account = require("../models/accountModel")

//حراست
const requireAuth = async (req, res, next)=> {
    //گزفتن کارت دانشجویی
    const { authorization } = req.headers

    //نداشتن کارت
    if(!authorization) {
        return res.status(401).json({error: "Authorization tokrn required"})
    }

    //نگاه کردن له اطلاهات مورد نیاز برای تشخیص هویت دانشجو
    const token = authorization.split(' ')[1]

    try{
        //ببینه مال این دانشگاه هست یا خیر
        const { _id } = jwt.verify(token, process.env.SECRET)

        req.user = await Account.findOne({_id}).select('_id')
        next()
    }catch(error){
        res.status(401).json({error: "request is not authorized"})
    }
}

module.exports = requireAuth