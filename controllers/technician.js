const technician = require("../models/technician");

async function handleCreateTechnician(req, res) {
    try {
        const { technicianType, name, city, mobileNumber, alternateNumber, vehicleType } = req.body
        if (!technicianType || !name || !city || !mobileNumber || !alternateNumber || !vehicleType) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }

        if (mobileNumber.length < 10 || mobileNumber.length > 11 || alternateNumber.length < 10 || alternateNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid Number"
            })
        }

        if (!["MECHANIC", "ELECTICIAN", "SPAREPARTSHOP", "SPRINGWORK", "BATTERYSERVICES", "VEHICLEBODYREPAIR"].includes(technicianType)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid technician type"
            })
        }
        if (!["ALL", "CAR", "BUS", "TRUCK"].includes(vehicleType)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid vehicle type"
            })
        }

        const createdTechnician = await technician.create({ technicianType, name, city, mobileNumber, alternateNumber, vehicleType })
        return res.status(201).json({
            success: true,
            data: createdTechnician
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleGetAllTechnicians(req, res) {
    try {
        const foundTechnicians = await technician.find({})
        if (!foundTechnicians) {
            return res.status(400).json({
                success: false,
                message: "Could not find technicians"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundTechnicians
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleDeleteTechnician(req, res) {
    try {
        const { technicianId } = req.query
        if (!technicianId) {
            return res.status(400).json({
                success: false,
                message: "Provide ID of technician to delete"
            })
        }
        const foundTechnician = await technician.findById(technicianId)
        if (!foundTechnician) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid technician ID"
            })
        }
        await technician.findByIdAndDelete(technicianId)
        return res.status(200).json({
            success: true,
            message: "Technician Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    handleGetAllTechnicians,
    handleCreateTechnician,
    handleDeleteTechnician
}