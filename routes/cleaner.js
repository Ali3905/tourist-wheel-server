const express = require("express")
const { handleCreateCleaner, handleGetAllCleaners, handleDeleteCleaner } = require("../controllers/cleaner")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{name : "license", maxCount : 1}, {name : "photo", maxCount : 1}, {name : "aadharCard", maxCount : 1}]), handleCreateCleaner)
router.get("/", handleGetAllCleaners)
router.delete("/", handleDeleteCleaner)

module.exports = router


