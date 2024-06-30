const user = require("../models/user");
const { vehicle, truck, car } = require("../models/vehicle")

async function handleCreateVehicle(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key].map(el => el.path); // Add the URL to req.body
                }
            });
        }
        const { name, number, seatingCapacity, model, bodyType, chassisBrand, location, contactNumber, photos, isAC, isForRent, isForSell, type, noOfTyres, vehicleWeightInKGS } = req.body
        if (!number || !seatingCapacity || !model || !bodyType || !chassisBrand || !location || !contactNumber || !photos || !isAC || !isForRent || !isForSell || !type) {
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

        const alreadyVehicleWithNumber = await vehicle.findOne({ number })
        if (alreadyVehicleWithNumber) {
            return res.status(400).json({
                success: false,
                message: "Vehicle with this number already exists"
            })
        }

        const createdVehicle = await vehicle.create({
            name, number, seatingCapacity, model, bodyType, chassisBrand, location, contactNumber, photos, isAC, isForRent, isForSell, type, noOfTyres, vehicleWeightInKGS
        })

        const updatedUser = await user.findByIdAndUpdate(req.data._id, { $push: { vehicles: createdVehicle } }, { new: true })

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


async function handleGetAllVehiclesByVehicleType(req, res) {
    try {
        const { vehicleType } = req.params
        if (req.data.role === "AGENCY") {
            const foundVehicles = await user.findById(req.data._id).populate("vehicles")
            const vehicles = foundVehicles?.vehicles?.filter(veh => veh.type === vehicleType)
            if (!foundVehicles) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find vehicles"
                })
            }
            return res.status(200).json({
                success: true,
                data: vehicles
            })
        }
        const foundVehicles = await vehicle.find({ type: vehicleType })
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

async function handleGetAllVehicles(req, res) {
    try {
        if (req.data.role === "AGENCY") {
            const foundvehicles = await user.findById(req.data._id).populate("vehicles")

            if (!foundvehicles) {
                return res.status(400).json({
                    success: false,
                    message: "Could find vehicles"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundvehicles.vehicles
            })
        }
        else {
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
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetRentVehicles(req, res) {
    try {

        if (req.data.role === "AGENCY") {
            const foundVehicles = await user.findById(req.data._id).populate("vehicles")
            const vehicles = foundVehicles?.vehicles?.filter(veh => veh.isForRent === true)
            if (!foundVehicles) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find vehicles"
                })
            }
            return res.status(200).json({
                success: true,
                data: vehicles
            })
        }

        const foundRentVehicles = await vehicle.find({ isForRent: true })
        return res.status(200).json({
            success: true,
            data: foundRentVehicles
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetSellVehicles(req, res) {
    try {
        if (req.data.role === "AGENCY") {
            const foundVehicles = await user.findById(req.data._id).populate("vehicles")
            const vehicles = foundVehicles?.vehicles?.filter(veh => veh.isForSell === true)
            if (!foundVehicles) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find vehicles"
                })
            }
            return res.status(200).json({
                success: true,
                data: vehicles
            })
        }
        const foundSellVehicles = await vehicle.find({ isForSell: true })
        return res.status(200).json({
            success: true,
            data: foundSellVehicles
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
        await user.findByIdAndUpdate(req.data._id, { $pull: { vehicles: vehicleId } }, { new: true })
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
        const foundVehicle = await vehicle.findById(vehicleId)
        if (req.body.name && foundVehicle && foundVehicle.type === "CAR") {
            const updatedcar = await car.findByIdAndUpdate(vehicleId, req.body, { new: true })
            return res.status(200).json({
                success: true,
                message: "Car updated",
                data: updatedcar
            })
        }
        const updatedVehicle = await vehicle.findByIdAndUpdate(vehicleId, req.body, { new: true })
        return res.status(200).json({
            success: true,
            message: "Vehicle updated",
            data: updatedVehicle
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleAddDocuments(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key][0].path; // Add the URL to req.body
                }
            });
        }
        const { RC, permit, insurance, fitness, tax, PUC } = req.body
        const { vehicleId } = req.query
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of vehicle to update"
            })
        }
        if (!RC || !permit || !insurance || !fitness || !tax || !PUC) {
            return res.status(400).json({
                success: false,
                message: "Provide all the documents of vehicle"
            })
        }

        const updatedVehicle = await vehicle.findByIdAndUpdate(vehicleId, { RC, permit, insurance, fitness, tax, PUC }, { new: true })
        return res.status(200).json({
            success: true,
            message: "Vehicle updated",
            data: updatedVehicle
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteDocuments(req, res) {
    try {
        const { vehicleId } = req.query
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of vehicle to update"
            })
        }

        const a = await vehicle.findByIdAndUpdate(vehicleId, { RC : null, permit: null, insurance: null, fitness: null, tax: null, PUC: null }, { new: true })
        return res.status(200).json({
            success: true,
            message: "Documents deleted",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleUpdateTruck(req, res) {
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
        const udpatedTruck = await truck.findByIdAndUpdate(vehicleId, req.body, { new: true })
        return res.status(200).json({
            success: true,
            message: "Vehicle updated",
            data: udpatedTruck
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



async function handleGetVehicleById(req, res) {
    try {
        const { vehicleId } = req.params
        if(!vehicleId) {
            return res.status(200).json({
                success : false,
                message : "Provide vehicle ID"
            })
        }
        const foundVehicle = await vehicle.findById(vehicleId).populate("services")
        return res.status(200).json({
            success : true,
            data : foundVehicle
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

module.exports = {
    handleCreateVehicle,
    handleGetAllVehicles,
    handleDeleteVehicle,
    handleUpdateVehicle,
    handleUpdateTruck,
    handleGetAllVehiclesByVehicleType,
    handleGetRentVehicles,
    handleGetSellVehicles,
    handleAddDocuments,
    handleGetVehicleById,
    handleDeleteDocuments
}