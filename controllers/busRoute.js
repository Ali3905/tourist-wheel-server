const busRoute = require("../models/busRoute");
const cleaner = require("../models/cleaner");
const driver = require("../models/driver");
const { user, agency } = require("../models/user");
const { vehicle } = require("../models/vehicle")

async function handleCreateBusRoute(req, res) {
    try {
        if (req.files) {
            for (const key of Object.keys(req.files)) {

                if (req.files[key] && req.files[key].length > 1) {
                    req.body[key] = [];
                    for (const file of req.files[key]) {
                        if (file.location) {
                            req.body[key].push(file.location);
                        }
                    }
                } else if (req.files[key][0] && req.files[key][0].location) {
                    req.body[key] = req.files[key][0].location; // Add the URL to req.body
                }
            }
        }

        // console.log({ body : req.body });

        const foundUser = await user.findById(req.data._id)


        const { vehicleNo, officeAddress, discount, departurePlace, destinationPlace, departureTime, arrivalTime, pickupPoint, dropoffPoint, ticketFare, busPhotos, isAC, isSleeper, amenities, doesCarryTwoWheelers, doesProvideCourierService, doesBookTrainTickets, phonepeName, phonepeNumber, QR, seatingArrangement } = req.body
        const foundVehicle = await vehicle.findOne({ number: vehicleNo })
        const createdBusRoute = await busRoute.create({
            vehicle: foundVehicle, officeAddress, discount, agencyName: foundUser.companyName, departurePlace, destinationPlace, departureTime, arrivalTime, pickupPoint, dropoffPoint, ticketFare, busPhotos, isAC, isSleeper, amenities, doesCarryTwoWheelers, doesProvideCourierService, doesBookTrainTickets, phonepeName, phonepeNumber, QR, seatingArrangement
        })
        // await user.findByIdAndUpdate(req.data._id, { $push: { busRoutes: createdBusRoute } }, { new: true })
        foundUser.busRoutes.push(createdBusRoute)
        await foundUser.save()
        return res.status(400).json({
            success: false,
            data: createdBusRoute
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllBusRoutes(req, res) {
    try {
        const foundUser = await user.findById(req.data._id).populate({
            path: "busRoutes",
            options: { sort: { createdAt: -1 } }, 
            populate:
                { path: "vehicle", model: "vehicle", select: "number" },

        })
        if (!foundUser) {
            return res.status(400).json({
                success: false,
                message: "Could not find the daily route"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundUser.busRoutes,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleFinalizeBusRoute(req, res) {
    try {
        const { routeId } = req.query
        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of route to update"
            })
        }
        if (req.files) {
            for (const key of Object.keys(req.files)) {
                if (req.files[key] && req.files[key].length > 0) {
                    req.body[key] = [];
                    for (const file of req.files[key]) {
                        if (file.location) {
                            req.body[key].push(file.location);
                        }
                    }
                }
            }
        }
        const { primaryDriverId, secondaryDriverId, cleanerId, instructions } = req.body
        if (!primaryDriverId || !cleanerId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the details"
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
        if (!foundCleaner) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid Cleaner ID"
            })
        }


        const updatedBusRoute = await busRoute.findByIdAndUpdate(routeId, { primaryDriver, secondaryDriver, cleaner: foundCleaner, instructions, status: "FINALIZED" }, { new: true }).populate("primaryDriver secondaryDriver vehicle cleaner")
        console.log(req.data._id);
        const foundAgency = await agency.findById(req.data._id)
        // const primaryDriverResponse = await sendSms(updatedDailyRoute.primaryDriver?.mobileNumber, `You have been selected for today's trip with ${foundAgency.companyName}. Route: ${updatedDailyRoute.departurePlace} to ${updatedDailyRoute.destinationPlace} Pick-Up Time: ${formatTime(updatedDailyRoute.departureTime)} Please reach the office 2 hours before departure. Kindly start the trip from your app before departure. All driver and cleaner details for this trip: Name:${updatedDailyRoute.primaryDriver?.name}, Mobile:${updatedDailyRoute.primaryDriver?.mobileNumber} Name:${updatedDailyRoute.secondaryDriver?.name}, Mobile:${updatedDailyRoute.secondaryDriver?.mobileNumber} Name:${updatedDailyRoute.cleaner?.name}, Mobile:${updatedDailyRoute.cleaner?.mobileNumber} Best regards, TOURIST JUNCTION PRIVATE LIMITED`)
        // const secondaryDriverResponse = await sendSms(updatedDailyRoute.secondaryDriver?.mobileNumber, `You have been selected for today's trip with ${foundAgency.companyName}. Route: ${updatedDailyRoute.departurePlace} to ${updatedDailyRoute.destinationPlace} Pick-Up Time: ${formatTime(updatedDailyRoute.departureTime)} Please reach the office 2 hours before departure. Kindly start the trip from your app before departure. All driver and cleaner details for this trip: Name:${updatedDailyRoute.primaryDriver?.name}, Mobile:${updatedDailyRoute.primaryDriver?.mobileNumber} Name:${updatedDailyRoute.secondaryDriver?.name}, Mobile:${updatedDailyRoute.secondaryDriver?.mobileNumber} Name:${updatedDailyRoute.cleaner?.name}, Mobile:${updatedDailyRoute.cleaner?.mobileNumber} Best regards, TOURIST JUNCTION PRIVATE LIMITED`)
        // const cleanerResponse = await sendSms(updatedDailyRoute.cleaner?.mobileNumber, `You have been selected for today's trip with ${foundAgency.companyName}. Route: ${updatedDailyRoute.departurePlace} to ${updatedDailyRoute.destinationPlace} Pick-Up Time: ${formatTime(updatedDailyRoute.departureTime)} Please reach the office 2 hours before departure. Kindly start the trip from your app before departure. All driver and cleaner details for this trip: Name:${updatedDailyRoute.primaryDriver?.name}, Mobile:${updatedDailyRoute.primaryDriver?.mobileNumber} Name:${updatedDailyRoute.secondaryDriver?.name}, Mobile:${updatedDailyRoute.secondaryDriver?.mobileNumber} Name:${updatedDailyRoute.cleaner?.name}, Mobile:${updatedDailyRoute.cleaner?.mobileNumber} Best regards, TOURIST JUNCTION PRIVATE LIMITED`)

        return res.status(200).json({
            success: true,
            data: updatedBusRoute,
            // smsResponse: primaryDriverResponse
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteBusRoute(req, res) {
    try {
        const { routeId } = req.query
        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "Please provide route ID to delete it"
            })
        }

        const foundBusRoute = await busRoute.findById(routeId)
        if (!foundBusRoute) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid route ID"
            })
        }

        await busRoute.findByIdAndDelete(routeId)
        await user.findByIdAndUpdate(req.data._id, { $pull: { busRoutes: routeId } }, { new: true })
        return res.status(200).json({
            success: true,
            message: "Route has been deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleStartBusRoute(req, res) {
    try {
        const { routeId } = req.query
        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "Please provide route ID to start"
            })
        }
        if (req.files) {
            for (const key of Object.keys(req.files)) {
                if (req.files[key] && req.files[key].length > 0) {
                    req.body[key] = [];
                    for (const file of req.files[key]) {
                        if (file.location) {
                            req.body[key].push(file.location);
                        }
                    }
                }
            }
        }
        const { beforeJourneyPhotos, beforeJourneyNote } = req.body
        if (!beforeJourneyPhotos || !beforeJourneyNote) {
            return res.status(400).json({
                success: false,
                message: "Provide All the fields"
            })
        }

        const foundRoute = await busRoute.findById(routeId)
        if (foundRoute.status !== "FINALIZED") {
            return res.status(400).json({
                success: false,
                message: "The selected route is not in a state to start. It is either completed, started or not finalized yet"
            })
        }

        const updatedRoute = await busRoute.findByIdAndUpdate(routeId, { beforeJourneyPhotos, beforeJourneyNote, status: "STARTED" }, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedRoute
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleCompleteBusRoute(req, res) {
    try {
        const { routeId } = req.query
        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "Please provide route ID to start"
            })
        }
        if (req.files) {
            for (const key of Object.keys(req.files)) {
                if (req.files[key] && req.files[key].length > 0) {
                    req.body[key] = [];
                    for (const file of req.files[key]) {
                        if (file.location) {
                            req.body[key].push(file.location);
                        }
                    }
                }
            }
        }
        const { afterJourneyPhotos, afterJourneyNote } = req.body
        if (!afterJourneyPhotos || !afterJourneyNote) {
            return res.status(400).json({
                success: false,
                message: "Provide All the fields"
            })
        }
        const foundRoute = await busRoute.findById(routeId)
        if (!foundRoute) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid route ID"
            })
        }
        if (foundRoute.status !== "STARTED") {
            return res.status(400).json({
                success: false,
                message: "The selected route is not in a state to end. It is either completed, created or not finalized yet"
            })
        }

        const updatedRoute = await busRoute.findByIdAndUpdate(routeId, { afterJourneyPhotos, afterJourneyNote, status: "COMPLETED" }, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedRoute
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleUpdateBusRoute(req, res) {
    try {
        if (req.files) {
            for (const key of Object.keys(req.files)) {
                if (req.files[key] && req.files[key].length > 0) {
                    req.body[key] = [];
                    for (const file of req.files[key]) {
                        if (file.location) {
                            req.body[key].push(file.location);
                        }
                    }
                }
            }
        }

        const { routeId } = req.query
        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of route to update"
            })
        }
        const { vehicleNo, officeAddress, discount, departurePlace, destinationPlace, departureTime, arrivalTime, pickupPoint, dropoffPoint, ticketFare, busPhotos, isAC, isSleeper, amenities, doesCarryTwoWheelers, doesProvideCourierService, doesBookTrainTickets, phonepeName, phonepeNumber, QR, seatingArrangement } = req.body
        if (!vehicleNo) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }

        const foundVehicle = await vehicle.findOne({ number: vehicleNo })

        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid Vehicle ID"
            })
        }
        const updatedRoute = await busRoute.findByIdAndUpdate(routeId, { vehicle: foundVehicle, officeAddress, discount, departurePlace, destinationPlace, departureTime, arrivalTime, pickupPoint, dropoffPoint, ticketFare, busPhotos, isAC, isSleeper, amenities, doesCarryTwoWheelers, doesProvideCourierService, doesBookTrainTickets, phonepeName, phonepeNumber, QR, seatingArrangement }, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedRoute,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetDriverBusRoutes(req, res) {
    try {
        const { driverId } = req.params

        if (!driverId) {
            return res.status(400).json({
                success: false,
                message: "Provide the driver ID"
            })
        }

        const foundBusRoutes = await busRoute.find({
            $or: [
                { primaryDriver: driverId },
                { secondaryDriver: driverId }
            ]
        }).populate("primaryDriver secondaryDriver cleaner vehicle").sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            data: foundBusRoutes
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    handleCreateBusRoute,
    handleGetAllBusRoutes,
    handleFinalizeBusRoute,
    handleDeleteBusRoute,
    handleStartBusRoute,
    handleUpdateBusRoute,
    handleStartBusRoute,
    handleCompleteBusRoute,
    handleGetDriverBusRoutes
}