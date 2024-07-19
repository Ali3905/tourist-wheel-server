const cleaner = require("../models/cleaner")
const driver = require("../models/driver")
const employee = require("../models/employee")
const packageBooking = require("../models/packageVehicleBooking")
const {user} = require("../models/user")
const { vehicle } = require("../models/vehicle")

async function handleCreatePackageBooking(req, res) {
    try {
        const { vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR } = req.body
        // console.log({ vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, note });
        if (!vehicleId || !otherVehicleId || !customerName || !mobileNumber || !alternateNumber || !kmStarting || !perKmRateInINR || !advanceAmountInINR || !remainingAmountInINR || !advancePlace || !departurePlace || !destinationPlace || !departureTime || !returnTime || !tollInINR || !otherStateTaxInINR) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid mobile number"
            })
        }
        if (alternateNumber.length < 10 || alternateNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid alternate number"
            })
        }
        const foundVehicle = await vehicle.findById(vehicleId)
        const foundOtherVehicle = await vehicle.findById(otherVehicleId)
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

        if (req.data.role === "MANAGER" || req.data.role === "OFFICE-BOY") {
            const foundEmployee = await employee.findById(req.data.employeeId)
            const createdPackageBooking = await packageBooking.create({ vehicle: foundVehicle, otherVehicle: foundOtherVehicle, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, status: "CREATED", createdBy: foundEmployee.name })
            await user.findByIdAndUpdate(req.data._id, { $push: { packageBookings: createdPackageBooking } }, { new: true })
            return res.status(201).json({
                success: true,
                data: createdPackageBooking
            })
        }
        const foundAgency = await user.findById(req.data._id)
        const bookingsCount = await packageBooking.countDocuments();
        const createdPackageBooking = await packageBooking.create({ vehicle: foundVehicle, otherVehicle: foundOtherVehicle, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, status: "CREATED", createdBy: foundAgency.userName, invoiceId : bookingsCount + 101 })
        await user.findByIdAndUpdate(req.data._id, { $push: { packageBookings: createdPackageBooking } }, { new: true })
        return res.status(201).json({
            success: true,
            data: createdPackageBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleFinalizePackageBookings(req, res) {
    try {
        const { bookingId } = req.query
        const { primaryDriverId, secondaryDriverId, cleanerId, instructions } = req.body
        if (!primaryDriverId || !secondaryDriverId || !cleanerId || !instructions) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the details"
            })
        }

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of booking to update"
            })
        }

        const primaryDriver = await driver.findById(primaryDriverId)
        const secondaryDriver = await driver.findById(secondaryDriverId)
        const foundCleaner = await cleaner.findById(cleanerId)

        if (!primaryDriver) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid primary driver ID"
            })
        }
        if (!secondaryDriver) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid secondary driver ID"
            })
        }
        if (!foundCleaner) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid Cleaner ID"
            })
        }


        const updatedPackageBooking = await packageBooking.findByIdAndUpdate(bookingId, { primaryDriver, secondaryDriver, cleaner: foundCleaner, instructions, status: "FINALIZED" }, { new: true })

        return res.status(200).json({
            success: true,
            data: updatedPackageBooking
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleUpdatePackageBooking(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }

        const { bookingId } = req.query
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of booking to update"
            })
        }
        const { vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, note } = req.body
        // console.log({ vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, note });
        if (!vehicleId || !otherVehicleId || !customerName || !mobileNumber || !alternateNumber || !kmStarting || !perKmRateInINR || !advanceAmountInINR || !remainingAmountInINR || !advancePlace || !departurePlace || !destinationPlace || !departureTime || !returnTime || !tollInINR || !otherStateTaxInINR || !note) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid mobile number"
            })
        }
        if (alternateNumber.length < 10 || alternateNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid alternate number"
            })
        }
        const foundVehicle = await vehicle.findById(vehicleId)
        const foundOtherVehicle = await vehicle.findById(otherVehicleId)
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
        const updatedPackageBooking = await packageBooking.findByIdAndUpdate(bookingId, { vehicle: foundVehicle, otherVehicle: foundOtherVehicle, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR }, { new: true })

        return res.status(200).json({
            success: true,
            data: updatedPackageBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


async function handleGetAllPackageBookings(req, res) {
    try {

        if (req.data.role === "AGENCY") {
            const foundUser = await user.findById(req.data._id).populate({
                path: "packageBookings",
                populate: {
                    path: "cleaner",
                    model: "cleaner"
                }

            }).populate({
                path: "packageBookings",
                populate: {
                    path: "vehicle",
                    model: "vehicle"
                }
            }).populate({
                path: "packageBookings",
                populate: {
                    path: "otherVehicle",
                    model: "vehicle"
                }
            }).populate({
                path: "packageBookings",
                populate: {
                    path: "primaryDriver",
                    model: "driver"
                }
            }).populate({
                path: "packageBookings",
                populate: {
                    path: "secondaryDriver",
                    model: "driver"
                }
            })
            if (!foundUser) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find the package bookings"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundUser.packageBookings
            })
        }

        const foundBookings = await packageBooking.find({}).populate("primaryDriver secondaryDriver cleaner vehicle")
        if (!foundBookings) {
            return res.status(400).json({
                success: false,
                message: "Could not find the package bookings"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundBookings
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
async function handleGetPackageBookingByID(req, res) {
    try {
        const { bookingId } = req.params
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
        console.log(bookingId);
        const foundPackageBooking = await packageBooking.findById(bookingId)
        if (!foundPackageBooking) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid booking ID"
            })
        }
        await user.findByIdAndUpdate(req.data._id, { $pull: { packageBookings: bookingId } }, { new: true })
        await packageBooking.findByIdAndDelete(bookingId)
        return res.status(200).json({
            success: true,
            message: "Package Booking Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleStartPackageBooking(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }
        const { beforeJourneyPhotos, beforeJourneyNote } = req.body
        const { bookingId } = req.query
        if (!beforeJourneyPhotos || !beforeJourneyNote) {
            return res.status(400).json({
                success: false,
                message: "Provide All the fields"
            })
        }

        const foundBooking = await packageBooking.findById(bookingId)
        if (foundBooking.status !== "FINALIZED") {
            return res.status(400).json({
                success: false,
                message: "The selected booking is not in a state to start. It is either completed, started or not finalized yet"
            })
        }

        const updatedBooking = await packageBooking.findByIdAndUpdate(bookingId, { beforeJourneyPhotos, beforeJourneyNote, status: "STARTED" }, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleCompletePackageBooking(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }
        const { afterJourneyPhotos, afterJourneyNote } = req.body
        const { bookingId } = req.query
        if (!afterJourneyPhotos || !afterJourneyNote) {
            return res.status(400).json({
                success: false,
                message: "Provide All the fields"
            })
        }
        const foundBooking = await packageBooking.findById(bookingId)
        if (foundBooking.status !== "STARTED") {
            return res.status(400).json({
                success: false,
                message: "The selected booking is not in a state to end. It is either completed, created or not finalized yet"
            })
        }

        const updatedBooking = await packageBooking.findByIdAndUpdate(bookingId, { afterJourneyPhotos, afterJourneyNote, status: "COMPLETED" }, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetDriverPackageBookings(req, res) {
    try {
        const { driverId } = req.params

        if (!driverId) {
            return res.status(400).json({
                success: false,
                message: "Provide the driver ID"
            })
        }

        const foundBookings = await packageBooking.find({
            $or: [
                { primaryDriver: driverId },
                { secondaryDriver: driverId }
            ]
        })

        return res.status(200).json({
            success: true,
            data: foundBookings
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    handleCreatePackageBooking,
    handleFinalizePackageBookings,
    handleUpdatePackageBooking,
    handleGetAllPackageBookings,
    handleDeletePackageBooking,
    handleGetPackageBookingByID,
    handleStartPackageBooking,
    handleCompletePackageBooking,
    handleGetDriverPackageBookings
}