const driver = require("../models/driver")

async function handleCreateDriver(req, res) {
    try {

        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key][0].path; // Add the URL to req.body
                }
            });
        }

        const { name, password, vehicleType, mobileNumber, city, state, license, photo, aadharCard } = req.body

        if (!name || !password || !vehicleType || !mobileNumber || !city || !state || !photo || !license || !aadharCard) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (password.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Password must contain atleast 5 Characters"
            })
        }
        
        if (!["ALL", "CAR", "BUS", "TRUCK"].includes(vehicleType)) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid Vehicle Type"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "number should be less than 10 and greater than 11"

            })
        }
        const createdDriver = await driver.create({
            name, password, vehicleType, mobileNumber, city, state, license, photo, aadharCard
        })
        return res.status(201).json({
            success: true,
            data: createdDriver
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleGetAllDrivers(req, res) {
    try {
        // const { } = req.body
        const foundDrivers = await driver.find({})

        if (!foundDrivers) {
            return res.status(400).json({
                success: false,
                message: "Could find drivers"
            })
        }

        return res.status(200).json({
            success: true,
            data: foundDrivers
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


async function handleDeleteDriver(req, res) {
    try {
        const { driverId } = req.query
        if (!driverId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of driver to delete"
            })
        }
        const foundDriver = await driver.findById(driverId)
        if (!foundDriver) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid driver ID"
            })
        }
        await driver.findByIdAndDelete(driverId)
        return res.status(200).json({
            success: true,
            message: "Driver Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleUpdateDriver(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    // console.log(req.files);
                    // console.log(req.files[key]);
                    req.body[key] = req.files[key][0].path; 
                }
            });
        }

        const { driverId } = req.query
        // const { updatedDriver } = req.body
        console.log({bo : req.body});
        if (!driverId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of driver to update"
            })
        }
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Provide the updated driver"
            })
        }
        await driver.findByIdAndUpdate(driverId, req.body)
        return res.status(200).json({
            success: true,
            message: "Driver updated",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    handleCreateDriver,
    handleGetAllDrivers,
    handleDeleteDriver,
    handleUpdateDriver
}


