const express = require("express")
const { handleCreatePackageBooking, handleGetAllPackageBookings, handleDeletePackageBooking, handleGetPackageBookingByID } = require("../controllers/packageBooking")
const router = express.Router()

router.post("/", handleCreatePackageBooking)
router.get("/", handleGetAllPackageBookings)
router.get("/:bookingId", handleGetPackageBookingByID)
router.delete("/", handleDeletePackageBooking)


module.exports = router