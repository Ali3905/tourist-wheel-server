const vehicleInspection = require("../models/vehicleInspection")

async function handleCreateVehicleInspection(req, res) {
    try {
        const { name, vehicleNumber, departurePlace, destinationPlace, departureDate, returnDate, beforeJourneyNote, afterJourneyNote, beforeJourneyPhotos, afterJourneyPhotos } = req.body
        if (!name || !vehicleNumber || !departurePlace || !destinationPlace || !departureDate || !returnDate || !beforeJourneyNote || !afterJourneyNote || !beforeJourneyPhotos || !afterJourneyPhotos ||  beforeJourneyPhotos.length < 1 || afterJourneyPhotos.length < 1) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }

        const createdVehicleInspection = await vehicleInspection.create({
            name, vehicleNumber, departurePlace, destinationPlace, departureDate, returnDate, beforeJourneyNote, afterJourneyNote, beforeJourneyPhotos, afterJourneyPhotos
        })
        return res.status(201).json({
            success: true,
            createdVehicleInspection
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllVehicleInspections(req, res) {
    try {
        const foundVehicleInspections = await vehicleInspection.find({})
        if (!foundVehicleInspections) {
            return res.status(400).json({
                success: false,
                message: "Could not find inspections"
            })
        }

        return res.status(200).json({
            success: true,
            data: foundVehicleInspections
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteVehicleInspection(req, res) {
    try {
        const { inspectionId } = req.query
        if (!inspectionId) {
            return res.status(400).json({
                success: false,
                message: "Provide ID of inspection to delete"
            })
        }
        const foundInspection = await vehicleInspection.findById(inspectionId)
        if (!foundInspection) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid technician ID"
            })
        }
        await vehicleInspection.findByIdAndDelete(inspectionId)
        return res.status(200).json({
            success: true,
            message: "Inspection Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    handleCreateVehicleInspection,
    handleGetAllVehicleInspections,
    handleDeleteVehicleInspection
}


