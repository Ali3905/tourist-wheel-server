const driver = require("../models/driver")

async function handleCreateDriver(req, res) {
    try {
        const { name, email, password, driverType, mobileNumber, city, village, state, license, photo, aadharCard } = req.body
        console.log({ name, email, password, driverType, mobileNumber, city, village, state, license, photo, aadharCard });
        if (!name || !email || !password || !driverType || !mobileNumber || !city || !village || !state || !photo || !license || !aadharCard) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (!email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid Email"
            })
        }
        if (password.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Password must contain atleast 5 Characters"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "number should be less than 10 and greater than 11"

            })
        }
        const createdDriver = await driver.create({
            name, email, password, driverType, mobileNumber, city, village, state, license, photo, aadharCard
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

module.exports = {
    handleCreateDriver,
    handleGetAllDrivers,
    handleDeleteDriver
}


