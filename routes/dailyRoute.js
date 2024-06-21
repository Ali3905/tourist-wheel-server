const express = require("express")
const { handleGetAllDailyRoutes, handleCreateDailyRoute, handleDeleteDailyRoute, handleUpdateDailyRoute } = require("../controllers/dailyRoute")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{name : "beforeJourneyPhotos", maxCount : 5}, {name : "afterJourneyPhotos", maxCount : 5}]), handleCreateDailyRoute)
router.get("/", handleGetAllDailyRoutes)
router.delete("/", handleDeleteDailyRoute)
router.patch("/", upload.fields([{name : "beforeJourneyPhotos", maxCount : 5}, {name : "afterJourneyPhotos", maxCount : 5}]), handleUpdateDailyRoute)

module.exports = router