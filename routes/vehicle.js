const express = require("express")
const { handleCreateVehicle, handleGetAllVehicles, handleDeleteVehicle } = require("../controllers/vehicle")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleCreateVehicle)
router.get("/", handleGetAllVehicles)
router.delete("/", handleDeleteVehicle)

module.exports = router