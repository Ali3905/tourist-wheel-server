const dailyRoute = require("../models/dailyRoute");
const driver = require("../models/driver")
const cleaner = require("../models/cleaner")

async function handleCreateDailyRoute(req, res) {
    try {

        if (req.files) {
            Object.keys(req.files).forEach((key) => {
              if (req.files[key][0] && req.files[key][0].path) {
                req.body[key] = req.files[key][0].path; // Add the URL to req.body
              }
            });
          }
        const { vehicleNumber, departurePlace, destinationPlace, primaryDriverId, secondaryDriverId, cleanerId, departureTime, instructions } = req.body
        console.log({ vehicleNumber, departurePlace, destinationPlace, primaryDriverId, secondaryDriverId, cleanerId, departureTime, instructions });
        if (!vehicleNumber || !departurePlace || !destinationPlace || !primaryDriverId || !secondaryDriverId || !cleanerId || !departureTime || !instructions) {
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

        const createdDailyRoute = await dailyRoute.create({
            vehicleNumber, departurePlace, destinationPlace, primaryDriver, secondaryDriver, cleaner: foundCleaner, departureTime, instructions
        })

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

async function handleGetAllDailyRoutes(req, res) {
    try {
        const foundVehicles = await dailyRoute.find({})
        if (!foundVehicles) {
            return res.status(400).json({
                success: false,
                message: "Could not find the daily route vehicles"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundVehicles
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
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
                success : false,
                message : "Provide a valid route ID"
            })
        }

        await dailyRoute.findByIdAndDelete(dailyRouteId)
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

module.exports = {
    handleGetAllDailyRoutes,
    handleCreateDailyRoute,
    handleDeleteDailyRoute
}