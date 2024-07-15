const dailyRoute = require("../models/dailyRoute");
const driver = require("../models/driver")
const cleaner = require("../models/cleaner")
const { vehicle } = require("../models/vehicle");
const user = require("../models/user");

async function handleCreateDailyRoute(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }
        const { vehicleId, departurePlace, destinationPlace, departureTime } = req.body
        if (!vehicleId || !departurePlace || !destinationPlace || !departureTime) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }

        const foundVehicle = await vehicle.findById(vehicleId)

        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid Vehicle ID"
            })
        }

        const createdDailyRoute = await dailyRoute.create({
            vehicle: foundVehicle, departurePlace, destinationPlace, departureTime, status: "CREATED"
        })

        await user.findByIdAndUpdate(req.data._id, { $push: { dailyRoutes: createdDailyRoute } }, { new: true })

        return res.status(200).json({
            success: true,
            data: createdDailyRoute
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


async function handleFinalizeDailyRoute(req, res) {
    try {
        const { routeId } = req.query
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }
        const { primaryDriverId, secondaryDriverId, cleanerId, instructions } = req.body
        if (!primaryDriverId || !secondaryDriverId || !cleanerId || !instructions) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the details"
            })
        }

        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of route to update"
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


        const updatedDailyRoute = await dailyRoute.findByIdAndUpdate(routeId, { primaryDriver, secondaryDriver, cleaner: foundCleaner, instructions, status: "FINALIZED" }, { new: true })

        return res.status(200).json({
            success: true,
            data: updatedDailyRoute
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllDailyRoutes(req, res) {
    try {

        if (req.data.role === "AGENCY") {
            const foundUser = await user.findById(req.data._id).populate({
                path: "dailyRoutes",
                populate: {
                    path: "cleaner",
                    model: "cleaner"
                }

            }).populate({
                path: "dailyRoutes",
                populate: {
                    path: "vehicle",
                    model: "vehicle"
                }
            }).populate({
                path: "dailyRoutes",
                populate: {
                    path: "primaryDriver",
                    model: "driver"
                }
            }).populate({
                path: "dailyRoutes",
                populate: {
                    path: "secondaryDriver",
                    model: "driver"
                }
            })
            if (!foundUser) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find the daily route"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundUser.dailyRoutes
            })
        }

        const foundRoutes = await dailyRoute.find({}).populate("primaryDriver secondaryDriver cleaner vehicle")
        if (!foundRoutes) {
            return res.status(400).json({
                success: false,
                message: "Could not find the daily route"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundRoutes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteDailyRoute(req, res) {
    try {
        const { dailyRouteId } = req.query
        if (!dailyRouteId) {
            return res.status(400).json({
                success: false,
                message: "Please provide route ID to delete it"
            })
        }

        const foundDailyRoute = await cleaner.findById(dailyRouteId)
        if (!foundDailyRoute) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid route ID"
            })
        }

        await dailyRoute.findByIdAndDelete(dailyRouteId)
        await user.findByIdAndUpdate(req.data._id, { $pull: { dailyRoutes: dailyRouteId } }, { new: true })
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

async function handleUpdateDailyRoute(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }

        const { routeId } = req.query
        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of route to update"
            })
        }
        const { vehicleId, departurePlace, destinationPlace, departureTime } = req.body
        if (!vehicleId || !departurePlace || !destinationPlace || !departureTime) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }

        const foundVehicle = await vehicle.findById(vehicleId)

        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid Vehicle ID"
            })
        }
        const updatedRoute = await dailyRoute.findByIdAndUpdate(routeId, { vehicle: foundVehicle, departurePlace, destinationPlace, departureTime }, { new: true })
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

async function handleStartDailyRoute(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }
        const { beforeJourneyPhotos, beforeJourneyNote } = req.body
        const { routeId } = req.query
        if (!beforeJourneyPhotos || !beforeJourneyNote) {
            return res.status(400).json({
                success: false,
                message: "Provide All the fields"
            })
        }

        const foundRoute = await dailyRoute.findById(routeId)
        if (foundRoute.status !== "FINALIZED") {
            return res.status(400).json({
                success: false,
                message: "The selected route is not in a state to start. It is either completed, started or not finalized yet"
            })
        }

        const updatedRoute = await dailyRoute.findByIdAndUpdate(routeId, { beforeJourneyPhotos, beforeJourneyNote, status: "STARTED" }, { new: true })
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

async function handleCompleteDailyRoute(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }
        const { afterJourneyPhotos, afterJourneyNote } = req.body
        const { routeId } = req.query
        if (!afterJourneyPhotos || !afterJourneyNote) {
            return res.status(400).json({
                success: false,
                message: "Provide All the fields"
            })
        }
        const foundRoute = await dailyRoute.findById(routeId)
        if (foundRoute.status !== "STARTED") {
            return res.status(400).json({
                success: false,
                message: "The selected route is not in a state to end. It is either completed, created or not finalized yet"
            })
        }

        const updatedRoute = await dailyRoute.findByIdAndUpdate(routeId, { afterJourneyPhotos, afterJourneyNote, status: "COMPLETED" }, { new: true })
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

async function handleGetDriverDailyRoutes(req, res) {
    try {
        const { driverId } = req.params

        if (!driverId) {
            return res.status(400).json({
                success: false,
                message: "Provide the driver ID"
            })
        }

        const foundDailyRoutes = await dailyRoute.find({
            $or: [
                { primaryDriver: driverId },
                { secondaryDriver: driverId }
            ]
        })

        return res.status(200).json({
            success: true,
            data: foundDailyRoutes
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    handleGetAllDailyRoutes,
    handleCreateDailyRoute,
    handleDeleteDailyRoute,
    handleUpdateDailyRoute,
    handleFinalizeDailyRoute,
    handleStartDailyRoute,
    handleCompleteDailyRoute,
    handleGetDriverDailyRoutes
}