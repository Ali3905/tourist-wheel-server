const express = require("express")
const { handleCreatePackageBooking, handleGetAllPackageBookings, handleDeletePackageBooking, handleGetPackageBookingByID, handleFinalizePackageBookings, handleUpdatePackageBooking } = require("../controllers/packageBooking")
const { handleGetUserByAuthToken, handleAuthorizeUserByRole } = require("../middlewares/auth")
const router = express.Router()

router.post("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY"]), handleCreatePackageBooking)
router.patch("/finalize", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleFinalizePackageBookings)
router.patch("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY"]), handleUpdatePackageBooking)
router.get("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleGetAllPackageBookings)
router.get("/:bookingId", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleGetPackageBookingByID)
router.delete("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY"]), handleDeletePackageBooking)


module.exports = router