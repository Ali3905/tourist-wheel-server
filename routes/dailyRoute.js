const express = require("express")
const { handleGetAllDailyRoutes, handleCreateDailyRoute, handleDeleteDailyRoute, handleUpdateDailyRoute, handleStartDailyRoute } = require("../controllers/dailyRoute")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", handleCreateDailyRoute)
router.patch("/finalize", handleStartDailyRoute)
router.get("/", handleGetAllDailyRoutes)
router.delete("/", handleDeleteDailyRoute)
router.patch("/", upload.fields([{name : "beforeJourneyPhotos", maxCount : 5}, {name : "afterJourneyPhotos", maxCount : 5}]), handleUpdateDailyRoute)

module.exports = router