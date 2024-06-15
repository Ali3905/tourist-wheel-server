const multer = require("multer");


const uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file);
        cb(null, "./uploads")
        },
    filename: function (req, file, cb) {
        const uniqueFileName = Date.now() + "-" + file.originalname
        req.body[file.fieldname] = `uploads/${uniqueFileName}`
        cb(null, uniqueFileName)
    }
})

const upload = multer({ storage: uploadStorage })

module.exports = {
    upload
}