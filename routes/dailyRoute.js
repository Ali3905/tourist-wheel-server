const express = require("express")
const { handleGetAllDailyRoutes, handleCreateDailyRoute, handleDeleteDailyRoute } = require("../controllers/dailyRoute")
const router = express.Router()

router.post("/", handleCreateDailyRoute)
router.get("/", handleGetAllDailyRoutes)
router.delete("/", handleDeleteDailyRoute)

module.exports = router