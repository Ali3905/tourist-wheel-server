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

        return res.status(400).json({
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


async function handleStartDailyRoute(req, res) {
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

        return res.status(400).json({
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
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Provide the updated route"
            })
        }
        await dailyRoute.findByIdAndUpdate(routeId, req.body)
        return res.status(200).json({
            success: true,
            message: "Daily Route updated",
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
    handleStartDailyRoute
}