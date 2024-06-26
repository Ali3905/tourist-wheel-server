const express = require("express")
const { handleCreateVehicle, handleGetAllVehicles, handleDeleteVehicle, handleUpdateVehicle, handleUpdateTruck, handleGetAllVehiclesByVehicleType, handleGetRentVehicles, handleGetSellVehicles } = require("../controllers/vehicle")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleCreateVehicle)
router.get("/:vehicleType", handleGetAllVehiclesByVehicleType)
router.get("/purpose/RENT", handleGetRentVehicles)
router.get("/purpose/SELL", handleGetSellVehicles)
router.get("/", handleGetAllVehicles)
router.delete("/", handleDeleteVehicle),
router.patch("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleUpdateVehicle)
router.patch("/truck", upload.fields([{ name: "photos", maxCount: 5 }]), handleUpdateTruck)

module.exports = router