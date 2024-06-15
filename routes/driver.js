const express = require("express")
const { handleCreateDriver, handleGetAllDrivers, handleDeleteDriver } = require("../controllers/driver")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{name : "license", maxCount : 1}, {name : "photo", maxCount : 1}, {name : "aadharCard", maxCount : 1}]), handleCreateDriver)
router.get("/", handleGetAllDrivers)
router.delete("/", handleDeleteDriver)

module.exports = router


