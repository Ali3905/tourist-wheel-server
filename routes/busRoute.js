const express = require("express")
const { handleCreateBusRoute, handleGetAllBusRoutes } = require("../controllers/busRoute")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{ name: "busPhotos", maxCount: 5 }, { name: "seatingArrangement", maxCount: 1 }, { name: "QR", maxCount: 1 }]), handleCreateBusRoute)
router.get("/", handleGetAllBusRoutes)

module.exports = router