const express = require("express")
const { handleCreateTour, handleGetAllTours } = require("../controllers/tour")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{ name: "photo", maxCount: 1 }]), handleCreateTour)
router.get("/", handleGetAllTours)

module.exports = router