const express = require("express")
const { handleCreateBusRoute, handleGetAllBusRoutes, handleFinalizeBusRoute, handleDeleteBusRoute, handleStartBusRoute, handleUpdateBusRoute, handleGetDriverBusRoutes, handleCompleteBusRoute } = require("../controllers/busRoute")
const { upload } = require("../middlewares/upload")
const { handleCompleteDailyRoute } = require("../controllers/dailyRoute")
const router = express.Router()

router.post("/", upload.fields([{ name: "busPhotos", maxCount: 5 }, { name: "seatingArrangement", maxCount: 1 }, { name: "QR", maxCount: 1 }]), handleCreateBusRoute)
router.get("/", handleGetAllBusRoutes)

// To Test
router.patch("/finalize", handleFinalizeBusRoute)
router.delete("/", handleDeleteBusRoute)
router.patch("/", handleUpdateBusRoute)
router.patch("/start", upload.fields([{ name: "beforeJourneyPhotos", maxCount: 5 }]), handleStartBusRoute)
router.patch("/complete", upload.fields([, { name: "afterJourneyPhotos", maxCount: 5 }]), handleCompleteBusRoute)
router.get("/driver/:driverId", handleGetDriverBusRoutes)


module.exports = router