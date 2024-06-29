const express = require("express")
const { handleGetAllDailyRoutes, handleCreateDailyRoute, handleDeleteDailyRoute, handleUpdateDailyRoute, handleStartDailyRoute } = require("../controllers/dailyRoute")
const { upload } = require("../middlewares/upload")
const { handleGetUserByAuthToken, handleAuthorizeUserByRole } = require("../middlewares/auth")
const router = express.Router()

router.post("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleCreateDailyRoute)
router.patch("/finalize", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleStartDailyRoute)
router.get("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleGetAllDailyRoutes)
router.delete("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY"]), handleDeleteDailyRoute)
router.patch("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), upload.fields([{name : "beforeJourneyPhotos", maxCount : 5}, {name : "afterJourneyPhotos", maxCount : 5}]), handleUpdateDailyRoute)

module.exports = router