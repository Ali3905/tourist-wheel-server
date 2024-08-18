const express = require("express")
const { handleCreateTour, handleGetAllTours, handleUpdateTour, handleDeleteTour, handleGetTourByID } = require("../controllers/tour")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{ name: "photo", maxCount: 1 }]), handleCreateTour)
router.get("/", handleGetAllTours)
router.get("/:tourId", handleGetTourByID)
router.patch("/", upload.fields([{ name: "photo", maxCount: 1 }]), handleUpdateTour)
router.delete("/", handleDeleteTour)

module.exports = router