const express = require("express")
const { handleCreateVehicle, handleGetAllVehicles, handleDeleteVehicle, handleUpdateVehicle, handleUpdateTruck, handleGetAllVehiclesByVehicleType, handleGetRentVehicles, handleGetSellVehicles, handleAddDocuments, handleGetVehicleById, handleDeleteDocuments, handleGetAllVehiclesImages } = require("../controllers/vehicle")
const { upload } = require("../middlewares/upload")
const { handleGetUserByAuthToken } = require("../middlewares/auth")
const router = express.Router()

router.post("/",handleGetUserByAuthToken, upload.fields([{ name: "photos", maxCount: 5 }]), handleCreateVehicle)
router.get("/:vehicleType",handleGetUserByAuthToken, handleGetAllVehiclesByVehicleType)
router.get("/purpose/RENT", handleGetRentVehicles)
router.get("/purpose/SELL", handleGetSellVehicles)
router.get("/", handleGetUserByAuthToken, handleGetAllVehicles)
router.get("/all/photos",handleGetUserByAuthToken, handleGetAllVehiclesImages)
router.get("/id/:vehicleId",handleGetUserByAuthToken, handleGetVehicleById)
router.delete("/",handleGetUserByAuthToken, handleDeleteVehicle),
router.patch("/",handleGetUserByAuthToken, upload.fields([{ name: "photos", maxCount: 5 }]), handleUpdateVehicle)
router.patch("/addDocuments",handleGetUserByAuthToken, upload.fields([{ name: "RC", maxCount: 1 }, { name: "permit", maxCount: 1 }, { name: "fitness", maxCount: 1 }, { name: "tax", maxCount: 1 }, { name: "insurance", maxCount: 1 } ,{ name: "PUC", maxCount: 1 }]), handleAddDocuments)
router.delete("/deleteDocuments",handleGetUserByAuthToken, handleDeleteDocuments)
router.patch("/truck",handleGetUserByAuthToken, upload.fields([{ name: "photos", maxCount: 5 }]), handleUpdateTruck)

module.exports = router