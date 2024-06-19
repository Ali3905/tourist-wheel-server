const express = require("express")
const { handleCreateVehicle, handleGetAllVehicles, handleDeleteVehicle, handleUpdateVehicle } = require("../controllers/vehicle")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleCreateVehicle)
router.get("/", handleGetAllVehicles)
router.delete("/", handleDeleteVehicle),
router.patch("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleUpdateVehicle)

module.exports = router