const busRoute = require("../models/busRoute");
const { user } = require("../models/user");
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


        const { vehicleNo, departurePlace, destinationPlace, departureTime, arrivalTime, pickupPoint, dropoffPoint, ticketFare, busPhotos, isAC, isSleeper, amenities, doesCarryTwoWheelers, doesProvideCourierService, doesBookTrainTickets, phonepeName, phonepeNumber, QR, seatingArrangement } = req.body
        const foundVehicle = await vehicle.findOne({ number: vehicleNo })
        const createdBusRoute = await busRoute.create({
            vehicle: foundVehicle, departurePlace, destinationPlace, departureTime, arrivalTime, pickupPoint, dropoffPoint, ticketFare, busPhotos, isAC, isSleeper, amenities, doesCarryTwoWheelers, doesProvideCourierService, doesBookTrainTickets, phonepeName, phonepeNumber, QR, seatingArrangement
        })
        await user.findByIdAndUpdate(req.data._id, { $push: { busRoutes: createdBusRoute } }, { new: true })
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
            options: { sort: { createdAt: -1 } }, // Sort dailyRoutes by createdAt in descending order
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
            data: foundUser.busRoutes
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
    handleGetAllBusRoutes
}