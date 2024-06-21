const express = require("express")
const { handleCreatePackageBooking, handleGetAllPackageBookings, handleDeletePackageBooking } = require("../controllers/packageBooking")
const router = express.Router()

router.post("/", handleCreatePackageBooking)
router.get("/", handleGetAllPackageBookings)
router.delete("/", handleDeletePackageBooking)


module.exports = router