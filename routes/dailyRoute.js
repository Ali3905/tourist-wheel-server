const express = require("express")
const { handleGetAllDailyRoutes, handleCreateDailyRoute, handleDeleteDailyRoute, handleUpdateDailyRoute } = require("../controllers/dailyRoute")
const router = express.Router()

router.post("/", handleCreateDailyRoute)
router.get("/", handleGetAllDailyRoutes)
router.delete("/", handleDeleteDailyRoute)
router.patch("/", handleUpdateDailyRoute)

module.exports = router