const packageBooking = require("../models/packageVehicleBooking")
const { vehicle } = require("../models/vehicle")

async function handleCreatePackageBooking(req, res) {
    try {
        const { vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, returnTime, tollInINR, otherStateTaxInINR, note, instructions } = req.body
        console.log({ vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, returnTime, tollInINR, otherStateTaxInINR, note, instructions });
        if (!vehicleId || !otherVehicleId || !customerName || !mobileNumber || !alternateNumber || !kmStarting || !perKmRateInINR || !advanceAmountInINR || !remainingAmountInINR || !advancePlace || !departurePlace || !destinationPlace || !departureTime || !returnTime || !tollInINR || !otherStateTaxInINR || !note || !instructions) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid mobile number"
            })
        }
        if (alternateNumber.length < 10 || alternateNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid alternate number"
            })
        }
        const foundVehicle = await vehicle.findById(vehicleId)
        const foundOtherVehicle = await vehicle.findById(vehicleId)
        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid vehicle ID"
            })
        }
        if (!foundOtherVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid other vehicle ID"
            })
        }

        const createdPackageBooking = await packageBooking.create({ vehicle : foundVehicle, otherVehicle : foundOtherVehicle, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, returnTime, tollInINR, otherStateTaxInINR, note, instructions })
        return res.status(201).json({
            success : true,
            data : createdPackageBooking
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}


async function handleGetAllPackageBookings(req, res) {
    try {
        const foundPackageBookings = await packageBooking.find({})

        if (!foundPackageBookings) {
            return res.status(400).json({
                success: false,
                message: "Could find package bookings"
            })
        }

        return res.status(200).json({
            success: true,
            data: foundPackageBookings
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
async function handleGetPackageBookingByID(req, res) {
    try {
        const { bookingId } = req.params
        console.log(bookingId);
        const foundPackageBooking = await packageBooking.findById(bookingId)

        if (!foundPackageBooking) {
            return res.status(400).json({
                success: false,
                message: "Could find package bookings"
            })
        }

        return res.status(200).json({
            success: true,
            data: foundPackageBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


async function handleDeletePackageBooking(req, res) {
    try {
        const { bookingId } = req.query
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of booking to delete"
            })
        }
        const foundPackageBooking = await packageBooking.findById(bookingId)
        if (!foundPackageBooking) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid booking ID"
            })
        }
        await packageBooking.findByIdAndDelete(bookingId)
        return res.status(200).json({
            success: true,
            message: "Package Booking Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


module.exports = {
    handleCreatePackageBooking,
    handleGetAllPackageBookings,
    handleDeletePackageBooking,
    handleGetPackageBookingByID
}