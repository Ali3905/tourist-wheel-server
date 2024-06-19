const vehicle = require("../models/vehicle")

async function handleCreateVehicle(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }
        const { number, seatingCapacity, model, bodyName, chassIsBrand, location, contactNumber, photos, isAC, isForRent, isForSell, type } = req.body
        if (!number || !seatingCapacity || !model || !bodyName || !chassIsBrand || !location || !contactNumber || !photos || !isAC || !isForRent || !isForSell || !type) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }
        if (!["CAR", "TRUCK", "BUS", "TAMPO"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid type of vehicle"
            })
        }

        if (contactNumber.length < 10 || contactNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid contact Number"
            })
        }

        const createdVehicle = await vehicle.create({
            number, seatingCapacity, model, bodyName, chassIsBrand, location, contactNumber, photos, isAC, isForRent, isForSell, type
        })
        return res.status(201).json({
            success: true,
            data: createdVehicle
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


async function handleGetAllVehicles(req, res) {
    try {
        const foundVehicles = await vehicle.find({})
        if (!foundVehicles) {
            return res.status(400).json({
                success: false,
                message: "Could not find vehicles"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundVehicles
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteVehicle(req, res) {
    try {
        const { vehicleId } = req.query
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Provide ID of vehicle to delete"
            })
        }
        const foundvehicle = await vehicle.findById(vehicleId)
        if (!foundvehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid vehicle ID"
            })
        }
        await vehicle.findByIdAndDelete(vehicleId)
        return res.status(200).json({
            success: true,
            message: "Vehicle Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleUpdateVehicle(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); 
                }
            });
        }

        const { vehicleId } = req.query
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of vehicle to update"
            })
        }
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Provide the updated vehicle"
            })
        }
        await vehicle.findByIdAndUpdate(vehicleId, req.body)
        return res.status(200).json({
            success: true,
            message: "Vehicle updated",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    handleCreateVehicle,
    handleGetAllVehicles,
    handleDeleteVehicle,
    handleUpdateVehicle
}