const cleaner = require('../models/cleaner')

async function handleGetAllCleaners(req, res) {

    try {

        const foundCleaners = await cleaner.find({})
        if (!foundCleaners) {
            return res.status(400).json({
                sucess: false,
                message: "Could not find cleaners"
            })
        }
        return res.status(201).json({
            success: true,
            data: foundCleaners
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }


}

async function handleCreateCleaner(req, res) {
    try {

        const { name, email, password, city, state, cleanerType, mobileNumber, photo, aadharCard } = req.body

        if (!name || !email || !password || !city || !state || !cleanerType || !mobileNumber || !photo || !aadharCard) {
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


        if (mobileNumber.length < 10 || mobileNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "number should be less than 10 and greater than 11"

            })
        }

        const createdCleaner = await cleaner.create({
            name, email, password, city, state, cleanerType, mobileNumber, photo, aadharCard
        })
        return res.status(201).json({
            success: true,
            createdCleaner
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteCleaner(req, res) {
    try {
        const { cleanerId } = req.query
        if (!cleanerId) {
            return res.status(400).json({
                success: false,
                message: "Please provide cleaner ID to delete it"
            })
        }

        const foundCleaner = await cleaner.findById(cleanerId)
        if (!foundCleaner) {
            return res.status(400).json({
                success : false,
                message : "Provide a valid cleaner ID"
            })
        }

        await cleaner.findByIdAndDelete(cleanerId)
        return res.status(200).json({
            success: true,
            message: "Cleaner Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


module.exports = {
    handleCreateCleaner,
    handleGetAllCleaners,
    handleDeleteCleaner
}




