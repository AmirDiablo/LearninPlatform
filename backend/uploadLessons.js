const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, "./uploads/lessons")
    },
    filename: (req, file, cb)=> {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb)=> {
    if(file.mimetype === "video/mp4" ){
        cb(null, true)
    }else{
        cb(new Error("Only mp4 files are allowed"))
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }) 

module.exports = upload