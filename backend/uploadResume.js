const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, "../frontend/public/resume")
    },
    filename: (req, file, cb)=> {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb)=> {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jfif" || file.mimetype === "application/pdf"){
        cb(null, true)
    }else{
        cb(new Error("Only png and jpeg files are allowed"))
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }) 

module.exports = upload