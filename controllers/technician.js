const technician = require("../models/technician");
const user = require("../models/user");

async function handleCreateTechnician(req, res) {
    try {
        const { technicianType, name, mobileNumber, alternateNumber, vehicleType, state, city } = req.body
        if (!technicianType || !name || !mobileNumber || !alternateNumber || !vehicleType || !state || !city) {
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

        const createdTechnician = await technician.create({ technicianType, name, mobileNumber, alternateNumber, vehicleType, state, city })
        const updatedUser = await user.findByIdAndUpdate(req.data._id, { $push: { technicians: createdTechnician } }, { new: true })

        return res.status(201).json({
            success: true,
            data: createdTechnician
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllTechnicians(req, res) {
    try {
        if (req.data.role === "AGENCY") {
            const foundTechnicians = await user.findById(req.data._id).populate("technicians")

            if (!foundTechnicians) {
                return res.status(400).json({
                    success: false,
                    message: "Could find technicians"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundTechnicians.technicians
            })
        }
        else {
            const foundTechnicians = await technician.find({})

            if (!foundTechnicians) {
                return res.status(400).json({
                    success: false,
                    message: "Could find technicians"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundTechnicians
            })
        }
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
        await user.findByIdAndUpdate(req.data._id, { $pull: { technician: technicianId } }, { new: true })
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

async function handleUpdateTechnician(req, res) {
    try {

        const { technicianId } = req.query
        if (!technicianId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of technician to update"
            })
        }
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Provide the updated technician"
            })
        }
        const updatedTechnician = await technician.findByIdAndUpdate(technicianId, req.body, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedTechnician,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetTechnicianById(req, res) {
    try {
        const { technicianId } = req.params
        if (!technicianId) {
            return res.status(400).json({
                success: false,
                message: "Provide the technician Id to find the technician"
            })
        }
        if (req.data.role === "AGENCY") {
            const foundUser = await user.findById(req.data._id).populate("technicians")
            const filteredTechnician = foundUser?.technicians.filter(technician => technician._id.toString() === technicianId)[0]
            return res.status(200).json({
                success: true,
                data: filteredTechnician
            })
        }
        const foundTechnician = await technician.findById(technicianId)
        return res.status(200).json({
            success: true,
            data: foundTechnician
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    handleGetAllTechnicians,
    handleCreateTechnician,
    handleDeleteTechnician,
    handleUpdateTechnician,
    handleGetTechnicianById
}